import { ITraceEvent, IStackFrame, IHeapObject } from "@/types/trace";
import { Node, Edge } from "@xyflow/react";
import { computeFrameDiff, IFrameDiffResult } from "./frameDiffEngine";
import { analyzeMemoryLayout, IMemoryAnalysisResult } from "./memory/memoryLayoutEngine";
import { detectDataStructures } from "./datastructures/dataStructureDetector";

export interface INormalizedCanvasData {
  nodes: Node[];
  edges: Edge[];
  diffResult: IFrameDiffResult;
  memoryAnalysis: IMemoryAnalysisResult;
}

export function normalizeTraceToGraph(
  currentEvent: ITraceEvent | null,
  previousEvent: ITraceEvent | null = null
): INormalizedCanvasData {
  const diffResult = computeFrameDiff(previousEvent, currentEvent);
  const memoryAnalysis = analyzeMemoryLayout(currentEvent);
  const detectedStructures = detectDataStructures(currentEvent);

  if (!currentEvent) {
    return { nodes: [], edges: [], diffResult, memoryAnalysis };
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const { stack_frames, heap_objects } = currentEvent;
  const garbageObjIds = new Set(memoryAnalysis.garbageObjects.map(g => g.objId));

  // Map of object IDs to specialized data structure type
  const dsMap: Record<string, string> = {};
  detectedStructures.forEach((ds) => {
    if (ds.rootObjId) dsMap[ds.rootObjId] = ds.type;
  });

  // 1. Stack Frame Nodes (Left Column: x = 50)
  let currentY = 50;
  stack_frames.forEach((frame: IStackFrame, index: number) => {
    const frameNodeId = `stack_${frame.frame_id}`;
    const isActive = index === stack_frames.length - 1;

    nodes.push({
      id: frameNodeId,
      type: "stackNode",
      position: { x: 50, y: currentY },
      data: {
        function_name: frame.function_name,
        line_number: frame.line_number,
        locals: frame.locals,
        isActive,
        changedVars: diffResult.changedVariables
      }
    });

    // Generate reference edges
    Object.entries(frame.locals).forEach(([varName, val]) => {
      if (val.kind === "reference" && val.target) {
        const isVarChanged = Boolean(diffResult.changedVariables[varName]);
        const refCount = memoryAnalysis.refCounts[val.target] || 1;
        const isAliased = refCount > 1;

        edges.push({
          id: `edge_${frameNodeId}_${varName}_to_${val.target}`,
          source: frameNodeId,
          target: `heap_${val.target}`,
          label: isAliased ? `${varName} (aliased)` : varName,
          animated: true,
          style: {
            stroke: isAliased ? "#f59e0b" : isVarChanged ? "#388bfd" : "#58a6ff",
            strokeWidth: isAliased ? 3 : isVarChanged ? 3 : 2
          }
        });
      }
    });

    currentY += 160;
  });

  // 2. Heap Memory Nodes (Right Column: x = 550)
  let heapY = 50;
  Object.entries(heap_objects).forEach(([objId, objData]: [string, IHeapObject]) => {
    const heapNodeId = `heap_${objId}`;
    const nodeDiff = diffResult.changedHeapNodes[objId];
    const isGarbage = garbageObjIds.has(objId);
    const dsType = dsMap[objId];

    if (dsType === "LINKED_LIST") {
      nodes.push({
        id: heapNodeId,
        type: "linkedListNode",
        position: { x: 550, y: heapY },
        data: {
          className: objData.type,
          fields: objData.kind === "object" ? objData.fields : {},
          isGarbage
        }
      });
      heapY += 140;
    } else if (dsType === "BINARY_TREE") {
      nodes.push({
        id: heapNodeId,
        type: "treeNode",
        position: { x: 550, y: heapY },
        data: {
          className: objData.type,
          fields: objData.kind === "object" ? objData.fields : {},
          isGarbage
        }
      });
      heapY += 160;
    } else if (objData.kind === "sequence") {
      nodes.push({
        id: heapNodeId,
        type: "arrayNode",
        position: { x: 550, y: heapY },
        data: {
          type: objData.type,
          items: objData.value,
          highlightIndices: nodeDiff?.changedIndices || [],
          isGarbage
        }
      });
      heapY += 150;
    } else if (objData.kind === "mapping") {
      nodes.push({
        id: heapNodeId,
        type: "dictNode",
        position: { x: 550, y: heapY },
        data: {
          entries: objData.value,
          highlightKeys: nodeDiff?.changedKeys || [],
          isGarbage
        }
      });
      heapY += 180;
    } else if (objData.kind === "object") {
      nodes.push({
        id: heapNodeId,
        type: "objectNode",
        position: { x: 550, y: heapY },
        data: {
          className: objData.type,
          fields: objData.fields,
          repr: objData.repr,
          highlightFields: nodeDiff?.changedFields || [],
          isGarbage
        }
      });
      heapY += 180;
    } else {
      nodes.push({
        id: heapNodeId,
        type: "default",
        position: { x: 550, y: heapY },
        data: { label: `${(objData as any).type || "object"}` }
      });
      heapY += 120;
    }
  });

  return { nodes, edges, diffResult, memoryAnalysis };
}
