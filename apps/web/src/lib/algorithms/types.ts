import { ITraceEvent } from "@/types/trace";

export type VisualizationMode =
  | "GENERIC"
  | "SORTING_BUBBLE"
  | "SORTING_INSERTION"
  | "SORTING_SELECTION"
  | "SEARCH_BINARY"
  | "SEARCH_LINEAR"
  | "RECURSION_TREE"
  | "GRAPH_TRAVERSAL";

export interface IAlgorithmMetrics {
  comparisons: number;
  swaps: number;
  assignments: number;
  functionCalls: number;
  maxStackDepth: number;
  executionTimeMs: number;
}

export interface IAlgorithmMetadata {
  name: string;
  category: "Sorting" | "Searching" | "Recursion" | "Graph / Tree" | "General";
  timeComplexity: string;
  spaceComplexity: string;
  isStable: boolean;
  isInPlace: boolean;
  overview: string;
  interviewTip: string;
  commonMistake: string;
}

export interface IAlgorithmResult {
  algorithmName: string;
  mode: VisualizationMode;
  confidence: number; // 0.0 to 1.0
  metadata: IAlgorithmMetadata;
  metrics: IAlgorithmMetrics;
  stateMetadata?: Record<string, any>;
}

export interface IAlgorithmDetector {
  name: string;
  mode: VisualizationMode;
  detect(trace: ITraceEvent[]): IAlgorithmResult | null;
}
