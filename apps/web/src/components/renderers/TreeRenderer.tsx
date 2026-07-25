"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { GitFork } from "lucide-react";
import { IVariableValue } from "@/types/trace";

interface TreeRendererProps {
  data: {
    className?: string;
    fields?: Record<string, IVariableValue>;
    repr?: string;
  };
}

const TreeRendererComponent: React.FC<TreeRendererProps> = ({ data }) => {
  const fields = data.fields || {};
  const valObj = fields["val"] || fields["value"] || fields["key"] || fields["data"];
  const valStr = valObj ? (valObj.kind === "primitive" ? String(valObj.value) : `ref`) : "?";

  return (
    <div className="bg-[#161b22] border-2 border-emerald-500 rounded-full p-4 shadow-2xl w-24 h-24 flex flex-col items-center justify-center relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-emerald-400" />

      <GitFork className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
      <span className="text-sm font-bold font-mono text-emerald-200">{valStr}</span>

      {/* Left Child Connection Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="left"
        className="w-3 h-3 bg-emerald-400 left-4"
      />
      {/* Right Child Connection Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="right"
        className="w-3 h-3 bg-emerald-400 right-4"
      />
    </div>
  );
};

export const TreeRenderer = memo(TreeRendererComponent);
