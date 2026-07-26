from abc import ABC, abstractmethod
from typing import Dict, Any, List

class ILanguageExecutor(ABC):
    """
    Abstract Base Class for language trace executors in CodeFlow backend.
    Enforces unified IExecutionTrace JSON schema output across Python, JS, C++, Java, Go, and Rust.
    """
    
    @abstractmethod
    def execute(self, code: str, timeout_seconds: float = 10.0) -> Dict[str, Any]:
        """
        Execute source code and return a dictionary conforming to the unified IExecutionTrace schema:
        {
          "status": "success" | "error",
          "total_steps": int,
          "trace": Array<IExecutionTraceStep>,
          "stdout": str,
          "error": str | None,
          "language": str
        }
        """
        pass

    def create_empty_trace_step(self, step_index: int, line_number: int, event_type: str, language: str) -> Dict[str, Any]:
        """
        Helper method to instantiate a trace step with the unified schema.
        """
        return {
            "step": step_index,
            "line": line_number,
            "event": event_type,
            "scope_variables": {},
            "heap_objects": {},
            "stack_frames": [],
            "stdout": "",
            "language": language
        }
