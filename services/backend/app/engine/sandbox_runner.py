import logging
from typing import Dict, Any
from app.utils.languageDetector import LanguageDetector
from app.executors import get_executor

logger = logging.getLogger("codeflow.sandbox")

def execute_code_in_sandbox(code: str, language: str = None, timeout_seconds: float = 10.0) -> Dict[str, Any]:
    """
    Execute user code safely using the production unified multi-language execution engine.
    Auto-detects programming language if omitted or generic.
    """
    if not code or not code.strip():
        return {
            "status": "error",
            "error": "Code payload cannot be empty."
        }

    # Auto-detect language if not explicitly provided
    if not language or language.lower() in ["auto", "detect", "unknown"]:
        detection = LanguageDetector.detect(code)
        target_language = detection["language"]
    else:
        target_language = language.lower()

    try:
        executor = get_executor(target_language)
        result = executor.execute(code, timeout_seconds=timeout_seconds)
        result["detected_language"] = target_language
        return result
    except Exception as e:
        logger.error(f"Sandbox execution error: {str(e)}")
        return {
            "status": "error",
            "error": f"Multi-Language Execution Sandbox Error: {str(e)}"
        }
