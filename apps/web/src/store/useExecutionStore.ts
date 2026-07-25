import { create } from "zustand";
import { IExecutionPayload } from "@/types/trace";
import { getApiUrl } from "@/lib/apiClient";

interface IExecutionState {
  code: string;
  language: string;
  isExecuting: boolean;
  executionPayload: IExecutionPayload | null;
  error: string | null;
  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  executeCode: () => Promise<void>;
}

const DEFAULT_PYTHON_CODE = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(3)
print("Fibonacci result:", result)
`;

export const useExecutionStore = create<IExecutionState>((set, get) => ({
  code: DEFAULT_PYTHON_CODE,
  language: "python",
  isExecuting: false,
  executionPayload: null,
  error: null,

  setCode: (code: string) => set({ code }),
  setLanguage: (language: string) => set({ language }),

  executeCode: async () => {
    const { code, language } = get();
    if (!code.trim()) return;

    set({ isExecuting: true, error: null });

    try {
      const response = await fetch(getApiUrl("/api/v1/execute"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language })
      });

      if (!response.ok) {
        throw new Error(`Execution request failed with status: ${response.status}`);
      }

      const data: IExecutionPayload = await response.json();

      if (data.status === "error" && !data.trace.length) {
        set({ error: data.error || "Execution failed", executionPayload: null, isExecuting: false });
      } else {
        set({ executionPayload: data, isExecuting: false, error: null });
      }
    } catch (err: any) {
      set({
        error: err.message || "Failed to reach backend execution engine.",
        isExecuting: false,
        executionPayload: null
      });
    }
  }
}));
