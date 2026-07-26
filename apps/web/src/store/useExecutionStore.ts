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
  executeCode: (codeToRun?: string) => Promise<void>;
}

const DEFAULT_DIJKSTRA_CODE = `import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        d, u = heapq.heappop(pq)
        if u in visited: continue
        visited.add(u)
        
        for v, weight in graph[u]:
            if dist[v] > dist[u] + weight:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
    return dist

graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('C', 1), ('D', 5)],
    'C': [('D', 8), ('E', 10)],
    'D': [('E', 2)],
    'E': []
}
dijkstra(graph, 'A')`;

export const useExecutionStore = create<IExecutionState>((set, get) => ({
  code: DEFAULT_DIJKSTRA_CODE,
  language: "python",
  isExecuting: false,
  executionPayload: null,
  error: null,

  setCode: (code: string) => set({ code }),
  setLanguage: (language: string) => set({ language }),

  executeCode: async (codeToRun?: string) => {
    const targetCode = codeToRun !== undefined ? codeToRun : get().code;
    const language = get().language;
    if (!targetCode.trim()) return;

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
