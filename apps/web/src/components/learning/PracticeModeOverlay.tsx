"use client";

import React, { useState, useMemo } from "react";
import { HelpCircle, CheckCircle2, XCircle, Award } from "lucide-react";
import { ITraceEvent } from "@/types/trace";

interface PracticeModeOverlayProps {
  currentStepEvent: ITraceEvent | null;
  onContinue: () => void;
}

export const PracticeModeOverlay: React.FC<PracticeModeOverlayProps> = ({
  currentStepEvent,
  onContinue,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState<boolean>(false);

  // Generate 4 dynamic multiple-choice options from current trace event facts
  const quiz = useMemo(() => {
    if (!currentStepEvent) return null;

    const line = currentStepEvent.line_number || 1;
    const isCall = currentStepEvent.event_type === "call";
    const isReturn = currentStepEvent.event_type === "return";

    const correctAnswer = isCall
      ? `Push new stack frame for function invocation at Line ${line}`
      : isReturn
      ? `Pop active stack frame and unwind return value at Line ${line}`
      : `Execute Line ${line} and update local scope variables`;

    const options = [
      correctAnswer,
      `Allocate 1024 bytes in Heap RAM Memory at Line ${line}`,
      `Rebalance Binary Search Tree root pointer at Line ${line}`,
      `Relax graph adjacency edge weight in distance table at Line ${line}`,
    ];

    return {
      question: `Practice Quiz (Line ${line}): What happens next?`,
      correctIndex: 0,
      options: options,
    };
  }, [currentStepEvent]);

  if (!quiz) return null;

  const handleSelectOption = (idx: number) => {
    if (answered) return;

    setSelectedOption(idx);
    setAnswered(true);

    const isCorrect = idx === quiz.correctIndex;
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    setSelectedOption(null);
    setAnswered(false);
    onContinue();
  };

  return (
    <div className="bg-[#161b22]/95 border-2 border-[#58a6ff] rounded-xl p-5 text-[#e6edf3] shadow-2xl backdrop-blur-md flex flex-col gap-4 font-sans max-w-lg mx-auto">
      {/* Header & Score Tracker */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <HelpCircle className="w-5 h-5 text-[#58a6ff]" />
          <span>Practice Mode Quiz</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0d1117] border border-[#30363d] px-3 py-1 rounded-full font-mono text-xs text-[#3fb950] font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>Score: {score.correct} / {score.total}</span>
        </div>
      </div>

      <p className="text-xs text-[#8b949e] font-semibold">{quiz.question}</p>

      {/* 4 Quiz Options */}
      <div className="flex flex-col gap-2 font-mono text-xs">
        {quiz.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === quiz.correctIndex;

          let btnClass = "bg-[#0d1117] border-[#30363d] text-gray-300 hover:border-[#58a6ff]";
          if (answered) {
            if (isCorrect) {
              btnClass = "bg-[#3fb950]/20 border-[#3fb950] text-[#3fb950] font-bold ring-2 ring-[#3fb950]/30";
            } else if (isSelected) {
              btnClass = "bg-[#f85149]/20 border-[#f85149] text-[#f85149]";
            }
          }

          return (
            <button
              key={idx}
              disabled={answered}
              onClick={() => handleSelectOption(idx)}
              className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${btnClass}`}
            >
              <span>{option}</span>
              {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#3fb950] shrink-0" />}
              {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-[#f85149] shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full py-2.5 bg-[#58a6ff] hover:bg-[#79c0ff] text-[#0d1117] font-bold text-xs rounded-lg transition-all shadow-md active:scale-95 mt-1"
        >
          Continue Execution ➔
        </button>
      )}
    </div>
  );
};

export default PracticeModeOverlay;
