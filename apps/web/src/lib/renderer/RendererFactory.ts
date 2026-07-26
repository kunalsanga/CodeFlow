// RendererFactory.ts - Core factory for managing all specialized visualizers
import { RendererFactory as SemanticRendererFactory } from '@/semantic-engine/renderers';

export interface RendererPlugin {
  name: string;
  supportedEvents: string[];
  initialize?: (eventBus: any, stateEngine: any) => void;
}

export class LegacyRendererFactory {
  private static instance: LegacyRendererFactory;

  public static getInstance(): LegacyRendererFactory {
    if (!LegacyRendererFactory.instance) {
      LegacyRendererFactory.instance = new LegacyRendererFactory();
    }
    return LegacyRendererFactory.instance;
  }

  public getRenderer(name: string): any {
    return SemanticRendererFactory.getRenderer(name);
  }
}

export const rendererFactory = LegacyRendererFactory.getInstance();