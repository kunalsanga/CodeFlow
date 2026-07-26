import { SceneGraph } from './SceneGraph';
import { ISceneTheme } from '../types/scene';

export class SceneBuilder {
  private scene: SceneGraph;

  constructor(theme?: ISceneTheme) {
    this.scene = new SceneGraph({ theme });
  }

  public setTitle(title: string, subtitle?: string): this {
    this.scene.title = title;
    this.scene.subtitle = subtitle;
    return this;
  }

  public addNode(id: string, label: string, x: number, y: number, options?: Partial<any>): this {
    this.scene.addNode({
      id,
      type: options?.type || 'circle',
      position: { x, y },
      label,
      subLabel: options?.subLabel,
      state: options?.state || 'default',
      style: options?.style,
      metadata: options?.metadata,
    });
    return this;
  }

  public addEdge(id: string, sourceId: string, targetId: string, options?: Partial<any>): this {
    this.scene.addEdge({
      id,
      sourceId,
      targetId,
      type: options?.type || 'arrow',
      label: options?.label,
      dashed: options?.dashed,
      state: options?.state || 'default',
      style: options?.style,
    });
    return this;
  }

  public addHighlight(targetId: string, label?: string, color?: string): this {
    this.scene.addHighlight({
      id: `hl-${targetId}-${Date.now()}`,
      targetId,
      type: 'ring',
      label,
      color,
    });
    return this;
  }

  public build(): SceneGraph {
    return this.scene;
  }
}

export default SceneBuilder;
