from fastapi import APIRouter, HTTPException, status
from app.schemas.request import CodeExecutionRequest
from app.schemas.response import CodeExecutionResponse
from app.engine.sandbox_runner import execute_code_in_sandbox

router = APIRouter()

@router.post("/execute", response_model=CodeExecutionResponse, status_code=status.HTTP_200_OK)
async def execute_code(payload: CodeExecutionRequest):
    """
    Execute user code safely in a sandbox environment and return complete execution step trace.
    """
    if not payload.code.strip():
        raise HTTPException(status_code=400, detail="Code string cannot be empty.")

    result = execute_code_in_sandbox(
        code=payload.code,
        language=payload.language,
        timeout_seconds=5.0
    )

    if result.get("status") == "error" and not result.get("trace"):
        return CodeExecutionResponse(
            status="error",
            total_steps=0,
            trace=[],
            stdout="",
            error=result.get("error", "Unknown sandbox execution error.")
        )

    return CodeExecutionResponse(
        status=result.get("status", "success"),
        total_steps=result.get("total_steps", 0),
        trace=result.get("trace", []),
        stdout=result.get("stdout", ""),
        error=result.get("error")
    )
