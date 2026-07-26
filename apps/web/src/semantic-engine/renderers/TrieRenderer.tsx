'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface TrieProps {
  semanticIR: ISemanticIR;
}

export const TrieRenderer: React.FC<TrieProps> = ({ semanticIR }) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-emerald-600/30 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Trie (Prefix Tree)</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Search Time: <span className="text-emerald-400 font-mono font-bold">O(L)</span></div>
          <div className="text-sm text-slate-400">Space Complexity: <span className="text-cyan-400 font-mono font-bold">O(N × L)</span></div>
        </div>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">
          Inserted Words: ["cat", "car", "card", "dog"]
        </h3>

        <svg className="w-full h-64 overflow-visible" viewBox="0 0 500 240">
          {/* Root */}
          <circle cx="250" cy="30" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="250" y="34" fill="#94a3b8" textAnchor="middle" fontSize="12" fontWeight="bold">root</text>

          {/* Root -> c, d */}
          <line x1="250" y1="30" x2="160" y2="90" stroke="#10b981" strokeWidth="3" />
          <line x1="250" y1="30" x2="340" y2="90" stroke="#475569" strokeWidth="2" />

          {/* Node c */}
          <circle cx="160" cy="90" r="18" fill="#10b981" stroke="#34d399" strokeWidth="3" />
          <text x="160" y="94" fill="#ffffff" textAnchor="middle" fontWeight="bold">c</text>

          {/* c -> a */}
          <line x1="160" y1="90" x2="160" y2="150" stroke="#10b981" strokeWidth="3" />
          <circle cx="160" cy="150" r="18" fill="#10b981" stroke="#34d399" strokeWidth="3" />
          <text x="160" y="154" fill="#ffffff" textAnchor="middle" fontWeight="bold">a</text>

          {/* a -> t, r */}
          <line x1="160" y1="150" x2="110" y2="210" stroke="#10b981" strokeWidth="3" />
          <line x1="160" y1="150" x2="210" y2="210" stroke="#10b981" strokeWidth="3" />

          {/* Node t (end of word "cat") */}
          <circle cx="110" cy="210" r="18" fill="#059669" stroke="#f59e0b" strokeWidth="4" />
          <text x="110" y="214" fill="#ffffff" textAnchor="middle" fontWeight="bold">t*</text>

          {/* Node r (end of word "car") */}
          <circle cx="210" cy="210" r="18" fill="#059669" stroke="#f59e0b" strokeWidth="4" />
          <text x="210" y="214" fill="#ffffff" textAnchor="middle" fontWeight="bold">r*</text>

          {/* Node d */}
          <circle cx="340" cy="90" r="18" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <text x="340" y="94" fill="#ffffff" textAnchor="middle" fontWeight="bold">d</text>
        </svg>

        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Active Path</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> End of Word Node (*)</span>
        </div>
      </div>
    </div>
  );
};

export default TrieRenderer;
