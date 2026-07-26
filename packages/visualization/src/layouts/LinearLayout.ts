import { ISceneNode, IPoint } from '../types/scene';

export class LinearLayout {
  public static calculatePositions(nodes: Partial<ISceneNode>[], options?: { direction?: 'horizontal' | 'vertical'; spacing?: number; startPos?: IPoint }): ISceneNode[] {
    const direction = options?.direction || 'horizontal';
    const spacing = options?.spacing || 120;
    const startPos = options?.startPos || { x: 100, y: 150 };

    return nodes.map((node, index) => {
      const position: IPoint =
        direction === 'horizontal'
          ? { x: startPos.x + index * spacing, y: startPos.y }
          : { x: startPos.x, y: startPos.y + index * spacing };

      return {
        id: node.id || `linear-node-${index}`,
        type: node.type || 'rectangle',
        position,
        label: node.label || String(node.value ?? index),
        subLabel: node.subLabel,
        state: node.state || 'default',
        style: node.style,
      };
    });
  }
}

export default LinearLayout;
