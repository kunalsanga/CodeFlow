import { IMemoryTraceFrame, IStackFrame, IHeapObject } from '../../types/src/execution';

export interface IFactualMemorySummary {
  activeStackDepth: number;
  totalHeapObjects: number;
  variableCount: number;
  topFunctionName: string;
}

export class TraceInterpreter {
  /**
   * Interpret factual memory trace frame state
   */
  static summarizeFrame(frame: IMemoryTraceFrame): IFactualMemorySummary {
    const stackFrames = frame.stack_frames || [];
    const heapObjects = frame.heap_objects || {};
    const topFrame = stackFrames[stackFrames.length - 1];

    const variableCount = stackFrames.reduce((acc, f) => acc + Object.keys(f.locals || {}).length, 0);

    return {
      activeStackDepth: stackFrames.length,
      totalHeapObjects: Object.keys(heapObjects).length,
      variableCount,
      topFunctionName: topFrame?.function_name || '<module>',
    };
  }

  /**
   * Extract object reference graph topology from factual heap
   */
  static extractReferenceGraph(heapObjects: Record<string, IHeapObject>): Array<{ from: string; to: string; field: string }> {
    const refs: Array<{ from: string; to: string; field: string }> = [];

    Object.entries(heapObjects).forEach(([objId, obj]) => {
      if (obj.kind === 'object' && obj.fields) {
        Object.entries(obj.fields).forEach(([fieldName, fieldVal]) => {
          if (fieldVal && fieldVal.kind === 'reference') {
            refs.push({
              from: objId,
              to: fieldVal.target,
              field: fieldName,
            });
          }
        });
      }
    });

    return refs;
  }
}
