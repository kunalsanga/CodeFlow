import sys
import os
sys.path.insert(0, os.path.abspath("."))

from app.engine.tracer_python import run_code_with_trace

code = """def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

res = fib(3)
print("Fibonacci result:", res)
"""

res = run_code_with_trace(code)
print("Trace Status:", res["status"])
print("Total Steps Captured:", res["total_steps"])
print("Stdout Captured:", res["stdout"].strip())
print("Step 1 Line Number:", res["trace"][0]["line_number"])
print("Step 3 Stack Depth:", len(res["trace"][2]["stack_frames"]))
