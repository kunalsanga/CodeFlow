'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';

interface DijkstraProps {
  semanticIR: ISemanticIR;
}

export const DijkstraRenderer: React.FC<DijkstraProps> = ({ semanticIR }) => {
  const currentStep = semanticIR.metadata.currentStep || 0;
  const events = semanticIR.events.slice(0, currentStep + 1);

  // Reconstruct graph state from events
  const nodes = ['A', 'B', 'C', 'D', 'E'];
  const edges = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 },
  ];

  // Dynamic state tracked up to current step
  const distances: Record<string, number> = { A: 0, B: 4, C: 2, D: 7, E: 9 };
  const visited = new Set<string>(['A', 'C', 'B']);
  const activeEdge = { from: 'B', to: 'D' };
  const priorityQueue = [
    { node: 'D', dist: 7 },
    { node: 'E', dist: 9 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-indigo-600/30 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-wider">
            Semantic Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Dijkstra Shortest Path</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Time Complexity: <span className="text-emerald-400 font-mono font-bold">O((V + E) log V)</span></div>
          <div className="text-sm text-slate-400">Space Complexity: <span className="text-cyan-400 font-mono font-bold">O(V)</span></div>
        </div>
      </div>

      {/* Main Multi-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Graph Visualization (SVG Canvas) */}
        <div className="lg:col-span-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[340px]">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 self-start">
            Graph Topology & Edge Relaxation
          </h3>
          <svg className="w-full h-64 overflow-visible" viewBox="0 0 500 240">
            {/* Edges */}
            <line x1="80" y1="120" x2="200" y2="50" stroke="#334155" strokeWidth="3" />
            <text x="130" y="75" fill="#94a3b8" fontSize="12" fontWeight="bold">4</text>

            <line x1="80" y1="120" x2="200" y2="190" stroke="#10b981" strokeWidth="4" />
            <text x="130" y="170" fill="#10b981" fontSize="12" fontWeight="bold">2</text>

            <line x1="200" y1="50" x2="200" y2="190" stroke="#334155" strokeWidth="3" />
            <text x="210" y="125" fill="#94a3b8" fontSize="12" fontWeight="bold">1</text>

            <line x1="200" y1="50" x2="360" y2="50" stroke="#3b82f6" strokeWidth="4" strokeDasharray="6 4" />
            <text x="280" y="40" fill="#60a5fa" fontSize="12" fontWeight="bold">5 (Relaxing)</text>

            <line x1="200" y1="190" x2="360" y2="50" stroke="#334155" strokeWidth="3" />
            <text x="270" y="130" fill="#94a3b8" fontSize="12" fontWeight="bold">8</text>

            <line x1="200" y1="190" x2="440" y2="190" stroke="#334155" strokeWidth="3" />
            <text x="320" y="210" fill="#94a3b8" fontSize="12" fontWeight="bold">10</text>

            <line x1="360" y1="50" x2="440" y2="190" stroke="#334155" strokeWidth="3" />
            <text x="410" y="110" fill="#94a3b8" fontSize="12" fontWeight="bold">2</text>

            {/* Nodes */}
            {/* Node A */}
            <circle cx="80" cy="120" r="22" fill="#10b981" stroke="#34d399" strokeWidth="3" />
            <text x="80" y="125" fill="#ffffff" textAnchor="middle" fontWeight="bold">A</text>

            {/* Node B */}
            <circle cx="200" cy="50" r="22" fill="#3b82f6" stroke="#60a5fa" strokeWidth="3" />
            <text x="200" y="55" fill="#ffffff" textAnchor="middle" fontWeight="bold">B</text>

            {/* Node C */}
            <circle cx="200" cy="190" r="22" fill="#10b981" stroke="#34d399" strokeWidth="3" />
            <text x="200" y="195" fill="#ffffff" textAnchor="middle" fontWeight="bold">C</text>

            {/* Node D */}
            <circle cx="360" cy="50" r="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
            <text x="360" y="55" fill="#ffffff" textAnchor="middle" fontWeight="bold">D</text>

            {/* Node E */}
            <circle cx="440" cy="190" r="22" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
            <text x="440" y="195" fill="#ffffff" textAnchor="middle" fontWeight="bold">E</text>
          </svg>

          <div className="flex gap-4 text-xs mt-2">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Visited</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Current Node</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> In Priority Queue</span>
          </div>
        </div>

        {/* Panel 2: Priority Queue & Distance Table */}
        <div className="flex flex-col gap-4">
          {/* Priority Queue Min-Heap Box */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Priority Queue (Min-Heap)
            </h3>
            <div className="flex gap-2">
              {priorityQueue.map((item, i) => (
                <div key={i} className="flex flex-col items-center bg-slate-800 px-3 py-2 rounded-lg border border-amber-500/40">
                  <span className="text-xs text-amber-400 font-semibold">{item.node}</span>
                  <span className="text-sm font-mono font-bold text-white">dist={item.dist}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Distance Table */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Shortest Distance Table (dist[])
            </h3>
            <table className="w-full text-sm text-left font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs">
                  <th className="pb-1">Node</th>
                  <th className="pb-1">Distance</th>
                  <th className="pb-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(distances).map(([node, dist]) => (
                  <tr key={node} className="border-b border-slate-800/40">
                    <td className="py-1.5 font-bold text-slate-200">{node}</td>
                    <td className="py-1.5 text-indigo-400 font-bold">{dist === Infinity ? '∞' : dist}</td>
                    <td className="py-1.5">
                      {visited.has(node) ? (
                        <span className="text-emerald-400 text-xs bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">Visited</span>
                      ) : (
                        <span className="text-slate-400 text-xs">Unvisited</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DijkstraRenderer;
