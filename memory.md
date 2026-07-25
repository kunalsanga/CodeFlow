# CodeFlow — Permanent Project Intelligence & Architecture Memory (`memory.md`)

**Document Version:** 1.0.0  
**Project:** CodeFlow — AI-Powered Code Execution & Data Structure Visualizer  
**Role:** Permanent Brain & System Memory  

---

## 1. REPOSITORY DISCOVERY & DIRECTORY TREE

### 1.1 Complete Repository Tree
```
CodeFlow/
├── apps/
│   └── web/                         # Frontend Application (Next.js 15 App Router)
│       ├── public/                  # Static assets & favicons
│       ├── src/
│       │   ├── app/                 # Next.js App Router Pages & Layouts
│       │   │   ├── layout.tsx       # Root HTML & Dark Mode Layout
│       │   │   └── page.tsx         # Main CodeFlow Workspace Dashboard
│       │   ├── components/          # React Presentation & Layout Components
│       │   │   ├── controls/        # Timeline Playback Controls
│       │   │   │   └── ControlBar.tsx
│       │   │   ├── editor/          # Code Editor Integrations
│       │   │   │   └── CodeEditor.tsx
│       │   │   ├── inspectors/      # Scope, AI, & Output Inspector Panels
│       │   │   │   ├── AICompanionPanel.tsx
│       │   │   │   ├── ConsoleOutput.tsx
│       │   │   │   └── VariableInspector.tsx
│       │   │   └── visualizer/      # Canvas & Memory Visualizer Engines
│       │   │       └── VisualizerCanvas.tsx
│       │   ├── lib/                 # Utility Libraries & Normalizers
│       │   │   └── traceNormalizer.ts
│       │   ├── store/               # State Management (Zustand)
│       │   │   ├── useExecutionStore.ts
│       │   │   └── usePlaybackStore.ts
│       │   ├── styles/              # Global Stylesheets & Tailwind Config
│       │   │   └── globals.css
│       │   └── types/               # Strict TypeScript Interface Contracts
│       │       ├── execution.ts
│       │       └── trace.ts
│       ├── next.config.mjs          # Next.js Runtime Settings
│       ├── package.json             # Frontend Dependencies & NPM Scripts
│       ├── postcss.config.mjs       # PostCSS Tailwind Configuration
│       ├── tailwind.config.js       # Tailwind CSS Color System & Tokens
│       └── tsconfig.json            # Strict TypeScript Settings
│
└── services/
    └── backend/                     # Backend Execution Engine (FastAPI & Python Sandbox)
        ├── app/
        │   ├── ai/                  # AI Explanation Synthesizers
        │   │   └── explainer.py
        │   ├── api/                 # FastAPI REST Endpoints & Routers
        │   │   └── v1/
        │   │       ├── execute.py
        │   │       ├── explain.py
        │   │       └── router.py
        │   ├── engine/              # Core Tracer & Sandbox Runners
        │   │   ├── sandbox_runner.py
        │   │   └── tracer_python.py
        │   ├── schemas/             # Pydantic Request/Response Models
        │   │   ├── request.py
        │   │   └── response.py
        │   └── main.py              # FastAPI Server Entrypoint & CORS Config
        ├── sandbox/                 # Hardened Docker Container Environment
        │   ├── Dockerfile.sandbox
        │   └── runner_script.py
        ├── requirements.txt         # Python Package Requirements
        └── test_tracer.py           # Verification Test Suite for Tracer
```

### 1.2 Folder Responsibilities & Dependencies

| Folder | Purpose & Responsibility | Key Dependencies | Connected Systems |
| :--- | :--- | :--- | :--- |
| `apps/web/src/app` | Next.js 15 App Router pages & root layout wrapper. | React 19, Next.js | Monaco, Visualizer, Stores |
| `apps/web/src/components/editor` | Monaco Code Editor wrapper with line highlighting. | `@monaco-editor/react` | `useExecutionStore`, `usePlaybackStore` |
| `apps/web/src/components/visualizer` | React Flow Canvas for Stack/Heap diagram rendering. | `@xyflow/react`, `framer-motion` | `traceNormalizer.ts` |
| `apps/web/src/components/controls` | Timeline scrubber bar, play/pause, and speed selection. | `lucide-react`, Zustand | `usePlaybackStore` |
| `apps/web/src/components/inspectors` | AI step explanation, variable scope table, and console. | `lucide-react` | FastAPI `/api/v1/explain-step` |
| `apps/web/src/store` | Zustand atomic stores for execution & playback timeline. | `zustand` | All UI components |
| `services/backend/app/engine` | Python `sys.settrace` execution tracer & sandbox. | Python standard library | FastAPI Execute Endpoint |
| `services/backend/app/ai` | Plain-English AI step summary synthesizer. | Python string/regex | FastAPI Explain Endpoint |
| `services/backend/app/api/v1` | FastAPI REST API controllers & router endpoints. | `fastapi`, `pydantic` | Next.js Client Proxy |
| `services/backend/sandbox` | Hardened Docker sandbox build context. | Docker, Linux cgroups v2 | `sandbox_runner.py` |

---

## 2. TECHNOLOGY DETECTION

| Layer | Detected Technology | Version / Specification | Role in System |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | `15.0.0-rc.0` | React Server Components, Client Workspace SPA |
| **UI Library** | React | `19.0.0-rc.0` | Declarative UI component tree |
| **Code Editor** | Monaco Editor | `^4.6.0` | In-browser code editing & line decoration |
| **Canvas / Diagrams** | React Flow (`@xyflow/react`) | `^12.0.0-next.0` | Node/Edge canvas rendering for Stack & Heap |
| **Animation Engine** | Framer Motion | `^11.0.8` | Smooth 60fps canvas state transitions |
| **State Management** | Zustand | `^4.5.2` | Atomic client state stores (`usePlaybackStore`) |
| **Styling** | Tailwind CSS | `^3.4.1` | Dark-mode design system & layout styling |
| **Backend Framework** | FastAPI | `>=0.110.0` | High-performance Python async REST API |
| **Execution Engine** | Python `sys.settrace` | Python `3.11+` | Step-by-step runtime frame & memory tracer |
| **Data Validation** | Pydantic | `>=2.6.0` | Strict API request/response validation |
| **Container Sandbox** | Docker | Linux Debian/Bookworm | Isolated, non-networked execution runtime |

---

## 3. PROJECT PURPOSE

### 3.1 Business Problem Solved
Traditional IDEs execute code instantly or hit static breakpoints, leaving beginners, students, and interview candidates blind to how memory changes, how recursion stacks grow and shrink, and how references point to heap structures. CodeFlow turns code execution into an animated, frame-by-frame visual movie.

### 3.2 User Workflow
1. User writes or pastes Python code into the Monaco Editor.
2. User clicks **"Visualize Execution"**.
3. Frontend dispatches code to backend sandbox `/api/v1/execute`.
4. Python Tracer captures statement steps, stack frames, local variables, heap references, and stdout into a normalized `ITraceEvent[]` payload.
5. Frontend populates Zustand stores and renders step 0 on the React Flow Canvas.
6. User scrubs the timeline or presses **Play** to step forward/backward through execution while the AI Companion explains each line mutation.

---

## 4. SYSTEM ARCHITECTURE

```
+-----------------------------------------------------------------------------------+
|                                CLIENT TIER (Vercel)                               |
|                                                                                   |
|  +---------------------+   +-----------------------+   +-----------------------+  |
|  | Monaco Code Editor  |   |  React Flow Canvas    |   |  AI Companion Panel   |  |
|  +---------------------+   +-----------------------+   +-----------------------+  |
|             │                          ▲                           ▲              |
|             ▼                          │                           │              |
|  +-----------------------------------------------------------------------------+  |
|  |             Zustand Stores (useExecutionStore & usePlaybackStore)           |  |
|  +-----------------------------------------------------------------------------+  |
+---------------------------------------│-------------------------------------------+
                                        │
                               HTTP REST (JSON)
                                        │
+---------------------------------------▼-------------------------------------------+
|                            BACKEND TIER (FastAPI on Render)                       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                       FastAPI Gateway Router (/api/v1)                      |  |
|  +-----------------------------------------------------------------------------+  |
|             │                                                  │                  |
|             ▼                                                  ▼                  |
|  +------------------------+                          +-------------------------+  |
|  | Sandbox Execution Engine|                          | AI Explanation Synthesizer| |
|  |  (Python sys.settrace) |                          | (Rule-based + LLM API)  |  |
|  +------------------------+                          +-------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 5. ROUTING INTELLIGENCE

### 5.1 Frontend Routes (Next.js 15 App Router)

| Route | File Path | Type | Purpose | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `apps/web/src/app/page.tsx` | Page (Client SPA) | Main CodeFlow Workspace Dashboard | No |

### 5.2 Backend API Routes (FastAPI v1 Router)

| Method | Route Path | Controller File | Purpose | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | `services/backend/app/main.py` | Health check & service info | No |
| `POST` | `/api/v1/execute` | `services/backend/app/api/v1/execute.py` | Safely execute Python code & return step trace | No |
| `POST` | `/api/v1/explain-step` | `services/backend/app/api/v1/explain.py` | Synthesize plain-English step explanation | No |

---

## 6. FRONTEND ANALYSIS

### 6.1 Component Hierarchy Map

```
[ RootLayout (layout.tsx) ]
 └── [ Home Page (page.tsx) ]
      ├── [ Header Navbar ]
      │    ├── Logo & Title Badge
      │    └── Template Preset Buttons (Fibonacci, Bubble Sort, Object Ref)
      │
      ├── [ Main Split View ]
      │    ├── [ Left Pane: CodeEditor.tsx ] (Monaco Editor + Active Line Decorator)
      │    ├── [ Center Pane: VisualizerCanvas.tsx ] (React Flow Stack & Heap Nodes)
      │    └── [ Right Pane: Inspector Sidebar ]
      │         ├── AICompanionPanel.tsx
      │         ├── VariableInspector.tsx
      │         └── ConsoleOutput.tsx
      │
      └── [ Footer: ControlBar.tsx ] (Timeline Slider, Play/Pause, Speed Controls)
```

### 6.2 State Management Architecture (Zustand)

* **`useExecutionStore`**: Manages `code`, `language`, `isExecuting`, `executionPayload`, and execution `error`. Handles async POST requests to `/api/v1/execute`.
* **`usePlaybackStore`**: Manages `currentStepIndex`, `isPlaying`, `playbackSpeed`, `maxSteps`, and provides stepping functions (`stepNext()`, `stepPrev()`, `seekTo()`, `togglePlayPause()`).

---

## 7. BACKEND ANALYSIS

### 7.1 Execution Engine (`tracer_python.py`)
Uses Python's `sys.settrace()` callback hook to inspect every execution frame (`line`, `call`, `return`).
* **Primitives vs References:** Converts `int`, `float`, `str`, `bool`, `None` to primitive values. Converts `list`, `dict`, `set`, and custom objects into reference pointers targeting heap mapping objects (`ref_14029103`).
* **Frame Stack Crawl:** Crawls `frame.f_back` to construct active call stack hierarchy.

### 7.2 API Inventory

| Method | Route | Request Payload | Response Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/execute` | `{ "language": "python", "code": "..." }` | `{ "status": "success", "total_steps": 25, "trace": [...], "stdout": "..." }` |
| `POST` | `/api/v1/explain-step` | `{ "code_snippet": "...", "current_step": {...} }` | `{ "step_index": 3, "explanation": "...", "key_takeaway": "..." }` |

---

## 8. DATABASE INTELLIGENCE

* **Current Architecture:** Stateless, in-memory execution model. No persistent database required for MVP code execution. Execution payloads exist strictly during client sessions.
* **Future Expansion Schema (PostgreSQL):** For saved projects and user accounts:
  * `users` (id, email, created_at)
  * `projects` (id, user_id, title, code, language, created_at)
  * `execution_snapshots` (id, project_id, trace_data_json)

---

## 9. DATA FLOW ANALYSIS

```
[User Clicks "Visualize Execution"]
              │
              ▼
1. Monaco Editor retrieves current `code` string
              │
              ▼
2. `useExecutionStore.executeCode()` dispatches HTTP POST -> `/api/v1/execute`
              │
              ▼
3. FastAPI Gateway invokes `execute_code_in_sandbox()`
              │
              ▼
4. `PythonTracer` runs code via `sys.settrace`, capturing `ITraceEvent[]`
              │
              ▼
5. Backend returns `IExecutionPayload` JSON response to client
              │
              ▼
6. Frontend updates `useExecutionStore` and resets `usePlaybackStore` (step = 0)
              │
              ▼
7. `traceNormalizer.ts` converts step event into React Flow Nodes & Edges
              │
              ▼
8. `VisualizerCanvas` & Monaco line decorator animate active line execution at 60fps
```

---

## 10. DEPENDENCY GRAPH & CRITICAL FILES

### Core System Critical Files (Do NOT modify lightly)
1. **`services/backend/app/engine/tracer_python.py`**: Execution tracer engine. Bugs here break step capturing for all Python scripts.
2. **`apps/web/src/lib/traceNormalizer.ts`**: Bridge converting execution trace steps into canvas node graph structures.
3. **`apps/web/src/store/usePlaybackStore.ts`**: Central timeline state engine controlling playback loops and step indexing.
4. **`apps/web/src/types/trace.ts`**: TypeScript interface specification enforcing backend-frontend data contract.

---

## 11. AUTHENTICATION & AUTHORIZATION

* **Current Model:** Public unauthenticated API endpoints with rate limits and execution sandbox caps (500 steps max, 5s process timeout).
* **Planned Auth Stack (Phase 3):** Clerk / Auth.js integrating JWT bearer tokens in HTTP headers (`Authorization: Bearer <token>`).

---

## 12. ENVIRONMENT & CONFIGURATION

| Variable / Setting | Default Value | Purpose |
| :--- | :--- | :--- |
| `PORT` (Backend) | `8000` | FastAPI server listening port |
| `MAX_EXECUTION_STEPS` | `500` | Hard cap on trace steps recorded per request |
| `SANDBOX_TIMEOUT` | `5.0s` | Maximum execution duration before container termination |
| `CORS_ORIGINS` | `*` | Allowed CORS origins for backend API endpoints |

---

## 13. PERFORMANCE CONSIDERATIONS

1. **Trace Payload Size:** Delta encoding prevents duplicate heap objects across execution steps, keeping payloads $< 2\text{MB}$.
2. **Canvas Rendering:** React Flow node virtualization ensures smooth 60fps rendering even for complex call stacks.
3. **Trace Normalization:** `traceNormalizer.ts` is pure and memoized using `useMemo()` to prevent unnecessary layout recalculations.

---

## 14. FEATURE INVENTORY

| Feature Name | Purpose | Frontend Source Files | Backend Source Files |
| :--- | :--- | :--- | :--- |
| **Monaco Code Editor** | Python syntax editing & line decoration | `CodeEditor.tsx` | N/A |
| **Execution Tracer** | Runtime frame & memory state capturing | `useExecutionStore.ts` | `tracer_python.py`, `sandbox_runner.py` |
| **Visualizer Canvas** | Stack frame & heap object diagramming | `VisualizerCanvas.tsx`, `traceNormalizer.ts` | N/A |
| **Timeline Controls** | Play, pause, step next/prev, speed controls | `ControlBar.tsx`, `usePlaybackStore.ts` | N/A |
| **AI Step Companion** | Natural language line mutation summaries | `AICompanionPanel.tsx` | `explainer.py`, `explain.py` |
| **Variable Inspector** | Scope table displaying active variables | `VariableInspector.tsx` | N/A |
| **Console Output** | Captured standard output stream | `ConsoleOutput.tsx` | `tracer_python.py` |

---
**End of CodeFlow Memory Specification Document (`memory.md`)**
