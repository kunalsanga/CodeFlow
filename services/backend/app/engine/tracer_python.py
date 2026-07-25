from app.engine.executor import execute_code_with_engine

def run_code_with_trace(code: str, max_steps: int = 1000):
    return execute_code_with_engine(code, max_steps=max_steps)
