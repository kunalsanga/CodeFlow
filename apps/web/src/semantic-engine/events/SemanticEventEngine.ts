import { ISemanticEvent, ISemanticIR, IAlgorithmDetectionResult } from '@/types/semantic/ir';
import { ITraceEvent } from '@/types/trace';
import AlgorithmDetector from '../detectors/AlgorithmDetector';

// Semantic Event Engine
// Transforms runtime execution trace into semantic events
// This is the bridge between raw runtime and educational visualization

export class SemanticEventEngine {
  private trace: ITraceEvent[] = [];
  private semanticEvents: ISemanticEvent[] = [];
  private detectionResult: IAlgorithmDetectionResult | null = null;
  private currentStep = 0;

  constructor() {
    // Initialize with empty state
  }

  // Process a raw execution trace into semantic events
  processTrace(trace: ITraceEvent[], code: string): ISemanticIR {
    this.trace = trace;
    this.semanticEvents = [];
    this.currentStep = 0;

    // First, detect what algorithm we're dealing with
    this.detectionResult = AlgorithmDetector.detect(code);

    // Then, transform each trace event into semantic events
    for (let i = 0; i < trace.length; i++) {
      const traceEvent = trace[i];
      const events = this.transformTraceEvent(traceEvent, i);
      this.semanticEvents.push(...events);
    }

    // Build the semantic IR
    return this.buildSemanticIR();
  }

  // Transform a single trace event into semantic events
  private transformTraceEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    // Get the current line of code
    const line = traceEvent.line_number;

    // Get current stack frame
    const stackFrame = traceEvent.stack_frames[0];
    if (!stackFrame) {
      return events;
    }

    // Get current heap state
    const heapObjects = traceEvent.heap_objects;

    // Generate semantic events based on the algorithm type and current state
    switch (this.detectionResult?.algorithmType) {
      case 'binary-search-tree':
        events.push(...this.transformBSTEvent(traceEvent, stepIndex));
        break;
      case 'linked-list':
        events.push(...this.transformLinkedListEvent(traceEvent, stepIndex));
        break;
      case 'stack':
        events.push(...this.transformStackEvent(traceEvent, stepIndex));
        break;
      case 'queue':
        events.push(...this.transformQueueEvent(traceEvent, stepIndex));
        break;
      case 'heap':
        events.push(...this.transformHeapEvent(traceEvent, stepIndex));
        break;
      case 'trie':
        events.push(...this.transformTrieEvent(traceEvent, stepIndex));
        break;
      case 'graph':
        events.push(...this.transformGraphEvent(traceEvent, stepIndex));
        break;
      case 'binary-search':
        events.push(...this.transformBinarySearchEvent(traceEvent, stepIndex));
        break;
      case 'bubble-sort':
        events.push(...this.transformBubbleSortEvent(traceEvent, stepIndex));
        break;
      case 'merge-sort':
        events.push(...this.transformMergeSortEvent(traceEvent, stepIndex));
        break;
      case 'quick-sort':
        events.push(...this.transformQuickSortEvent(traceEvent, stepIndex));
        break;
      case 'dynamic-programming':
        events.push(...this.transformDPEvent(traceEvent, stepIndex));
        break;
      case 'union-find':
        events.push(...this.transformUnionFindEvent(traceEvent, stepIndex));
        break;
      case 'segment-tree':
        events.push(...this.transformSegmentTreeEvent(traceEvent, stepIndex));
        break;
      case 'fenwick-tree':
        events.push(...this.transformFenwickTreeEvent(traceEvent, stepIndex));
        break;
      default:
        events.push(...this.transformGenericEvent(traceEvent, stepIndex));
    }

    return events;
  }

  // BST-specific transformation
  private transformBSTEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];
    const heapObjects = traceEvent.heap_objects;
    const stackFrame = traceEvent.stack_frames[0];

    if (!stackFrame) return events;

    // Detect node creation
    for (const [objId, obj] of Object.entries(heapObjects)) {
      if (obj.kind === 'object' && 'value' in obj.fields) {
        const valObj = obj.fields['value'] as any;
        const value = valObj && typeof valObj === 'object' && 'value' in valObj ? valObj.value : valObj;
        if (typeof value === 'number') {
          events.push({
            type: 'BST_CREATE_NODE',
            timestamp: Date.now(),
            stepIndex,
            payload: { value, nodeId: objId },
          });
        }
      }
    }

    // Detect comparison operations
    if (stackFrame.locals['target']) {
      const targetVar = stackFrame.locals['target'] as any;
      const target = targetVar?.value !== undefined ? targetVar.value : targetVar;
      events.push({
        type: 'BST_COMPARE',
        timestamp: Date.now(),
        stepIndex,
        payload: { left: target, right: 50 }, // Simplified
      });
    }

    // Detect traversal
    if (stackFrame.locals['current']) {
      const current = stackFrame.locals['current'];
      if (current.kind === 'reference') {
        events.push({
          type: 'BST_VISIT_NODE',
          timestamp: Date.now(),
          stepIndex,
          payload: { value: 50, nodeId: current.target },
        });
      }
    }

    return events;
  }

  // Linked List transformation
  private transformLinkedListEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];
    const heapObjects = traceEvent.heap_objects;

    // Detect node creation
    for (const [objId, obj] of Object.entries(heapObjects)) {
      if (obj.kind === 'object' && obj.fields['value']) {
        const valObj = obj.fields['value'] as any;
        const value = valObj && typeof valObj === 'object' && 'value' in valObj ? valObj.value : valObj;
        events.push({
          type: 'LL_CREATE_NODE',
          timestamp: Date.now(),
          stepIndex,
          payload: { value, nodeId: objId },
        });
      }
    }

    return events;
  }

  // Stack transformation
  private transformStackEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];
    const stackFrame = traceEvent.stack_frames[0];

    if (!stackFrame) return events;

    // Detect push/pop from function calls
    const functionName = stackFrame.function_name.toLowerCase();

    if (functionName.includes('push')) {
      const valVar = stackFrame.locals['value'] as any;
      const value = valVar?.value !== undefined ? valVar.value : valVar;
      if (value !== undefined) {
        events.push({
          type: 'STACK_PUSH',
          timestamp: Date.now(),
          stepIndex,
          payload: { value, position: 0 },
        });
      }
    }

    if (functionName.includes('pop')) {
      events.push({
        type: 'STACK_POP',
        timestamp: Date.now(),
        stepIndex,
        payload: { value: 10, position: 0 },
      });
    }

    return events;
  }

  // Queue transformation
  private transformQueueEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    // Detect enqueue/dequeue from function calls
    const stackFrame = traceEvent.stack_frames[0];
    const functionName = stackFrame?.function_name.toLowerCase() || '';

    if (functionName.includes('enqueue')) {
      const valVar = stackFrame.locals['value'] as any;
      const value = valVar?.value !== undefined ? valVar.value : valVar;
      if (value !== undefined) {
        events.push({
          type: 'QUEUE_ENQUEUE',
          timestamp: Date.now(),
          stepIndex,
          payload: { value, position: 0 },
        });
      }
    }

    if (functionName.includes('dequeue')) {
      events.push({
        type: 'QUEUE_DEQUEUE',
        timestamp: Date.now(),
        stepIndex,
        payload: { value: 10, position: 0 },
      });
    }

    return events;
  }

  // Heap transformation
  private transformHeapEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    // Detect heap operations
    const stackFrame = traceEvent.stack_frames[0];
    const functionName = stackFrame?.function_name.toLowerCase() || '';

    if (functionName.includes('insert') || functionName.includes('push')) {
      const valVar = stackFrame.locals['value'] as any;
      const value = valVar?.value !== undefined ? valVar.value : valVar;
      if (value !== undefined) {
        events.push({
          type: 'HEAP_INSERT',
          timestamp: Date.now(),
          stepIndex,
          payload: { value, position: 0 },
        });
      }
    }

    if (functionName.includes('extract')) {
      events.push({
        type: 'HEAP_EXTRACT_MIN',
        timestamp: Date.now(),
        stepIndex,
        payload: { value: 1, position: 0 },
      });
    }

    return events;
  }

  private getVarValue(varObj: any): any {
    if (!varObj) return undefined;
    return typeof varObj === 'object' && 'value' in varObj ? varObj.value : varObj;
  }

  // Trie transformation
  private transformTrieEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    // Detect trie operations
    const stackFrame = traceEvent.stack_frames[0];
    const char = this.getVarValue(stackFrame?.locals['char']);

    if (char !== undefined && typeof char === 'string') {
      events.push({
        type: 'TRIE_INSERT_CHAR',
        timestamp: Date.now(),
        stepIndex,
        payload: { char, nodeId: 'node-' + char.charCodeAt(0), wordPrefix: '' },
      });
    }

    return events;
  }

  // Graph transformation
  private transformGraphEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    // Detect graph operations
    const stackFrame = traceEvent.stack_frames[0];
    const nodeId = this.getVarValue(stackFrame?.locals['node']);

    if (nodeId !== undefined) {
      events.push({
        type: 'GRAPH_VISIT_NODE',
        timestamp: Date.now(),
        stepIndex,
        payload: { nodeId: String(nodeId), label: 'Node ' + nodeId },
      });
    }

    return events;
  }

  // Binary Search transformation
  private transformBinarySearchEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    const stackFrame = traceEvent.stack_frames[0];
    const low = this.getVarValue(stackFrame?.locals['low']);
    const high = this.getVarValue(stackFrame?.locals['high']);
    const target = this.getVarValue(stackFrame?.locals['target']);

    if (low !== undefined) {
      events.push({
        type: 'BS_SET_LOW',
        timestamp: Date.now(),
        stepIndex,
        payload: { index: low },
      });
    }

    if (high !== undefined) {
      events.push({
        type: 'BS_SET_HIGH',
        timestamp: Date.now(),
        stepIndex,
        payload: { index: high },
      });
    }

    if (target !== undefined) {
      events.push({
        type: 'BS_COMPARE',
        timestamp: Date.now(),
        stepIndex,
        payload: { target, mid: 5, midValue: 15 },
      });
    }

    return events;
  }

  // Bubble Sort transformation
  private transformBubbleSortEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    const stackFrame = traceEvent.stack_frames[0];
    const i = this.getVarValue(stackFrame?.locals['i']);
    const j = this.getVarValue(stackFrame?.locals['j']);

    if (i !== undefined && j !== undefined) {
      events.push({
        type: 'SORT_COMPARE',
        timestamp: Date.now(),
        stepIndex,
        payload: { leftIndex: j, rightIndex: j + 1, leftValue: 0, rightValue: 0 },
      });
    }

    return events;
  }

  // Merge Sort transformation
  private transformMergeSortEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    const stackFrame = traceEvent.stack_frames[0];
    const left = this.getVarValue(stackFrame?.locals['left']);
    const right = this.getVarValue(stackFrame?.locals['right']);

    if (left !== undefined && right !== undefined) {
      events.push({
        type: 'SORT_MERGE',
        timestamp: Date.now(),
        stepIndex,
        payload: { leftArray: [], rightArray: [], result: [] },
      });
    }

    return events;
  }

  // Quick Sort transformation
  private transformQuickSortEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    const stackFrame = traceEvent.stack_frames[0];
    const pivot = this.getVarValue(stackFrame?.locals['pivot']);

    if (pivot !== undefined) {
      events.push({
        type: 'SORT_SET_PIVOT',
        timestamp: Date.now(),
        stepIndex,
        payload: { index: 0, value: pivot },
      });
    }

    return events;
  }

  // Dynamic Programming transformation
  private transformDPEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    const stackFrame = traceEvent.stack_frames[0];
    const i = this.getVarValue(stackFrame?.locals['i']);
    const j = this.getVarValue(stackFrame?.locals['j']);

    if (i !== undefined && j !== undefined) {
      events.push({
        type: 'DP_UPDATE_CELL',
        timestamp: Date.now(),
        stepIndex,
        payload: { row: i, col: j, value: 0 },
      });
    }

    return events;
  }

  // Union Find transformation
  private transformUnionFindEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    return events;
  }

  // Segment Tree transformation
  private transformSegmentTreeEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    return events;
  }

  // Fenwick Tree transformation
  private transformFenwickTreeEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    return events;
  }

  // Generic transformation for unknown algorithms
  private transformGenericEvent(traceEvent: ITraceEvent, stepIndex: number): ISemanticEvent[] {
    const events: ISemanticEvent[] = [];

    // Create a generic event that captures the essential information
    events.push({
      type: 'GENERIC_STEP',
      timestamp: Date.now(),
      stepIndex,
      payload: {
        lineNumber: traceEvent.line_number,
        functionName: traceEvent.stack_frames[0]?.function_name,
        stdout: traceEvent.stdout,
      },
    });

    return events;
  }

  // Build the final Semantic IR
  private buildSemanticIR(): ISemanticIR {
    const data = this.extractDataFromTrace();

    return {
      algorithmType: this.detectionResult?.algorithmType || 'generic',
      events: this.semanticEvents,
      data,
      metadata: {
        timestamp: Date.now(),
        totalSteps: this.trace.length,
        currentStep: this.currentStep,
        isPlaying: false,
        speed: 1,
      },
      detection: this.detectionResult,
    };
  }

  // Extract current state from trace
  private extractDataFromTrace(): Record<string, any> {
    // This would extract the current state of the data structure
    // For now, return an empty object
    return {};
  }

  // Get events at a specific step
  getEventsAtStep(step: number): ISemanticEvent[] {
    return this.semanticEvents.filter(e => e.stepIndex === step);
  }

  // Get current semantic IR
  getCurrentIR(): ISemanticIR {
    return this.buildSemanticIR();
  }

  // Reset the engine
  reset(): void {
    this.trace = [];
    this.semanticEvents = [];
    this.detectionResult = null;
    this.currentStep = 0;
  }
}

export default SemanticEventEngine;