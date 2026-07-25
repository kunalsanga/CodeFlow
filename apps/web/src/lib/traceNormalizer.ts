import { ITraceEvent, IStackFrame, IHeapObject } from "@/types/trace";
import { Node, Edge } from "@xyflow/react";
import { computeFrameDiff, IFrameDiffResult } from "./frameDiffEngine";

export interface INormalizedCanvasData {
  nodes: Node[];
  edges: Edge[];
  diffResult: IFrameDiffResult;
}

export function normalizeTraceToGraph(
  currentEvent: ITraceEvent | null,
  previousEvent: ITraceEvent | null = null
): INormalizedCanvasData {
  const diffResult = computeFrameDiff(previousEvent, currentEvent);

  if (!currentEvent) {
    return { nodes: [], edges: [], diffResult };
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const { stack_frames, heap_objects } = currentEvent;

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
        edges.push({
          id: `edge_${frameNodeId}_${varName}_to_${val.target}`,
          source: frameNodeId,
          target: `heap_${val.target}`,
          label: varName,
          animated: true,
          style: {
            stroke: isVarChanged ? "#388bfd" : "#58a6ff",
            strokeWidth: isVarChanged ? 3 : 2
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

    if (objData.kind === "sequence") {
      nodes.push({
        id: heapNodeId,
        type: "arrayNode",
        position: { x: 550, y: heapY },
        data: {
          type: objData.type,
          items: objData.value,
          highlightIndices: nodeDiff?.changedIndices || []
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
          highlightKeys: nodeDiff?.changedKeys || []
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
          highlightFields: nodeDiff?.changedFields || []
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

  return { nodes, edges, diffResult };
}
