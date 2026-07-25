"use client";

import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handle, Position } from "@xyflow/react";
import { ChevronDown, ChevronRight, KeyRound } from "lucide-react";
import { IVariableValue } from "@/types/trace";

interface DictionaryRendererProps {
  id: string;
  data: {
    label?: string;
    entries?: Record<string, IVariableValue>;
    isGarbage?: boolean;
  };
}

const DictionaryRendererComponent: React.FC<DictionaryRendererProps> = ({ id, data }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const entries = data.entries || {};
  const entryKeys = Object.keys(entries);
  const isGarbage = data.isGarbage || false;
  const hexAddress = `0x${(200 + (id ? id.length * 5 : 1)).toString(16)}`;

  return (
    <div
      className={`bg-[#161b22]/90 backdrop-blur-md border-2 rounded-xl p-3 shadow-2xl min-w-[260px] transition-all ${
        isGarbage
          ? "border-dashed border-red-500/80 opacity-60 bg-red-950/20"
          : "border-emerald-500/80"
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-emerald-400" />

      {/* Header with RAM address */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
          aria-label="Toggle dictionary expansion"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <KeyRound className="w-3.5 h-3.5" />
          <span>dict</span>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded font-mono border border-emerald-500/30 ml-1">
            {hexAddress}
          </span>
        </button>

        <span className="text-[10px] text-gray-400 font-mono">
          {entryKeys.length} keys
        </span>
      </div>

      {/* Key-Value Card Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1.5 overflow-hidden"
          >
            {entryKeys.length === 0 ? (
              <div className="text-xs text-gray-500 italic py-1">Empty Dict {"{}"}</div>
            ) : (
              entryKeys.map((key) => {
                const val = entries[key];
                const valStr = val.kind === "primitive" ? String(val.value) : `-> ${val.target}`;

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-[#0d1117] px-2.5 py-1.5 rounded-lg border border-[#30363d]"
                  >
                    <span className="text-xs font-mono text-[#79c0ff] font-medium">
                      "{key}":
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-300">
                      {valStr}
                    </span>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-emerald-400" />
    </div>
  );
};

export const DictionaryRenderer = memo(DictionaryRendererComponent);
