'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface DPProps {
  semanticIR: ISemanticIR;
}

export const DPRenderer: React.FC<DPProps> = ({ semanticIR }) => {
  const dpMatrix = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 1, 2, 3, 3],
    [0, 1, 2, 3, 5],
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-blue-600/30 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Dynamic Programming (DP Matrix)</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Recurrence: <span className="text-blue-400 font-mono font-bold">dp[i][j] = dp[i-1][j] + dp[i][j-1]</span></div>
        </div>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">
          Tabulation Table & Subproblem Transition Arrows
        </h3>

        <div className="grid grid-cols-5 gap-2 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono">
          {dpMatrix.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isCurrent = rIdx === 3 && cIdx === 4;
              const isDep1 = rIdx === 2 && cIdx === 4;
              const isDep2 = rIdx === 3 && cIdx === 3;

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-14 h-14 flex flex-col items-center justify-center rounded-lg border font-bold text-lg transition-all ${
                    isCurrent
                      ? 'bg-blue-600 border-2 border-blue-400 text-white shadow-lg scale-105'
                      : isDep1 || isDep2
                      ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[10px] text-slate-500 font-normal">[{rIdx},{cIdx}]</span>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-600"></span> Active Target Cell</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-400"></span> Subproblem Dependencies</span>
        </div>
      </div>
    </div>
  );
};

export default DPRenderer;
