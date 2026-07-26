'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface QuickSortProps {
  semanticIR: ISemanticIR;
}

export const QuickSortRenderer: React.FC<QuickSortProps> = ({ semanticIR }) => {
  const array = [10, 80, 30, 90, 40, 50, 70];
  const pivotIdx = 6;
  const iIdx = 3;
  const jIdx = 4;

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-amber-600/30 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Quick Sort (Lomuto Partition)</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Average Time: <span className="text-amber-400 font-mono font-bold">O(N log N)</span></div>
          <div className="text-sm text-slate-400">Worst Space: <span className="text-cyan-400 font-mono font-bold">O(log N)</span></div>
        </div>
      </div>

      {/* Partition Visualizer */}
      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">
          Partitioning Around Active Pivot (pivot = 70)
        </h3>

        <div className="flex gap-3 items-end h-40">
          {array.map((val, idx) => {
            const isPivot = idx === pivotIdx;
            const isI = idx === iIdx;
            const isJ = idx === jIdx;

            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  {isPivot ? 'PIVOT' : isI ? 'i' : isJ ? 'j' : ''}
                </span>

                <div
                  style={{ height: `${val * 1.5}px` }}
                  className={`w-12 flex items-center justify-center font-mono font-bold text-white rounded-t-lg transition-all ${
                    isPivot
                      ? 'bg-amber-500 border-2 border-amber-300'
                      : isJ
                      ? 'bg-blue-600 border-2 border-blue-400'
                      : isI
                      ? 'bg-emerald-600 border-2 border-emerald-400'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  {val}
                </div>
                <span className="text-xs font-mono text-slate-500">[{idx}]</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-6 text-xs mt-2">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500"></span> Pivot Element</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-600"></span> Pointer i (Smaller Boundary)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-600"></span> Pointer j (Current Scanner)</span>
        </div>
      </div>
    </div>
  );
};

export default QuickSortRenderer;
