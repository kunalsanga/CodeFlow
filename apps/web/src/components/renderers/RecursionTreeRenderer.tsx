"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { GitBranch, CornerDownRight } from "lucide-react";
import { IStackFrame } from "@/types/trace";

interface RecursionTreeRendererProps {
  stackFrames: IStackFrame[];
}

export const RecursionTreeRenderer: React.FC<RecursionTreeRendererProps> = ({ stackFrames }) => {
  if (!stackFrames || stackFrames.length < 2) return null;

  const recursiveFrames = stackFrames.filter(f => f.function_name !== "<module>");
  if (recursiveFrames.length < 2) return null;

  return (
    <div className="bg-[#161b22]/95 border-2 border-purple-500/80 rounded-xl p-3.5 shadow-2xl min-w-[260px] flex flex-col gap-2">
      <div className="flex items-center gap-2 border-b border-[#30363d] pb-2">
        <GitBranch className="w-4 h-4 text-purple-400" />
        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
          Recursion Call Tree
        </h4>
      </div>

      <div className="flex flex-col gap-1.5 pl-1">
        {recursiveFrames.map((frame, idx) => {
          const indentPx = idx * 16;
          const isActive = idx === recursiveFrames.length - 1;
          const localsStr = Object.entries(frame.locals)
            .map(([k, v]) => `${k}=${v.kind === "primitive" ? v.value : "ref"}`)
            .join(", ");

          return (
            <motion.div
              key={`rec_${frame.frame_id}_${idx}`}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              style={{ marginLeft: `${indentPx}px` }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                isActive
                  ? "bg-purple-950/80 border-purple-500 text-purple-200 font-bold ring-2 ring-purple-500/40 scale-105"
                  : "bg-[#0d1117] border-[#30363d] text-gray-300"
              }`}
            >
              <CornerDownRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{frame.function_name}({localsStr})</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(RecursionTreeRenderer);
