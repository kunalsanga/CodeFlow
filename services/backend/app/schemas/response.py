from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class CodeExecutionResponse(BaseModel):
    status: str
    total_steps: int
    trace: List[Dict[str, Any]]
    stdout: str
    error: Optional[str] = None

class ExplainStepResponse(BaseModel):
    step_index: int
    explanation: str
    key_takeaway: str
