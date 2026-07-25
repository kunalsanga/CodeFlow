"use client";

import React, { useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, PlayCircle } from "lucide-react";
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
        onClick={executeCode}
        disabled={isExecuting}
        className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors shadow-sm"
      >
        <PlayCircle className="w-4 h-4" />
        {isExecuting ? "Executing..." : "Visualize Execution"}
      </button>

      {/* Center: Playback Controls & Timeline Scrubber */}
      <div className="flex-1 w-full max-w-2xl flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button
            onClick={resetTimeline}
            disabled={!maxSteps}
            title="Reset Timeline"
            className="p-1.5 text-gray-300 hover:text-white hover:bg-[#21262d] rounded disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={stepPrev}
            disabled={!maxSteps || currentStepIndex === 0}
            title="Previous Step"
            className="p-1.5 text-gray-300 hover:text-white hover:bg-[#21262d] rounded disabled:opacity-40"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlayPause}
            disabled={!maxSteps}
            title={isPlaying ? "Pause" : "Play"}
            className="p-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-full disabled:opacity-40"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>
          <button
            onClick={stepNext}
            disabled={!maxSteps || currentStepIndex >= maxSteps - 1}
            title="Next Step"
            className="p-1.5 text-gray-300 hover:text-white hover:bg-[#21262d] rounded disabled:opacity-40"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Slider with Step Metadata */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-300">
            <span>
              {currentEvent ? `Step ${currentStepIndex + 1} | Line ${currentEvent.line_number}` : "Step 0"}
            </span>
            <span className="text-[#79c0ff]">
              {currentEvent ? currentEvent.event_type.toUpperCase() : ""}
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
              className="w-full accent-[#58a6ff] cursor-pointer disabled:opacity-40"
            />
            <span className="text-xs font-mono text-gray-400 min-w-[70px] text-right">
              {maxSteps > 0 ? `${currentStepIndex + 1} / ${maxSteps}` : "0 / 0"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Speed Control Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Speed:</span>
        <select
          value={playbackSpeed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="bg-[#21262d] text-gray-200 border border-[#30363d] text-xs rounded px-2 py-1 focus:outline-none focus:border-[#58a6ff]"
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
