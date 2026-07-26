'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface SegmentTreeProps {
  semanticIR: ISemanticIR;
}

export const SegmentTreeRenderer: React.FC<SegmentTreeProps> = ({ semanticIR }) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-rose-600/30 text-rose-400 text-xs font-semibold px-3 py-1 rounded-full border border-rose-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Segment Tree (Range Queries)</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Query Time: <span className="text-rose-400 font-mono font-bold">O(log N)</span></div>
        </div>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">
          Array Synchronized with Binary Range Tree (Range Sum Query [1, 3])
        </h3>

        {/* Tree Top */}
        <div className="flex flex-col items-center gap-4">
          <div className="px-4 py-2 bg-rose-600 rounded-lg border border-rose-300 font-mono font-bold text-center">
            <div>Sum: 36</div>
            <div className="text-[10px] text-rose-200">[0, 3]</div>
          </div>

          <div className="flex gap-12">
            <div className="px-3 py-1.5 bg-slate-800 rounded border border-rose-500 font-mono text-xs text-center">
              <div>Sum: 9</div>
              <div className="text-[10px] text-slate-400">[0, 1]</div>
            </div>
            <div className="px-3 py-1.5 bg-rose-600/80 rounded border border-rose-300 font-mono text-xs text-center">
              <div>Sum: 27</div>
              <div className="text-[10px] text-rose-200">[2, 3]</div>
            </div>
          </div>
        </div>

        {/* Base Array */}
        <div className="flex gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
          {[2, 7, 11, 16].map((val, idx) => (
            <div key={idx} className={`w-12 h-12 flex flex-col items-center justify-center font-mono font-bold rounded-lg border ${
              idx >= 1 && idx <= 3 ? 'bg-rose-950/80 border-rose-500 text-rose-200' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <span>{val}</span>
              <span className="text-[9px] text-slate-500">idx {idx}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SegmentTreeRenderer;
