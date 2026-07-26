import { create } from "zustand";
import { IExecutionPayload } from "@/types/trace";
import { getApiUrl } from "@/lib/apiClient";
import { usePlaybackStore } from "@/store/usePlaybackStore";

interface IExecutionState {
  code: string;
  language: string;
  isExecuting: boolean;
  hasExecuted: boolean;
  executionPayload: IExecutionPayload | null;
  error: string | null;
  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  executeCode: (codeToRun?: string) => Promise<void>;
  resetExecutionState: () => void;
}

export const useExecutionStore = create<IExecutionState>((set, get) => ({
  code: "",
  language: "python",
  isExecuting: false,
  hasExecuted: false,
  executionPayload: null,
  error: null,

  setCode: (code: string) => set({ code, hasExecuted: false }),
  setLanguage: (language: string) => set({ language, hasExecuted: false }),

  resetExecutionState: () => set({ hasExecuted: false, executionPayload: null, error: null }),

  executeCode: async (codeToRun?: string) => {
    const targetCode = codeToRun !== undefined ? codeToRun : get().code;
    const language = get().language;
    if (!targetCode || !targetCode.trim()) return;

    set({ code: targetCode, isExecuting: true, error: null });

    try {
      const response = await fetch(getApiUrl("/api/v1/execute"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: targetCode, language })
      });

      if (!response.ok) {
        throw new Error(`Execution request failed with status: ${response.status}`);
      }

      const data: IExecutionPayload = await response.json();

      if (data.status === "error" && (!data.trace || !data.trace.length)) {
        set({ error: data.error || "Execution failed", executionPayload: null, isExecuting: false, hasExecuted: true });
        usePlaybackStore.getState().setMaxSteps(0);
      } else {
        set({ executionPayload: data, isExecuting: false, hasExecuted: true, error: null });
        const stepCount = data.trace ? data.trace.length : 0;
        usePlaybackStore.getState().setMaxSteps(stepCount);
      }
    } catch (err: any) {
      set({
        error: err.message || "Failed to reach backend execution engine.",
        isExecuting: false,
        hasExecuted: true,
        executionPayload: null
      });
      usePlaybackStore.getState().setMaxSteps(0);
    }
  }
}));
