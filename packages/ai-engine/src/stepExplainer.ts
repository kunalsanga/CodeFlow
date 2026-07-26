import { ISemanticEvent, IStepRationale } from '../../types/src';

export class StepExplainerEngine {
  /**
   * Generate educational step rationale explaining WHY a state change occurred
   */
  static generateRationale(event: ISemanticEvent | null, stepIndex: number, algorithmType: string): IStepRationale {
    if (!event) {
      return {
        reason: 'Initial Program Setup',
        explanation: `Initializing runtime execution state for ${algorithmType.toUpperCase()}.`,
        prediction: 'Variables and data structures will initialize.',
      };
    }

    const type = event.type || 'STEP';

    if (type.includes('DIJKSTRA_RELAX')) {
      return {
        reason: 'Edge Relaxation Check: dist[v] > dist[u] + weight',
        explanation: 'A shorter path to neighbor node was discovered through the current node.',
        prediction: 'Distance table and Priority Queue will update with shorter distance.',
        hint: 'Priority queue always yields the node with minimum unvisited distance.',
      };
    }

    if (type.includes('MERGESORT_SPLIT')) {
      return {
        reason: 'Divide & Conquer Array Halving',
        explanation: 'Array is divided into left and right sub-arrays until single elements remain.',
        prediction: 'Recursive calls will continue splitting until array length is <= 1.',
        hint: 'Base case of single elements is trivially sorted.',
      };
    }

    if (type.includes('BST_ROTATE') || type.includes('ROTATE')) {
      return {
        reason: 'Unbalanced Height (Balance Factor < -1 or > 1)',
        explanation: 'Tree subtree height difference exceeded 1. A tree rotation was triggered to restore O(log N) depth.',
        prediction: 'Root of subtree changes to balance left and right branch heights.',
        hint: 'Rotations maintain BST inorder ordering while minimizing tree height.',
      };
    }

    if (type.includes('TRIE_INSERT_CHAR')) {
      return {
        reason: 'Character Prefix Traversal',
        explanation: `Checking prefix path for character '${event.payload?.char || ''}'. Reusing existing nodes if character match found.`,
        prediction: 'Reuses shared prefix nodes before growing new branch.',
        hint: 'Trie compresses storage by sharing common word prefix paths.',
      };
    }

    return {
      reason: `Step ${stepIndex + 1}: Executing ${type}`,
      explanation: `State transition event ${type} applied to algorithm state.`,
      prediction: 'Next step will advance execution flow.',
    };
  }
}
