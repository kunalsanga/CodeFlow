import logging
from typing import Dict, Any
from app.executors.base_executor import ILanguageExecutor
from app.engine.executor import execute_code_with_engine

logger = logging.getLogger("codeflow.executors.python")

class PythonExecutor(ILanguageExecutor):
    """
    Python Language Trace Executor for CodeFlow.
    Converts sys.settrace execution events into unified IExecutionTrace JSON schema.
    """
    
    def execute(self, code: str, timeout_seconds: float = 10.0) -> Dict[str, Any]:
        if not code or not code.strip():
            return {
                "status": "error",
                "total_steps": 0,
                "trace": [],
                "stdout": "",
                "error": "Code string cannot be empty",
                "language": "python"
            }
            
        try:
            raw_result = execute_code_with_engine(code, max_steps=1000)
            
            # Map legacy trace to unified schema steps
            unified_trace = []
            legacy_trace = raw_result.get("trace", [])
            
            for idx, event in enumerate(legacy_trace):
                unified_step = {
                    "step": idx,
                    "line": event.get("line_number", 1),
                    "event": event.get("event_type", "line"),
                    "scope_variables": event.get("globals", {}),
                    "heap_objects": event.get("heap_objects", {}),
                    "stack_frames": event.get("stack_frames", []),
                    "stdout": event.get("stdout", ""),
                    "language": "python"
                }
                unified_trace.append(unified_step)
                
            return {
                "status": raw_result.get("status", "success"),
                "total_steps": len(unified_trace),
                "trace": unified_trace,
                "stdout": raw_result.get("stdout", ""),
                "error": raw_result.get("error"),
                "language": "python"
            }
        except Exception as e:
            logger.error(f"Python executor error: {str(e)}")
            return {
                "status": "error",
                "total_steps": 0,
                "trace": [],
                "stdout": "",
                "error": f"Python Executor Error: {str(e)}",
                "language": "python"
            }
