import sys
import io
from typing import Dict, Any, Optional
from app.engine.tracer import ProductionTracer
from app.engine.timeline import TimelineGenerator

def execute_code_with_engine(code: str, max_steps: int = 1000) -> Dict[str, Any]:
    """
    Execute user Python code using the Production Execution Engine.
    Returns a standardized renderer-independent timeline payload.
    """
    tracer = ProductionTracer(max_steps=max_steps)
    execution_error: Optional[str] = None

    try:
        compiled_code = compile(code, "<string>", "exec")
        global_scope: Dict[str, Any] = {"__name__": "__main__"}
        
        tracer.start()
        exec(compiled_code, global_scope)
    except Exception as e:
        execution_error = f"{type(e).__name__}: {str(e)}"
    finally:
        tracer.stop()

    return TimelineGenerator.generate_timeline_payload(
        timeline_frames=tracer.timeline,
        status="error" if execution_error else "success",
        error_msg=execution_error
    )
