import { ICodeFlowPlugin } from '../../types/src/plugin';

export class PluginRegistry {
  private static instance: PluginRegistry;
  private plugins: Map<string, ICodeFlowPlugin> = new Map();

  private constructor() {}

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  public registerPlugin(plugin: ICodeFlowPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  public getPlugin(id: string): ICodeFlowPlugin | undefined {
    return this.plugins.get(id);
  }

  public getAllPlugins(): ICodeFlowPlugin[] {
    return Array.from(this.plugins.values());
  }

  public hasPlugin(id: string): boolean {
    return this.plugins.has(id);
  }
}

export const pluginRegistry = PluginRegistry.getInstance();
