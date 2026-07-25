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
    
    nodes.push({
      id: frameNodeId,
      type: "default",
      position: { x: 50, y: currentY },
      data: {
        label: `${frame.function_name}() [Line ${frame.line_number}]`
      },
      style: {
        background: index === stack_frames.length - 1 ? "#1f293d" : "#161b22",
        color: "#e6edf3",
        border: index === stack_frames.length - 1 ? "2px solid #58a6ff" : "1px solid #30363d",
        borderRadius: "8px",
        padding: "12px",
        width: "280px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }
    });

    // Generate variables inside frame
    Object.entries(frame.locals).forEach(([varName, val]) => {
      if (val.kind === "reference") {
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

    currentY += 120;
  });

  // 2. Heap Memory Nodes (Right Column: x = 450)
  let heapY = 50;
  Object.entries(heap_objects).forEach(([objId, objData]: [string, IHeapObject]) => {
    const heapNodeId = `heap_${objId}`;
    let label = `${objData.type}`;

    if (objData.kind === "sequence") {
      const items = objData.value.map(v => v.kind === "primitive" ? String(v.value) : `->${v.target}`).join(", ");
      label = `${objData.type} [${items}]`;
    } else if (objData.kind === "mapping") {
      label = `dict { ${Object.keys(objData.value).length} entries }`;
    } else if (objData.kind === "object") {
      label = `${objData.type} instance`;
    }

    nodes.push({
      id: heapNodeId,
      type: "default",
      position: { x: 450, y: heapY },
      data: { label },
      style: {
        background: "#1c2128",
        color: "#79c0ff",
        border: "1px solid #388bfd",
        borderRadius: "8px",
        padding: "12px",
        width: "240px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
      }
    });

    heapY += 100;
  });

  return { nodes, edges };
}
