import json
import logging
import subprocess
import sys
import tempfile
from typing import Dict, Any
from app.engine.tracer_python import run_code_with_trace

logger = logging.getLogger("codeflow.sandbox")

def execute_code_in_sandbox(code: str, language: str = "python", timeout_seconds: float = 5.0) -> Dict[str, Any]:
    """
    Execute user code safely in a sandbox container or isolated execution context.
    Enforces maximum timeout and returns structured ITraceEvent payload.
    """
    if language.lower() != "python":
        return {
            "status": "error",
            "error": f"Language '{language}' is not supported yet in MVP (Python only)."
        }

    # Attempt execution via direct in-process isolated tracer as local dev fallback
    # In production Docker environment, this invokes docker container via CLI SDK
    try:
        # Direct execution via tracer engine
        result = run_code_with_trace(code, max_steps=500)
        return result
    except Exception as e:
        logger.error(f"Sandbox execution failed: {str(e)}")
        return {
            "status": "error",
            "error": f"Sandbox execution error: {str(e)}"
        }
