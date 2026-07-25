"use client";

import React, { useMemo, useState } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { VisualizerCanvas } from "@/components/visualizer/VisualizerCanvas";
import { ControlBar } from "@/components/controls/ControlBar";
import { AICompanionPanel } from "@/components/inspectors/AICompanionPanel";
import { StepChangesPanel } from "@/components/inspectors/StepChangesPanel";
import { AlgorithmMetadataPanel } from "@/components/inspectors/AlgorithmMetadataPanel";
import { MemoryInsightsPanel } from "@/components/inspectors/MemoryInsightsPanel";
import { VariableInspector } from "@/components/inspectors/VariableInspector";
import { ConsoleOutput } from "@/components/inspectors/ConsoleOutput";

import { PredictionCard } from "@/components/learning/PredictionCard";
import { ExecutionStoryPanel } from "@/components/learning/ExecutionStoryPanel";
import { ConceptCardModal } from "@/components/learning/ConceptCardModal";

import { useExecutionStore } from "@/store/useExecutionStore";
import { usePlaybackStore } from "@/store/usePlaybackStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

import { computeFrameDiff } from "@/lib/frameDiffEngine";
import { analyzeMemoryLayout } from "@/lib/memory/memoryLayoutEngine";
import { detectorManager } from "@/lib/algorithms/detectorManager";
import { generateExecutionStory } from "@/lib/learning/narrativeGenerator";
import { generatePredictionQuestions } from "@/lib/learning/predictionEngine";

import { Code2, BookOpen, HelpCircle, BookMarked, SlidersHorizontal } from "lucide-react";

export default function Home() {
  const { code, setCode, executionPayload, error: executionError } = useExecutionStore();
  const { currentStepIndex, stepNext } = usePlaybackStore();

  const [isPredictionMode, setIsPredictionMode] = useState<boolean>(false);
  const [showAdvancedInspectors, setShowAdvancedInspectors] = useState<boolean>(false);
  const [activeConceptKey, setActiveConceptKey] = useState<"stack" | "heap" | null>(null);

  // Keyboard navigation shortcuts
  useKeyboardShortcuts(() => setIsPredictionMode(prev => !prev));

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

  // Memory Analysis
  const memoryAnalysis = useMemo(() => {
    return analyzeMemoryLayout(currentStepEvent);
  }, [currentStepEvent]);

  // Algorithm Intelligence Detection
  const algorithmResult = useMemo(() => {
    if (!executionPayload || !executionPayload.trace.length) return null;
    return detectorManager.detectAlgorithm(executionPayload.trace);
  }, [executionPayload]);

  // Execution Narrative Story
  const storySteps = useMemo(() => {
    if (!executionPayload || !executionPayload.trace.length) return [];
    return generateExecutionStory(executionPayload.trace);
  }, [executionPayload]);

  // Interactive Prediction Questions
  const predictionQuestions = useMemo(() => {
    if (!executionPayload || !executionPayload.trace.length) return [];
    return generatePredictionQuestions(executionPayload.trace);
  }, [executionPayload]);

  const activePrediction = useMemo(() => {
    return predictionQuestions.find(q => q.stepIndex === currentStepIndex) || null;
  }, [predictionQuestions, currentStepIndex]);

  const activeLineNumber = currentStepEvent?.line_number;
  const currentCodeSnippet = useMemo(() => {
    if (!activeLineNumber) return "";
    const lines = code.split("\n");
    return lines[activeLineNumber - 1] || "";
  }, [code, activeLineNumber]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0d1117]">
      {/* Concept Card Modal */}
      <ConceptCardModal
        conceptKey={activeConceptKey}
        onClose={() => setActiveConceptKey(null)}
      />

      {/* Clean Minimalist Header Navigation */}
      <header className="h-14 bg-[#161b22] border-b border-[#30363d] px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              CodeFlow <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-900/50 text-[#79c0ff] border border-blue-700/50 rounded-full">
                {algorithmResult?.algorithmName || "Python Visualizer"}
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">Interactive Code Execution & Visual Learning Platform</p>
          </div>
        </div>

        {/* Action Controls & Preset Sample Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvancedInspectors(!showAdvancedInspectors)}
            aria-label="Toggle Advanced Inspector Panels"
            className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#58a6ff] ${
              showAdvancedInspectors
                ? "bg-blue-950/80 border-[#58a6ff] text-[#79c0ff] ring-2 ring-blue-500/30"
                : "bg-[#21262d] border-[#30363d] text-gray-300 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#58a6ff]" />
            {showAdvancedInspectors ? "Hide Details" : "Show Details"}
          </button>

          <div className="h-4 w-px bg-[#30363d]" />

          <button
            onClick={() => setIsPredictionMode(!isPredictionMode)}
            aria-label="Toggle Prediction Mode"
            title="Toggle Prediction Mode (P)"
            className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isPredictionMode
                ? "bg-indigo-950/80 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/40"
                : "bg-[#21262d] border-[#30363d] text-gray-300 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            Prediction: {isPredictionMode ? "ON" : "OFF"}
          </button>

          <div className="h-4 w-px bg-[#30363d]" />

          {/* Preset Sample Code Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Samples:
            </span>
            <button
              onClick={() => setCode(`def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nresult = fibonacci(3)\nprint("Fibonacci:", result)`)}
              aria-label="Load Fibonacci Recursion Sample"
              className="text-xs bg-[#21262d] hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 px-2.5 py-1 rounded border border-[#30363d] transition-colors"
            >
              Recursion
            </button>
            <button
              onClick={() => setCode(`numbers = [5, 2, 8, 1, 3]\nfor i in range(len(numbers)):\n    for j in range(0, len(numbers) - i - 1):\n        if numbers[j] > numbers[j + 1]:\n            numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]\nprint("Sorted:", numbers)`)}
              aria-label="Load Bubble Sort Sample"
              className="text-xs bg-[#21262d] hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 px-2.5 py-1 rounded border border-[#30363d] transition-colors"
            >
              Bubble Sort
            </button>
            <button
              onClick={() => setCode(`a = [10, 20, 30]\nb = a\nb.append(40)\nprint("Aliased list:", a)`)}
              aria-label="Load Reference Aliasing Sample"
              className="text-xs bg-[#21262d] hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 px-2.5 py-1 rounded border border-[#30363d] transition-colors"
            >
              Aliasing (Heap RAM)
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Split View */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Column: Code Editor */}
        <div className={`${showAdvancedInspectors ? "col-span-4" : "col-span-5"} h-full border-r border-[#30363d] overflow-hidden transition-all`}>
          <CodeEditor activeLineNumber={activeLineNumber} />
        </div>

        {/* Center Column: Adaptive Visualizer Canvas */}
        <div className={`${showAdvancedInspectors ? "col-span-5" : "col-span-7"} h-full border-r border-[#30363d] overflow-hidden relative transition-all`}>
          <VisualizerCanvas
            currentStepEvent={currentStepEvent}
            previousStepEvent={previousStepEvent}
            mode={algorithmResult?.mode}
          />

          {/* Interactive Prediction Modal Overlay */}
          {isPredictionMode && activePrediction && (
            <div className="absolute top-4 left-4 right-4 z-30">
              <PredictionCard
                question={activePrediction}
                onContinue={() => stepNext()}
              />
            </div>
          )}
        </div>

        {/* Right Column: Detail Inspectors (Only visible when toggled) */}
        {showAdvancedInspectors && (
          <div className="col-span-3 h-full bg-[#0d1117] p-4 flex flex-col gap-3 overflow-y-auto border-l border-[#30363d]">
            <MemoryInsightsPanel memoryAnalysis={memoryAnalysis} />
            <ExecutionStoryPanel
              storySteps={storySteps}
              currentStepIndex={currentStepIndex}
            />
            <AlgorithmMetadataPanel algorithmResult={algorithmResult} />
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
        )}
      </main>

      {/* Bottom Timeline & Control Bar */}
      <footer className="shrink-0">
        <ControlBar />
      </footer>
    </div>
  );
}
