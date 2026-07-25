# CodeFlow — Permanent Project Intelligence & Architecture Memory (`memory.md`)

**Document Version:** 2.0.0  
**Project:** CodeFlow — AI-Powered Code Execution & Data Structure Visualizer  
**Role:** Permanent Brain & System Memory  

---

## 1. REPOSITORY DISCOVERY & DIRECTORY TREE

### 1.1 Complete Repository Tree
```
CodeFlow/
├── apps/
│   └── web/                         # Frontend Application (Next.js 14/15 App Router)
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
│       │   ├── lib/                 # Utility Libraries, API Client & Normalizer
│       │   │   ├── apiClient.ts
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
    └── backend/                     # Modular Execution Engine & FastAPI Backend
        ├── app/
        │   ├── ai/                  # AI Explanation Synthesizers
        │   │   └── explainer.py
        │   ├── api/                 # FastAPI REST Endpoints & Routers
        │   │   └── v1/
        │   │       ├── execute.py
        │   │       ├── explain.py
        │   │       └── router.py
        │   ├── engine/              # Production Runtime Execution Engine
        │   │   ├── event_system.py  # Semantic Event Detector (VARIABLE_CREATED, FUNCTION_CALLED, etc.)
        │   │   ├── executor.py      # Code Execution Entrypoint
        │   │   ├── memory_model.py  # Safe Heap Graph & Object Serialization Engine
        │   │   ├── models.py        # Data Classes & Renderer-Agnostic JSON Schemas
        │   │   ├── sandbox_runner.py# Sandbox Isolation & Timeout Runner
        │   │   ├── timeline.py      # Independent Timeline Payload Generator
        │   │   └── tracer.py        # Re-Entrant Safe PythonTracer (sys.settrace)
        │   ├── schemas/             # Pydantic Request/Response Models
        │   │   ├── request.py
        │   │   └── response.py
        │   └── main.py              # FastAPI Server Entrypoint & CORS Config
        ├── sandbox/                 # Hardened Docker Container Environment
        │   ├── Dockerfile.sandbox
        │   └── runner_script.py
        ├── tests/                   # Engine Automated Test Suite
        │   └── test_runtime_engine.py
        ├── Procfile                 # Render Deployment Process File
        ├── render.yaml              # Render Deployment Blueprint
        └── requirements.txt         # Python Package Requirements
```

---

## 2. PRODUCTION RUNTIME EXECUTION ENGINE ARCHITECTURE

### 2.1 Engine Module Responsibilities

| Module | Responsibility | Safety & Performance Measures |
| :--- | :--- | :--- |
| **`models.py`** | Renderer-independent timeline data schemas (`TimelineFrameModel`, `StackFrameModel`, `HeapObjectModel`, `SemanticEventModel`). | Enforces typing, backward compatibility with React Flow canvas. |
| **`memory_model.py`** | Safe memory extractor for primitives, sequences, mappings, objects, and functions. | Prevents `RecursionError` using `visited_obj_ids` cycle-detection and depth capping. |
| **`event_system.py`** | Detects semantic runtime events (`VARIABLE_CREATED`, `VARIABLE_UPDATED`, `FUNCTION_CALLED`, `PRINT`). | State diffing between execution steps. |
| **`tracer.py`** | `sys.settrace` callback engine. | Re-entrancy guard `_is_tracing_active` & `sys.settrace(None)` during inspection prevents tracer-self-tracing. |
| **`timeline.py`** | Standardized playback payload generator. | Decouples engine logic from frontend rendering layers. |
| **`executor.py`** | Code compilation and tracer orchestration entrypoint. | Compiles and executes user Python scripts. |

---

## 3. VERIFICATION BENCHMARK SUITE

Automated tests in `services/backend/tests/test_runtime_engine.py` verify 100% pass rate:

1. **`test_1_hello_world`**: Verifies stdout string output capture.
2. **`test_2_basic_arithmetic`**: Verifies primitive variable mutations (`x=5`, `y=10`, `z=x+y`).
3. **`test_3_for_loop`**: Verifies iterative loop execution steps.
4. **`test_4_conditionals`**: Verifies branch evaluation (`if x > 5`).
5. **`test_5_functions`**: Verifies function frame push/pop and parameter binding (`add(5, 3)`).
6. **`test_6_recursion_fibonacci`**: Verifies deep recursive function execution (`fib(5)`) without `RecursionError`.
7. **`test_7_circular_references`**: Verifies self-referential heap structures (`a = []; a.append(a)`) without infinite serialization loops.

---
**End of CodeFlow Memory Specification Document (`memory.md`)**
