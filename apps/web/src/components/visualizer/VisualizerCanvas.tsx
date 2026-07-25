"use client";

import React, { useMemo } from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ITraceEvent } from "@/types/trace";
import { normalizeTraceToGraph } from "@/lib/traceNormalizer";

interface VisualizerCanvasProps {
  currentStepEvent: ITraceEvent | null;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ currentStepEvent }) => {
  const { nodes, edges } = useMemo(() => {
    return normalizeTraceToGraph(currentStepEvent);
  }, [currentStepEvent]);

  return (
    <div className="h-full w-full bg-[#0b0e14] relative flex flex-col">
      <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between z-10">
        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
          Execution Visualizer Canvas (Stack vs. Heap Memory)
        </span>
        {currentStepEvent && (
          <span className="text-xs text-[#79c0ff] font-mono">
            Event: {currentStepEvent.event_type.toUpperCase()} | Line {currentStepEvent.line_number}
          </span>
        )}
      </div>

      <div className="flex-1 w-full h-full">
        {nodes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
            <p className="text-sm">Click "Visualize Execution" to start visual step tracing.</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            colorMode="dark"
            className="bg-[#0b0e14]"
          >
            <Background color="#21262d" gap={16} />
            <Controls className="bg-[#161b22] border-[#30363d] text-white" />
            <MiniMap
              className="bg-[#161b22] border-[#30363d]"
              nodeColor="#388bfd"
              maskColor="rgba(0,0,0,0.6)"
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
};
