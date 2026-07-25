import logging
from typing import Dict, Any
from app.engine.executor import execute_code_with_engine

logger = logging.getLogger("codeflow.sandbox")

def execute_code_in_sandbox(code: str, language: str = "python", timeout_seconds: float = 5.0) -> Dict[str, Any]:
    """
    Execute user code safely using the production execution engine.
    """
    if language.lower() != "python":
        return {
            "status": "error",
            "error": f"Language '{language}' is not supported yet in MVP (Python only)."
        }

    try:
        result = execute_code_with_engine(code, max_steps=1000)
        return result
    except Exception as e:
        logger.error(f"Sandbox execution error: {str(e)}")
        return {
            "status": "error",
            "error": f"Execution Engine Error: {str(e)}"
        }
