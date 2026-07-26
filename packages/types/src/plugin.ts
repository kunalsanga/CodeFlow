import { ISemanticIRv1, ISemanticEvent } from './ir_v1';

export interface ICodeFlowPluginMetadata {
  name: string;
  category: 'graph' | 'tree' | 'sorting' | 'dp' | 'ds' | 'string';
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}

export interface IStepRationale {
  reason: string;
  explanation: string;
  prediction?: string;
  question?: string;
  hint?: string;
}

export interface ICodeFlowPlugin {
  id: string;
  metadata: ICodeFlowPluginMetadata;
  supportedEvents: string[];
  renderer: any; // React ComponentType
  stepExplainer?: (event: ISemanticEvent, stepIndex: number) => IStepRationale;
  quizGenerator?: (trace: any[]) => Array<{ question: string; options: string[]; answer: number }>;
  complexityAnalyzer?: () => { time: string; space: string; explanation: string };
}
