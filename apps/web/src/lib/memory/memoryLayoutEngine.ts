import { ITraceEvent } from "@/types/trace";
import { detectGarbageObjects, IUnreachableObjectInfo } from "./garbageCollector";

export interface IAliasingLink {
  objId: string;
  variableNames: string[];
}

export interface IMemoryAnalysisResult {
  refCounts: Record<string, number>;
  aliasedLinks: IAliasingLink[];
  garbageObjects: IUnreachableObjectInfo[];
  memoryInsights: string[];
}

export function analyzeMemoryLayout(currentEvent: ITraceEvent | null): IMemoryAnalysisResult {
  const result: IMemoryAnalysisResult = {
    refCounts: {},
    aliasedLinks: [],
    garbageObjects: [],
    memoryInsights: []
  };

  if (!currentEvent) return result;

  const { stack_frames, heap_objects } = currentEvent;
  const varMapByObjId: Record<string, string[]> = {};

  // 1. Calculate reference counts and collect aliased variable names
  stack_frames.forEach((frame) => {
    Object.entries(frame.locals).forEach(([varName, val]) => {
      if (val.kind === "reference" && val.target) {
        const objId = val.target;
        result.refCounts[objId] = (result.refCounts[objId] || 0) + 1;

        if (!varMapByObjId[objId]) varMapByObjId[objId] = [];
        varMapByObjId[objId].push(varName);
      }
    });
  });

  // 2. Identify Aliasing Links (variables pointing to the SAME heap object)
  Object.entries(varMapByObjId).forEach(([objId, vars]) => {
    if (vars.length > 1) {
      result.aliasedLinks.push({ objId, variableNames: vars });
      const heapObj = heap_objects[objId];
      const typeName = heapObj?.type || "object";
      result.memoryInsights.push(
        `Aliasing Detected: Variables [${vars.map(v => `'${v}'`).join(", ")}] both point to the same ${typeName} on the heap.`
      );
    }
  });

  // 3. Detect Garbage Candidates
  result.garbageObjects = detectGarbageObjects(currentEvent);
  result.garbageObjects.forEach((gb) => {
    result.memoryInsights.push(`Garbage Candidate: ${gb.reason}`);
  });

  // 4. Memory Heap Insights
  const heapCount = Object.keys(heap_objects).length;
  if (heapCount > 0 && result.memoryInsights.length === 0) {
    result.memoryInsights.push(
      `Heap Allocation: ${heapCount} active data structure(s) stored in heap memory.`
    );
  }

  return result;
}
