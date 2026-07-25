from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class CodeExecutionRequest(BaseModel):
    language: str = Field(default="python", description="Programming language of the code")
    code: str = Field(..., description="Source code string to execute and trace")
    max_steps: Optional[int] = Field(default=500, description="Maximum execution step cap")

class ExplainStepRequest(BaseModel):
    code_snippet: str = Field(..., description="Line of code executed")
    current_step: Dict[str, Any] = Field(..., description="Active step metadata payload")
    previous_step: Optional[Dict[str, Any]] = Field(default=None, description="Previous step metadata payload")
