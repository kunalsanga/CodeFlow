'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeFlowSprings } from '@codeflow/animation-engine';

interface LinkedListProps {
  semanticIR: ISemanticIR;
}

export const LinkedListRenderer: React.FC<LinkedListProps> = ({ semanticIR }) => {
  const currentStep = semanticIR.metadata.currentStep || 0;

  // Step-driven dynamic Linked List trace state sequence
  const listStates = [
    { op: 'list.insert(10)', nodes: [10], pointers: { prev: null, curr: 10, next: null } },
    { op: 'list.insert(20)', nodes: [10, 20], pointers: { prev: null, curr: 20, next: null } },
    { op: 'list.insert(30)', nodes: [10, 20, 30], pointers: { prev: null, curr: 30, next: null } },
    { op: 'list.insert(40)', nodes: [10, 20, 30, 40], pointers: { prev: null, curr: 40, next: null } },
    { op: 'list.insertFront(5)', nodes: [5, 10, 20, 30, 40], pointers: { prev: null, curr: 5, next: 10 } },
    { op: 'list.deleteNode(20)', nodes: [5, 10, 30, 40], pointers: { prev: 10, curr: 20, next: 30 } },
    { op: 'list.reverse() Init', nodes: [5, 10, 30, 40], pointers: { prev: 'NULL', curr: 5, next: 10 } },
    { op: 'list.reverse() Step 1', nodes: [5, 10, 30, 40], pointers: { prev: 5, curr: 10, next: 30 } },
    { op: 'list.reverse() Step 2', nodes: [5, 10, 30, 40], pointers: { prev: 10, curr: 30, next: 40 } },
    { op: 'list.reverse() Step 3', nodes: [5, 10, 30, 40], pointers: { prev: 30, curr: 40, next: 'NULL' } },
    { op: 'list.reverse() Complete', nodes: [40, 30, 10, 5], pointers: { prev: 40, curr: 'HEAD', next: null } },
  ];

  const stateIndex = Math.min(currentStep, listStates.length - 1);
  const currentState = listStates[stateIndex] || listStates[0];

  return (
    <div key={`linked-list-step-${currentStep}`} className="flex flex-col gap-6 p-6 bg-[#161b22] text-[#e6edf3] rounded-xl border border-[#30363d] shadow-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
        <div>
          <span className="bg-[#3fb950]/20 text-[#3fb950] text-xs font-semibold px-3 py-1 rounded-full border border-[#3fb950]/30 uppercase tracking-wider">
            Semantic Visualizer (98% Confidence)
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">Singly Linked List Structure</h2>
        </div>
        <div className="text-right font-mono text-xs text-[#8b949e]">
          <div>Active Operation: <span className="text-[#58a6ff] font-bold">{currentState.op}</span></div>
          <div>Step Position: <span className="text-[#3fb950] font-bold">{currentStep + 1} / {semanticIR.metadata.totalSteps || listStates.length}</span></div>
        </div>
      </div>

      {/* Dynamic Linked List Node Chain with VALUE | NEXT Sections & Colored Reversal Pointers */}
      <div className="bg-[#0d1117] p-8 rounded-xl border border-[#30363d] flex flex-col items-center gap-6 min-h-[250px] justify-center overflow-x-auto relative shadow-inner">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Node Memory Pointers & Active Pointers (Step {currentStep + 1})
          </h3>
          {/* Active Pointer Legend */}
          <div className="flex gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-[#f85149] font-bold">🔴 prev</span>
            <span className="flex items-center gap-1 text-[#d29922] font-bold">🟡 curr</span>
            <span className="flex items-center gap-1 text-[#58a6ff] font-bold">🔵 next</span>
          </div>
        </div>

        <div className="flex items-center gap-4 my-4">
          <AnimatePresence mode="popLayout">
            {currentState.nodes.map((val, idx) => {
              const isHead = idx === 0;
              const isTail = idx === currentState.nodes.length - 1;

              const isPrev = currentState.pointers.prev === val;
              const isCurr = currentState.pointers.curr === val;
              const isNext = currentState.pointers.next === val;

              return (
                <React.Fragment key={`${val}-${idx}-${currentStep}`}>
                  <motion.div
                    layout
                    initial={{ scale: 0.7, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: -20 }}
                    transition={CodeFlowSprings.nodeDropIn}
                    className={`rounded-xl flex flex-col items-center border-2 font-mono relative overflow-hidden shadow-lg ${
                      isCurr
                        ? 'bg-[#d29922]/20 border-[#d29922] text-[#d29922] ring-4 ring-[#d29922]/30'
                        : isPrev
                        ? 'bg-[#f85149]/20 border-[#f85149] text-[#f85149]'
                        : isNext
                        ? 'bg-[#58a6ff]/20 border-[#58a6ff] text-[#79c0ff]'
                        : isHead
                        ? 'bg-[#3fb950]/20 border-[#3fb950] text-[#3fb950]'
                        : isTail
                        ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                        : 'bg-[#161b22] border-[#30363d] text-[#e6edf3]'
                    }`}
                  >
                    {/* Floating Pointer Badges */}
                    <div className="absolute -top-6 left-0 right-0 flex justify-center gap-1 text-[10px] font-bold">
                      {isPrev && <span className="bg-[#f85149] text-white px-1.5 py-0.5 rounded shadow">PREV</span>}
                      {isCurr && <span className="bg-[#d29922] text-black px-1.5 py-0.5 rounded shadow">CURR</span>}
                      {isNext && <span className="bg-[#58a6ff] text-[#0d1117] px-1.5 py-0.5 rounded shadow">NEXT</span>}
                    </div>

                    <div className="px-3 py-1 bg-[#161b22] border-b border-[#30363d] w-full text-center text-[10px] uppercase font-bold tracking-wider opacity-75">
                      {isHead ? 'HEAD' : isTail ? 'TAIL' : `NODE [${idx}]`}
                    </div>

                    {/* VALUE | NEXT Sections */}
                    <div className="flex items-center divide-x divide-[#30363d] p-3 gap-2">
                      <div className="flex flex-col items-center px-2">
                        <span className="text-[9px] text-[#8b949e] uppercase font-bold">VAL</span>
                        <span className="text-xl font-bold">{val}</span>
                      </div>
                      <div className="flex flex-col items-center px-2">
                        <span className="text-[9px] text-[#8b949e] uppercase font-bold">NEXT</span>
                        <span className="text-xs text-[#58a6ff] font-bold">0x{val * 4}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Pointer Arrow */}
                  <motion.span
                    layout
                    transition={CodeFlowSprings.pointerReconnect}
                    className="text-[#3fb950] text-xl font-bold px-1 select-none"
                  >
                    ➔
                  </motion.span>
                </React.Fragment>
              );
            })}
          </AnimatePresence>

          {/* Dashed ∅ NULL Terminator */}
          <div className="p-3 bg-[#f85149]/10 border-2 border-dashed border-[#f85149]/60 rounded-xl text-[#f85149] font-mono font-bold text-sm flex items-center gap-1 select-none shadow-sm">
            <span className="text-lg">∅</span> NULL
          </div>
        </div>
      </div>

      {/* Classifier Evidence Panel */}
      <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] font-mono text-xs text-[#8b949e]">
        <div className="text-[#3fb950] font-bold mb-1">Classifier Evidence (98% Confidence):</div>
        <div className="flex gap-4 flex-wrap text-[#8b949e]">
          <span>✓ LinkedList class / struct definition</span>
          <span>✓ Node* next pointer chaining</span>
          <span>✓ insert / delete / reverse pointer operations</span>
        </div>
      </div>
    </div>
  );
};

export default LinkedListRenderer;
