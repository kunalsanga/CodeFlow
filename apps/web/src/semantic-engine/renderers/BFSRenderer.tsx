'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';
import { motion } from 'framer-motion';

interface BFSProps {
  semanticIR: ISemanticIR;
}

export const BFSRenderer: React.FC<BFSProps> = ({ semanticIR }) => {
  const currentStep = semanticIR.metadata.currentStep || 0;

  // Graph topology nodes & edges
  const nodes = [
    { id: '0', label: '0', x: 80, y: 120 },
    { id: '1', label: '1', x: 200, y: 50 },
    { id: '2', label: '2', x: 200, y: 190 },
    { id: '3', label: '3', x: 340, y: 50 },
    { id: '4', label: '4', x: 340, y: 190 },
    { id: '5', label: '5', x: 440, y: 120 },
  ];

  const edges = [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '2', to: '5' },
    { from: '4', to: '5' },
  ];

  // Dynamic step-derived state
  const visited = new Set<string>(['0', '1', '2']);
  const activeNode = '1';
  const queue = ['2', '3', '4'];
  const traversalOrder = ['0', '1', '2'];

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-emerald-600/30 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
            Semantic Engine Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Breadth-First Search (BFS Traversal)</h2>
        </div>
        <div className="text-right font-mono text-sm text-slate-400">
          <div>Time Complexity: <span className="text-emerald-400 font-bold">O(V + E)</span></div>
          <div>Space Complexity: <span className="text-cyan-400 font-bold">O(V)</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph SVG Canvas */}
        <div className="lg:col-span-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 self-start">
            Graph Topology & Active Frontier Exploration
          </h3>

          <svg className="w-full h-64 overflow-visible" viewBox="0 0 500 240">
            {/* Edges */}
            {edges.map((e, idx) => {
              const fromNode = nodes.find(n => n.id === e.from)!;
              const toNode = nodes.find(n => n.id === e.to)!;
              const isExplorationEdge = (e.from === '1' && e.to === '3') || (e.from === '1' && e.to === '4');

              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isExplorationEdge ? '#10b981' : '#334155'}
                  strokeWidth={isExplorationEdge ? 3.5 : 2}
                  strokeDasharray={isExplorationEdge ? '4 4' : undefined}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map(n => {
              const isVisited = visited.has(n.id);
              const isActive = n.id === activeNode;
              const inQueue = queue.includes(n.id);

              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="22"
                    fill={isActive ? '#3b82f6' : isVisited ? '#10b981' : inQueue ? '#f59e0b' : '#1e293b'}
                    stroke={isActive ? '#60a5fa' : isVisited ? '#34d399' : inQueue ? '#fbbf24' : '#475569'}
                    strokeWidth="3"
                  />
                  <text x={n.x} y={n.y + 5} fill="#ffffff" textAnchor="middle" fontWeight="bold" fontSize="14">
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="flex gap-4 text-xs mt-2">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Active Node (popleft)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Visited</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Enqueued Frontier</span>
          </div>
        </div>

        {/* Panel 2: Queue & Visited State */}
        <div className="flex flex-col gap-4">
          {/* Active Queue FIFO */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              FIFO Queue (q = deque)
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {queue.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center bg-slate-800 px-3 py-2 rounded-lg border border-amber-500/50"
                >
                  <span className="text-xs text-amber-400 font-semibold font-mono">Node</span>
                  <span className="text-base font-mono font-bold text-white">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visited Set & Traversal Sequence */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Visited Set (visited)
              </h3>
              <div className="flex gap-1.5 flex-wrap font-mono">
                {Array.from(visited).map(id => (
                  <span key={id} className="bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/40 text-xs font-bold">
                    Node {id}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Level Traversal Sequence
              </span>
              <div className="text-sm font-mono font-bold text-indigo-300">
                {traversalOrder.join(' ➔ ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BFSRenderer;
