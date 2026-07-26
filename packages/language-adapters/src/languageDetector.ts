// Automatic Language Detector for CodeFlow Platform

export type SupportedLanguage = 'python' | 'javascript' | 'typescript' | 'cpp' | 'java';

export interface ILanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number;
  evidence: string[];
}

export class LanguageDetector {
  /**
   * Automatically detect programming language from code syntax patterns
   */
  static detectLanguage(code: string): ILanguageDetectionResult {
    if (!code || !code.trim()) {
      return { language: 'python', confidence: 1.0, evidence: ['Default fallback'] };
    }

    const trimmed = code.trim();
    const scores: Record<SupportedLanguage, number> = {
      python: 0,
      javascript: 0,
      typescript: 0,
      cpp: 0,
      java: 0,
    };
    const evidenceMap: Record<SupportedLanguage, string[]> = {
      python: [],
      javascript: [],
      typescript: [],
      cpp: [],
      java: [],
    };

    // Python signals
    if (/\bdef\s+\w+\s*\(/.test(trimmed)) { scores.python += 30; evidenceMap.python.push('def keyword'); }
    if (/\bimport\s+\w+|\bfrom\s+\w+\s+import/.test(trimmed)) { scores.python += 20; evidenceMap.python.push('import/from statement'); }
    if (/\belif\b/.test(trimmed)) { scores.python += 25; evidenceMap.python.push('elif keyword'); }
    if (/\bNone\b|\bTrue\b|\bFalse\b/.test(trimmed)) { scores.python += 20; evidenceMap.python.push('Python booleans/None'); }
    if (/\bself\.\w+/.test(trimmed)) { scores.python += 25; evidenceMap.python.push('self attribute access'); }
    if (/\bprint\s*\(/.test(trimmed) && !/System\.out/.test(trimmed)) { scores.python += 15; evidenceMap.python.push('print() function'); }
    if (/\bset\(\)|\bdeque\(|\bheapq\./.test(trimmed)) { scores.python += 25; evidenceMap.python.push('Python stdlib data structures'); }

    // C++ signals
    if (/#include\s*<.+>/.test(trimmed)) { scores.cpp += 40; evidenceMap.cpp.push('#include directive'); }
    if (/\bstd::/.test(trimmed)) { scores.cpp += 35; evidenceMap.cpp.push('std:: namespace'); }
    if (/\bcout\s*<</.test(trimmed)) { scores.cpp += 35; evidenceMap.cpp.push('cout stream'); }
    if (/\bvector\s*</.test(trimmed)) { scores.cpp += 30; evidenceMap.cpp.push('std::vector template'); }
    if (/\bint\s+main\s*\(/.test(trimmed)) { scores.cpp += 30; evidenceMap.cpp.push('main function'); }

    // Java signals
    if (/\bpublic\s+class\s+\w+/.test(trimmed)) { scores.java += 40; evidenceMap.java.push('public class definition'); }
    if (/\bpublic\s+static\s+void\s+main/.test(trimmed)) { scores.java += 40; evidenceMap.java.push('main method'); }
    if (/System\.out\.println/.test(trimmed)) { scores.java += 35; evidenceMap.java.push('System.out.println'); }
    if (/\bimport\s+java\./.test(trimmed)) { scores.java += 30; evidenceMap.java.push('import java.*'); }

    // JS/TS signals
    if (/\bconst\s+|\blet\s+|\bvar\s+/.test(trimmed)) {
      scores.javascript += 20; evidenceMap.javascript.push('const/let/var decl');
      scores.typescript += 20; evidenceMap.typescript.push('const/let/var decl');
    }
    if (/\bfunction\s+\w+\s*\(/.test(trimmed)) {
      scores.javascript += 20; evidenceMap.javascript.push('function keyword');
      scores.typescript += 20; evidenceMap.typescript.push('function keyword');
    }
    if (/=>/.test(trimmed)) {
      scores.javascript += 15; evidenceMap.javascript.push('arrow function');
      scores.typescript += 15; evidenceMap.typescript.push('arrow function');
    }

    // TypeScript specific signals
    if (/\binterface\s+\w+|\btype\s+\w+\s*=/.test(trimmed)) { scores.typescript += 35; evidenceMap.typescript.push('interface/type definition'); }
    if (/:\s*(number|string|boolean|any|void)\b/.test(trimmed)) { scores.typescript += 30; evidenceMap.typescript.push('type annotations'); }

    // Find highest score
    let bestLang: SupportedLanguage = 'python';
    let maxScore = scores.python;

    (Object.keys(scores) as SupportedLanguage[]).forEach(lang => {
      if (scores[lang] > maxScore) {
        maxScore = scores[lang];
        bestLang = lang;
      }
    });

    const confidence = Math.min(0.98, Math.max(0.60, maxScore / 50));

    return {
      language: bestLang,
      confidence,
      evidence: evidenceMap[bestLang],
    };
  }
}
