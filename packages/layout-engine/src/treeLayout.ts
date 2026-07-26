// Centralized Balanced Tree Layout Engine for CodeFlow

export interface ITreeNodeState {
  id: string;
  val: number;
  leftId: string | null;
  rightId: string | null;
}

export interface ITreePositionedNode {
  id: string;
  val: number;
  x: number;
  y: number;
  leftId: string | null;
  rightId: string | null;
}

export class TreeLayoutEngine {
  /**
   * Layout binary tree using inorder positioning with cycle safety
   */
  static layout(
    rootId: string | null,
    nodes: Record<string, ITreeNodeState>,
    xSpacing: number = 80,
    ySpacing: number = 90
  ): ITreePositionedNode[] {
    if (!rootId || !nodes[rootId]) return [];

    const positioned: ITreePositionedNode[] = [];
    const visited = new Set<string>();
    let inorderIndex = 0;

    function traverse(nodeId: string | null, depth: number) {
      if (!nodeId || !nodes[nodeId] || visited.has(nodeId) || depth > 50) return;

      visited.add(nodeId);
      const node = nodes[nodeId];

      // Left subtree
      traverse(node.leftId, depth + 1);

      // Position current node
      positioned.push({
        id: node.id,
        val: node.val,
        x: inorderIndex * xSpacing,
        y: depth * ySpacing,
        leftId: node.leftId,
        rightId: node.rightId,
      });
      inorderIndex++;

      // Right subtree
      traverse(node.rightId, depth + 1);
    }

    traverse(rootId, 0);

    // Center tree horizontally
    if (positioned.length > 0) {
      const minX = Math.min(...positioned.map(n => n.x));
      const maxX = Math.max(...positioned.map(n => n.x));
      const centerOffset = (minX + maxX) / 2;
      positioned.forEach(n => { n.x -= centerOffset; });
    }

    return positioned;
  }
}
