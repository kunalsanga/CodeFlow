"use client";

import React, { useMemo } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { VisualizerCanvas } from "@/components/visualizer/VisualizerCanvas";
import { ControlBar } from "@/components/controls/ControlBar";
import { AICompanionPanel } from "@/components/inspectors/AICompanionPanel";
import { StepChangesPanel } from "@/components/inspectors/StepChangesPanel";
import { VariableInspector } from "@/components/inspectors/VariableInspector";
import { ConsoleOutput } from "@/components/inspectors/ConsoleOutput";
import { useExecutionStore } from "@/store/useExecutionStore";
import { usePlaybackStore } from "@/store/usePlaybackStore";
import { computeFrameDiff } from "@/lib/frameDiffEngine";
import { Code2, BookOpen } from "lucide-react";

export default function Home() {
  const { code, setCode, executionPayload, error: executionError } = useExecutionStore();
  const { currentStepIndex } = usePlaybackStore();

  const currentStepEvent = useMemo(() => {
    if (!executionPayload || !executionPayload.trace.length) return null;
    return executionPayload.trace[currentStepIndex] || null;
  }, [executionPayload, currentStepIndex]);

  const previousStepEvent = useMemo(() => {
    if (!executionPayload || currentStepIndex <= 0) return null;
    return executionPayload.trace[currentStepIndex - 1] || null;
  }, [executionPayload, currentStepIndex]);

  const diffResult = useMemo(() => {
    return computeFrameDiff(previousStepEvent, currentStepEvent);
  }, [previousStepEvent, currentStepEvent]);

  const activeLineNumber = currentStepEvent?.line_number;
  const currentCodeSnippet = useMemo(() => {
    if (!activeLineNumber) return "";
    const lines = code.split("\n");
    return lines[activeLineNumber - 1] || "";
  }, [code, activeLineNumber]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0d1117]">
      {/* Top Header Navigation */}
      <header className="h-14 bg-[#161b22] border-b border-[#30363d] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              CodeFlow <span className="text-xs font-semibold px-2 py-0.5 bg-blue-900/50 text-[#79c0ff] border border-blue-700/50 rounded-full">Python MVP</span>
            </h1>
            <p className="text-[11px] text-gray-400">Interactive Visual Execution & Visual Diff Engine</p>
          </div>
        </div>

        {/* Preset Code Templates */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Samples:
          </span>
          <button
            onClick={() => setCode(`def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nresult = fibonacci(3)\nprint("Fibonacci:", result)`)}
            className="text-xs bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-2.5 py-1 rounded border border-[#30363d] transition-colors"
          >
            Recursion (Fibonacci)
          </button>
          <button
            onClick={() => setCode(`numbers = [5, 2, 8, 1, 3]\nfor i in range(len(numbers)):\n    for j in range(0, len(numbers) - i - 1):\n        if numbers[j] > numbers[j + 1]:\n            numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]\nprint("Sorted:", numbers)`)}
            className="text-xs bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-2.5 py-1 rounded border border-[#30363d] transition-colors"
          >
            Bubble Sort
          </button>
          <button
            onClick={() => setCode(`person = {"name": "Alice", "skills": ["Python", "Algorithms"]}\nperson["skills"].append("AI")\nprint(person)`)}
            className="text-xs bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-2.5 py-1 rounded border border-[#30363d] transition-colors"
          >
            Object & Heap Ref
          </button>
        </div>
      </header>

      {/* Main Workspace Split View */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Column: Monaco Code Editor (4 cols) */}
        <div className="col-span-4 h-full border-r border-[#30363d] overflow-hidden">
          <CodeEditor activeLineNumber={activeLineNumber} />
        </div>

        {/* Center Column: Visualizer Canvas (5 cols) */}
        <div className="col-span-5 h-full border-r border-[#30363d] overflow-hidden">
          <VisualizerCanvas
            currentStepEvent={currentStepEvent}
            previousStepEvent={previousStepEvent}
          />
        </div>

        {/* Right Column: AI Companion, Step Changes & Inspectors (3 cols) */}
        <div className="col-span-3 h-full bg-[#0d1117] p-4 flex flex-col gap-3 overflow-y-auto">
          <StepChangesPanel diffResult={diffResult} />
          <AICompanionPanel
            currentStepEvent={currentStepEvent}
            codeSnippet={currentCodeSnippet}
          />
          <VariableInspector currentStepEvent={currentStepEvent} />
          <ConsoleOutput
            stdout={executionPayload?.stdout || currentStepEvent?.stdout || ""}
            error={executionError || executionPayload?.error}
          />
        </div>
      </main>

      {/* Bottom Timeline & Control Bar */}
      <footer className="shrink-0">
        <ControlBar />
      </footer>
    </div>
  );
}
