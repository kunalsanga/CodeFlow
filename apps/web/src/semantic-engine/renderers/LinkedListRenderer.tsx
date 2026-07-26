'use client';

import React from 'react';
import { ISemanticIR } from '@/types/semantic/ir';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div key={`linked-list-step-${currentStep}`} className="h-full w-full flex flex-col justify-between p-8 bg-[#3f51b5] text-white font-sans overflow-y-auto">
      {/* Flat Vector Header */}
      <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
        <div>
          <span className="bg-white text-[#3f51b5] text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
            Singly Linked List
          </span>
          <h2 className="text-2xl font-black mt-2 text-white">Pointer Chaining & Reversal</h2>
        </div>
        <div className="text-right font-mono text-xs text-white/90">
          <div>Operation: <span className="text-yellow-300 font-bold">{currentState.op}</span></div>
          <div>Step: <span className="text-emerald-300 font-bold">{currentStep + 1} / {semanticIR.metadata.totalSteps || listStates.length}</span></div>
        </div>
      </div>

      {/* Flat Vector Diagram Area */}
      <div className="my-auto py-12 flex flex-col items-center gap-8 min-h-[300px] justify-center overflow-x-auto">
        <div className="flex items-center gap-6">
          {/* Head Indicator Badge */}
          <div className="bg-emerald-400 text-[#0d1117] font-black text-xs px-3 py-2 rounded-lg shadow-md font-mono uppercase">
            HEAD ➔
          </div>

          <AnimatePresence mode="popLayout">
            {currentState.nodes.map((val, idx) => {
              const isCurr = currentState.pointers.curr === val;
              const isPrev = currentState.pointers.prev === val;
              const isNext = currentState.pointers.next === val;

              return (
                <React.Fragment key={`${val}-${idx}-${currentStep}`}>
                  <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`bg-white text-[#0d1117] rounded-xl border-4 font-mono relative overflow-hidden shadow-2xl flex items-center divide-x-2 divide-gray-300 ${
                      isCurr
                        ? 'border-yellow-400 ring-4 ring-yellow-300'
                        : isPrev
                        ? 'border-rose-400'
                        : isNext
                        ? 'border-cyan-400'
                        : 'border-white'
                    }`}
                  >
                    {/* Floating Active Pointer Badges */}
                    <div className="absolute -top-7 left-0 right-0 flex justify-center gap-1 text-[10px] font-black">
                      {isPrev && <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded shadow">PREV</span>}
                      {isCurr && <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded shadow">CURR</span>}
                      {isNext && <span className="bg-cyan-400 text-black px-1.5 py-0.5 rounded shadow">NEXT</span>}
                    </div>

                    {/* VALUE SECTION */}
                    <div className="px-5 py-4 flex flex-col items-center bg-gray-50">
                      <span className="text-[10px] text-gray-500 font-black uppercase">VAL</span>
                      <span className="text-2xl font-black">{val}</span>
                    </div>

                    {/* NEXT POINTER SECTION */}
                    <div className="px-4 py-4 flex flex-col items-center bg-white">
                      <span className="text-[10px] text-gray-500 font-black uppercase">NEXT</span>
                      <span className="text-xs font-black text-[#3f51b5]">0x{val * 8}</span>
                    </div>
                  </motion.div>

                  {/* Thick Solid White Vector Pointer Arrow */}
                  <motion.div layout className="flex items-center text-white text-2xl font-black px-1 select-none">
                    ➔
                  </motion.div>
                </React.Fragment>
              );
            })}
          </AnimatePresence>

          {/* Solid White Null Terminator Node */}
          <div className="bg-white/20 border-4 border-dashed border-white text-white font-mono font-black text-sm px-4 py-4 rounded-xl flex items-center gap-2 select-none shadow-md">
            <span className="text-xl">∅</span> NULL
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-black/20 p-4 rounded-xl font-mono text-xs text-white/90 border border-white/20">
        <span className="font-bold text-yellow-300">Semantic Evidence:</span> Linked list node chain traversal with dynamic next pointer updates.
      </div>
    </div>
  );
};

export default LinkedListRenderer;
