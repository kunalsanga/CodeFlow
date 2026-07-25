from typing import Dict, Any, List, Optional
from app.engine.models import (
    SemanticEventModel,
    SemanticEventType,
    StackFrameModel,
    VariableValue
)

class EventDetector:
    """
    Semantic event system detecting runtime events like variable assignments,
    function calls, returns, stdout prints, and exceptions.
    """
    def __init__(self):
        self.prev_locals: Dict[str, VariableValue] = {}
        self.prev_stdout: str = ""

    def reset(self):
        self.prev_locals.clear()
        self.prev_stdout = ""

    def detect_events(
        self,
        event_type: str,
        current_frame: StackFrameModel,
        stdout_current: str,
        line_number: int
    ) -> List[SemanticEventModel]:
        events: List[SemanticEventModel] = []

        # 1. Function Call / Return Events
        if event_type == "call":
            events.append(SemanticEventModel(
                event_type=SemanticEventType.FUNCTION_CALLED,
                description=f"Function `{current_frame.function_name}` invoked at line {line_number}.",
                metadata={"function": current_frame.function_name, "line": line_number}
            ))
        elif event_type == "return":
            events.append(SemanticEventModel(
                event_type=SemanticEventType.FUNCTION_RETURNED,
                description=f"Function `{current_frame.function_name}` returned at line {line_number}.",
                metadata={"function": current_frame.function_name, "line": line_number}
            ))

        # 2. Variable Creation & Mutation Events
        curr_locals = current_frame.locals
        for var_name, curr_val in curr_locals.items():
            if var_name not in self.prev_locals:
                events.append(SemanticEventModel(
                    event_type=SemanticEventType.VARIABLE_CREATED,
                    description=f"Variable `{var_name}` created with initial value.",
                    metadata={"variable": var_name, "value": curr_val.to_dict()}
                ))
            else:
                prev_val = self.prev_locals[var_name]
                if prev_val.value != curr_val.value or prev_val.target != curr_val.target:
                    events.append(SemanticEventModel(
                        event_type=SemanticEventType.VARIABLE_UPDATED,
                        description=f"Variable `{var_name}` updated.",
                        metadata={"variable": var_name, "value": curr_val.to_dict()}
                    ))

        # 3. Print / Output Events
        if stdout_current != self.prev_stdout and len(stdout_current) > len(self.prev_stdout):
            printed_delta = stdout_current[len(self.prev_stdout):]
            events.append(SemanticEventModel(
                event_type=SemanticEventType.PRINT,
                description=f"Console output: {printed_delta.strip()}",
                metadata={"output": printed_delta}
            ))

        self.prev_locals = dict(curr_locals)
        self.prev_stdout = stdout_current

        return events
