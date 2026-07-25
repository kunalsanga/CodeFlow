"use client";

import React from "react";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { IFrameDiffResult } from "@/lib/frameDiffEngine";

interface StepChangesPanelProps {
  diffResult: IFrameDiffResult | null;
}

export const StepChangesPanel: React.FC<StepChangesPanelProps> = ({ diffResult }) => {
  if (!diffResult || diffResult.educationalSummaries.length === 0) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
          Step Changes
        </h3>
        <p className="text-xs text-gray-500 italic">No state mutations in this step.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] border border-blue-500/50 rounded-lg p-3 flex flex-col gap-2 shadow-md">
      <div className="flex items-center gap-1.5 border-b border-[#30363d] pb-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#58a6ff]" />
        <h3 className="text-xs font-bold text-[#79c0ff] uppercase tracking-wider">
          Educational Change Summary
        </h3>
      </div>

      <div className="flex flex-col gap-1.5">
        {diffResult.educationalSummaries.map((summary, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-gray-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{summary}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
