from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, Any, List, Optional, Union

class EventType(str, Enum):
    LINE = "line"
    CALL = "call"
    RETURN = "return"
    EXCEPTION = "exception"

class SemanticEventType(str, Enum):
    VARIABLE_CREATED = "VARIABLE_CREATED"
    VARIABLE_UPDATED = "VARIABLE_UPDATED"
    FUNCTION_CALLED = "FUNCTION_CALLED"
    FUNCTION_RETURNED = "FUNCTION_RETURNED"
    LOOP_STARTED = "LOOP_STARTED"
    LOOP_ITERATION = "LOOP_ITERATION"
    LOOP_ENDED = "LOOP_ENDED"
    CONDITION_TRUE = "CONDITION_TRUE"
    CONDITION_FALSE = "CONDITION_FALSE"
    PRINT = "PRINT"
    EXCEPTION = "EXCEPTION"
    PROGRAM_FINISHED = "PROGRAM_FINISHED"

class ValueKind(str, Enum):
    PRIMITIVE = "primitive"
    REFERENCE = "reference"
    SEQUENCE = "sequence"
    MAPPING = "mapping"
    OBJECT = "object"
    FUNCTION = "function"

@dataclass
class VariableValue:
    kind: ValueKind
    type: str
    value: Optional[Any] = None
    target: Optional[str] = None  # obj_id for reference types

    def to_dict(self) -> Dict[str, Any]:
        res: Dict[str, Any] = {"kind": self.kind.value, "type": self.type}
        if self.kind == ValueKind.PRIMITIVE:
            res["value"] = self.value
        elif self.kind == ValueKind.REFERENCE:
            res["target"] = self.target
        return res

@dataclass
class StackFrameModel:
    frame_id: str = ""
    function_name: str = ""
    line_number: int = 0
    locals: Dict[str, VariableValue] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "frame_id": self.frame_id,
            "function_name": self.function_name,
            "line_number": self.line_number,
            "locals": {k: v.to_dict() for k, v in self.locals.items()}
        }

@dataclass
class HeapObjectModel:
    obj_id: str
    kind: ValueKind
    type: str
    value: Optional[Any] = None  # list of VariableValue or dict of key->VariableValue
    fields: Optional[Dict[str, VariableValue]] = None
    repr_str: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        res: Dict[str, Any] = {"kind": self.kind.value, "type": self.type}
        if self.kind == ValueKind.SEQUENCE and isinstance(self.value, list):
            res["value"] = [item.to_dict() for item in self.value]
        elif self.kind == ValueKind.MAPPING and isinstance(self.value, dict):
            res["value"] = {k: v.to_dict() for k, v in self.value.items()}
        elif self.kind == ValueKind.OBJECT:
            res["fields"] = {k: v.to_dict() for k, v in (self.fields or {}).items()}
            if self.repr_str:
                res["repr"] = self.repr_str
        elif self.repr_str:
            res["repr"] = self.repr_str
        return res

@dataclass
class SemanticEventModel:
    event_type: SemanticEventType
    description: str
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_type": self.event_type.value,
            "description": self.description,
            "metadata": self.metadata
        }

@dataclass
class TimelineFrameModel:
    step: int
    event: str
    line: int
    function: str
    callDepth: int
    variables: Dict[str, VariableValue]
    stack: List[StackFrameModel]
    heap: Dict[str, HeapObjectModel]
    stdout: str
    semantic_events: List[SemanticEventModel] = field(default_factory=list)
    execution_time: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        # Emits both renderer-independent schema and backwards-compatible fields
        return {
            "step": self.step,
            "event": self.event,
            "line": self.line,
            "function": self.function,
            "callDepth": self.callDepth,
            "variables": {k: v.to_dict() for k, v in self.variables.items()},
            "stack": [f.to_dict() for f in self.stack],
            "heap": {k: v.to_dict() for k, v in self.heap.items()},
            "stdout": self.stdout,
            "semantic_events": [e.to_dict() for e in self.semantic_events],
            "executionTime": self.execution_time,
            # Backward compatibility fields for current React Flow frontend renderer
            "step_index": self.step,
            "event_type": self.event,
            "line_number": self.line,
            "stack_frames": [f.to_dict() for f in self.stack],
            "heap_objects": {k: v.to_dict() for k, v in self.heap.items()}
        }
