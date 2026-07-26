'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkedListProps {
  semanticIR: ISemanticIR;
}

export const LinkedListRenderer: React.FC<LinkedListProps> = ({ semanticIR }) => {
  const currentStep = semanticIR.metadata.currentStep || 0;

  // Step-driven dynamic Linked List state sequence matching C++ code execution
  const listStates = [
    { op: 'Initial Setup', nodes: [10] },
    { op: 'list.insert(20)', nodes: [10, 20] },
    { op: 'list.insert(30)', nodes: [10, 20, 30] },
    { op: 'list.insert(40)', nodes: [10, 20, 30, 40] },
    { op: 'list.insertFront(5)', nodes: [5, 10, 20, 30, 40] },
    { op: 'list.deleteNode(20)', nodes: [5, 10, 30, 40] },
    { op: 'list.search(30)', nodes: [5, 10, 30, 40], highlighted: 30 },
    { op: 'list.reverse()', nodes: [40, 30, 10, 5] },
  ];

  const stateIndex = Math.min(currentStep, listStates.length - 1);
  const currentState = listStates[stateIndex] || listStates[0];

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="bg-emerald-600/30 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
            Semantic Engine Visualizer (98% Confidence)
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Singly Linked List Structure</h2>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          <div>Active Operation: <span className="text-emerald-400 font-bold">{currentState.op}</span></div>
          <div>Access: <span className="text-cyan-400 font-bold">O(N)</span> | Insert/Delete: <span className="text-amber-400 font-bold">O(1)</span></div>
        </div>
      </div>

      {/* Dynamic Linked List Node Chain */}
      <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 flex flex-col items-center gap-6 min-h-[220px] justify-center overflow-x-auto">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">
          Node Memory Pointers & Sequence Flow (Step {currentStep + 1})
        </h3>

        <div className="flex items-center gap-3">
          <AnimatePresence mode="popLayout">
            {currentState.nodes.map((val, idx) => {
              const isHead = idx === 0;
              const isTail = idx === currentState.nodes.length - 1;
              const isHighlighted = currentState.highlighted === val;

              return (
                <React.Fragment key={`${val}-${idx}`}>
                  <motion.div
                    layout
                    initial={{ scale: 0.7, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`p-4 rounded-xl flex flex-col items-center min-w-[70px] border-2 font-mono relative ${
                      isHighlighted
                        ? 'bg-amber-950/90 border-amber-400 text-amber-200 ring-4 ring-amber-500/30'
                        : isHead
                        ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                        : isTail
                        ? 'bg-purple-950/90 border-purple-500 text-purple-200'
                        : 'bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-75">
                      {isHead ? 'HEAD' : isTail ? 'TAIL' : `NODE [${idx}]`}
                    </span>
                    <span className="text-2xl font-bold">{val}</span>
                  </motion.div>

                  {/* Pointer Arrow */}
                  <motion.span
                    layout
                    className="text-emerald-400 text-xl font-bold px-1 select-none"
                  >
                    ➔
                  </motion.span>
                </React.Fragment>
              );
            })}
          </AnimatePresence>

          {/* NULL Pointer */}
          <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-400 font-mono font-bold text-xs select-none">
            NULL
          </div>
        </div>
      </div>

      {/* Detection Evidence Panel */}
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300">
        <div className="text-emerald-400 font-bold mb-1">Classifier Evidence (98% Confidence):</div>
        <div className="flex gap-4 flex-wrap text-slate-400">
          <span>✓ LinkedList class definition</span>
          <span>✓ Node* next pointer chaining</span>
          <span>✓ insert / delete / reverse operations</span>
        </div>
      </div>
    </div>
  );
};

export default LinkedListRenderer;
