"use client";

import React, { useMemo, useState, useEffect } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { VisualizerCanvas } from "@/components/visualizer/VisualizerCanvas";
import { ControlBar } from "@/components/controls/ControlBar";
import { ResizableSplitLayout } from "@/components/layout/ResizableSplitLayout";
import { StepChangesPanel } from "@/components/inspectors/StepChangesPanel";
import { MemoryInsightsPanel } from "@/components/inspectors/MemoryInsightsPanel";
import { VariableInspector } from "@/components/inspectors/VariableInspector";
import { ConsoleOutput } from "@/components/inspectors/ConsoleOutput";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

import { ShareModal } from "@/components/modals/ShareModal";
import { ShortcutsModal } from "@/components/modals/ShortcutsModal";
import { PracticeModeOverlay } from "@/components/learning/PracticeModeOverlay";
import { ExecutionStoryPanel } from "@/components/learning/ExecutionStoryPanel";
import { ConceptCardModal } from "@/components/learning/ConceptCardModal";

import { useExecutionStore } from "@/store/useExecutionStore";
import { usePlaybackStore } from "@/store/usePlaybackStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

import { computeFrameDiff } from "@/lib/frameDiffEngine";
import { analyzeMemoryLayout } from "@/lib/memory/memoryLayoutEngine";
import { generateExecutionStory } from "@/lib/learning/narrativeGenerator";

import { AlgorithmDetector } from "@/semantic-engine/detectors/AlgorithmDetector";
import { StepExplainerEngine } from "@codeflow/ai-engine";
import { LanguageDetector } from "@codeflow/language-adapters";

import { SlidersHorizontal, Sparkles, Cpu, Eye, Layers, ScrollText, Download, Activity, Share2, Keyboard, HelpCircle } from "lucide-react";

type ViewMode = "visualizer" | "memory" | "log";

export default function Home() {
  const { code, setCode, setLanguage, executionPayload, error: executionError } = useExecutionStore();
  const { currentStepIndex, stepNext, setStep } = usePlaybackStore();

  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [showAdvancedInspectors, setShowAdvancedInspectors] = useState<boolean>(false);
  const [activeConceptKey, setActiveConceptKey] = useState<"stack" | "heap" | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>("visualizer");

  // Rehydrate state on load if share payload parameter exists in URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get("share");
    if (shareParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(shareParam)));
        if (decoded.code) setCode(decoded.code);
        if (decoded.language) setLanguage(decoded.language);
        if (decoded.currentStep !== undefined) setStep(decoded.currentStep);
      } catch (err) {
        console.error("Failed to rehydrate shared session payload:", err);
      }
    }
  }, [setCode, setLanguage, setStep]);

  // Keydown listener for ? key shortcuts modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable || target.closest(".monaco-editor"))) {
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        setIsShareModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Global Keyboard Navigation Shortcuts
  useKeyboardShortcuts(() => setIsPracticeMode(prev => !prev));

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

  // Factual Execution Log Stream
  const stepRationale = useMemo(() => {
    const algoType = semanticDetectionResult?.algorithmType || 'code';
    return StepExplainerEngine.generateRationale(null, currentStepIndex, algoType);
  }, [currentStepIndex, semanticDetectionResult]);

  const activeLineNumber = currentStepEvent?.line_number;

  // Image Exporter Helper
  const handleExportCanvasImage = () => {
    const canvasContainer = document.querySelector('#visualization-canvas');
    if (!canvasContainer) return;

    const svgElement = canvasContainer.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `codeflow-step-${currentStepIndex + 1}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const confidencePercent = semanticDetectionResult ? Math.round(semanticDetectionResult.confidence * 100) : 0;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0d1117] text-[#e6edf3]">
      {/* Concept Card Modal */}
      <ConceptCardModal
        conceptKey={activeConceptKey}
        onClose={() => setActiveConceptKey(null)}
      />

      {/* Share Session Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        code={code}
        language={autoLanguage?.language || "python"}
        currentStep={currentStepIndex}
      />

      {/* Keyboard Shortcuts Modal (?) */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* CodeFlow Top Navigation Header */}
      <header className="h-14 bg-[#161b22] border-b border-[#30363d] px-6 flex items-center justify-between shrink-0 shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#58a6ff] to-indigo-600 rounded-lg shadow-md flex items-center gap-1">
            <Cpu className="w-5 h-5 text-[#0d1117]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-3">
              CodeFlow
              {hasCode && autoLanguage && semanticDetectionResult && (
                <div className="flex items-center gap-2 bg-[#1f242c] border border-[#30363d] px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="text-[#58a6ff] uppercase tracking-wider font-mono text-[11px]">
                    {autoLanguage.language.toUpperCase()}
                  </span>
                  <span className="text-[#30363d]">|</span>
                  <span className="text-white capitalize">
                    {semanticDetectionResult.algorithmType}
                  </span>

                  {/* Animated Confidence Fill Bar */}
                  <div className="w-16 h-2 bg-[#30363d] rounded-full overflow-hidden relative ml-1" title={`Confidence: ${confidencePercent}%`}>
                    <div
                      className="h-full bg-gradient-to-r from-[#58a6ff] to-[#3fb950] transition-all duration-500 rounded-full"
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#3fb950] font-bold">
                    {confidencePercent}%
                  </span>
                </div>
              )}
            </h1>
            <p className="text-[11px] text-[#8b949e] font-medium">Understand Code Through Interactive Execution</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#0d1117] p-1 rounded-xl border border-[#30363d] gap-1">
          <button
            onClick={() => setActiveViewMode("visualizer")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeViewMode === "visualizer"
                ? "bg-[#58a6ff] text-[#0d1117] shadow-md"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Canvas Visualizer
          </button>
          <button
            onClick={() => setActiveViewMode("memory")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeViewMode === "memory"
                ? "bg-[#58a6ff] text-[#0d1117] shadow-md"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Memory (RAM)
          </button>
          <button
            onClick={() => setActiveViewMode("log")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeViewMode === "log"
                ? "bg-[#58a6ff] text-[#0d1117] shadow-md"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" /> Execution Log
          </button>
        </div>

        {/* Action Controls & Practice Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Practice Mode Toggle */}
          <button
            onClick={() => setIsPracticeMode(!isPracticeMode)}
            className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all focus:outline-none ${
              isPracticeMode
                ? "bg-[#3fb950] text-[#0d1117] border-[#3fb950] shadow-md"
                : "bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d]"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {isPracticeMode ? "Practice ON" : "Practice Mode"}
          </button>

          <button
            onClick={handleExportCanvasImage}
            title="Export Visualization Image (E)"
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d] font-medium transition-all focus:outline-none"
          >
            <Download className="w-3.5 h-3.5 text-[#3fb950]" />
            Export SVG
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            title="Share Visualization Session (S)"
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d] font-medium transition-all focus:outline-none"
          >
            <Share2 className="w-3.5 h-3.5 text-[#58a6ff]" />
            Share
          </button>

          <button
            onClick={() => setIsShortcutsModalOpen(true)}
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
            className="p-1.5 rounded-lg border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:text-white transition-all"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowAdvancedInspectors(!showAdvancedInspectors)}
            aria-label="Toggle Advanced Inspector Panels"
            className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all focus:outline-none ${
              showAdvancedInspectors
                ? "bg-blue-950/80 border-[#58a6ff] text-[#79c0ff]"
                : "bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#58a6ff]" />
            {showAdvancedInspectors ? "Hide Details" : "Details"}
          </button>
        </div>
      </header>

      {/* Main Workspace Resizable Split Layout */}
      <main className="flex-1 w-full h-full overflow-hidden flex">
        <ResizableSplitLayout
          initialLeftWidthPercent={40}
          minLeftWidthPercent={25}
          maxLeftWidthPercent={65}
          leftComponent={
            <div className="h-full w-full flex flex-col justify-between overflow-hidden bg-[#161b22]">
              <CodeEditor activeLineNumber={activeLineNumber} language={autoLanguage?.language} />

              {/* Factual Execution Log Stream Banner */}
              {hasCode && (
                <div className="p-3 bg-[#0d1117] border-t border-[#30363d] font-mono text-xs text-[#e6edf3] flex items-start gap-2.5 shadow-inner shrink-0">
                  <Activity className="w-4 h-4 text-[#3fb950] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#3fb950]">{stepRationale.reason}</div>
                    <div className="text-[#8b949e] mt-0.5">{stepRationale.explanation}</div>
                  </div>
                </div>
              )}
            </div>
          }
          rightComponent={
            <div className="h-full w-full flex overflow-hidden">
              <div
                id="visualization-canvas"
                className="flex-1 h-full relative overflow-hidden bg-[#0d1117] bg-grid-dots"
              >
                <ErrorBoundary>
                  {activeViewMode === "log" ? (
                    <div className="h-full w-full bg-[#0d1117] p-6 overflow-y-auto font-mono text-xs">
                      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                        <ScrollText className="w-5 h-5 text-[#3fb950]" /> Factual Execution Log Stream
                      </h2>
                      <ExecutionStoryPanel
                        storySteps={storySteps}
                        currentStepIndex={currentStepIndex}
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
                </ErrorBoundary>

                {/* Interactive Practice Mode Overlay */}
                {isPracticeMode && currentStepEvent && (
                  <div className="absolute top-6 left-6 right-6 z-30">
                    <PracticeModeOverlay
                      currentStepEvent={currentStepEvent}
                      onContinue={() => stepNext()}
                    />
                  </div>
                )}
              </div>

              {/* Right Side Inspector Panel */}
              {!isPracticeMode && showAdvancedInspectors && (
                <div className="w-80 h-full bg-[#161b22] p-4 flex flex-col gap-3 overflow-y-auto border-l border-[#30363d] shrink-0">
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
            </div>
          }
        />
      </main>

      {/* Bottom Timeline & Control Bar */}
      <footer className="shrink-0">
        <ControlBar />
      </footer>
    </div>
  );
}
