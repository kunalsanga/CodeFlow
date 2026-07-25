"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { ITraceEvent, IHeapObject } from "@/types/trace";
import { GitFork, Sparkles } from "lucide-react";
import { springPhysics } from "@/lib/animation/motionPresets";

interface TreeHeroVisualizerProps {
  currentEvent: ITraceEvent | null;
}

export const TreeHeroVisualizerComponent: React.FC<TreeHeroVisualizerProps> = ({ currentEvent }) => {
  if (!currentEvent) return null;

  const topFrame = currentEvent.stack_frames[currentEvent.stack_frames.length - 1];
  const funcName = topFrame?.function_name || "insert";
  const locals = topFrame?.locals || {};

  // Extract tree nodes from heap
  const treeNodes: { id: string; val: string; leftTarget?: string; rightTarget?: string }[] = [];

  Object.entries(currentEvent.heap_objects).forEach(([objId, obj]: [string, IHeapObject]) => {
    if (obj.kind === "object" && obj.fields) {
      const keys = Object.keys(obj.fields).map(k => k.toLowerCase());
      if (keys.includes("left") || keys.includes("right")) {
        const valObj = obj.fields["val"] || obj.fields["value"] || obj.fields["key"] || obj.fields["data"];
        const valStr = valObj ? (valObj.kind === "primitive" ? String(valObj.value) : "ref") : objId;

        const leftObj = obj.fields["left"];
        const rightObj = obj.fields["right"];

        treeNodes.push({
          id: objId,
          val: valStr,
          leftTarget: leftObj && leftObj.kind === "reference" ? leftObj.target : undefined,
          rightTarget: rightObj && rightObj.kind === "reference" ? rightObj.target : undefined
        });
      }
    }
  });

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-[#0b0e14]">
      {/* Header Badge */}
      <div className="mb-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40">
        <GitFork className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider">
          Binary Search Tree (BST) Visualizer Mode
        </span>
      </div>

      {/* Operation Status Card */}
      <div className="mb-6 bg-[#161b22]/90 border-2 border-emerald-500/60 rounded-xl p-3.5 shadow-2xl flex items-center gap-6 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-semibold uppercase">Operation:</span>
          <span className="font-extrabold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 text-sm">
            {funcName}()
          </span>
        </div>

        <div className="h-4 w-px bg-[#30363d]" />

        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-gray-200 font-bold">
            {treeNodes.length} BST node(s) allocated in heap memory
          </span>
        </div>
      </div>

      {/* Tree Nodes Display */}
      {treeNodes.length === 0 ? (
        <div className="text-gray-500 italic text-sm">Executing BST initialization...</div>
      ) : (
        <div className="flex items-center justify-center gap-6 flex-wrap py-8 px-6 bg-[#161b22]/80 border-2 border-[#30363d] rounded-2xl shadow-2xl">
          {treeNodes.map((node, idx) => (
            <motion.div
              key={`bst_hero_${node.id}_${idx}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springPhysics}
              className="bg-[#0d1117] border-2 border-emerald-500 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-1 min-w-[100px]"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center font-mono font-extrabold text-emerald-200 text-lg shadow-inner">
                {node.val}
              </div>
              <span className="text-[10px] font-mono text-gray-400 mt-1">Node 0x{node.id.slice(0, 4)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeHeroVisualizer = memo(TreeHeroVisualizerComponent);
