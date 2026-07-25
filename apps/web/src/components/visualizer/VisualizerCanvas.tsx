"use client";

import React, { useMemo } from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ITraceEvent } from "@/types/trace";
import { normalizeTraceToGraph } from "@/lib/traceNormalizer";
import { customNodeTypes } from "@/components/renderers/RendererManager";
import { SortingHeroVisualizer } from "./SortingHeroVisualizer";
import { BinarySearchHeroVisualizer } from "./BinarySearchHeroVisualizer";
import { RecursionHeroVisualizer } from "./RecursionHeroVisualizer";
import { VisualizationMode } from "@/lib/algorithms/types";
import { Layers, Database } from "lucide-react";

interface VisualizerCanvasProps {
  currentStepEvent: ITraceEvent | null;
  previousStepEvent?: ITraceEvent | null;
  mode?: VisualizationMode;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  currentStepEvent,
  previousStepEvent = null,
  mode = "GENERIC"
}) => {
  const { nodes, edges } = useMemo(() => {
    return normalizeTraceToGraph(currentStepEvent, previousStepEvent);
  }, [currentStepEvent, previousStepEvent]);

  // Contextually render specialized algorithm visualizers
  if (mode === "SORTING_BUBBLE") {
    return <SortingHeroVisualizer currentEvent={currentStepEvent} />;
  }

  if (mode === "SEARCH_BINARY") {
    return <BinarySearchHeroVisualizer currentEvent={currentStepEvent} />;
  }

  if (mode === "RECURSION_TREE" && currentStepEvent) {
    return <RecursionHeroVisualizer stackFrames={currentStepEvent.stack_frames} />;
  }

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
