"use client";

import React, { useState } from "react";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { IPredictionQuestion } from "@/lib/learning/types";

interface PredictionCardProps {
  question: IPredictionQuestion;
  onContinue: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ question, onContinue }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <div className="bg-[#161b22] border-2 border-indigo-500/80 rounded-xl p-4 shadow-2xl flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-[#30363d] pb-2">
        <HelpCircle className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
          Prediction Mode Challenge
        </h3>
      </div>

      <p className="text-xs text-gray-200 font-medium">
        {question.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {question.options.map((opt, idx) => {
          let btnStyle = "bg-[#0d1117] border-[#30363d] text-gray-300 hover:border-indigo-500";

          if (isSubmitted) {
            if (idx === question.correctIndex) {
              btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold";
            } else if (idx === selectedIndex) {
              btnStyle = "bg-red-950/80 border-red-500 text-red-200";
            }
          } else if (idx === selectedIndex) {
            btnStyle = "bg-indigo-950/80 border-indigo-500 text-indigo-200 font-semibold";
          }

          return (
            <button
              key={idx}
              disabled={isSubmitted}
              onClick={() => setSelectedIndex(idx)}
              className={`text-left text-xs p-2.5 rounded-lg border transition-all ${btnStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Action / Feedback */}
      {!isSubmitted ? (
        <button
          disabled={selectedIndex === null}
          onClick={() => setIsSubmitted(true)}
          className="mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-xs py-2 rounded-lg transition-colors"
        >
          Check Prediction
        </button>
      ) : (
        <div className="flex flex-col gap-2 pt-2 border-t border-[#30363d]">
          <div className="flex items-center gap-2 text-xs font-bold">
            {isCorrect ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Correct Prediction!
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Incorrect
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-300 bg-[#0d1117] p-2 rounded border border-[#21262d]">
            {question.explanation}
          </p>
          <button
            onClick={onContinue}
            className="bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-medium py-1.5 rounded transition-colors"
          >
            Continue Execution →
          </button>
        </div>
      )}
    </div>
  );
};
