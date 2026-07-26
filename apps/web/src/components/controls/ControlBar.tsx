"use client";

import React, { useEffect, useMemo } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, PlayCircle, Sparkles } from "lucide-react";
import { useExecutionStore } from "@/store/useExecutionStore";
import { usePlaybackStore } from "@/store/usePlaybackStore";

export const ControlBar: React.FC = () => {
  const { executeCode, isExecuting, executionPayload } = useExecutionStore();
  const {
    currentStepIndex,
    isPlaying,
    playbackSpeed,
    maxSteps,
    togglePlayPause,
    stepNext,
    stepPrev,
    setStep,
    setSpeed,
    setMaxSteps,
    resetTimeline
  } = usePlaybackStore();

  const currentEvent = executionPayload?.trace?.[currentStepIndex];

  // Derive Concept Milestone Title (e.g. "Comparing elements", "Swapping", "Function Call")
  const conceptMilestone = useMemo(() => {
    if (!currentEvent) return "Ready to Visualize";

    if (currentEvent.event_type === "call") {
      const funcName = currentEvent.stack_frames[currentEvent.stack_frames.length - 1]?.function_name || "function";
      return `Function Call \`${funcName}()\``;
    }
    if (currentEvent.event_type === "return") {
      return "Returning from frame";
    }
    if (currentEvent.heap_objects && Object.keys(currentEvent.heap_objects).length > 0) {
      return `Mutating RAM Heap Memory (Line ${currentEvent.line_number})`;
    }

    return `Executing Line ${currentEvent.line_number}`;
  }, [currentEvent]);

  // Sync max steps when execution payload changes
  useEffect(() => {
    if (executionPayload && executionPayload.trace) {
      setMaxSteps(executionPayload.trace.length);
    }
  }, [executionPayload, setMaxSteps]);

  // Handle auto playback interval
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(100, 1000 / playbackSpeed);
    const timer = setInterval(() => {
      stepNext();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, stepNext]);

  return (
    <div className="bg-[#161b22] border-t border-[#30363d] px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 z-20 shadow-lg">
      {/* Left: Execution Trigger */}
      <button
        onClick={() => executeCode()}
        disabled={isExecuting}
        aria-label="Visualize Code Execution"
        className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors shadow-sm"
      >
        <PlayCircle className="w-4 h-4" />
        {isExecuting ? "Executing..." : "Visualize Execution"}
      </button>

      {/* Center: Playback Controls & Concept Timeline Scrubber */}
      <div className="flex-1 w-full max-w-2xl flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button
            onClick={resetTimeline}
            disabled={!maxSteps}
            title="Reset Timeline (R)"
            aria-label="Reset Timeline"
            className="p-1.5 text-gray-300 hover:text-white hover:bg-[#21262d] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] rounded disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={stepPrev}
            disabled={!maxSteps || currentStepIndex === 0}
            title="Previous Step (Left Arrow)"
            aria-label="Previous Step"
            className="p-1.5 text-gray-300 hover:text-white hover:bg-[#21262d] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] rounded disabled:opacity-40"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlayPause}
            disabled={!maxSteps}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            aria-label={isPlaying ? "Pause Execution" : "Play Execution"}
            className="p-2 bg-[#1f6feb] hover:bg-[#388bfd] focus:outline-none focus:ring-2 focus:ring-blue-400 text-white rounded-full disabled:opacity-40"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>
          <button
            onClick={stepNext}
            disabled={!maxSteps || currentStepIndex >= maxSteps - 1}
            title="Next Step (Right Arrow)"
            aria-label="Next Step"
            className="p-1.5 text-gray-300 hover:text-white hover:bg-[#21262d] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] rounded disabled:opacity-40"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Concept Milestone Header & Scrubber Slider */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-mono text-gray-200">
            <span className="flex items-center gap-1.5 font-bold text-[#79c0ff]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {conceptMilestone}
            </span>
            <span className="text-gray-400 text-[11px]">
              {maxSteps > 0 ? `${currentStepIndex + 1} of ${maxSteps}` : "0 / 0"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={Math.max(0, maxSteps - 1)}
              value={currentStepIndex}
              onChange={(e) => setStep(Number(e.target.value))}
              disabled={!maxSteps}
              aria-label="Timeline Scrubber Slider"
              className="w-full accent-[#58a6ff] cursor-pointer disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#58a6ff] rounded"
            />
          </div>
        </div>
      </div>

      {/* Right: Speed Control Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="playback-speed-select" className="text-xs text-gray-400">Speed:</label>
        <select
          id="playback-speed-select"
          value={playbackSpeed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          aria-label="Select Playback Speed"
          className="bg-[#21262d] text-gray-200 border border-[#30363d] text-xs rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
        >
          <option value={0.25}>0.25x</option>
          <option value={0.5}>0.5x</option>
          <option value={1}>1.0x</option>
          <option value={2}>2.0x</option>
          <option value={4}>4.0x</option>
        </select>
      </div>
    </div>
  );
};
