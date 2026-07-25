import { IAlgorithmDetector, IAlgorithmResult } from "./types";
import { ITraceEvent } from "@/types/trace";
import { bubbleSortDetector } from "./plugins/bubbleSort";
import { binarySearchDetector } from "./plugins/binarySearch";
import { recursionTreeDetector } from "./plugins/recursionTree";

class AlgorithmDetectorManager {
  private detectors: IAlgorithmDetector[] = [];

  constructor() {
    // Register default plugin detectors
    this.register(bubbleSortDetector);
    this.register(binarySearchDetector);
    this.register(recursionTreeDetector);
  }

  public register(detector: IAlgorithmDetector) {
    this.detectors.push(detector);
  }

  public detectAlgorithm(trace: ITraceEvent[]): IAlgorithmResult {
    if (!trace || trace.length === 0) {
      return this.getGenericResult(0);
    }

    let bestResult: IAlgorithmResult | null = null;

    for (const detector of this.detectors) {
      try {
        const result = detector.detect(trace);
        if (result && result.confidence > 0.5) {
          if (!bestResult || result.confidence > bestResult.confidence) {
            bestResult = result;
          }
        }
      } catch (err) {
        // Safe plugin isolation
      }
    }

    return bestResult || this.getGenericResult(trace.length);
  }

  private getGenericResult(totalSteps: number): IAlgorithmResult {
    return {
      algorithmName: "General Execution",
      mode: "GENERIC",
      confidence: 1.0,
      metadata: {
        name: "General Python Execution",
        category: "General",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        isStable: true,
        isInPlace: true,
        overview: "Standard imperative program execution stepping line-by-line.",
        interviewTip: "Keep variable names meaningful and modularize code into clear functions.",
        commonMistake: "Off-by-one errors in loop boundaries and array index access."
      },
      metrics: {
        comparisons: Math.floor(totalSteps / 3),
        swaps: 0,
        assignments: totalSteps,
        functionCalls: 1,
        maxStackDepth: 1,
        executionTimeMs: 0.05
      }
    };
  }
}

export const detectorManager = new AlgorithmDetectorManager();
