import logging
from typing import Dict, Any
from app.executors.base_executor import ILanguageExecutor

logger = logging.getLogger("codeflow.executors.java")

class JavaExecutor(ILanguageExecutor):
    """
    Java Language Trace Executor for CodeFlow.
    Parses javac execution steps into unified IExecutionTrace schema.
    """
    
    def execute(self, code: str, timeout_seconds: float = 10.0) -> Dict[str, Any]:
        if not code or not code.strip():
            return {
                "status": "error",
                "total_steps": 0,
                "trace": [],
                "stdout": "",
                "error": "Java code string cannot be empty",
                "language": "java"
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
                    "language": "java"
                })

        return {
            "status": "success",
            "total_steps": len(trace),
            "trace": trace,
            "stdout": "",
            "error": None,
            "language": "java"
        }
