"use client";

import React from "react";
import { ITraceEvent } from "@/types/trace";
import { Table } from "lucide-react";

interface VariableInspectorProps {
  currentStepEvent: ITraceEvent | null;
}

export const VariableInspector: React.FC<VariableInspectorProps> = ({ currentStepEvent }) => {
  if (!currentStepEvent || !currentStepEvent.stack_frames.length) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
        <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
          Variable Inspector
        </h3>
        <p className="text-xs text-gray-500 italic">No active variables in current step scope.</p>
      </div>
    );
  }

  const activeFrame = currentStepEvent.stack_frames[currentStepEvent.stack_frames.length - 1];
  const locals = activeFrame.locals;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-[#58a6ff]" />
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Scope Variables ({activeFrame.function_name})
          </h3>
        </div>
      </div>

      {Object.keys(locals).length === 0 ? (
        <p className="text-xs text-gray-500 italic">No variables in active frame.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-[#30363d]">
                <th className="py-1 font-semibold">Name</th>
                <th className="py-1 font-semibold">Kind / Type</th>
                <th className="py-1 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {Object.entries(locals).map(([name, val]) => (
                <tr key={name} className="text-gray-300">
                  <td className="py-1.5 font-mono text-[#79c0ff]">{name}</td>
                  <td className="py-1.5 font-mono text-gray-400 text-[11px]">{val.type}</td>
                  <td className="py-1.5 font-mono">
                    {val.kind === "primitive"
                      ? String(val.value)
                      : `-> ${val.target}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
