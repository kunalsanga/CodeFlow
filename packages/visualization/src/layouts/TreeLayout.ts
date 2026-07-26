import { ISceneNode, ISceneEdge, IPoint } from '../types/scene';

export interface ITreeNodeData {
  id: string;
  label: string;
  leftId?: string;
  rightId?: string;
  subLabel?: string;
  state?: any;
}

export class TreeLayout {
  public static calculatePositions(
    treeNodes: Record<string, ITreeNodeData>,
    rootId: string,
    startPos: IPoint = { x: 400, y: 100 }
  ): { nodes: ISceneNode[]; edges: ISceneEdge[] } {
    const nodes: ISceneNode[] = [];
    const edges: ISceneEdge[] = [];

    const traverse = (nodeId: string, depth: number, x: number, xOffset: number) => {
      const nodeData = treeNodes[nodeId];
      if (!nodeData) return;

      const y = startPos.y + depth * 90;

      nodes.push({
        id: nodeId,
        type: 'circle',
        position: { x, y },
        label: nodeData.label,
        subLabel: nodeData.subLabel,
        state: nodeData.state || 'default',
      });

      if (nodeData.leftId) {
        edges.push({
          id: `e-${nodeId}-${nodeData.leftId}`,
          sourceId: nodeId,
          targetId: nodeData.leftId,
          type: 'straight',
        });
        traverse(nodeData.leftId, depth + 1, x - xOffset, xOffset / 2);
      }

      if (nodeData.rightId) {
        edges.push({
          id: `e-${nodeId}-${nodeData.rightId}`,
          sourceId: nodeId,
          targetId: nodeData.rightId,
          type: 'straight',
        });
        traverse(nodeData.rightId, depth + 1, x + xOffset, xOffset / 2);
      }
    };

    traverse(rootId, 0, startPos.x, 140);
    return { nodes, edges };
  }
}

export default TreeLayout;
