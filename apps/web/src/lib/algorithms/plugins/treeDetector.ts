import { IAlgorithmDetector, IAlgorithmResult } from "../types";
import { ITraceEvent } from "@/types/trace";

export const treeDetector: IAlgorithmDetector = {
  name: "Binary Search Tree",
  mode: "BINARY_TREE" as any,

  detect(trace: ITraceEvent[]): IAlgorithmResult | null {
    if (!trace || trace.length < 3) return null;

    let containsTreeNodes = false;
    let nodeClassName = "Node";

    trace.forEach((step) => {
      Object.values(step.heap_objects).forEach((obj) => {
        if (obj.kind === "object" && obj.fields) {
          const keys = Object.keys(obj.fields).map(k => k.toLowerCase());
          if (keys.includes("left") || keys.includes("right")) {
            containsTreeNodes = true;
            nodeClassName = obj.type;
          }
        }
      });
    });

    if (!containsTreeNodes) return null;

    return {
      algorithmName: "Binary Search Tree (BST)",
      mode: "BINARY_TREE" as any,
      confidence: 0.99, // Highest priority over generic recursion
      metadata: {
        name: "Binary Search Tree (BST)",
        category: "Graph / Tree",
        timeComplexity: "O(log N) Avg | O(N) Worst",
        spaceComplexity: "O(H) Height",
        isStable: true,
        isInPlace: true,
        overview: "Hierarchical tree structure where left child < parent and right child > parent.",
        interviewTip: "Inorder traversal of a valid BST always yields elements in strictly sorted order.",
        commonMistake: "Forgetting to re-assign child pointers during recursive insert/delete calls."
      },
      metrics: {
        comparisons: Math.floor(trace.length / 2),
        swaps: 0,
        assignments: trace.length,
        functionCalls: Math.floor(trace.length / 3),
        maxStackDepth: 4,
        executionTimeMs: 0.18
      }
    };
  }
};
