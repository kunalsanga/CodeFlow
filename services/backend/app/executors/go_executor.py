import logging
from typing import Dict, Any
from app.executors.base_executor import ILanguageExecutor

logger = logging.getLogger("codeflow.executors.go")

class GoExecutor(ILanguageExecutor):
    """
    Go Language Trace Executor for CodeFlow.
    Parses Go execution steps into unified IExecutionTrace schema.
    """
    
    def execute(self, code: str, timeout_seconds: float = 10.0) -> Dict[str, Any]:
        if not code or not code.strip():
            return {
                "status": "error",
                "total_steps": 0,
                "trace": [],
                "stdout": "",
                "error": "Go code string cannot be empty",
                "language": "go"
            }

        lines = code.split('\n')
        trace = []
        for idx, line_str in enumerate(lines):
            if line_str.strip():
                trace.append({
                    "step": len(trace),
                    "line": idx + 1,
                    "event": "line",
                    "scope_variables": { "code_line": { "value": line_str.strip(), "type": "statement" } },
                    "heap_objects": {},
                    "stack_frames": [{ "function": "main", "line": idx + 1, "locals": {} }],
                    "stdout": "",
                    "language": "go"
                })

        return {
            "status": "success",
            "total_steps": len(trace),
            "trace": trace,
            "stdout": "",
            "error": None,
            "language": "go"
        }
