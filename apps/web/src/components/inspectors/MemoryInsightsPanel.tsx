"use client";

import React from "react";
import { Database, AlertOctagon, Share2, Info } from "lucide-react";
import { IMemoryAnalysisResult } from "@/lib/memory/memoryLayoutEngine";

interface MemoryInsightsPanelProps {
  memoryAnalysis: IMemoryAnalysisResult | null;
}

export const MemoryInsightsPanel: React.FC<MemoryInsightsPanelProps> = ({ memoryAnalysis }) => {
  if (!memoryAnalysis) return null;

  const { aliasedLinks, garbageObjects, memoryInsights } = memoryAnalysis;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3.5 flex flex-col gap-2.5 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
        <div className="flex items-center gap-1.5">
          <Database className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Memory & Garbage Collection Engine
          </h3>
        </div>
        {garbageObjects.length > 0 && (
          <span className="text-[10px] bg-red-950/80 border border-red-800/80 text-red-300 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
            {garbageObjects.length} Garbage
          </span>
        )}
      </div>

      {/* Aliased Reference Warnings */}
      {aliasedLinks.map((link) => (
        <div key={link.objId} className="bg-amber-950/40 border-l-2 border-amber-500 p-2 rounded-r flex items-start gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-[11px] text-amber-200 leading-snug">
            <strong className="text-amber-400">Aliasing:</strong> Variables [{link.variableNames.map(v => `'${v}'`).join(", ")}] point to the same memory address!
          </span>
        </div>
      ))}

      {/* Garbage Objects Alerts */}
      {garbageObjects.map((gb) => (
        <div key={gb.objId} className="bg-red-950/40 border-l-2 border-red-500 p-2 rounded-r flex items-start gap-1.5">
          <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <span className="text-[11px] text-red-200 leading-snug">
            <strong className="text-red-400">Garbage Candidate:</strong> Unreachable {gb.type} object.
          </span>
        </div>
      ))}

      {/* General Memory Insights */}
      {memoryInsights.map((insight, idx) => (
        <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-300">
          <Info className="w-3.5 h-3.5 text-[#79c0ff] shrink-0 mt-0.5" />
          <span className="leading-relaxed">{insight}</span>
        </div>
      ))}
    </div>
  );
};
