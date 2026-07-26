import { ISemanticIR, ISemanticEvent, IRVisualizer } from '@/types/semantic/ir';

// Renderer Factory
// Creates the appropriate visualizer for each algorithm type
// This is the central place where renderers are registered and instantiated

export class RendererFactory {
  private static renderers: Map<string, new () => IRVisualizer> = new Map();

  // Register a renderer for a specific algorithm type
  static registerRenderer(algorithmType: string, rendererClass: new () => IRVisualizer): void {
    this.renderers.set(algorithmType, rendererClass);
  }

  // Get a renderer instance for a specific algorithm type
  static getRenderer(algorithmType: string): IRVisualizer | null {
    const rendererClass = this.renderers.get(algorithmType);
    if (rendererClass) {
      return new rendererClass();
    }
    return null;
  }

  // Get all registered algorithm types
  static getRegisteredAlgorithms(): string[] {
    return Array.from(this.renderers.keys());
  }

  // Check if a renderer is registered for an algorithm type
  static hasRenderer(algorithmType: string): boolean {
    return this.renderers.has(algorithmType);
  }
}

// Abstract base class for all renderers
export abstract class BaseVisualizer implements IRVisualizer {
  protected state: Record<string, any> = {};

  abstract render(semanticIR: ISemanticIR): JSX.Element;
  abstract getInitialState(): Record<string, any>;
  abstract handleEvent(event: ISemanticEvent): void;
  abstract reset(): void;

  // Helper method to update state and trigger re-render
  protected setState(newState: Partial<Record<string, any>>): void {
    this.state = { ...this.state, ...newState };
  }
}

export default RendererFactory;