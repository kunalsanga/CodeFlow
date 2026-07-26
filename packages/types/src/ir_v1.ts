// Versioned Semantic Intermediate Representation v1 for CodeFlow Platform

export interface ISemanticEvent {
  type: string;
  timestamp: number;
  stepIndex: number;
  payload: Record<string, any>;
  explanation?: string;
  reason?: string;
}

export interface IAlgorithmDetectionResult {
  algorithmType: string;
  confidence: number;
  detectedFrom: string[];
  suggestedRenderer: string;
  stageScores?: {
    astScore: number;
    traceScore: number;
    graphScore: number;
    behaviorScore: number;
  };
}

export interface ISemanticIRv1 {
  version: 'v1';
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
