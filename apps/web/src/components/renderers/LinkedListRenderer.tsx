"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { ArrowRight, Link } from "lucide-react";
import { IVariableValue } from "@/types/trace";

interface LinkedListRendererProps {
  data: {
    className?: string;
    fields?: Record<string, IVariableValue>;
    repr?: string;
    isGarbage?: boolean;
  };
}

const LinkedListRendererComponent: React.FC<LinkedListRendererProps> = ({ data }) => {
  const fields = data.fields || {};
  const valObj = fields["val"] || fields["data"] || fields["value"];
  const valStr = valObj ? (valObj.kind === "primitive" ? String(valObj.value) : `ref`) : "?";

  return (
    <div className="bg-[#161b22] border-2 border-cyan-500 rounded-xl p-3 shadow-2xl min-w-[200px] flex flex-col gap-2">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-cyan-400" />

      {/* Header */}
      <div className="flex items-center gap-1.5 border-b border-[#30363d] pb-1.5">
        <Link className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
          ListNode
        </span>
      </div>

      {/* Node Content: [ Value | Next ] */}
      <div className="flex items-center gap-2 bg-[#0d1117] p-2 rounded-lg border border-[#30363d]">
        <div className="flex flex-col items-center flex-1">
          <span className="text-[9px] text-gray-400 font-mono">val</span>
          <span className="text-xs font-bold font-mono text-cyan-200">{valStr}</span>
        </div>
        <div className="h-6 w-px bg-[#30363d]" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-[9px] text-gray-400 font-mono">next</span>
          <span className="text-xs font-bold font-mono text-gray-300 flex items-center gap-0.5">
            next <ArrowRight className="w-3 h-3 text-cyan-400" />
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-cyan-400" />
    </div>
  );
};

export const LinkedListRenderer = memo(LinkedListRendererComponent);
