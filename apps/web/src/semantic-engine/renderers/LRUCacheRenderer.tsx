'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';
import { motion } from 'framer-motion';

interface LRUCacheProps {
  semanticIR: ISemanticIR;
}

export const LRUCacheRenderer: React.FC<LRUCacheProps> = ({ semanticIR }) => {
  const currentStep = semanticIR.metadata.currentStep || 0;

  // LRU Cache dual data structure state sequence
  const lruStates = [
    { op: 'put(1, 10)', cache: { 1: 'Node(1, 10)' }, dll: [{ k: 1, v: 10 }] },
    { op: 'put(2, 20)', cache: { 1: 'Node(1, 10)', 2: 'Node(2, 20)' }, dll: [{ k: 2, v: 20 }, { k: 1, v: 10 }] },
    { op: 'get(1) -> 10', cache: { 1: 'Node(1, 10)', 2: 'Node(2, 20)' }, dll: [{ k: 1, v: 10 }, { k: 2, v: 20 }] },
    { op: 'put(3, 30) (Evict 2)', cache: { 1: 'Node(1, 10)', 3: 'Node(3, 30)' }, dll: [{ k: 3, v: 30 }, { k: 1, v: 10 }] },
  ];

  const stateIndex = Math.min(currentStep, lruStates.length - 1);
  const currentState = lruStates[stateIndex] || lruStates[0];

  return (
    <div key={`lru-step-${currentStep}`} className="flex flex-col gap-6 p-6 bg-[#161b22] text-[#e6edf3] rounded-xl border border-[#30363d] shadow-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
        <div>
          <span className="bg-[#58a6ff]/20 text-[#58a6ff] text-xs font-semibold px-3 py-1 rounded-full border border-[#58a6ff]/30 uppercase tracking-wider">
            Semantic Visualizer (98% Confidence)
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">LRU Cache (HashMap + Doubly Linked List)</h2>
        </div>
        <div className="text-right font-mono text-xs text-[#8b949e]">
          <div>Operation: <span className="text-[#3fb950] font-bold">{currentState.op}</span></div>
          <div>Lookup / Eviction: <span className="text-[#d29922] font-bold">O(1) Time</span></div>
        </div>
      </div>

      {/* Dual Data Structure Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HashMap Key-Node Lookup Table */}
        <div className="bg-[#0d1117] p-6 rounded-xl border border-[#30363d] flex flex-col gap-4 shadow-inner">
          <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            HashMap (O(1) Key ➔ Node Pointer Lookup)
          </h3>
          <div className="flex flex-col gap-2 font-mono text-xs">
            {Object.entries(currentState.cache).map(([key, val]) => (
              <div key={key} className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center justify-between">
                <span className="text-[#58a6ff] font-bold">Key {key}</span>
                <span className="text-[#8b949e]">➔</span>
                <span className="text-[#3fb950] font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doubly Linked List Order Chain */}
        <div className="bg-[#0d1117] p-6 rounded-xl border border-[#30363d] flex flex-col gap-4 shadow-inner">
          <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Doubly Linked List (MRU ➔ LRU Order Chain)
          </h3>
          <div className="flex items-center gap-3 overflow-x-auto py-2">
            <span className="text-[10px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-1 rounded border border-[#3fb950]/30 font-mono font-bold">MRU</span>
            {currentState.dll.map((node, idx) => (
              <React.Fragment key={idx}>
                <motion.div
                  layout
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="p-3 bg-[#161b22] border border-[#58a6ff] rounded-xl font-mono text-xs flex flex-col items-center min-w-[70px]"
                >
                  <span className="text-[#8b949e] text-[9px]">K:{node.k}</span>
                  <span className="text-white font-bold text-base">V:{node.v}</span>
                </motion.div>
                {idx < currentState.dll.length - 1 && <span className="text-[#58a6ff] font-bold">⇄</span>}
              </React.Fragment>
            ))}
            <span className="text-[10px] bg-[#f85149]/20 text-[#f85149] px-2 py-1 rounded border border-[#f85149]/30 font-mono font-bold">LRU</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LRUCacheRenderer;
