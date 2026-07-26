// Semantic Engine - Core module for CodeFlow
// Transforms runtime execution into educational semantic events

export { SemanticEventEngine } from './events/SemanticEventEngine';
export { AlgorithmDetector } from './detectors/AlgorithmDetector';
export { RendererFactory, BaseVisualizer } from './renderers/RendererFactory';
export { BSTRenderer } from './renderers/BSTRenderer';

// Type exports
export type {
  ISemanticEvent,
  ISemanticIR,
  IRVisualizer,
  IAlgorithmDetectionResult,
} from '@/types/semantic/ir';