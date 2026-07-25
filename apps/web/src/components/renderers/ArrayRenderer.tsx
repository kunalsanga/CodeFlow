"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handle, Position } from "@xyflow/react";
import { IVariableValue } from "@/types/trace";
import { swapCellVariants, springPhysics } from "@/lib/animation/motionPresets";
import { Sparkles, BarChart2 } from "lucide-react";

interface ArrayRendererProps {
  id: string;
  data: {
    label?: string;
    type?: string;
    items?: IVariableValue[];
    highlightIndices?: number[];
    isGarbage?: boolean;
  };
}

const ArrayRendererComponent: React.FC<ArrayRendererProps> = ({ id, data }) => {
  const items = data.items || [];
  const highlightIndices = data.highlightIndices || [];
  const isGarbage = data.isGarbage || false;

  return (
    <div
      className={`bg-[#161b22]/95 backdrop-blur-xl border-2 rounded-2xl p-4 shadow-2xl min-w-[340px] transition-all ${
        isGarbage
          ? "border-dashed border-red-500/80 opacity-60 bg-red-950/20"
          : highlightIndices.length > 0
          ? "border-[#58a6ff] ring-4 ring-blue-500/30 shadow-blue-500/30"
          : "border-[#30363d]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-3.5 h-3.5 bg-[#58a6ff]" />

      {/* Hero Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#58a6ff]" />
          <span className="text-sm font-bold text-[#79c0ff] uppercase tracking-wider">
            {data.type || "List"}
          </span>
        </div>

        <span className="text-xs text-gray-400 font-mono">
          {items.length} elements
        </span>
      </div>

      {/* Hero Array Cells (Large Animated Blocks) */}
      {items.length === 0 ? (
        <div className="text-center py-4 text-xs text-gray-500 italic">Empty Array []</div>
      ) : (
        <div className="flex items-center gap-3 overflow-x-auto py-2 px-1">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => {
              const isHighlighted = highlightIndices.includes(idx);
              const valStr = item.kind === "primitive" ? String(item.value) : `ref`;

              return (
                <motion.div
                  key={`cell_${idx}_${valStr}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isHighlighted ? "highlighted" : "initial"}
                  variants={swapCellVariants}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={springPhysics}
                  className="flex flex-col items-center flex-shrink-0 relative"
                >
                  {/* Swap Sparkle */}
                  {isHighlighted && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-4 text-amber-400 z-20"
                    >
                      <Sparkles className="w-4 h-4 fill-amber-400" />
                    </motion.div>
                  )}

                  {/* Index Header */}
                  <span className="text-xs font-mono font-bold text-gray-400 mb-1.5">
                    [{idx}]
                  </span>

                  {/* Hero Large Value Block */}
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center font-mono font-extrabold text-lg shadow-xl transition-all ${
                      isHighlighted
                        ? "bg-[#388bfd] text-white border-2 border-white ring-4 ring-blue-500/50 shadow-blue-500/60 scale-110"
                        : "bg-[#0d1117] text-white border border-[#30363d]"
                    }`}
                  >
                    {valStr}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-3.5 h-3.5 bg-[#58a6ff]" />
    </div>
  );
};

export const ArrayRenderer = memo(ArrayRendererComponent);
