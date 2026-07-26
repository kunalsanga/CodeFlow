'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';
import { motion } from 'framer-motion';

interface DFSProps {
  semanticIR: ISemanticIR;
}

export const DFSRenderer: React.FC<DFSProps> = ({ semanticIR }) => {
  const currentStep = semanticIR.metadata.currentStep || 0;

  // Graph topology
  const nodes = [
    { id: '0', label: '0', x: 80, y: 120 },
    { id: '1', label: '1', x: 200, y: 50 },
    { id: '2', label: '2', x: 200, y: 190 },
    { id: '3', label: '3', x: 340, y: 50 },
    { id: '4', label: '4', x: 340, y: 190 },
  ];

  const edges = [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
  ];

  const visited = new Set<string>(['0', '1', '3']);
  const activeCallStack = ['dfs(0)', 'dfs(1)', 'dfs(3)'];
  const activeNode = '3';

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-purple-600/30 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30 uppercase tracking-wider">
            Semantic Engine Visualizer
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Depth-First Search (DFS & Backtracking)</h2>
        </div>
        <div className="text-right font-mono text-sm text-slate-400">
          <div>Time Complexity: <span className="text-purple-400 font-bold">O(V + E)</span></div>
          <div>Space Complexity (Call Stack): <span className="text-cyan-400 font-bold">O(V)</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph SVG Canvas */}
        <div className="lg:col-span-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 self-start">
            Graph Topology & Deep Traversal Path
          </h3>

          <svg className="w-full h-64 overflow-visible" viewBox="0 0 500 240">
            {/* Edges */}
            {edges.map((e, idx) => {
              const fromNode = nodes.find(n => n.id === e.from)!;
              const toNode = nodes.find(n => n.id === e.to)!;
              const isDFSPath = (e.from === '0' && e.to === '1') || (e.from === '1' && e.to === '3');

              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isDFSPath ? '#a855f7' : '#334155'}
                  strokeWidth={isDFSPath ? 4 : 2}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map(n => {
              const isVisited = visited.has(n.id);
              const isActive = n.id === activeNode;

              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="22"
                    fill={isActive ? '#a855f7' : isVisited ? '#7e22ce' : '#1e293b'}
                    stroke={isActive ? '#c084fc' : isVisited ? '#a855f7' : '#475569'}
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
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Active DFS Frame</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-900"></span> Visited Ancestors</span>
          </div>
        </div>

        {/* Panel 2: Call Stack & Visited Set */}
        <div className="flex flex-col gap-4">
          {/* Recursive Call Stack */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Recursive Call Stack Frame (LIFO)
            </h3>
            <div className="flex flex-col-reverse gap-1.5 font-mono">
              {activeCallStack.map((frame, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`p-2.5 rounded-lg border text-xs font-bold flex justify-between items-center ${
                    i === activeCallStack.length - 1
                      ? 'bg-purple-950/80 border-purple-400 text-purple-200 ring-2 ring-purple-500/30'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <span>{frame}</span>
                  {i === activeCallStack.length - 1 && <span className="text-[10px] bg-purple-900 text-purple-300 px-2 py-0.5 rounded uppercase">Active</span>}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visited Set */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Visited Vertices Set
            </h3>
            <div className="flex gap-1.5 flex-wrap font-mono">
              {Array.from(visited).map(id => (
                <span key={id} className="bg-purple-950 text-purple-300 px-2.5 py-1 rounded border border-purple-500/40 text-xs font-bold">
                  Node {id}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DFSRenderer;
