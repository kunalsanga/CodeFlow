import { create } from "zustand";

interface IPlaybackState {
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  maxSteps: number;
  
  setStep: (index: number) => void;
  setMaxSteps: (max: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  setSpeed: (speed: number) => void;
  stepNext: () => void;
  stepPrev: () => void;
  resetTimeline: () => void;
}

export const usePlaybackStore = create<IPlaybackState>((set, get) => ({
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  maxSteps: 0,

  setStep: (index: number) => {
    const { maxSteps } = get();
    const clampedIndex = Math.max(0, Math.min(index, maxSteps > 0 ? maxSteps - 1 : 0));
    set({ currentStepIndex: clampedIndex });
  },

  setMaxSteps: (maxSteps: number) => set({ maxSteps, currentStepIndex: 0, isPlaying: false }),

  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),

  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setSpeed: (playbackSpeed: number) => set({ playbackSpeed }),

  stepNext: () => {
    const { currentStepIndex, maxSteps } = get();
    if (currentStepIndex < maxSteps - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepPrev: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  resetTimeline: () => set({ currentStepIndex: 0, isPlaying: false })
}));
