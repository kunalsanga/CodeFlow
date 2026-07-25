"use client";

import React from "react";
import { BookMarked, Lightbulb, AlertTriangle, X } from "lucide-react";
import { conceptLibrary } from "@/lib/learning/conceptLibrary";

interface ConceptCardModalProps {
  conceptKey: "stack" | "heap" | null;
  onClose: () => void;
}

export const ConceptCardModal: React.FC<ConceptCardModalProps> = ({ conceptKey, onClose }) => {
  if (!conceptKey) return null;

  const concept = conceptLibrary[conceptKey];
  if (!concept) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="bg-[#161b22] border-2 border-[#388bfd] rounded-xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 border-b border-[#30363d] pb-3">
          <BookMarked className="w-5 h-5 text-[#79c0ff]" />
          <div>
            <h2 className="text-sm font-bold text-white">{concept.title}</h2>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{concept.category}</span>
          </div>
        </div>

        {/* Memory Representation */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-[#79c0ff] uppercase">Memory Architecture</span>
          <p className="text-xs text-gray-300 bg-[#0d1117] p-2.5 rounded border border-[#21262d] leading-relaxed">
            {concept.memoryRepresentation}
          </p>
        </div>

        {/* Real-world Analogy */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-emerald-400 uppercase">Real-World Analogy</span>
          <p className="text-xs text-gray-300 bg-emerald-950/30 p-2.5 rounded border border-emerald-900/40 leading-relaxed">
            {concept.realWorldAnalogy}
          </p>
        </div>

        {/* Interview Tip & Common Mistake */}
        <div className="flex flex-col gap-2 pt-1 border-t border-[#30363d]">
          <div className="flex items-start gap-2 bg-blue-950/40 p-2 rounded border-l-2 border-[#58a6ff]">
            <Lightbulb className="w-4 h-4 text-[#79c0ff] shrink-0 mt-0.5" />
            <span className="text-xs text-blue-200">
              <strong className="text-[#79c0ff]">Interview Tip:</strong> {concept.interviewTip}
            </span>
          </div>

          <div className="flex items-start gap-2 bg-amber-950/40 p-2 rounded border-l-2 border-amber-500">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="text-xs text-amber-200">
              <strong className="text-amber-400">Common Mistake:</strong> {concept.commonMistake}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-medium text-xs py-2 rounded-lg transition-colors"
        >
          Got It! Close Concept
        </button>
      </div>
    </div>
  );
};
