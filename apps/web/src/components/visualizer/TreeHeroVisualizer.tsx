"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ITraceEvent, IHeapObject } from "@/types/trace";
import { GitFork, Sparkles, ArrowLeft, ArrowRight, Activity } from "lucide-react";
import { springPhysics } from "@/lib/animation/motionPresets";
import { generateSemanticEventStream } from "@/lib/events/semanticEventEngine";

interface TreeHeroVisualizerProps {
  currentEvent: ITraceEvent | null;
}

interface IBSTNode {
  id: string;
  val: number;
  leftId?: string;
  rightId?: string;
}

export const TreeHeroVisualizerComponent: React.FC<TreeHeroVisualizerProps> = ({ currentEvent }) => {
  if (!currentEvent) return null;

  const topFrame = currentEvent.stack_frames[currentEvent.stack_frames.length - 1];
  const funcName = topFrame?.function_name || "insert";
  const locals = topFrame?.locals || {};

  // Extract inserted value & root
  const valueToInsert = locals["value"]?.kind === "primitive" ? Number(locals["value"].value) : null;

  // Extract tree nodes from heap
  const bstNodesMap: Record<string, IBSTNode> = {};

  Object.entries(currentEvent.heap_objects).forEach(([objId, obj]: [string, IHeapObject]) => {
    if (obj.kind === "object" && obj.fields) {
      const keys = Object.keys(obj.fields).map(k => k.toLowerCase());
      if (keys.includes("left") || keys.includes("right")) {
        const valObj = obj.fields["val"] || obj.fields["value"] || obj.fields["key"] || obj.fields["data"];
        const numVal = valObj && valObj.kind === "primitive" ? Number(valObj.value) : 0;

        const leftObj = obj.fields["left"];
        const rightObj = obj.fields["right"];

        bstNodesMap[objId] = {
          id: objId,
          val: numVal,
          leftId: leftObj && leftObj.kind === "reference" ? leftObj.target : undefined,
          rightId: rightObj && rightObj.kind === "reference" ? rightObj.target : undefined
        };
      }
    }
  });

  const nodeCount = Object.keys(bstNodesMap).length;
  const semanticEvents = generateSemanticEventStream([currentEvent]);
  const activeSemanticEvent = semanticEvents[0];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-[#0b0e14]">
      {/* Header Badge */}
      <div className="mb-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40">
        <GitFork className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider">
          BST Semantic Event Stream Visualizer
        </span>
      </div>

      {/* Semantic Event Operation Status Card */}
      <div className="mb-6 bg-[#161b22]/90 border-2 border-emerald-500/60 rounded-xl p-3.5 shadow-2xl flex items-center gap-6 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-gray-400 font-semibold uppercase">Semantic Event:</span>
          <span className="font-extrabold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40 text-sm">
            {activeSemanticEvent ? activeSemanticEvent.description : `${funcName}(val=${valueToInsert !== null ? valueToInsert : "?"})`}
          </span>
        </div>

        <div className="h-4 w-px bg-[#30363d]" />

        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-gray-200 font-bold">
            {nodeCount} Tree Node(s) Allocated
          </span>
        </div>
      </div>

      {/* Hierarchical Tree Nodes Canvas */}
      {nodeCount === 0 ? (
        <div className="text-gray-500 italic text-sm">Executing BST initialization...</div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8 py-8 px-10 bg-[#161b22]/80 border-2 border-[#30363d] rounded-2xl shadow-2xl min-w-[480px]">
          <AnimatePresence mode="popLayout">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {Object.values(bstNodesMap).map((node, idx) => {
                const isInsertingTarget = valueToInsert !== null && node.val === valueToInsert;

                return (
                  <motion.div
                    key={`bst_semantic_node_${node.id}_${idx}`}
                    layout
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, y: isInsertingTarget ? -10 : 0 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={springPhysics}
                    className="flex flex-col items-center relative"
                  >
                    {/* BST Circular Node Block */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-mono font-extrabold text-xl shadow-2xl transition-all ${
                        isInsertingTarget
                          ? "bg-amber-600 text-white border-2 border-white ring-4 ring-amber-500/60 scale-110 shadow-amber-500/60"
                          : "bg-emerald-950 text-emerald-200 border-2 border-emerald-400"
                      }`}
                    >
                      {node.val}
                    </div>

                    {/* Left & Right Branch Indicator Badges */}
                    <div className="flex items-center gap-2 mt-2 font-mono text-[10px] font-bold">
                      {node.leftId && (
                        <span className="flex items-center text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                          <ArrowLeft className="w-2.5 h-2.5 mr-0.5" /> L
                        </span>
                      )}
                      {node.rightId && (
                        <span className="flex items-center text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/40">
                          R <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export const TreeHeroVisualizer = memo(TreeHeroVisualizerComponent);
