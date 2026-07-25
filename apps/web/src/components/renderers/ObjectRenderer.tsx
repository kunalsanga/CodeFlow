"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box } from "lucide-react";
import { IVariableValue } from "@/types/trace";

interface ObjectRendererProps {
  data: {
    className?: string;
    fields?: Record<string, IVariableValue>;
    repr?: string;
  };
}

const ObjectRendererComponent: React.FC<ObjectRendererProps> = ({ data }) => {
  const className = data.className || "Object";
  const fields = data.fields || {};
  const fieldKeys = Object.keys(fields);

  return (
    <div className="bg-[#161b22] border-2 border-purple-500/80 rounded-xl p-3 shadow-2xl min-w-[240px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-400" />

      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#30363d] pb-2 mb-2">
        <Box className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-bold text-purple-300 tracking-wider">
          class {className}
        </span>
      </div>

      {/* Object Fields List */}
      <div className="flex flex-col gap-1.5">
        {fieldKeys.length === 0 ? (
          <div className="text-xs text-gray-500 italic py-1">No instance attributes</div>
        ) : (
          fieldKeys.map((fieldName) => {
            const val = fields[fieldName];
            const valStr = val.kind === "primitive" ? String(val.value) : `-> ${val.target}`;

            return (
              <div
                key={fieldName}
                className="flex items-center justify-between bg-[#0d1117] px-2.5 py-1.5 rounded-lg border border-[#30363d]"
              >
                <span className="text-xs font-mono text-purple-300">
                  self.{fieldName}
                </span>
                <span className="text-xs font-mono text-gray-200">
                  {valStr}
                </span>
              </div>
            );
          })
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-400" />
    </div>
  );
};

export const ObjectRenderer = memo(ObjectRendererComponent);
