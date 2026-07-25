import { ITraceEvent, IStackFrame, IHeapObject } from "@/types/trace";
import { Node, Edge } from "@xyflow/react";

export interface INormalizedCanvasData {
  nodes: Node[];
  edges: Edge[];
}

export function normalizeTraceToGraph(event: ITraceEvent | null): INormalizedCanvasData {
  if (!event) {
    return { nodes: [], edges: [] };
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const { stack_frames, heap_objects } = event;

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
        isActive
      }
    });

    // Generate reference edges
    Object.entries(frame.locals).forEach(([varName, val]) => {
      if (val.kind === "reference" && val.target) {
        edges.push({
          id: `edge_${frameNodeId}_${varName}_to_${val.target}`,
          source: frameNodeId,
          target: `heap_${val.target}`,
          label: varName,
          animated: true,
          style: { stroke: "#58a6ff", strokeWidth: 2 }
        });
      }
    });

    currentY += 160;
  });

  // 2. Heap Memory Nodes (Right Column: x = 550)
  let heapY = 50;
  Object.entries(heap_objects).forEach(([objId, objData]: [string, IHeapObject]) => {
    const heapNodeId = `heap_${objId}`;

    if (objData.kind === "sequence") {
      nodes.push({
        id: heapNodeId,
        type: "arrayNode",
        position: { x: 550, y: heapY },
        data: {
          type: objData.type,
          items: objData.value
        }
      });
      heapY += 150;
    } else if (objData.kind === "mapping") {
      nodes.push({
        id: heapNodeId,
        type: "dictNode",
        position: { x: 550, y: heapY },
        data: {
          entries: objData.value
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
          repr: objData.repr
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

  return { nodes, edges };
}
