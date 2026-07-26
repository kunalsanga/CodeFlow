// Semantic Intermediate Representation (IR) for CodeFlow
// All renderers consume ONLY this format
// Represents algorithm concepts, not literal raw runtime memory

export interface ISemanticEvent {
  type: string;
  timestamp: number;
  stepIndex: number;
  payload: Record<string, any>;
  explanation?: string; // AI step rationale
}

// Algorithm-specific semantic events
export type SemanticEventPayload =
  // Binary Search Tree events
  | { type: 'BST_CREATE_NODE'; value: number; nodeId: string }
  | { type: 'BST_VISIT_NODE'; value: number; nodeId: string }
  | { type: 'BST_COMPARE'; left: number; right: number }
  | { type: 'BST_GO_LEFT'; fromNodeId: string; toNodeId: string }
  | { type: 'BST_GO_RIGHT'; fromNodeId: string; toNodeId: string }
  | { type: 'BST_FOUND'; value: number; nodeId: string }
  | { type: 'BST_DELETE'; value: number; nodeId: string }
  | { type: 'BST_ROTATE'; nodeId: string; direction: 'left' | 'right' }

  // Linked List events
  | { type: 'LL_CREATE_NODE'; value: number; nodeId: string }
  | { type: 'LL_INSERT'; value: number; position: number; nodeId: string }
  | { type: 'LL_DELETE'; value: number; position: number; nodeId: string }
  | { type: 'LL_TRAVERSE'; currentNodeId: string }
  | { type: 'LL_REVERSE'; fromNodeId: string; toNodeId: string }
  | { type: 'LL_SET_HEAD'; nodeId: string }
  | { type: 'LL_SET_TAIL'; nodeId: string }
  | { type: 'LL_UPDATE_POINTER'; fromId: string; toId: string; pointerType: 'next' | 'prev' }

  // Dijkstra Shortest Path events
  | { type: 'DIJKSTRA_START'; sourceNodeId: string }
  | { type: 'DIJKSTRA_VISIT_NODE'; nodeId: string; distance: number }
  | { type: 'DIJKSTRA_RELAX_EDGE'; fromNodeId: string; toNodeId: string; weight: number; oldDistance: number; newDistance: number }
  | { type: 'DIJKSTRA_UPDATE_DISTANCE'; nodeId: string; distance: number }
  | { type: 'DIJKSTRA_MARK_VISITED'; nodeId: string }
  | { type: 'DIJKSTRA_UPDATE_PQ'; queueState: Array<{ nodeId: string; distance: number }> }
  | { type: 'DIJKSTRA_PATH_FOUND'; path: string[]; totalDistance: number }

  // Merge Sort events
  | { type: 'MERGESORT_SPLIT'; array: number[]; leftHalf: number[]; rightHalf: number[]; depth: number }
  | { type: 'MERGESORT_MERGE_STEP'; leftArray: number[]; rightArray: number[]; mergedArray: number[]; activeIndices: number[] }
  | { type: 'MERGESORT_COMPARE'; leftVal: number; rightVal: number }
  | { type: 'MERGESORT_PLACED'; val: number; targetIndex: number }

  // Quick Sort events
  | { type: 'QUICKSORT_SET_PIVOT'; pivotIndex: number; pivotValue: number; low: number; high: number }
  | { type: 'QUICKSORT_COMPARE'; index: number; value: number; pivotValue: number }
  | { type: 'QUICKSORT_SWAP'; fromIndex: number; toIndex: number }
  | { type: 'QUICKSORT_PARTITION_COMPLETE'; finalPivotIndex: number }

  // Trie events
  | { type: 'TRIE_INSERT_CHAR'; char: string; nodeId: string; wordPrefix: string }
  | { type: 'TRIE_MARK_END'; nodeId: string; word: string }
  | { type: 'TRIE_TRAVERSE'; currentNodeId: string; path: string }
  | { type: 'TRIE_CREATE_NODE'; char: string; nodeId: string; parentId: string }

  // Dynamic Programming events
  | { type: 'DP_INITIALIZE_TABLE'; dimensions: [number, number]; defaultVal: any }
  | { type: 'DP_UPDATE_CELL'; row: number; col: number; value: number; subproblems: Array<[number, number]> }
  | { type: 'DP_TRANSITION'; fromCells: Array<[number, number]>; toCell: [number, number]; formula: string }
  | { type: 'DP_SOLUTION_FOUND'; finalValue: number; optimalPath: Array<[number, number]> }

  // Union-Find (Disjoint Set) events
  | { type: 'UNIONFIND_MAKE_SET'; element: string | number }
  | { type: 'UNIONFIND_FIND'; element: string | number; root: string | number; pathCompressed: boolean }
  | { type: 'UNIONFIND_UNION'; root1: string | number; root2: string | number; newRoot: string | number }

  // Segment Tree events
  | { type: 'SEGMENTTREE_BUILD_NODE'; nodeId: string; range: [number, number]; val: number }
  | { type: 'SEGMENTTREE_QUERY'; queryRange: [number, number]; visitedNodes: string[] }
  | { type: 'SEGMENTTREE_UPDATE'; index: number; newVal: number; updatedNodes: string[] }

  // LRU Cache events
  | { type: 'LRU_GET'; key: string; value: any; hit: boolean }
  | { type: 'LRU_PUT'; key: string; value: any; evictedKey?: string }
  | { type: 'LRU_MOVE_TO_HEAD'; key: string }
  | { type: 'LRU_EVICT'; key: string };

// Algorithm detection result with confidence scoring breakdown
export interface IAlgorithmDetectionResult {
  algorithmType: string;
  confidence: number; // 0.0 to 1.0
  detectedFrom: string[];
  suggestedRenderer: string;
  stageScores?: {
    astScore: number;
    traceScore: number;
    graphScore: number;
    behaviorScore: number;
  };
}

// Semantic IR container - passed directly to visualizers
export interface ISemanticIR {
  algorithmType: string;
  events: ISemanticEvent[];
  data: Record<string, any>;
  metadata: {
    timestamp: number;
    totalSteps: number;
    currentStep: number;
    isPlaying: boolean;
    speed: number;
  };
  detection: IAlgorithmDetectionResult | null;
  complexity?: {
    timeComplexity: string;
    spaceComplexity: string;
    description: string;
  };
}

// Visualizer interface
export interface IRVisualizer {
  render(semanticIR: ISemanticIR): JSX.Element;
  getInitialState(): Record<string, any>;
  handleEvent(event: ISemanticEvent): void;
  reset(): void;
}