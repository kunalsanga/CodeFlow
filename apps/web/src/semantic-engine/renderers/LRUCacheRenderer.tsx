'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface LRUCacheProps {
  semanticIR: ISemanticIR;
}

export const LRUCacheRenderer: React.FC<LRUCacheProps> = ({ semanticIR }) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-orange-600/30 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full border border-orange-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">LRU Cache (HashMap + Doubly Linked List)</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Get & Put: <span className="text-orange-400 font-mono font-bold">O(1)</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hash Map Index */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Hash Map Key Index
          </h3>
          <div className="flex flex-col gap-2 font-mono text-sm">
            <div className="flex justify-between items-center bg-slate-800 p-2 rounded border border-orange-500/40">
              <span className="text-orange-300 font-bold">Key "A"</span>
              <span className="text-slate-400 text-xs">➔ Pointer to Node A</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800 p-2 rounded border border-slate-700">
              <span className="text-slate-200 font-bold">Key "B"</span>
              <span className="text-slate-400 text-xs">➔ Pointer to Node B</span>
            </div>
          </div>
        </div>

        {/* Doubly Linked List Order */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Doubly Linked List (MRU ➔ LRU)
          </h3>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-lg text-center font-mono">
              <div className="text-xs text-emerald-400 font-bold">HEAD (MRU)</div>
              <div className="text-lg font-bold text-white">"A": 100</div>
            </div>
            <span className="text-slate-500 text-xl font-bold">⇄</span>
            <div className="p-3 bg-amber-950 border border-amber-500 rounded-lg text-center font-mono">
              <div className="text-xs text-amber-400 font-bold">TAIL (LRU)</div>
              <div className="text-lg font-bold text-white">"B": 200</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LRUCacheRenderer;
