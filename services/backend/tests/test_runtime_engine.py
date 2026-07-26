import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.engine.executor import execute_code_with_engine
from app.engine.sandbox_runner import execute_code_in_sandbox
from app.utils.languageDetector import LanguageDetector

def test_1_hello_world():
    code = 'print("Hello World")'
    res = execute_code_with_engine(code)
    assert res["status"] == "success"
    assert "Hello World" in res["stdout"]
    assert res["total_steps"] > 0
    print("[PASS] Test 1 (Hello World)")

def test_2_basic_arithmetic():
    code = """x = 5
y = 10
z = x + y
print(z)
"""
    res = execute_code_with_engine(code)
    assert res["status"] == "success"
    assert "15" in res["stdout"]
    last_frame = res["trace"][-1]
    assert last_frame["variables"]["z"]["value"] == 15
    print("[PASS] Test 2 (Basic Arithmetic)")

def test_3_for_loop():
    code = """for i in range(5):
    print(i)
"""
    res = execute_code_with_engine(code)
    assert res["status"] == "success"
    assert "0\n1\n2\n3\n4" in res["stdout"]
    print("[PASS] Test 3 (For Loop)")

def test_4_conditionals():
    code = """x = 10
if x > 5:
    print(x)
"""
    res = execute_code_with_engine(code)
    assert res["status"] == "success"
    assert "10" in res["stdout"]
    print("[PASS] Test 4 (Conditionals)")

def test_5_functions():
    code = """def add(a, b):
    return a + b

print(add(5, 3))
"""
    res = execute_code_with_engine(code)
    assert res["status"] == "success"
    assert "8" in res["stdout"]
    print("[PASS] Test 5 (Function Calls)")

def test_6_recursion_fibonacci():
    code = """def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

res = fib(5)
print("Fibonacci:", res)
"""
    res = execute_code_with_engine(code)
    assert res["status"] == "success"
    assert "Fibonacci: 5" in res["stdout"]
    assert res["total_steps"] > 10
    print("[PASS] Test 6 (Recursion Fibonacci)")

def test_7_circular_references():
    code = """a = []
a.append(a)
"""
    res = execute_code_with_engine(code)
    assert res["status"] == "success"
    print("[PASS] Test 7 (Circular Reference Safety)")

def test_8_multi_language_executors():
    cpp_code = """#include <iostream>
int main() {
    std::cout << "C++ CodeFlow" << std::endl;
    return 0;
}"""
    res = execute_code_in_sandbox(code=cpp_code, language="cpp")
    assert res["status"] == "success"
    assert res["detected_language"] == "cpp"
    assert len(res["trace"]) > 0
    print("[PASS] Test 8 (Multi-Language C++ Executor)")

def test_9_language_detector():
    java_code = """public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}"""
    detection = LanguageDetector.detect(java_code)
    assert detection["language"] == "java"
    assert detection["confidence"] > 0.3
    print("[PASS] Test 9 (Backend Language Auto-Detector)")

def test_10_sandbox_forbidden_imports():
    malicious_code = "import os\nos.system('echo malicious')"
    res = execute_code_in_sandbox(code=malicious_code, language="python")
    assert res.get("error") is True
    assert res.get("error_type") == "sandbox"
    print("[PASS] Test 10 (Security Sandbox Blocked Forbidden Imports)")

if __name__ == "__main__":
    test_1_hello_world()
    test_2_basic_arithmetic()
    test_3_for_loop()
    test_4_conditionals()
    test_5_functions()
    test_6_recursion_fibonacci()
    test_7_circular_references()
    test_8_multi_language_executors()
    test_9_language_detector()
    test_10_sandbox_forbidden_imports()
    print("\nALL 10 ENGINE BENCHMARK TESTS PASSED SUCCESSFULLY!")
