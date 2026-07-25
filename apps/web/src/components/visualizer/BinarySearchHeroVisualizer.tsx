"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ITraceEvent, IVariableValue } from "@/types/trace";
import { Sparkles, ArrowUp, Search } from "lucide-react";
import { springPhysics } from "@/lib/animation/motionPresets";

interface BinarySearchHeroVisualizerProps {
  currentEvent: ITraceEvent | null;
}

export const BinarySearchHeroVisualizerComponent: React.FC<BinarySearchHeroVisualizerProps> = ({ currentEvent }) => {
  if (!currentEvent) return null;

  const topFrame = currentEvent.stack_frames[currentEvent.stack_frames.length - 1];
  const locals = topFrame?.locals || {};

  // Extract pointers low, high, mid, target
  const lowVal = locals["low"]?.kind === "primitive" ? Number(locals["low"].value) : null;
  const highVal = locals["high"]?.kind === "primitive" ? Number(locals["high"].value) : null;
  const midVal = locals["mid"]?.kind === "primitive" ? Number(locals["mid"].value) : null;
  const targetVal = locals["target"]?.kind === "primitive" ? Number(locals["target"].value) : null;

  // Extract array sequence
  let arrayItems: IVariableValue[] = [];
  Object.values(currentEvent.heap_objects).forEach((obj) => {
    if (obj.kind === "sequence" && Array.isArray(obj.value)) {
      arrayItems = obj.value;
    }
  });

  const midElement = midVal !== null && arrayItems[midVal]?.kind === "primitive" ? Number(arrayItems[midVal].value) : null;
  const comparisonText = midElement !== null && targetVal !== null
    ? midElement === targetVal
      ? `${midElement} == ${targetVal} (Target Found! 🎉)`
      : midElement < targetVal
      ? `${midElement} < ${targetVal} (Search Right Half →)`
      : `${midElement} > ${targetVal} (← Search Left Half)`
    : "Searching...";

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-[#0b0e14]">
      {/* Header Badge */}
      <div className="mb-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/40">
        <Search className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
          Binary Search Visualizer Mode
        </span>
      </div>

      {/* Operation Status Card */}
      <div className="mb-6 bg-[#161b22]/90 border-2 border-cyan-500/60 rounded-xl p-3.5 shadow-2xl flex items-center gap-6 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-semibold uppercase">Target:</span>
          <span className="font-extrabold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 text-sm">
            {targetVal !== null ? targetVal : "?"}
          </span>
        </div>

        <div className="h-4 w-px bg-[#30363d]" />

        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-gray-200 font-bold">{comparisonText}</span>
        </div>
      </div>

      {/* Binary Search Hero Array Blocks */}
      {arrayItems.length === 0 ? (
        <div className="text-gray-500 italic text-sm">Initializing search array...</div>
      ) : (
        <div className="flex items-end justify-center gap-4 py-8 px-6 bg-[#161b22]/80 border-2 border-[#30363d] rounded-2xl shadow-2xl">
          <AnimatePresence mode="popLayout">
            {arrayItems.map((item, idx) => {
              const valStr = item.kind === "primitive" ? String(item.value) : "ref";

              const isLow = lowVal === idx;
              const isMid = midVal === idx;
              const isHigh = highVal === idx;
              const isOut = (lowVal !== null && idx < lowVal) || (highVal !== null && idx > highVal);

              return (
                <motion.div
                  key={`bs_cell_${idx}_${valStr}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: isOut ? 0.35 : 1, y: isMid ? -16 : 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={springPhysics}
                  className="flex flex-col items-center relative"
                >
                  {/* Array Value Block */}
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center font-mono font-extrabold text-2xl shadow-2xl transition-all ${
                      isMid
                        ? "bg-cyan-600 text-white border-2 border-white ring-4 ring-cyan-500/50 shadow-cyan-500/60 scale-110"
                        : isOut
                        ? "bg-[#0d1117]/60 text-gray-500 border border-[#21262d]"
                        : "bg-[#0d1117] text-white border-2 border-[#30363d]"
                    }`}
                  >
                    {valStr}
                  </div>

                  {/* Index Header */}
                  <span className="text-xs font-mono font-bold text-gray-400 mt-2">
                    [{idx}]
                  </span>

                  {/* Pointer Pins (Low, Mid, High) */}
                  <div className="flex items-center gap-1 mt-2 h-6">
                    {isLow && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-500/50 font-mono">
                        <ArrowUp className="w-2.5 h-2.5" /> L
                      </span>
                    )}
                    {isMid && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/50 font-mono animate-bounce">
                        <ArrowUp className="w-2.5 h-2.5" /> M
                      </span>
                    )}
                    {isHigh && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/50 font-mono">
                        <ArrowUp className="w-2.5 h-2.5" /> H
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export const BinarySearchHeroVisualizer = memo(BinarySearchHeroVisualizerComponent);
