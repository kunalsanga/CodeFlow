from typing import Dict
from app.executors.base_executor import ILanguageExecutor
from app.executors.python_executor import PythonExecutor
from app.executors.javascript_executor import JavaScriptExecutor
from app.executors.cpp_executor import CPPExecutor
from app.executors.java_executor import JavaExecutor
from app.executors.go_executor import GoExecutor
from app.executors.rust_executor import RustExecutor

EXECUTOR_REGISTRY: Dict[str, ILanguageExecutor] = {
    "python": PythonExecutor(),
    "javascript": JavaScriptExecutor(),
    "typescript": JavaScriptExecutor(),
    "js": JavaScriptExecutor(),
    "ts": JavaScriptExecutor(),
    "cpp": CPPExecutor(),
    "c++": CPPExecutor(),
    "java": JavaExecutor(),
    "go": GoExecutor(),
    "golang": GoExecutor(),
    "rust": RustExecutor(),
}

def get_executor(language: str) -> ILanguageExecutor:
    """
    Retrieve language trace executor instance for the requested language name.
    Defaults to PythonExecutor if language is unrecognized.
    """
    lang_key = language.lower().strip() if language else "python"
    return EXECUTOR_REGISTRY.get(lang_key, EXECUTOR_REGISTRY["python"])
