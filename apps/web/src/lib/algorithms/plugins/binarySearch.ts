import { IAlgorithmDetector, IAlgorithmResult } from "../types";
import { ITraceEvent } from "@/types/trace";

export const binarySearchDetector: IAlgorithmDetector = {
  name: "Binary Search",
  mode: "SEARCH_BINARY",

  detect(trace: ITraceEvent[]): IAlgorithmResult | null {
    if (!trace || trace.length < 3) return null;

    let hasLow = false;
    let hasHigh = false;
    let hasMid = false;

    trace.forEach((step) => {
      const topFrame = step.stack_frames[step.stack_frames.length - 1];
      if (!topFrame) return;

      const keys = Object.keys(topFrame.locals).map(k => k.toLowerCase());
      if (keys.includes("low") || keys.includes("left") || keys.includes("l")) hasLow = true;
      if (keys.includes("high") || keys.includes("right") || keys.includes("r")) hasHigh = true;
      if (keys.includes("mid") || keys.includes("middle") || keys.includes("m")) hasMid = true;
    });

    if (!(hasLow && hasHigh)) return null;

    const confidence = hasMid ? 0.95 : 0.75;

    return {
      algorithmName: "Binary Search",
      mode: "SEARCH_BINARY",
      confidence,
      metadata: {
        name: "Binary Search",
        category: "Searching",
        timeComplexity: "O(log N)",
        spaceComplexity: "O(1)",
        isStable: true,
        isInPlace: true,
        overview: "Finds the position of a target value within a sorted array by dividing the search interval in half recursively or iteratively.",
        interviewTip: "Always check for integer overflow when calculating mid: use mid = low + (high - low) // 2.",
        commonMistake: "Off-by-one errors in loop condition while low <= high."
      },
      metrics: {
        comparisons: Math.floor(trace.length / 2),
        swaps: 0,
        assignments: trace.length,
        functionCalls: 1,
        maxStackDepth: 1,
        executionTimeMs: 0.08
      }
    };
  }
};
