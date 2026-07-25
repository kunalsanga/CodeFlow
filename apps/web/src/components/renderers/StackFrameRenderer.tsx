"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Handle, Position } from "@xyflow/react";
import { Layers, CornerDownRight } from "lucide-react";
import { IVariableValue } from "@/types/trace";

interface StackFrameRendererProps {
  data: {
    function_name?: string;
    line_number?: number;
    locals?: Record<string, IVariableValue>;
    isActive?: boolean;
    changedVars?: Record<string, any>;
  };
}

const StackFrameRendererComponent: React.FC<StackFrameRendererProps> = ({ data }) => {
  const funcName = data.function_name || "<module>";
  const lineNo = data.line_number || 1;
  const locals = data.locals || {};
  const isActive = data.isActive ?? true;
  const changedVars = data.changedVars || {};

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`bg-[#161b22]/95 border-2 rounded-xl overflow-hidden shadow-2xl min-w-[280px] transition-all ${
        isActive
          ? "border-[#58a6ff] ring-4 ring-blue-500/20 scale-102"
          : "border-[#30363d] opacity-80"
      }`}
    >
      {/* Debugger Header */}
      <div className="bg-[#1f242c] px-3.5 py-2 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className={`w-4 h-4 ${isActive ? "text-[#58a6ff]" : "text-gray-400"}`} />
          <span className="text-xs font-bold text-white font-mono tracking-wide">
            {funcName}()
          </span>
        </div>
        <span className="text-[10px] bg-[#1f6feb]/30 text-[#79c0ff] px-2 py-0.5 rounded font-mono border border-blue-500/30">
          Line {lineNo}
        </span>
      </div>

      {/* Memory Table: Variables & Values */}
      <div className="p-2.5 flex flex-col gap-1.5">
        {Object.keys(locals).length === 0 ? (
          <div className="text-xs text-gray-500 italic py-1 text-center">Empty Frame Scope</div>
        ) : (
          Object.entries(locals).map(([varName, val]) => {
            const isChanged = Boolean(changedVars[varName]);
            const valStr = val.kind === "primitive" ? String(val.value) : `0x${val.target}`;

            return (
              <motion.div
                key={varName}
                animate={isChanged ? { scale: [1, 1.05, 1] } : {}}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-all ${
                  isChanged
                    ? "bg-[#1f6feb]/30 border-[#58a6ff] text-white font-bold ring-2 ring-blue-500/40"
                    : "bg-[#0d1117] border-[#30363d] text-gray-200"
                }`}
              >
                <span className="text-xs font-mono text-[#79c0ff] font-medium">
                  {varName}
                </span>
                <span className="text-xs font-mono font-bold">
                  {valStr}
                </span>
              </motion.div>
            );
          })
        )}

        {/* Return address indicator */}
        {isActive && (
          <div className="mt-1 pt-1.5 border-t border-[#30363d]/60 flex items-center justify-between text-[10px] text-gray-400 font-mono">
            <span className="flex items-center gap-1">
              <CornerDownRight className="w-3 h-3 text-[#58a6ff]" /> return address
            </span>
            <span className="text-[#79c0ff]">line {lineNo}</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#58a6ff]" />
    </motion.div>
  );
};

export const StackFrameRenderer = memo(StackFrameRendererComponent);
