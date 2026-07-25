from fastapi import APIRouter, status
from app.schemas.request import ExplainStepRequest
from app.schemas.response import ExplainStepResponse
from app.ai.explainer import generate_step_explanation

router = APIRouter()

@router.post("/explain-step", response_model=ExplainStepResponse, status_code=status.HTTP_200_OK)
async def explain_step(payload: ExplainStepRequest):
    """
    Generate natural language explanation for specific execution step.
    """
    explanation_result = generate_step_explanation(
        code_snippet=payload.code_snippet,
        current_step=payload.current_step,
        previous_step=payload.previous_step
    )

    return ExplainStepResponse(
        step_index=explanation_result["step_index"],
        explanation=explanation_result["explanation"],
        key_takeaway=explanation_result["key_takeaway"]
    )
