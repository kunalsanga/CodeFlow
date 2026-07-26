"use client";

import { useEffect } from "react";
import { usePlaybackStore } from "@/store/usePlaybackStore";

export function useKeyboardShortcuts(onTogglePrediction?: () => void) {
  const { togglePlayPause, stepNext, stepPrev, resetTimeline, setStep, maxSteps } = usePlaybackStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore key events when user is typing inside Monaco editor or input fields
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest(".monaco-editor"))
      ) {
        return;
      }

      switch (event.key) {
        case " ":
          event.preventDefault();
          togglePlayPause();
          break;
        case "ArrowRight":
          event.preventDefault();
          stepNext();
          break;
        case "ArrowLeft":
          event.preventDefault();
          stepPrev();
          break;
        case "Home":
        case "r":
        case "R":
          event.preventDefault();
          resetTimeline();
          break;
        case "End":
          event.preventDefault();
          setStep(Math.max(0, maxSteps - 1));
          break;
        case "p":
        case "P":
          if (onTogglePrediction) {
            event.preventDefault();
            onTogglePrediction();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, stepNext, stepPrev, resetTimeline, setStep, maxSteps, onTogglePrediction]);
}
