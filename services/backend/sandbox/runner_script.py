import sys
import json
import os
from tracer_python import run_code_with_trace

def main():
    if len(sys.argv) > 1:
        code = sys.argv[1]
    else:
        code = sys.stdin.read()

    if not code:
        print(json.dumps({"status": "error", "error": "Empty code payload provided."}))
        sys.exit(1)

    result = run_code_with_trace(code, max_steps=500)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
