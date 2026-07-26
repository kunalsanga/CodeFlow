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

import { Code2, BookOpen, HelpCircle, SlidersHorizontal, Sparkles, Cpu, Eye, Layers, Brain, Lightbulb } from "lucide-react";

type ViewMode = "visualizer" | "memory" | "ai";

export default function Home() {
  const { code, setCode, executionPayload, error: executionError } = useExecutionStore();
  const { currentStepIndex, stepNext } = usePlaybackStore();

  const [isPredictionMode, setIsPredictionMode] = useState<boolean>(false);
  const [showAdvancedInspectors, setShowAdvancedInspectors] = useState<boolean>(false);
  const [activeConceptKey, setActiveConceptKey] = useState<"stack" | "heap" | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>("visualizer");

  // Keyboard navigation shortcuts
  useKeyboardShortcuts(() => setIsPredictionMode(prev => !prev));

  // Run Multi-Stage Semantic Engine on current code
  const semanticDetectionResult = useMemo(() => {
    return AlgorithmDetector.detect(code, 'python');
  }, [code]);

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
    return StepExplainerEngine.generateRationale(null, currentStepIndex, semanticDetectionResult.algorithmType);
  }, [currentStepIndex, semanticDetectionResult.algorithmType]);

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

      {/* Studio Header Navigation */}
      <header className="h-14 bg-[#161b22] border-b border-[#30363d] px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md flex items-center gap-1">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              CodeFlow <span className="text-xs font-semibold px-3 py-0.5 bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Semantic Engine: {semanticDetectionResult.algorithmType} ({(semanticDetectionResult.confidence * 100).toFixed(0)}%)
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">Language-Independent Execution & Algorithm Teaching Platform</p>
          </div>
        </div>

        {/* Studio View Switcher Tabs */}
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

        {/* Action Controls & Sample Code Presets */}
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

          <div className="h-4 w-px bg-[#30363d]" />

          {/* Sample Presets */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-400 mr-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Presets:
            </span>
            <button
              onClick={() => setCode(`from collections import deque\n\ngraph = {0:[1,2], 1:[3,4], 2:[5], 3:[], 4:[5], 5:[]}\nvisited = set()\nq = deque([0])\nwhile q:\n    node = q.popleft()\n    if node in visited: continue\n    visited.add(node)\n    for nxt in graph[node]:\n        q.append(nxt)`)}
              className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 font-semibold px-2 py-1 rounded transition-colors"
            >
              BFS
            </button>

            <button
              onClick={() => setCode(`graph = {0:[1,2], 1:[3], 2:[4], 3:[], 4:[]}\nvisited = set()\n\ndef dfs(node):\n    if node in visited: return\n    visited.add(node)\n    for nxt in graph[node]:\n        dfs(nxt)\n\ndfs(0)`)}
              className="bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 font-semibold px-2 py-1 rounded transition-colors"
            >
              DFS
            </button>

            <button
              onClick={() => setCode(`import heapq\n\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    visited = set()\n    while pq:\n        d, u = heapq.heappop(pq)\n        if u in visited: continue\n        visited.add(u)\n        for v, weight in graph[u]:\n            if dist[v] > dist[u] + weight:\n                dist[v] = dist[u] + weight\n                heapq.heappush(pq, (dist[v], v))\n    return dist\n\ngraph = {'A': [('B', 4), ('C', 2)], 'B': [('C', 1), ('D', 5)], 'C': [('D', 8), ('E', 10)], 'D': [('E', 2)], 'E': []}\ndijkstra(graph, 'A')`)}
              className="bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 font-semibold px-2 py-1 rounded transition-colors"
            >
              Dijkstra
            </button>

            <button
              onClick={() => setCode(`def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    res, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]: res.append(left[i]); i += 1\n        else: res.append(right[j]); j += 1\n    res.extend(left[i:]); res.extend(right[j:])\n    return res\n\nmerge_sort([38, 27, 43, 3, 9, 82, 10])`)}
              className="bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 font-semibold px-2 py-1 rounded transition-colors"
            >
              Merge Sort
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Split View */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Column: Code Editor */}
        <div className={`${showAdvancedInspectors ? "col-span-4" : "col-span-5"} h-full border-r border-[#30363d] overflow-hidden transition-all flex flex-col justify-between`}>
          <CodeEditor activeLineNumber={activeLineNumber} />

          {/* AI Educational Step Rationale Banner */}
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
              detectedAlgorithm={activeViewMode === "memory" ? "generic-memory" : semanticDetectionResult.algorithmType}
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
