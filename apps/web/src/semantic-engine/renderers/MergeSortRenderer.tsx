'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface MergeSortProps {
  semanticIR: ISemanticIR;
}

export const MergeSortRenderer: React.FC<MergeSortProps> = ({ semanticIR }) => {
  const sampleArray = [38, 27, 43, 3, 9, 82, 10];

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-purple-600/30 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Merge Sort (Divide & Conquer)</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Time Complexity: <span className="text-purple-400 font-mono font-bold">O(N log N)</span></div>
          <div className="text-sm text-slate-400">Space Complexity: <span className="text-cyan-400 font-mono font-bold">O(N)</span></div>
        </div>
      </div>

      {/* Recursive Split Tree View */}
      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">
          Recursive Divide & Merge Animation Tree
        </h3>

        {/* Level 0 - Original Array */}
        <div className="flex gap-2">
          {sampleArray.map((val, idx) => (
            <div key={idx} className="w-12 h-12 flex items-center justify-center bg-slate-800 border border-slate-700 font-mono font-bold text-lg rounded-lg shadow">
              {val}
            </div>
          ))}
        </div>

        {/* Split Connector */}
        <div className="w-px h-6 bg-slate-700"></div>

        {/* Level 1 - Halves */}
        <div className="flex gap-12">
          <div className="flex gap-1.5 p-2 bg-slate-900 rounded-lg border border-purple-500/40">
            {[38, 27, 43, 3].map((val, idx) => (
              <div key={idx} className="w-10 h-10 flex items-center justify-center bg-purple-950/60 border border-purple-500/60 font-mono font-bold text-purple-200 rounded">
                {val}
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 p-2 bg-slate-900 rounded-lg border border-cyan-500/40">
            {[9, 82, 10].map((val, idx) => (
              <div key={idx} className="w-10 h-10 flex items-center justify-center bg-cyan-950/60 border border-cyan-500/60 font-mono font-bold text-cyan-200 rounded">
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* Merge Phase Highlight */}
        <div className="w-full bg-slate-900 p-4 rounded-lg border border-emerald-500/40 mt-2 flex flex-col items-center">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Active Sub-Array Merging Step
          </span>
          <div className="flex gap-2 items-center">
            <span className="text-slate-400 font-mono text-sm">[27, 38, 43]</span>
            <span className="text-emerald-400 font-bold">+</span>
            <span className="text-slate-400 font-mono text-sm">[3, 9]</span>
            <span className="text-emerald-400 font-bold">➔</span>
            <span className="text-emerald-300 font-mono font-bold text-base bg-emerald-950 px-3 py-1 rounded border border-emerald-500/40">
              [3, 9, 27, 38, 43]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeSortRenderer;
