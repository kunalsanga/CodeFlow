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
import { TreeHeroVisualizer } from "./TreeHeroVisualizer";
import { VisualizationMode } from "@/lib/algorithms/types";
import { Layers, Database } from "lucide-react";

import {
  BFSRenderer,
  DFSRenderer,
  DijkstraRenderer,
  MergeSortRenderer,
  QuickSortRenderer,
  TrieRenderer,
  DPRenderer,
  UnionFindRenderer,
  SegmentTreeRenderer,
  LRUCacheRenderer,
  LinkedListRenderer,
} from "@/semantic-engine/renderers";
import { ISemanticIR } from "@/types/semantic/ir";

interface VisualizerCanvasProps {
  currentStepEvent: ITraceEvent | null;
  previousStepEvent?: ITraceEvent | null;
  allTraceEvents?: ITraceEvent[];
  currentStepIndex?: number;
  mode?: VisualizationMode | string;
  detectedAlgorithm?: string;
  code?: string;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  currentStepEvent,
  previousStepEvent = null,
  allTraceEvents = [],
  currentStepIndex = 0,
  mode = "GENERIC",
  detectedAlgorithm = "generic",
  code = "",
}) => {
  const { nodes, edges } = useMemo(() => {
    return normalizeTraceToGraph(currentStepEvent, previousStepEvent);
  }, [currentStepEvent, previousStepEvent]);

  // Construct standard ISemanticIR container
  const semanticIR: ISemanticIR = useMemo(() => {
    return {
      algorithmType: detectedAlgorithm,
      events: [],
      data: {},
      metadata: {
        timestamp: Date.now(),
        totalSteps: allTraceEvents.length || 10,
        currentStep: currentStepIndex,
        isPlaying: false,
        speed: 1,
      },
      detection: {
        algorithmType: detectedAlgorithm,
        confidence: 0.95,
        detectedFrom: ['Multi-Stage Semantic DSA Detector'],
        suggestedRenderer: `${detectedAlgorithm}-renderer`,
      },
    };
  }, [detectedAlgorithm, allTraceEvents.length, currentStepIndex]);

  try {
    // Render specialized semantic visualizers with topic-based flat design
    if (detectedAlgorithm === "bfs") {
      return <BFSRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "dfs") {
      return <DFSRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "dijkstra") {
      return <DijkstraRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "merge-sort") {
      return <MergeSortRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "quick-sort") {
      return <QuickSortRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "trie") {
      return <TrieRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "dynamic-programming") {
      return <DPRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "union-find") {
      return <UnionFindRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "segment-tree") {
      return <SegmentTreeRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "lru-cache") {
      return <LRUCacheRenderer semanticIR={semanticIR} />;
    }

    if (detectedAlgorithm === "linked-list") {
      return <LinkedListRenderer semanticIR={semanticIR} />;
    }

    // BST / Tree mode
    if (mode === "BINARY_TREE" || detectedAlgorithm === "binary-search-tree") {
      return (
        <TreeHeroVisualizer
          currentEvent={currentStepEvent}
          allTraceEvents={allTraceEvents}
          currentStepIndex={currentStepIndex}
        />
      );
    }

    // Sorting mode
    if (mode === "SORTING_BUBBLE" || detectedAlgorithm === "bubble-sort") {
      return <SortingHeroVisualizer currentEvent={currentStepEvent} />;
    }

    // Binary search mode
    if (mode === "SEARCH_BINARY" || detectedAlgorithm === "binary-search") {
      return <BinarySearchHeroVisualizer currentEvent={currentStepEvent} />;
    }

    // Recursion mode
    if (mode === "RECURSION_TREE" && currentStepEvent) {
      return <RecursionHeroVisualizer stackFrames={currentStepEvent.stack_frames} />;
    }
  } catch (err) {
    console.warn("Specialized renderer threw exception. Falling back to Generic Memory Debugger:", err);
  }

  // Universal Fallback: Generic Memory Debugger (Stack + Heap RAM Layout)
  return (
    <div className="h-full w-full bg-[#0d1117] relative flex flex-col font-sans">
      <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-200">
            <Layers className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="uppercase tracking-wider">Stack Call Frames</span>
          </div>
          <div className="h-3.5 w-px bg-[#30363d]" />
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-200">
            <Database className="w-3.5 h-3.5 text-[#3fb950]" />
            <span className="uppercase tracking-wider">Heap RAM Memory</span>
          </div>
        </div>
        {currentStepEvent && (
          <span className="text-xs text-[#58a6ff] font-mono font-bold">
            Line {currentStepEvent.line_number} | {currentStepEvent.event_type.toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-1 w-full h-full relative">
        {nodes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#8b949e] gap-2 p-6 text-center">
            <p className="text-sm font-semibold">Click "Visualize Execution" to step through memory & execution state.</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={customNodeTypes}
            fitView
            colorMode="dark"
            className="bg-[#0d1117]"
          >
            <Background color="#30363d" gap={24} />
            <Controls className="bg-[#161b22] border-[#30363d] text-white" />
            <MiniMap
              className="bg-[#161b22] border-[#30363d]"
              nodeColor="#58a6ff"
              maskColor="rgba(0,0,0,0.6)"
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
};
