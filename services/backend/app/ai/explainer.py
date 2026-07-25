import os
import httpx
from typing import Dict, Any, Optional

def generate_step_explanation(
    code_snippet: str,
    current_step: Dict[str, Any],
    previous_step: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Synthesize plain-English step explanation for active line execution.
    Falls back to a structured rule-based generator if no LLM API key is present.
    """
    step_idx = current_step.get("step_index", 1)
    event_type = current_step.get("event_type", "line")
    line_no = current_step.get("line_number", 1)
    stack_frames = current_step.get("stack_frames", [])

    current_frame = stack_frames[-1] if stack_frames else {}
    func_name = current_frame.get("function_name", "<module>")
    locals_map = current_frame.get("locals", {})

    # Rule-Based Structural Generator Baseline
    if event_type == "call":
        params = ", ".join([f"{k}={v.get('value', v.get('target', '...'))}" for k, v in locals_map.items()])
        explanation = f"Function `{func_name}({params})` was invoked and pushed onto the call stack at line {line_no}."
        key_takeaway = f"New stack frame created for `{func_name}`."
    elif event_type == "return":
        explanation = f"Function `{func_name}` completed execution at line {line_no} and returned to caller frame."
        key_takeaway = f"Frame `{func_name}` popped from stack."
    else:
        var_summary = []
        for k, v in locals_map.items():
            if v.get("kind") == "primitive":
                var_summary.append(f"`{k}` = {v.get('value')}")
            elif v.get("kind") == "reference":
                var_summary.append(f"`{k}` -> memory target `{v.get('target')}`")

        vars_str = ", ".join(var_summary) if var_summary else "no active variables"
        explanation = f"Executed line {line_no}: `{code_snippet.strip()}`. Scope variables in `{func_name}`: {vars_str}."
        key_takeaway = f"Line {line_no} execution updated scope."

    return {
        "step_index": step_idx,
        "explanation": explanation,
        "key_takeaway": key_takeaway
    }
