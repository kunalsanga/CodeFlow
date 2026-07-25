"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handle, Position } from "@xyflow/react";
import { IVariableValue } from "@/types/trace";

interface ArrayRendererProps {
  data: {
    label?: string;
    type?: string;
    items?: IVariableValue[];
    highlightIndices?: number[];
  };
}

const ArrayRendererComponent: React.FC<ArrayRendererProps> = ({ data }) => {
  const items = data.items || [];
  const highlightIndices = data.highlightIndices || [];

  return (
    <div className="bg-[#161b22] border-2 border-[#388bfd] rounded-xl p-3 shadow-2xl min-w-[280px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#58a6ff]" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#79c0ff] uppercase tracking-wider">
            {data.type || "List"}
          </span>
          <span className="text-[10px] bg-[#1f6feb]/30 text-[#79c0ff] px-2 py-0.5 rounded-full font-mono">
            len = {items.length}
          </span>
        </div>
      </div>

      {/* Array Cells Grid */}
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
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`flex flex-col items-center flex-shrink-0 ${
                    isHighlighted ? "scale-105" : ""
                  }`}
                >
                  {/* Index Label Header */}
                  <span className="text-[10px] font-mono text-gray-400 mb-1">
                    [{idx}]
                  </span>

                  {/* Value Box */}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-md transition-all ${
                      isHighlighted
                        ? "bg-[#388bfd] text-white border-2 border-white ring-4 ring-blue-500/30"
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
