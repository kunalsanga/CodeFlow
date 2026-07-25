"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Handle, Position } from "@xyflow/react";
import { Layers } from "lucide-react";
import { IVariableValue } from "@/types/trace";

interface StackFrameRendererProps {
  data: {
    function_name?: string;
    line_number?: number;
    locals?: Record<string, IVariableValue>;
    isActive?: boolean;
  };
}

const StackFrameRendererComponent: React.FC<StackFrameRendererProps> = ({ data }) => {
  const funcName = data.function_name || "<module>";
  const lineNo = data.line_number || 1;
  const locals = data.locals || {};
  const isActive = data.isActive ?? true;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`bg-[#161b22] border-2 ${
        isActive ? "border-[#58a6ff] ring-2 ring-blue-500/30" : "border-[#30363d]"
      } rounded-xl p-3 shadow-2xl min-w-[260px]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Layers className={`w-4 h-4 ${isActive ? "text-[#58a6ff]" : "text-gray-400"}`} />
          <span className="text-xs font-bold text-gray-200 font-mono">
            {funcName}()
          </span>
        </div>
        <span className="text-[10px] bg-[#1f6feb]/30 text-[#79c0ff] px-2 py-0.5 rounded-full font-mono">
          Line {lineNo}
        </span>
      </div>

      {/* Frame Locals */}
      <div className="flex flex-col gap-1.5">
        {Object.keys(locals).length === 0 ? (
          <div className="text-xs text-gray-500 italic py-1">No local scope variables</div>
        ) : (
          Object.entries(locals).map(([varName, val]) => {
            const valStr = val.kind === "primitive" ? String(val.value) : `ref`;

            return (
              <div
                key={varName}
                className="flex items-center justify-between bg-[#0d1117] px-2.5 py-1.5 rounded-lg border border-[#30363d]"
              >
                <span className="text-xs font-mono text-[#79c0ff]">
                  {varName}
                </span>
                <span className="text-xs font-mono font-medium text-gray-200">
                  {valStr}
                </span>
              </div>
            );
          })
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#58a6ff]" />
    </motion.div>
  );
};

export const StackFrameRenderer = memo(StackFrameRendererComponent);
