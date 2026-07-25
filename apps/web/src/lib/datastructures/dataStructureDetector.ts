import { ITraceEvent, IHeapObject } from "@/types/trace";
import { IDataStructureInfo, DataStructureType } from "./types";

export function detectDataStructures(currentEvent: ITraceEvent | null): IDataStructureInfo[] {
  if (!currentEvent) return [];

  const { heap_objects } = currentEvent;
  const detected: IDataStructureInfo[] = [];

  Object.entries(heap_objects).forEach(([objId, objData]: [string, IHeapObject]) => {
    if (objData.kind === "object" && objData.fields) {
      const fieldNames = Object.keys(objData.fields).map(f => f.toLowerCase());

      // Binary Tree Detection (left & right attributes)
      if (fieldNames.includes("left") || fieldNames.includes("right")) {
        detected.push({
          type: "BINARY_TREE",
          rootObjId: objId,
          metadata: { className: objData.type }
        });
      }
      // Linked List Detection (next attribute)
      else if (fieldNames.includes("next")) {
        detected.push({
          type: "LINKED_LIST",
          rootObjId: objId,
          metadata: { className: objData.type }
        });
      }
    }
  });

  return detected;
}
