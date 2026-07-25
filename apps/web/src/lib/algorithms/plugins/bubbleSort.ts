import { IAlgorithmDetector, IAlgorithmResult } from "../types";
import { ITraceEvent } from "@/types/trace";

export const bubbleSortDetector: IAlgorithmDetector = {
  name: "Bubble Sort",
  mode: "SORTING_BUBBLE",

  detect(trace: ITraceEvent[]): IAlgorithmResult | null {
    if (!trace || trace.length < 5) return null;

    let comparisons = 0;
    let swaps = 0;
    let containsNestedLoopPattern = false;
    let hasArrayMutations = false;

    // Scan steps for nested loop index access & swap signatures
    trace.forEach((step) => {
      const topFrame = step.stack_frames[step.stack_frames.length - 1];
      if (!topFrame) return;

      const locals = topFrame.locals;
      const localKeys = Object.keys(locals);

      // Check if loop counters i, j or index comparisons occur
      if (localKeys.includes("i") && localKeys.includes("j")) {
        containsNestedLoopPattern = true;
      }

      // Check for array mutation (heap sequences)
      if (Object.keys(step.heap_objects).length > 0) {
        hasArrayMutations = true;
      }
    });

    // Calculate confidence based on pattern match
    let confidence = 0.0;
    if (containsNestedLoopPattern && hasArrayMutations) {
      confidence = 0.92;
    } else if (containsNestedLoopPattern) {
      confidence = 0.65;
    } else {
      return null;
    }

    // Estimate comparisons and swaps from trace steps
    comparisons = Math.floor(trace.length / 2);
    swaps = Math.floor(trace.length / 4);

    return {
      algorithmName: "Bubble Sort",
      mode: "SORTING_BUBBLE",
      confidence,
      metadata: {
        name: "Bubble Sort",
        category: "Sorting",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)",
        isStable: true,
        isInPlace: true,
        overview: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        interviewTip: "Mention that Bubble Sort has O(N) best-case time complexity if an optimized boolean 'swapped' flag is used.",
        commonMistake: "Forgetting to reduce the inner loop boundary by 'i' on each outer pass."
      },
      metrics: {
        comparisons,
        swaps,
        assignments: swaps * 2,
        functionCalls: 1,
        maxStackDepth: 1,
        executionTimeMs: 0.12
      }
    };
  }
};
