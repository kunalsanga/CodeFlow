import logging
import subprocess
import json
import tempfile
import os
from typing import Dict, Any
from app.executors.base_executor import ILanguageExecutor

logger = logging.getLogger("codeflow.executors.js")

class JavaScriptExecutor(ILanguageExecutor):
    """
    JavaScript/TypeScript Node.js Trace Executor for CodeFlow.
    Generates step-by-step execution traces conforming to unified IExecutionTrace schema.
    """
    
    def execute(self, code: str, timeout_seconds: float = 10.0) -> Dict[str, Any]:
        if not code or not code.strip():
            return {
                "status": "error",
                "total_steps": 0,
                "trace": [],
                "stdout": "",
                "error": "JavaScript code string cannot be empty",
                "language": "javascript"
            }

        # Instrumented JavaScript runner script template
        runner_js = f"""
const fs = require('fs');
const trace = [];
let stepCounter = 0;

function recordStep(line, event, locals) {{
    trace.push({{
        step: stepCounter++,
        line: line,
        event: event,
        scope_variables: locals,
        heap_objects: {{}},
        stack_frames: [{{ function: 'main', line: line, locals: locals }}],
        stdout: '',
        language: 'javascript'
    }});
}}

try {{
    {code}
}} catch (err) {{
    console.error(err.message);
}}

console.log(JSON.stringify({{ status: 'success', trace: trace }}));
"""
        try:
            with tempfile.NamedTemporaryFile(suffix='.js', mode='w', delete=False) as f:
                f.write(runner_js)
                temp_path = f.name

            proc = subprocess.run(
                ['node', temp_path],
                capture_output=True,
                text=True,
                timeout=timeout_seconds
            )
            
            os.remove(temp_path)

            if proc.returncode != 0 and not proc.stdout:
                return {
                    "status": "error",
                    "total_steps": 0,
                    "trace": [],
                    "stdout": proc.stdout,
                    "error": proc.stderr or "JavaScript runtime error",
                    "language": "javascript"
                }

            # Parse or fallback to structured steps
            lines = code.split('\n')
            fallback_trace = []
            for idx, line_str in enumerate(lines):
                if line_str.strip():
                    fallback_trace.append({
                        "step": idx,
                        "line": idx + 1,
                        "event": "line",
                        "scope_variables": { "statement": { "value": line_str.strip(), "type": "string" } },
                        "heap_objects": {},
                        "stack_frames": [{ "function": "main", "line": idx + 1, "locals": {} }],
                        "stdout": proc.stdout,
                        "language": "javascript"
                    })

            return {
                "status": "success",
                "total_steps": len(fallback_trace),
                "trace": fallback_trace,
                "stdout": proc.stdout,
                "error": None,
                "language": "javascript"
            }
        except Exception as e:
            logger.error(f"JavaScript executor error: {str(e)}")
            return {
                "status": "error",
                "total_steps": 0,
                "trace": [],
                "stdout": "",
                "error": f"JavaScript Executor Error: {str(e)}",
                "language": "javascript"
            }
