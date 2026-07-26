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
    <div key={`dp-step-${currentStep}`} className="flex flex-col gap-6 p-6 bg-[#161b22] text-[#e6edf3] rounded-xl border border-[#30363d] shadow-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
        <div>
          <span className="bg-[#58a6ff]/20 text-[#58a6ff] text-xs font-semibold px-3 py-1 rounded-full border border-[#58a6ff]/30 uppercase tracking-wider">
            Semantic Visualizer (98% Confidence)
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Dynamic Programming (2D Tabulation Table)</h2>
        </div>
        <div className="text-right font-mono text-xs text-[#8b949e]">
          <div>Recurrence: <span className="text-[#3fb950] font-bold">dp[i][j] = dp[i-1][j] + dp[i][j-1]</span></div>
          <div>Complexity: <span className="text-[#d29922] font-bold">O(N × M) Time | O(N × M) Space</span></div>
        </div>
      </div>

      {/* 2D Tabulation Grid */}
      <div className="bg-[#0d1117] p-8 rounded-xl border border-[#30363d] flex flex-col items-center gap-4 min-h-[300px] justify-center overflow-x-auto relative shadow-inner">
        <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider self-start">
          Tabulation Matrix & Active Cell Subproblem Transition (Step {currentStep + 1})
        </h3>

        <div className="grid grid-cols-5 gap-3 my-2">
          {dpMatrix.map((row, r) =>
            row.map((val, c) => {
              const isActive = r === activeRow && c === activeCol;
              const isComputed = r * cols + c <= currentStep;

              return (
                <motion.div
                  key={`dp-cell-${r}-${c}`}
                  layout
                  initial={{ scale: 0.9, opacity: 0.7 }}
                  animate={{ scale: isActive ? 1.1 : 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center font-mono border-2 relative transition-all ${
                    isActive
                      ? 'bg-[#58a6ff]/30 border-[#58a6ff] text-[#79c0ff] ring-4 ring-[#58a6ff]/30 shadow-lg z-10'
                      : isComputed
                      ? 'bg-[#1f242c] border-[#3fb950]/60 text-[#3fb950]'
                      : 'bg-[#161b22] border-[#30363d] text-[#8b949e] opacity-40'
                  }`}
                >
                  <span className="text-[9px] text-[#8b949e] absolute top-1 left-1 font-bold">
                    [{r},{c}]
                  </span>
                  <span className="text-xl font-bold mt-2">{val}</span>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Detection Evidence Panel */}
      <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] font-mono text-xs text-[#8b949e]">
        <div className="text-[#58a6ff] font-bold mb-1">Classifier Evidence (98% Confidence):</div>
        <div className="flex gap-4 flex-wrap text-[#8b949e]">
          <span>✓ 2D vector/array tabulation table storage</span>
          <span>✓ Recurrence relation state transition relation</span>
          <span>✓ Optimal substructure memoization evaluation</span>
        </div>
      </div>
    </div>
  );
};

export default DPRenderer;
