"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ITraceEvent, IVariableValue } from "@/types/trace";
import { Sparkles, ArrowUp } from "lucide-react";
import { springPhysics } from "@/lib/animation/motionPresets";

interface SortingHeroVisualizerProps {
  currentEvent: ITraceEvent | null;
}

export const SortingHeroVisualizerComponent: React.FC<SortingHeroVisualizerProps> = ({ currentEvent }) => {
  if (!currentEvent) return null;

  const topFrame = currentEvent.stack_frames[currentEvent.stack_frames.length - 1];
  const locals = topFrame?.locals || {};

  // Extract loop pointers i and j
  const iVal = locals["i"]?.kind === "primitive" ? Number(locals["i"].value) : null;
  const jVal = locals["j"]?.kind === "primitive" ? Number(locals["j"].value) : null;

  // Extract primary array sequence from heap
  let arrayItems: IVariableValue[] = [];
  Object.values(currentEvent.heap_objects).forEach((obj) => {
    if (obj.kind === "sequence" && Array.isArray(obj.value)) {
      arrayItems = obj.value;
    }
  });

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-[#0b0e14]">
      {/* Header Badge */}
      <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1f6feb]/20 border border-[#58a6ff]/40">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold font-mono text-[#79c0ff] uppercase tracking-wider">
          Bubble Sort Visualizer Mode
        </span>
      </div>

      {/* Hero Array Blocks */}
      {arrayItems.length === 0 ? (
        <div className="text-gray-500 italic text-sm">Executing array initialization...</div>
      ) : (
        <div className="flex items-end justify-center gap-4 py-8 px-6 bg-[#161b22]/80 border-2 border-[#30363d] rounded-2xl shadow-2xl">
          <AnimatePresence mode="popLayout">
            {arrayItems.map((item, idx) => {
              const valNum = item.kind === "primitive" ? Number(item.value) : 0;
              const valStr = item.kind === "primitive" ? String(item.value) : "ref";

              const isPointerI = iVal === idx;
              const isPointerJ = jVal === idx;
              const isCompared = isPointerJ || (jVal !== null && jVal + 1 === idx);

              return (
                <motion.div
                  key={`sorting_cell_${idx}_${valStr}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, y: isCompared ? -16 : 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={springPhysics}
                  className="flex flex-col items-center relative"
                >
                  {/* Array Value Block */}
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center font-mono font-extrabold text-2xl shadow-2xl transition-all ${
                      isCompared
                        ? "bg-[#388bfd] text-white border-2 border-white ring-4 ring-blue-500/50 shadow-blue-500/60 scale-110"
                        : "bg-[#0d1117] text-white border-2 border-[#30363d]"
                    }`}
                  >
                    {valStr}
                  </div>

                  {/* Index Header */}
                  <span className="text-xs font-mono font-bold text-gray-400 mt-2">
                    [{idx}]
                  </span>

                  {/* Pointer Pins (i & j) */}
                  <div className="flex items-center gap-1 mt-2 h-6">
                    {isPointerI && (
                      <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/50 animate-bounce">
                        <ArrowUp className="w-3 h-3" /> i
                      </span>
                    )}
                    {isPointerJ && (
                      <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50 animate-bounce">
                        <ArrowUp className="w-3 h-3" /> j
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

export const SortingHeroVisualizer = memo(SortingHeroVisualizerComponent);
