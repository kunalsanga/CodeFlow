import sys
import io
import time
import inspect
from typing import Dict, Any, List, Optional
from app.engine.models import (
    TimelineFrameModel,
    StackFrameModel,
    VariableValue,
    SemanticEventModel,
    SemanticEventType
)
from app.engine.memory_model import MemoryModelExtractor
from app.engine.event_system import EventDetector

class ProductionTracer:
    """
    Re-entrancy safe, production-grade Python execution tracer using sys.settrace.
    Eliminates all Tracer-self-tracing and RecursionError crashes.
    """
    def __init__(self, max_steps: int = 1000):
        self.max_steps = max_steps
        self.step_counter = 0
        self.timeline: List[TimelineFrameModel] = []
        self.memory_extractor = MemoryModelExtractor()
        self.event_detector = EventDetector()
        self.stdout_buffer = io.StringIO()
        self._original_stdout = sys.stdout
        self._is_tracing_active = False
        self._start_time = 0.0

    def start(self):
        self.step_counter = 0
        self.timeline.clear()
        self.memory_extractor.reset()
        self.event_detector.reset()
        self.stdout_buffer = io.StringIO()
        self._original_stdout = sys.stdout
        sys.stdout = self.stdout_buffer
        self._start_time = time.time()
        sys.settrace(self._trace_callback)

    def stop(self):
        sys.settrace(None)
        sys.stdout = self._original_stdout
        self._is_tracing_active = False

    def _trace_callback(self, frame: Any, event: str, arg: Any):
        # 1. Re-entrancy guard: prevent tracer from tracing itself
        if self._is_tracing_active:
            return self._trace_callback

        if event not in ("line", "call", "return"):
            return self._trace_callback

        # 2. Filter out tracer internal files and standard libraries
        filename = frame.f_code.co_filename
        if "tracer" in filename or "runner" in filename or "inspect" in filename:
            return self._trace_callback

        # Only trace user code (compiled with '<string>' filename or user execution filename)
        if not (filename.endswith("<string>") or "user_code" in filename or "<input>" in filename):
            return self._trace_callback

        # Turn ON tracing active flag and temporarily disable settrace inside callback
        self._is_tracing_active = True
        old_trace = sys.gettrace()
        sys.settrace(None)

        try:
            self.step_counter += 1
            if self.step_counter > self.max_steps:
                raise RuntimeError(f"Execution step limit exceeded (maximum {self.max_steps} steps allowed).")

            # Capture current stdout snapshot
            stdout_snapshot = self.stdout_buffer.getvalue()

            # Reset memory extractor for the current step to capture mutations and garbage collection
            self.memory_extractor.reset()

            # Inspect stack frames cleanly
            stack_models: List[StackFrameModel] = []
            curr = frame
            call_depth = 0

            while curr:
                curr_file = curr.f_code.co_filename
                if not (curr_file.endswith("<string>") or "user_code" in curr_file or "<input>" in curr_file):
                    curr = curr.f_back
                    continue

                call_depth += 1
                locals_dict: Dict[str, VariableValue] = {}

                # Inspect local variables safely
                for var_name, var_val in curr.f_locals.items():
                    if var_name.startswith("__") or inspect.ismodule(var_val):
                        continue
                    locals_dict[var_name] = self.memory_extractor.serialize_value(var_val)

                stack_models.append(StackFrameModel(
                    frame_id=f"frame_{id(curr)}",
                    function_name=curr.f_code.co_name,
                    line_number=curr.f_lineno,
                    locals=locals_dict
                ))
                curr = curr.f_back

            stack_models = list(reversed(stack_models))
            top_frame = stack_models[-1] if stack_models else StackFrameModel(line_number=frame.f_lineno)

            # Detect semantic events
            events = self.event_detector.detect_events(
                event_type=event,
                current_frame=top_frame,
                stdout_current=stdout_snapshot,
                line_number=frame.f_lineno
            )

            # Construct standardized timeline frame
            exec_time = round(time.time() - self._start_time, 6)
            timeline_frame = TimelineFrameModel(
                step=self.step_counter,
                event=event,
                line=frame.f_lineno,
                function=top_frame.function_name,
                callDepth=call_depth,
                variables=top_frame.locals,
                stack=stack_models,
                heap=dict(self.memory_extractor.heap),
                stdout=stdout_snapshot,
                semantic_events=events,
                execution_time=exec_time
            )

            self.timeline.append(timeline_frame)
        finally:
            # Re-enable settrace and reset tracing active flag
            sys.settrace(self._trace_callback)
            self._is_tracing_active = False

        return self._trace_callback
