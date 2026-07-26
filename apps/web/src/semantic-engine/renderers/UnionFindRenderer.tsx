'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface UnionFindProps {
  semanticIR: ISemanticIR;
}

export const UnionFindRenderer: React.FC<UnionFindProps> = ({ semanticIR }) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-cyan-600/30 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full border border-cyan-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Disjoint Set (Union-Find)</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Amortized Time: <span className="text-cyan-400 font-mono font-bold">O(α(N))</span></div>
        </div>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">
          Component Tree Forests & Path Compression
        </h3>

        <div className="flex gap-16 items-center">
          {/* Component 1 Root 0 */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-600 border-2 border-cyan-300 flex items-center justify-center font-bold text-lg shadow-lg">
              0 (Root)
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500 flex items-center justify-center font-bold text-sm">
                2
              </div>
            </div>
          </div>

          {/* Component 2 Root 3 */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 border-2 border-indigo-300 flex items-center justify-center font-bold text-lg shadow-lg">
              3 (Root)
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-indigo-500 flex items-center justify-center font-bold text-sm">
              4
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-900 p-3 rounded-lg border border-slate-800 text-center font-mono text-sm">
          Active Action: <span className="text-cyan-400 font-bold">union(0, 3)</span> ➔ Re-parenting Root 3 to Root 0
        </div>
      </div>
    </div>
  );
};

export default UnionFindRenderer;
