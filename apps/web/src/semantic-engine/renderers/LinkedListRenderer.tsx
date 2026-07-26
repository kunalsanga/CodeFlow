'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface LinkedListProps {
  semanticIR: ISemanticIR;
}

export const LinkedListRenderer: React.FC<LinkedListProps> = ({ semanticIR }) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-emerald-600/30 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Singly Linked List</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Access Time: <span className="text-emerald-400 font-mono font-bold">O(N)</span></div>
        </div>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">
          Node Sequence & Pointer Navigation
        </h3>

        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-950 border-2 border-emerald-500 rounded-xl flex flex-col items-center font-mono">
            <span className="text-xs text-emerald-400 font-bold mb-1">HEAD</span>
            <span className="text-xl font-bold text-white">10</span>
          </div>

          <span className="text-emerald-400 text-2xl font-bold">➔</span>

          <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center font-mono">
            <span className="text-xs text-slate-400 mb-1">Node</span>
            <span className="text-xl font-bold text-white">20</span>
          </div>

          <span className="text-slate-600 text-2xl font-bold">➔</span>

          <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center font-mono">
            <span className="text-xs text-slate-400 mb-1">TAIL</span>
            <span className="text-xl font-bold text-white">30</span>
          </div>

          <span className="text-slate-600 text-2xl font-bold">➔</span>

          <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-400 font-mono font-bold text-sm">
            NULL
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListRenderer;
