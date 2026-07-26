'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';
import { motion } from 'framer-motion';

interface DPRendererProps {
  semanticIR: ISemanticIR;
}

export const DPRenderer: React.FC<DPRendererProps> = ({ semanticIR }) => {
  const currentStep = semanticIR.metadata.currentStep || 0;

  // 2D DP Tabulation Matrix simulation (e.g. 0/1 Knapsack / LCS / Grid DP)
  const rows = 5;
  const cols = 5;

  const dpMatrix = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const cellStep = r * cols + c;
      if (cellStep <= currentStep) {
        return Math.floor(Math.sin(r + c) * 10) + r * c + 1;
      }
      return 0;
    })
  );

  const activeRow = Math.min(Math.floor(currentStep / cols), rows - 1);
  const activeCol = Math.min(currentStep % cols, cols - 1);

  return (
    <div key={`dp-step-${currentStep}`} className="h-full w-full flex flex-col justify-between p-8 bg-[#5c6bc0] text-white font-sans overflow-y-auto">
      {/* Flat Vector Header */}
      <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
        <div>
          <span className="bg-white text-[#5c6bc0] text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
            Dynamic Programming Matrix
          </span>
          <h2 className="text-2xl font-black mt-2 text-white">2D Tabulation State Grid</h2>
        </div>
        <div className="text-right font-mono text-xs text-white/90">
          <div>Recurrence: <span className="text-yellow-300 font-bold">dp[i][j] = dp[i-1][j] + dp[i][j-1]</span></div>
          <div>Complexity: <span className="text-emerald-300 font-bold">O(N × M) Time & Space</span></div>
        </div>
      </div>

      {/* Flat Vector Grid Area */}
      <div className="my-auto py-8 flex flex-col items-center gap-6 min-h-[300px] justify-center overflow-x-auto">
        <div className="grid grid-cols-5 gap-4 my-2">
          {dpMatrix.map((row, r) =>
            row.map((val, c) => {
              const isActive = r === activeRow && c === activeCol;
              const isComputed = r * cols + c <= currentStep;

              return (
                <motion.div
                  key={`dp-cell-${r}-${c}`}
                  layout
                  initial={{ scale: 0.9 }}
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ duration: 0.2 }}
                  className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center font-mono border-4 relative transition-all shadow-xl ${
                    isActive
                      ? 'bg-yellow-400 text-black border-white ring-4 ring-yellow-300 z-10'
                      : isComputed
                      ? 'bg-white text-[#0d1117] border-white'
                      : 'bg-white/20 text-white border-white/30 opacity-60'
                  }`}
                >
                  <span className="text-[9px] font-black absolute top-1 left-1.5 opacity-60">
                    [{r},{c}]
                  </span>
                  <span className="text-2xl font-black mt-2">{val}</span>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-black/20 p-4 rounded-xl font-mono text-xs text-white/90 border border-white/20">
        <span className="font-bold text-yellow-300">Active Subproblem:</span> Evaluating dp[{activeRow}][{activeCol}] state transition.
      </div>
    </div>
  );
};

export default DPRenderer;
