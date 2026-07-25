"use client";

import React from "react";
import { Brain, Cpu, Zap, Lightbulb, AlertTriangle } from "lucide-react";
import { IAlgorithmResult } from "@/lib/algorithms/types";

interface AlgorithmMetadataPanelProps {
  algorithmResult: IAlgorithmResult | null;
}

export const AlgorithmMetadataPanel: React.FC<AlgorithmMetadataPanelProps> = ({
  algorithmResult
}) => {
  if (!algorithmResult) return null;

  const { metadata, metrics, confidence, algorithmName } = algorithmResult;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-3 shadow-md">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Algorithm Mode: <span className="text-[#79c0ff]">{algorithmName}</span>
          </h3>
        </div>
        <span className="text-[10px] bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded-full font-mono">
          {Math.round(confidence * 100)}% match
        </span>
      </div>

      {/* Complexity Badges */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0d1117] p-2 rounded border border-[#21262d] flex flex-col">
          <span className="text-[10px] text-gray-400 font-semibold uppercase">Time Complexity</span>
          <span className="text-xs font-mono font-bold text-emerald-400">{metadata.timeComplexity}</span>
        </div>
        <div className="bg-[#0d1117] p-2 rounded border border-[#21262d] flex flex-col">
          <span className="text-[10px] text-gray-400 font-semibold uppercase">Space Complexity</span>
          <span className="text-xs font-mono font-bold text-blue-400">{metadata.spaceComplexity}</span>
        </div>
      </div>

      {/* Live Performance Metrics Grid */}
      <div className="bg-[#0d1117] p-2.5 rounded border border-[#30363d]">
        <div className="flex items-center gap-1.5 mb-2">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
            Live Metrics
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-[#161b22] p-1.5 rounded">
            <div className="text-gray-400 text-[10px]">Compares</div>
            <div className="font-bold text-[#79c0ff]">{metrics.comparisons}</div>
          </div>
          <div className="bg-[#161b22] p-1.5 rounded">
            <div className="text-gray-400 text-[10px]">Swaps</div>
            <div className="font-bold text-amber-400">{metrics.swaps}</div>
          </div>
          <div className="bg-[#161b22] p-1.5 rounded">
            <div className="text-gray-400 text-[10px]">Max Stack</div>
            <div className="font-bold text-purple-400">{metrics.maxStackDepth}</div>
          </div>
        </div>
      </div>

      {/* Educational Guidance */}
      <div className="flex flex-col gap-2 pt-1 border-t border-[#30363d]">
        <div className="flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">
            {metadata.overview}
          </p>
        </div>

        <div className="bg-blue-950/40 border-l-2 border-[#58a6ff] p-2 rounded-r flex items-start gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-[#79c0ff] shrink-0 mt-0.5" />
          <span className="text-[11px] text-blue-200">
            <strong className="text-[#79c0ff]">Interview Tip:</strong> {metadata.interviewTip}
          </span>
        </div>

        <div className="bg-amber-950/40 border-l-2 border-amber-500 p-2 rounded-r flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-[11px] text-amber-200">
            <strong className="text-amber-400">Common Mistake:</strong> {metadata.commonMistake}
          </span>
        </div>
      </div>
    </div>
  );
};
