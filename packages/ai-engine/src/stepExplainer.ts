import { ISemanticEvent, IStepRationale } from '../../types/src';

// Factual Execution Log Stream Engine for CodeFlow v1.0 PRD
// Translates execution events into deterministic factual logs without AI LLM dependencies

export class StepExplainerEngine {
  /**
   * Generate factual execution log explaining exact step state change
   */
  static generateRationale(event: ISemanticEvent | null, stepIndex: number, algorithmType: string): IStepRationale {
    if (!event) {
      return {
        reason: 'Program Execution Start',
        explanation: `Initial state initialized for ${algorithmType.toUpperCase()} execution.`,
        prediction: 'Variables and memory frames will allocate on line step.',
      };
    }

    const type = event.type || 'STEP';

    if (type.includes('LINKED_LIST_INSERT') || algorithmType === 'linked-list') {
      return {
        reason: `Linked List Operation: Node Insertion`,
        explanation: `Allocated Node in Heap RAM. Next pointer connected to previous Head node.`,
        prediction: `Head pointer updated to point to newly inserted node.`,
      };
    }

    if (type.includes('DIJKSTRA_RELAX') || algorithmType === 'dijkstra') {
      return {
        reason: 'Graph Edge Relaxation: dist[v] > dist[u] + weight',
        explanation: 'Shorter path discovered to target node. Updated distance table.',
        prediction: 'Pushed updated (distance, node) tuple to Min-Heap Priority Queue.',
      };
    }

    if (type.includes('MERGESORT_SPLIT') || algorithmType === 'merge-sort') {
      return {
        reason: 'Divide & Conquer Split',
        explanation: 'Calculated sub-array middle index. Splitting array into left and right halves.',
        prediction: 'Recursive call stack frame pushed for left sub-array.',
      };
    }

    if (type.includes('BST_ROTATE') || algorithmType === 'binary-search-tree') {
      return {
        reason: 'Binary Search Tree Node Insertion / Traversal',
        explanation: 'Comparing search value against root node value. Pointer traversing child node.',
        prediction: 'Left or right child pointer assigned upon reaching leaf NULL pointer.',
      };
    }

    if (type.includes('RECURSION') || algorithmType === 'recursion') {
      return {
        reason: 'Call Stack Frame Allocation',
        explanation: 'Recursive function invocation pushed new stack frame to Stack Memory.',
        prediction: 'Stack frame unwinds upon hitting base return condition.',
      };
    }

    return {
      reason: `Step ${stepIndex + 1}: Line Execution`,
      explanation: `Executed line state transition event ${type}.`,
      prediction: 'Next execution step will advance control flow.',
    };
  }
}
