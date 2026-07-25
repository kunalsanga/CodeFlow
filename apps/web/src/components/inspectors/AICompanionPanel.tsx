"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { ITraceEvent } from "@/types/trace";
import { IAIExplanationResponse } from "@/types/execution";
import { getApiUrl } from "@/lib/apiClient";

interface AICompanionPanelProps {
  currentStepEvent: ITraceEvent | null;
  codeSnippet: string;
}

export const AICompanionPanel: React.FC<AICompanionPanelProps> = ({
  currentStepEvent,
  codeSnippet
}) => {
  const [explanation, setExplanation] = useState<IAIExplanationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentStepEvent) {
      setExplanation(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch(getApiUrl("/api/v1/explain-step"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code_snippet: codeSnippet,
        current_step: currentStepEvent
      })
    })
      .then((res) => res.json())
      .then((data: IAIExplanationResponse) => {
        if (isMounted) {
          setExplanation(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setExplanation({
            step_index: currentStepEvent.step_index,
            explanation: `Line ${currentStepEvent.line_number} execution step in \`${currentStepEvent.event_type}\` state.`,
            key_takeaway: "Step execution state updated."
          });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentStepEvent, codeSnippet]);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-3 shadow-md">
      <div className="flex items-center gap-2 border-b border-[#30363d] pb-2">
        <Sparkles className="w-4 h-4 text-[#79c0ff]" />
        <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
          AI Step Companion
        </h3>
      </div>

      {!currentStepEvent ? (
        <p className="text-xs text-gray-500 italic">
          Run code and scrub timeline steps to view AI insights.
        </p>
      ) : loading ? (
        <div className="text-xs text-[#79c0ff] animate-pulse py-2">
          Generating step breakdown...
        </div>
      ) : explanation ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-300 leading-relaxed">
            {explanation.explanation}
          </p>
          <div className="bg-[#0d1117] border-l-2 border-[#58a6ff] p-2 rounded-r">
            <span className="text-[11px] font-semibold text-[#79c0ff]">
              Key Takeaway: {explanation.key_takeaway}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
