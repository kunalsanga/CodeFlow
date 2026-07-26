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

  // Derive Concept Milestone Title
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
    <div className="bg-[#161b22] border-t border-[#30363d] px-6 py-2.5 flex items-center justify-between gap-6 z-20 shadow-xl">
      {/* Left: Execution Trigger Button */}
      <button
        onClick={() => executeCode()}
        disabled={isExecuting}
        aria-label="Visualize Code Execution"
        className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-[#3fb950] disabled:opacity-50 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md shrink-0 active:scale-95"
      >
        <PlayCircle className="w-4 h-4 text-white" />
        {isExecuting ? "Executing..." : "Visualize Execution"}
      </button>

      {/* Center: Centered 48px Playback Control Bar & Monospace Step Counter */}
      <div className="flex-1 max-w-3xl flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={resetTimeline}
            disabled={!maxSteps}
            title="Reset Timeline (R / Home)"
            aria-label="Reset Timeline"
            className="w-9 h-9 flex items-center justify-center text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-lg transition-all disabled:opacity-30 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={stepPrev}
            disabled={!maxSteps || currentStepIndex === 0}
            title="Previous Step (Left Arrow)"
            aria-label="Previous Step"
            className="w-9 h-9 flex items-center justify-center text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-lg transition-all disabled:opacity-30 active:scale-95"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Polished 48px Primary Accent Play Button */}
          <button
            onClick={togglePlayPause}
            disabled={!maxSteps}
            title={isPlaying ? "Pause Execution (Space)" : "Play Execution (Space)"}
            aria-label={isPlaying ? "Pause Execution" : "Play Execution"}
            className="w-12 h-12 bg-[#58a6ff] hover:bg-[#79c0ff] active:scale-95 text-[#0d1117] flex items-center justify-center rounded-full shadow-lg transition-all disabled:opacity-40 shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-[#0d1117]" />
            ) : (
              <Play className="w-5 h-5 fill-[#0d1117] ml-0.5" />
            )}
          </button>

          <button
            onClick={stepNext}
            disabled={!maxSteps || currentStepIndex >= maxSteps - 1}
            title="Next Step (Right Arrow)"
            aria-label="Next Step"
            className="w-9 h-9 flex items-center justify-center text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-lg transition-all disabled:opacity-30 active:scale-95"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Concept Milestone Header & Monospace Step Scrubber Slider */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 font-semibold text-[#58a6ff] truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#d29922] shrink-0" />
              {conceptMilestone}
            </span>
            <span className="text-[#8b949e] font-mono text-[11px] shrink-0 ml-2">
              {maxSteps > 0 ? `Step ${currentStepIndex + 1} of ${maxSteps}` : "Step 0 of 0"}
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
              className="w-full accent-[#58a6ff] h-1.5 bg-[#30363d] rounded-lg cursor-pointer disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
            />
          </div>
        </div>
      </div>

      {/* Right: Clean Dropdown Speed Selector */}
      <div className="flex items-center gap-2 shrink-0">
        <label htmlFor="playback-speed-select" className="text-xs font-medium text-[#8b949e]">
          Speed:
        </label>
        <select
          id="playback-speed-select"
          value={playbackSpeed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          aria-label="Select Playback Speed"
          className="bg-[#21262d] text-[#e6edf3] border border-[#30363d] text-xs font-mono font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#58a6ff] cursor-pointer"
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

export default ControlBar;
