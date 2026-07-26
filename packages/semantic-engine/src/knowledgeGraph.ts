// Queryable Educational Knowledge Graph for CodeFlow

export interface IKnowledgeGraphNode {
  id: string;
  type: 'Node' | 'Tree' | 'Graph' | 'Queue' | 'Stack' | 'Table';
  label: string;
  properties: Record<string, any>;
}

export interface IKnowledgeGraphEdge {
  from: string;
  to: string;
  relationship: 'PARENT_OF' | 'LEFT_CHILD' | 'RIGHT_CHILD' | 'NEXT' | 'RELAXED_TO' | 'ENQUEUED';
  weight?: number;
}

export class KnowledgeGraph {
  private nodes: Map<string, IKnowledgeGraphNode> = new Map();
  private edges: IKnowledgeGraphEdge[] = [];

  addNode(node: IKnowledgeGraphNode): void {
    this.nodes.set(node.id, node);
  }

  addEdge(edge: IKnowledgeGraphEdge): void {
    this.edges.push(edge);
  }

  getNode(id: string): IKnowledgeGraphNode | undefined {
    return this.nodes.get(id);
  }

  getEdgesFrom(id: string): IKnowledgeGraphEdge[] {
    return this.edges.filter(e => e.from === id);
  }

  getEdgesTo(id: string): IKnowledgeGraphEdge[] {
    return this.edges.filter(e => e.to === id);
  }

  /**
   * Query relationships for AI reasoning
   */
  querySubtree(rootId: string): string[] {
    const visited = new Set<string>();
    const queue = [rootId];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (visited.has(curr)) continue;
      visited.add(curr);

      const outEdges = this.getEdgesFrom(curr);
      outEdges.forEach(e => queue.push(e.to));
    }

    return Array.from(visited);
  }
}
