import sys
import io
import json
import inspect
from typing import Dict, Any, List, Optional, Tuple

class PythonTracer:
    """
    Core Python execution tracer using sys.settrace.
    Captures line steps, call stack frames, local variables,
    heap object references, and stdout deltas.
    """
    def __init__(self, max_steps: int = 500):
        self.max_steps = max_steps
        self.step_counter = 0
        self.trace_events: List[Dict[str, Any]] = []
        self.heap_objects: Dict[str, Any] = {}
        self.stdout_buffer = io.StringIO()
        self._original_stdout = sys.stdout

    def start_trace(self):
        sys.stdout = self.stdout_buffer
        sys.settrace(self.trace_callback)

    def stop_trace(self):
        sys.settrace(None)
        sys.stdout = self._original_stdout

    def trace_callback(self, frame: Any, event: str, arg: Any):
        if event not in ("line", "call", "return"):
            return self.trace_callback

        # Filter out tracer internal files or standard library internals
        filename = frame.f_code.co_filename
        if "tracer" in filename or "runner_script" in filename or "<string>" not in filename:
            # If executing via exec with filename '<string>'
            if not filename.endswith('<string>') and 'user_code' not in filename:
                return self.trace_callback

        self.step_counter += 1
        if self.step_counter > self.max_steps:
            raise RuntimeError(f"Execution step limit exceeded (maximum {self.max_steps} steps allowed).")

        # Capture stdout snapshot
        current_stdout = self.stdout_buffer.getvalue()

        # Capture Stack Frames
        stack_frames: List[Dict[str, Any]] = []
        curr_frame = frame
        while curr_frame:
            code_file = curr_frame.f_code.co_filename
            # Filter internal frames
            if "tracer" in code_file or "runner_script" in code_file:
                curr_frame = curr_frame.f_back
                continue

            local_vars: Dict[str, Any] = {}
            for k, v in curr_frame.f_locals.items():
                if k.startswith("__") or inspect.ismodule(v) or inspect.isfunction(v):
                    continue
                local_vars[k] = self._serialize_value(v)

            frame_id = f"frame_{id(curr_frame)}"
            stack_frames.append({
                "frame_id": frame_id,
                "function_name": curr_frame.f_code.co_name,
                "line_number": curr_frame.f_lineno,
                "locals": local_vars
            })
            curr_frame = curr_frame.f_back

        step_event = {
            "step_index": self.step_counter,
            "event_type": event,
            "line_number": frame.f_lineno,
            "stack_frames": list(reversed(stack_frames)),
            "heap_objects": dict(self.heap_objects),
            "stdout": current_stdout
        }
        self.trace_events.append(step_event)
        return self.trace_callback

    def _serialize_value(self, val: Any) -> Dict[str, Any]:
        """Serialize values into primitive types or heap reference mappings."""
        if isinstance(val, (int, float, str, bool, type(None))):
            return {
                "kind": "primitive",
                "type": type(val).__name__,
                "value": val
            }
        
        # Reference types (List, Dict, Tuple, Set, Custom Class)
        obj_id = f"ref_{id(val)}"
        if obj_id not in self.heap_objects:
            if isinstance(val, (list, tuple)):
                elements = [self._serialize_value(item) for item in val]
                self.heap_objects[obj_id] = {
                    "kind": "sequence",
                    "type": type(val).__name__,
                    "value": elements
                }
            elif isinstance(val, dict):
                entries = {str(k): self._serialize_value(v) for k, v in val.items()}
                self.heap_objects[obj_id] = {
                    "kind": "mapping",
                    "type": "dict",
                    "value": entries
                }
            else:
                # Custom object / instance
                fields = {}
                if hasattr(val, "__dict__"):
                    for k, v in val.__dict__.items():
                        if not k.startswith("__"):
                            fields[k] = self._serialize_value(v)
                self.heap_objects[obj_id] = {
                    "kind": "object",
                    "type": type(val).__name__,
                    "fields": fields,
                    "repr": repr(val)
                }

        return {
            "kind": "reference",
            "type": type(val).__name__,
            "target": obj_id
        }

def run_code_with_trace(code: str, max_steps: int = 500) -> Dict[str, Any]:
    """Execute python code string and return structured execution trace."""
    tracer = PythonTracer(max_steps=max_steps)
    stdout_capture = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = stdout_capture

    execution_error: Optional[str] = None
    try:
        compiled_code = compile(code, "<string>", "exec")
        global_scope: Dict[str, Any] = {"__name__": "__main__"}
        
        tracer.start_trace()
        exec(compiled_code, global_scope)
    except Exception as e:
        execution_error = f"{type(e).__name__}: {str(e)}"
    finally:
        tracer.stop_trace()
        sys.stdout = old_stdout

    captured_stdout = stdout_capture.getvalue()

    return {
        "status": "error" if execution_error else "success",
        "total_steps": len(tracer.trace_events),
        "trace": tracer.trace_events,
        "stdout": captured_stdout,
        "error": execution_error
    }
