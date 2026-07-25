"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { GitBranch, CornerDownRight } from "lucide-react";
import { IStackFrame } from "@/types/trace";

interface RecursionHeroVisualizerProps {
  stackFrames: IStackFrame[];
}

export const RecursionHeroVisualizerComponent: React.FC<RecursionHeroVisualizerProps> = ({ stackFrames }) => {
  if (!stackFrames || stackFrames.length === 0) return null;

  const recursiveFrames = stackFrames.filter(f => f.function_name !== "<module>");

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-[#0b0e14]">
      {/* Header Badge */}
      <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/40">
        <GitBranch className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-bold font-mono text-purple-300 uppercase tracking-wider">
          Recursion Call Tree Mode
        </span>
      </div>

      {/* Hero Recursion Call Tree */}
      <div className="bg-[#161b22]/90 border-2 border-purple-500/80 rounded-2xl p-6 shadow-2xl max-w-xl w-full flex flex-col gap-3">
        {recursiveFrames.length === 0 ? (
          <div className="text-gray-500 italic text-sm text-center">Root frame initialized</div>
        ) : (
          recursiveFrames.map((frame, idx) => {
            const indentPx = idx * 24;
            const isActive = idx === recursiveFrames.length - 1;
            const localsStr = Object.entries(frame.locals)
              .map(([k, v]) => `${k}=${v.kind === "primitive" ? v.value : "ref"}`)
              .join(", ");

            return (
              <motion.div
                key={`rec_hero_${frame.frame_id}_${idx}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.08 }}
                style={{ marginLeft: `${indentPx}px` }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-mono border transition-all ${
                  isActive
                    ? "bg-purple-950/90 border-purple-400 text-purple-100 font-bold ring-4 ring-purple-500/40 scale-105 shadow-xl"
                    : "bg-[#0d1117] border-[#30363d] text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{frame.function_name}({localsStr})</span>
                </div>
                <span className="text-xs text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded font-mono">
                  Line {frame.line_number}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export const RecursionHeroVisualizer = memo(RecursionHeroVisualizerComponent);
