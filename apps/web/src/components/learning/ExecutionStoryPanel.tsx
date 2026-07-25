"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { IExecutionStoryStep } from "@/lib/learning/types";

interface ExecutionStoryPanelProps {
  storySteps: IExecutionStoryStep[];
  currentStepIndex: number;
}

export const ExecutionStoryPanel: React.FC<ExecutionStoryPanelProps> = ({
  storySteps,
  currentStepIndex
}) => {
  const currentStory = storySteps[currentStepIndex];

  if (!currentStory) return null;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-[#30363d] pb-1.5">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Execution Narrative
          </h3>
        </div>
        <span className="text-[10px] bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded-full font-mono">
          {currentStory.conceptTag}
        </span>
      </div>

      <p className="text-xs text-gray-300 leading-relaxed font-medium">
        {currentStory.narrative}
      </p>
    </div>
  );
};
