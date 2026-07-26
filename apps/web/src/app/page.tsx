"use client";

import React, { useMemo, useState } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { VisualizerCanvas } from "@/components/visualizer/VisualizerCanvas";
import { ControlBar } from "@/components/controls/ControlBar";
import { AICompanionPanel } from "@/components/inspectors/AICompanionPanel";
import { StepChangesPanel } from "@/components/inspectors/StepChangesPanel";
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
import { generateExecutionStory } from "@/lib/learning/narrativeGenerator";
import { generatePredictionQuestions } from "@/lib/learning/predictionEngine";

import { AlgorithmDetector } from "@/semantic-engine/detectors/AlgorithmDetector";
import { StepExplainerEngine } from "@codeflow/ai-engine";
import { LanguageDetector } from "@codeflow/language-adapters";

import { SlidersHorizontal, Sparkles, Cpu, Eye, Layers, Brain, Lightbulb } from "lucide-react";

type ViewMode = "visualizer" | "memory" | "ai";

export default function Home() {
  const { code, executionPayload, error: executionError } = useExecutionStore();
  const { currentStepIndex, stepNext } = usePlaybackStore();

  const [isPredictionMode, setIsPredictionMode] = useState<boolean>(false);
  const [showAdvancedInspectors, setShowAdvancedInspectors] = useState<boolean>(false);
  const [activeConceptKey, setActiveConceptKey] = useState<"stack" | "heap" | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>("visualizer");

  // Keyboard navigation shortcuts
  useKeyboardShortcuts(() => setIsPredictionMode(prev => !prev));

  const hasCode = code && code.trim() !== "";

  // Automatic Language Detection Subsystem
  const autoLanguage = useMemo(() => {
    if (!hasCode) return null;
    return LanguageDetector.detectLanguage(code);
  }, [code, hasCode]);

  // Run Multi-Stage Semantic Engine on current code
  const semanticDetectionResult = useMemo(() => {
    if (!hasCode || !autoLanguage) return null;
    return AlgorithmDetector.detect(code, autoLanguage.language);
  }, [code, hasCode, autoLanguage]);

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

  // Execution Narrative Story
  const storySteps = useMemo(() => {
    if (!executionPayload || !executionPayload.trace.length) return [];
    return generateExecutionStory(executionPayload.trace);
  }, [executionPayload]);

  // Educational Step Rationale from AI Engine
  const stepRationale = useMemo(() => {
    const algoType = semanticDetectionResult?.algorithmType || 'code';
    return StepExplainerEngine.generateRationale(null, currentStepIndex, algoType);
  }, [currentStepIndex, semanticDetectionResult]);

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
    if (!activeLineNumber || !hasCode) return "";
    const lines = code.split("\n");
    return lines[activeLineNumber - 1] || "";
  }, [code, activeLineNumber, hasCode]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0d1117]">
      {/* Concept Card Modal */}
      <ConceptCardModal
        conceptKey={activeConceptKey}
        onClose={() => setActiveConceptKey(null)}
      />

      {/* Clean IDE Top Navigation Header */}
      <header className="h-14 bg-[#161b22] border-b border-[#30363d] px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md flex items-center gap-1">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              CodeFlow
              {hasCode && autoLanguage && semanticDetectionResult && (
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Detected: {autoLanguage.language.toUpperCase()} | {semanticDetectionResult.algorithmType} ({(semanticDetectionResult.confidence * 100).toFixed(0)}%)
                </span>
              )}
            </h1>
            <p className="text-[11px] text-gray-400">Language-Independent Code Execution & Visualization Platform</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#0d1117] p-1 rounded-xl border border-[#30363d] gap-1">
          <button
            onClick={() => setActiveViewMode("visualizer")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeViewMode === "visualizer"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Graph Visualizer
          </button>
          <button
            onClick={() => setActiveViewMode("memory")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeViewMode === "memory"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Memory (RAM)
          </button>
          <button
            onClick={() => setActiveViewMode("ai")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeViewMode === "ai"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-amber-400" /> AI Rationale
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvancedInspectors(!showAdvancedInspectors)}
            aria-label="Toggle Advanced Inspector Panels"
            className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all focus:outline-none ${
              showAdvancedInspectors
                ? "bg-blue-950/80 border-[#58a6ff] text-[#79c0ff]"
                : "bg-[#21262d] border-[#30363d] text-gray-300 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#58a6ff]" />
            {showAdvancedInspectors ? "Hide Details" : "Show Details"}
          </button>
        </div>
      </header>

      {/* Main Workspace Split View */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Column: Code Editor */}
        <div className={`${showAdvancedInspectors ? "col-span-4" : "col-span-5"} h-full border-r border-[#30363d] overflow-hidden transition-all flex flex-col justify-between`}>
          <CodeEditor activeLineNumber={activeLineNumber} />

          {/* AI Educational Step Rationale Banner */}
          {hasCode && (
            <div className="p-3 bg-slate-900 border-t border-[#30363d] font-mono text-xs text-slate-300 flex items-start gap-2.5 shadow-inner">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-300">{stepRationale.reason}</div>
                <div className="text-slate-400 mt-0.5">{stepRationale.explanation}</div>
                {stepRationale.hint && (
                  <div className="text-indigo-400 mt-1 italic">💡 Hint: {stepRationale.hint}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center Column: Adaptive Canvas Mode */}
        <div className={`${showAdvancedInspectors ? "col-span-5" : "col-span-7"} h-full border-r border-[#30363d] overflow-hidden relative transition-all`}>
          {activeViewMode === "ai" ? (
            <div className="h-full w-full bg-[#0d1117] p-6 overflow-y-auto">
              <AICompanionPanel
                currentStepEvent={currentStepEvent}
                codeSnippet={currentCodeSnippet}
              />
            </div>
          ) : (
            <VisualizerCanvas
              currentStepEvent={currentStepEvent}
              previousStepEvent={previousStepEvent}
              allTraceEvents={executionPayload?.trace || []}
              currentStepIndex={currentStepIndex}
              detectedAlgorithm={activeViewMode === "memory" ? "generic-memory" : (semanticDetectionResult?.algorithmType || "generic-memory")}
              code={code}
            />
          )}

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

        {/* Right Column: Detail Inspectors */}
        {showAdvancedInspectors && (
          <div className="col-span-3 h-full bg-[#0d1117] p-4 flex flex-col gap-3 overflow-y-auto border-l border-[#30363d]">
            <MemoryInsightsPanel memoryAnalysis={memoryAnalysis} />
            <ExecutionStoryPanel
              storySteps={storySteps}
              currentStepIndex={currentStepIndex}
            />
            <StepChangesPanel diffResult={diffResult} />
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
