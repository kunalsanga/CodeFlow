'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface BSTProps {
  semanticIR: ISemanticIR;
}

export const BSTRenderer: React.FC<BSTProps> = ({ semanticIR }) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-blue-600/30 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Binary Search Tree</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Search Time: <span className="text-blue-400 font-mono font-bold">O(log N)</span></div>
        </div>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">
          Tree Topology & Traversal Path
        </h3>

        <svg className="w-full h-64 overflow-visible" viewBox="0 0 500 240">
          {/* Root 50 */}
          <circle cx="250" cy="40" r="20" fill="#3b82f6" stroke="#60a5fa" strokeWidth="3" />
          <text x="250" y="45" fill="#ffffff" textAnchor="middle" fontWeight="bold">50</text>

          {/* Left Branch 30 */}
          <line x1="250" y1="40" x2="160" y2="120" stroke="#34d399" strokeWidth="3" />
          <circle cx="160" cy="120" r="20" fill="#10b981" stroke="#34d399" strokeWidth="3" />
          <text x="160" y="125" fill="#ffffff" textAnchor="middle" fontWeight="bold">30</text>

          {/* Right Branch 70 */}
          <line x1="250" y1="40" x2="340" y2="120" stroke="#475569" strokeWidth="2" />
          <circle cx="340" cy="120" r="20" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <text x="340" y="125" fill="#ffffff" textAnchor="middle" fontWeight="bold">70</text>

          {/* 30 -> 20, 40 */}
          <line x1="160" y1="120" x2="100" y2="200" stroke="#34d399" strokeWidth="3" />
          <circle cx="100" cy="200" r="20" fill="#10b981" stroke="#34d399" strokeWidth="3" />
          <text x="100" y="205" fill="#ffffff" textAnchor="middle" fontWeight="bold">20</text>

          <line x1="160" y1="120" x2="220" y2="200" stroke="#475569" strokeWidth="2" />
          <circle cx="220" cy="200" r="20" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <text x="220" y="205" fill="#ffffff" textAnchor="middle" fontWeight="bold">40</text>
        </svg>

        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Active Target</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Traversed Left Edge</span>
        </div>
      </div>
    </div>
  );
};

export default BSTRenderer;
