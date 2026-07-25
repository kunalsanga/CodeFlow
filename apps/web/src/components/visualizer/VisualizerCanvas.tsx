"use client";

import React, { useMemo } from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ITraceEvent } from "@/types/trace";
import { normalizeTraceToGraph } from "@/lib/traceNormalizer";
import { customNodeTypes } from "@/components/renderers/RendererManager";
import { RecursionTreeRenderer } from "@/components/renderers/RecursionTreeRenderer";
import { Layers, Database } from "lucide-react";

interface VisualizerCanvasProps {
  currentStepEvent: ITraceEvent | null;
  previousStepEvent?: ITraceEvent | null;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  currentStepEvent,
  previousStepEvent = null
}) => {
  const { nodes, edges } = useMemo(() => {
    return normalizeTraceToGraph(currentStepEvent, previousStepEvent);
  }, [currentStepEvent, previousStepEvent]);

  return (
    <div className="h-full w-full bg-[#0b0e14] relative flex flex-col">
      {/* Visual Memory Header Bar */}
      <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-200">
            <Layers className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="uppercase tracking-wider">Stack Memory</span>
          </div>

          <div className="h-3.5 w-px bg-[#30363d]" />

          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-200">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase tracking-wider">Heap Memory (RAM)</span>
          </div>
        </div>

        {currentStepEvent && (
          <span className="text-xs text-[#79c0ff] font-mono">
            Line {currentStepEvent.line_number} | {currentStepEvent.event_type.toUpperCase()}
          </span>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 w-full h-full relative">
        {/* Integrated Recursion Tree Component Overlay */}
        {currentStepEvent && currentStepEvent.stack_frames.length >= 2 && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <RecursionTreeRenderer stackFrames={currentStepEvent.stack_frames} />
            </div>
          </div>
        )}

        {nodes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
            <p className="text-sm">Click "Visualize Execution" to step through memory & execution state.</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={customNodeTypes}
            fitView
            colorMode="dark"
            className="bg-[#0b0e14]"
          >
            <Background color="#21262d" gap={20} />
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
