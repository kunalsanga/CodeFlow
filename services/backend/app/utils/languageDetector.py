import re
from typing import Dict, Any

class LanguageDetector:
    """
    Backend Language Auto-Detector using syntax heuristics, keyword patterns, and idiom scoring.
    Returns { "language": str, "confidence": float, "dialect": str }
    """

    PATTERNS = {
        "python": [
            (r'\bdef\s+\w+\s*\(', 30),
            (r'\bimport\s+\w+|\bfrom\s+\w+\s+import', 25),
            (r'\bif\s+__name__\s*==\s*[\'"]__main__[\'"]:', 40),
            (r'\bprint\s*\(', 15),
            (r'\bself\b', 20),
            (r':\s*$', 15),
        ],
        "javascript": [
            (r'\bconst\s+|\blet\s+|\bvar\s+', 25),
            (r'\bfunction\s+\w+\s*\(', 25),
            (r'\bconsole\.log\s*\(', 30),
            (r'=>', 20),
            (r'\bmodule\.exports\b|\bexport\s+default\b', 30),
        ],
        "typescript": [
            (r':\s*(number|string|boolean|any|void|object)\b', 35),
            (r'\binterface\s+\w+', 35),
            (r'\btype\s+\w+\s*=', 30),
        ],
        "cpp": [
            (r'#include\s*<\w+>', 40),
            (r'\bstd::\w+', 35),
            (r'\bcout\s*<<|\bcin\s*>>', 40),
            (r'\bint\s+main\s*\(\s*\)', 35),
            (r'struct\s+\w+\s*\{', 20),
        ],
        "java": [
            (r'\bpublic\s+class\s+\w+', 40),
            (r'\bpublic\s+static\s+void\s+main\s*\(', 45),
            (r'\bSystem\.out\.println\s*\(', 40),
            (r'\bimport\s+java\.', 35),
        ],
        "go": [
            (r'\bpackage\s+main\b', 45),
            (r'\bfunc\s+main\s*\(\s*\)', 45),
            (r'\bfmt\.Println\s*\(', 40),
            (r'\bimport\s*\(\s*"fmt"', 40),
        ],
        "rust": [
            (r'\bfn\s+main\s*\(\s*\)', 45),
            (r'\blet\s+mut\b', 40),
            (r'\bprintln!\s*\(', 40),
            (r'\buse\s+std::', 35),
        ]
    }

    @classmethod
    def detect(cls, code: str) -> Dict[str, Any]:
        if not code or not code.strip():
            return {"language": "python", "confidence": 0.5, "dialect": "standard"}

        scores = {lang: 0 for lang in cls.PATTERNS.keys()}

        for lang, pattern_list in cls.PATTERNS.items():
            for pattern, weight in pattern_list:
                if re.search(pattern, code, re.MULTILINE):
                    scores[lang] += weight

        # TypeScript inherits JS score
        scores["typescript"] += scores["javascript"] // 2

        best_lang = max(scores, key=scores.get)
        best_score = scores[best_lang]

        if best_score == 0:
            return {"language": "python", "confidence": 0.5, "dialect": "standard"}

        confidence = min(best_score / 100.0, 0.99)
        return {
            "language": best_lang,
            "confidence": round(confidence, 2),
            "dialect": "standard"
        }
