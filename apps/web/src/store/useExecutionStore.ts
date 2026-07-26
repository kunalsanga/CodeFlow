import { create } from "zustand";
import { IExecutionPayload } from "@/types/trace";
import { getApiUrl } from "@/lib/apiClient";
import { usePlaybackStore } from "@/store/usePlaybackStore";

interface IExecutionState {
  code: string;
  language: string;
  isExecuting: boolean;
  executionPayload: IExecutionPayload | null;
  error: string | null;
  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  executeCode: (codeToRun?: string) => Promise<void>;
}

export const useExecutionStore = create<IExecutionState>((set, get) => ({
  code: "",
  language: "python",
  isExecuting: false,
  executionPayload: null,
  error: null,

  setCode: (code: string) => set({ code }),
  setLanguage: (language: string) => set({ language }),

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
        set({ error: data.error || "Execution failed", executionPayload: null, isExecuting: false });
        usePlaybackStore.getState().setMaxSteps(0);
      } else {
        set({ executionPayload: data, isExecuting: false, error: null });
        const stepCount = data.trace ? data.trace.length : 0;
        usePlaybackStore.getState().setMaxSteps(stepCount);
      }
    } catch (err: any) {
      set({
        error: err.message || "Failed to reach backend execution engine.",
        isExecuting: false,
        executionPayload: null
      });
      usePlaybackStore.getState().setMaxSteps(0);
    }
  }
}));
