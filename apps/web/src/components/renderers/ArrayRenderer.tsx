"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handle, Position } from "@xyflow/react";
import { IVariableValue } from "@/types/trace";
import { swapCellVariants, springPhysics } from "@/lib/animation/motionPresets";
import { Sparkles, Database } from "lucide-react";

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

  // Generate clean hex memory address for display (e.g. 0x101)
  const hexAddress = `0x${(100 + (id ? id.length * 7 : 1)).toString(16)}`;

  return (
    <div
      className={`bg-[#161b22]/90 backdrop-blur-md border-2 rounded-xl p-3 shadow-2xl min-w-[280px] transition-all ${
        isGarbage
          ? "border-dashed border-red-500/80 opacity-60 bg-red-950/20"
          : highlightIndices.length > 0
          ? "border-[#58a6ff] ring-4 ring-blue-500/20 shadow-blue-500/20"
          : "border-[#30363d]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#58a6ff]" />

      {/* RAM Address & Type Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span className="text-xs font-bold text-[#79c0ff] uppercase tracking-wider">
            {data.type || "List"}
          </span>
          <span className="text-[10px] bg-[#1f6feb]/20 text-[#79c0ff] px-2 py-0.5 rounded font-mono border border-blue-500/30">
            {hexAddress}
          </span>
        </div>

        <span className="text-[10px] text-gray-400 font-mono">
          len = {items.length}
        </span>
      </div>

      {/* Array Cells Grid with Pixar-style Lift/Drop Animation */}
      {items.length === 0 ? (
        <div className="text-center py-2 text-xs text-gray-500 italic">Empty List []</div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
                  {/* Swap Sparkle Icon */}
                  {isHighlighted && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-3 text-amber-400 z-20"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                    </motion.div>
                  )}

                  {/* Index Label Header */}
                  <span className="text-[10px] font-mono text-gray-400 mb-1">
                    [{idx}]
                  </span>

                  {/* Value Box */}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-md transition-all ${
                      isHighlighted
                        ? "bg-[#388bfd] text-white border-2 border-white ring-4 ring-blue-500/40 shadow-blue-500/50 scale-105"
                        : "bg-[#0d1117] text-[#e6edf3] border border-[#30363d]"
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

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#58a6ff]" />
    </div>
  );
};

export const ArrayRenderer = memo(ArrayRendererComponent);
