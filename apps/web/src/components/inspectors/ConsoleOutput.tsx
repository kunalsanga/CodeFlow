"use client";

import React from "react";
import { Terminal } from "lucide-react";

interface ConsoleOutputProps {
  stdout: string;
  error?: string | null;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ stdout, error }) => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 border-b border-[#30363d] pb-2">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
          Console Output
        </h3>
      </div>

      <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap max-h-32 overflow-y-auto bg-[#0d1117] p-2.5 rounded border border-[#21262d]">
        {error ? (
          <span className="text-red-400 font-semibold">{error}</span>
        ) : stdout ? (
          stdout
        ) : (
          <span className="text-gray-600 italic">No output produced yet.</span>
        )}
      </pre>
    </div>
  );
};
