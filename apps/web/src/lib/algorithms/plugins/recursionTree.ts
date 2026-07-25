import { IAlgorithmDetector, IAlgorithmResult } from "../types";
import { ITraceEvent } from "@/types/trace";

export const recursionTreeDetector: IAlgorithmDetector = {
  name: "Recursion",
  mode: "RECURSION_TREE",

  detect(trace: ITraceEvent[]): IAlgorithmResult | null {
    if (!trace || trace.length < 3) return null;

    let maxDepth = 1;
    let recursiveFuncName = "";
    let isRecursive = false;

    trace.forEach((step) => {
      const frames = step.stack_frames;
      if (frames.length > maxDepth) {
        maxDepth = frames.length;
      }

      // Check if same function appears multiple times in call stack
      const funcNames = frames.map(f => f.function_name).filter(n => n !== "<module>");
      const uniqueNames = new Set(funcNames);

      if (funcNames.length > uniqueNames.size) {
        isRecursive = true;
        recursiveFuncName = funcNames[0] || "recursive_func";
      }
    });

    if (!isRecursive) return null;

    return {
      algorithmName: `Recursion (${recursiveFuncName})`,
      mode: "RECURSION_TREE",
      confidence: 0.96,
      metadata: {
        name: `Recursion Tree (${recursiveFuncName})`,
        category: "Recursion",
        timeComplexity: maxDepth > 5 ? "O(2ᴺ)" : "O(N)",
        spaceComplexity: `O(Depth=${maxDepth})`,
        isStable: true,
        isInPlace: true,
        overview: "A method of solving a problem where the solution depends on solutions to smaller instances of the same problem.",
        interviewTip: "Always identify base cases first to prevent stack overflow recursion errors.",
        commonMistake: "Forgetting to return the result of recursive calls."
      },
      metrics: {
        comparisons: trace.length,
        swaps: 0,
        assignments: trace.length * 2,
        functionCalls: maxDepth,
        maxStackDepth: maxDepth,
        executionTimeMs: 0.15
      }
    };
  }
};
