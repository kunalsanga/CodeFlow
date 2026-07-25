import { ITraceEvent } from "@/types/trace";

export interface IUnreachableObjectInfo {
  objId: string;
  type: string;
  reason: string;
}

export function detectGarbageObjects(currentEvent: ITraceEvent | null): IUnreachableObjectInfo[] {
  if (!currentEvent) return [];

  const { stack_frames, heap_objects } = currentEvent;
  const reachableObjIds = new Set<string>();

  // 1. Collect all directly reachable heap objects from active stack frames
  stack_frames.forEach((frame) => {
    Object.values(frame.locals).forEach((val) => {
      if (val.kind === "reference" && val.target) {
        markReachable(val.target, heap_objects, reachableObjIds);
      }
    });
  });

  // 2. Identify unreachable heap objects (ref_count == 0)
  const garbageObjects: IUnreachableObjectInfo[] = [];

  Object.entries(heap_objects).forEach(([objId, objData]) => {
    if (!reachableObjIds.has(objId)) {
      garbageObjects.push({
        objId,
        type: objData.type,
        reason: `No active variables reference this ${objData.type} object. It is eligible for Garbage Collection.`
      });
    }
  });

  return garbageObjects;
}

function markReachable(
  objId: string,
  heapObjects: Record<string, any>,
  reachableSet: Set<string>
) {
  if (reachableSet.has(objId)) return;
  reachableSet.add(objId);

  const obj = heapObjects[objId];
  if (!obj) return;

  // Traverse child reference pointers inside sequence / mapping / object fields
  if (obj.kind === "sequence" && Array.isArray(obj.value)) {
    obj.value.forEach((item: any) => {
      if (item.kind === "reference" && item.target) {
        markReachable(item.target, heapObjects, reachableSet);
      }
    });
  } else if (obj.kind === "mapping" && obj.value) {
    Object.values(obj.value).forEach((item: any) => {
      if (item.kind === "reference" && item.target) {
        markReachable(item.target, heapObjects, reachableSet);
      }
    });
  } else if (obj.kind === "object" && obj.fields) {
    Object.values(obj.fields).forEach((item: any) => {
      if (item.kind === "reference" && item.target) {
        markReachable(item.target, heapObjects, reachableSet);
      }
    });
  }
}
