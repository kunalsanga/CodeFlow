import logging
import re
from typing import Dict, Any
from app.utils.languageDetector import LanguageDetector
from app.executors import get_executor

logger = logging.getLogger("codeflow.sandbox")

# Restricted import patterns for backend security sandbox
FORBIDDEN_IMPORTS = [
    (r'\bimport\s+os\b|\bfrom\s+os\b|\bos\.system|\bos\.popen', "os.system / os.popen"),
    (r'\bimport\s+subprocess\b|\bfrom\s+subprocess\b', "subprocess"),
    (r'\bimport\s+socket\b|\bfrom\s+socket\b', "socket network access"),
    (r'\b__import__\b', "__import__ dynamic loader"),
    (r'\bopen\s*\([^)]*[\'"]w[\'"]', "file write access"),
]

def execute_code_in_sandbox(code: str, language: str = None, timeout_seconds: float = 15.0) -> Dict[str, Any]:
    """
    Execute user code safely using the production execution engine with 15s timeout,
    restricted import sandbox, 1000 trace step cap, and structured error responses.
    """
    if not code or not code.strip():
        return {
            "error": True,
            "error_type": "syntax",
            "line": 1,
            "message": "Code payload cannot be empty.",
            "suggestion": "Paste valid Python, C++, Java, JS, TS, Go, or Rust code."
        }

    # Security Sandbox Check: Block forbidden system-level imports
    for pattern, name in FORBIDDEN_IMPORTS:
        match = re.search(pattern, code)
        if match:
            return {
                "error": True,
                "error_type": "sandbox",
                "line": code[:match.start()].count('\n') + 1,
                "message": f"Security Restricted Import: '{name}' is blocked in CodeFlow sandbox.",
                "suggestion": "Remove system-level I/O operations and write pure algorithmic logic."
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
        
        # Cap trace to max 1000 steps
        if result.get("trace") and len(result["trace"]) > 1000:
            result["trace"] = result["trace"][:1000]
            result["total_steps"] = 1000
            result["truncated"] = True
            
        result["detected_language"] = target_language
        return result
    except Exception as e:
        logger.error(f"Sandbox execution error: {str(e)}")
        return {
            "error": True,
            "error_type": "runtime",
            "line": 1,
            "message": f"Multi-Language Execution Error: {str(e)}",
            "suggestion": "Check variable types, array bounds, and pointer initialization."
        }
