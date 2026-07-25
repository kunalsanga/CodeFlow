# CodeFlow — AI-Powered Interactive Code Execution & Data Structure Visualizer

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React Flow](https://img.shields.io/badge/React_Flow-12.0-ff007a?style=flat-square)](https://reactflow.dev/)
[![Docker](https://img.shields.io/badge/Docker-Sandbox-2496ed?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**CodeFlow** turns static code execution into an interactive, frame-by-frame visual movie. Understand variables, call stack frames, heap memory objects, pointer movements, and AI step summaries in real time.

---

## 🌟 Core Features

- ⚡ **Production-Grade Execution Engine:** Re-entrant safe Python `sys.settrace` tracer capturing stack frames, local scope, and heap objects without `RecursionError` crashes.
- 🎨 **Domain-Specific Visual Renderers:** Specialized interactive renderers for Arrays/Lists (indexed cells), Dictionaries (expandable key-value cards), Class Instance Objects, and Sliding Call Stack Frames.
- 🔍 **Visual Diff Engine:** Automatically computes frame-to-frame state deltas (`arr[2]: 8 → 100`) and renders an educational Step Changes Panel.
- 🧠 **Algorithm Intelligence Layer:** Auto-detects algorithms (Bubble Sort, Binary Search, Recursion Trees) and displays live complexity metrics ($O(N^2)$, $O(\log N)$) and interview guidance.
- 🎓 **Interactive Learning Engine:** Features Prediction Mode challenges (*"What happens next?"*), step-by-step Execution Narrative Stories, and interactive Concept Cards for Stack vs. Heap memory.
- ⌨️ **Keyboard Hotkeys & Accessibility:** Full WCAG 2.1 AA accessibility with keyboard navigation (`Space` Play/Pause, `→` Next, `←` Prev, `R` Reset, `P` Prediction Mode).

---

## 🛠 System Architecture

```
User Code Submission
        │
        ▼
FastAPI Gateway & Hardened Docker Sandbox Container Engine
        │
        ▼
Re-Entrant Safe Python Tracer (sys.settrace)
        │
        ▼
Renderer-Independent Timeline JSON Payload (ITraceEvent[])
        │
        ├──> Algorithm Intelligence Layer (Auto-Detects Bubble Sort / Binary Search / Recursion)
        ├──> Visual Diff Engine (Frame-to-Frame Mutation Highlighting)
        └──> Interactive Learning Engine (Prediction Challenges & Narrative Storyline)
        │
        ▼
React Flow Canvas & Custom Domain Node Renderers (Array, Dict, Object, Stack)
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Setup Backend Engine
```bash
cd services/backend
pip install -r requirements.txt
py -m uvicorn app.main:app --reload --port 8000
```
*Backend API server will run at `http://localhost:8000` (Health Endpoint: `http://localhost:8000/health`).*

### 2. Setup & Run Frontend Workspace
```bash
cd apps/web
npm install
npm run dev
```
*Frontend workspace will run at `http://localhost:3000`.*

---

## 🧪 Automated Benchmark Testing

Run the execution engine benchmark test suite:
```bash
cd services/backend
py tests/test_runtime_engine.py
```

---

## 🌐 Production Deployment

- **Backend (Render):** Deploy `services/backend` with build command `pip install -r requirements.txt` and start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- **Frontend (Vercel):** Deploy `apps/web` with environment variable `NEXT_PUBLIC_API_URL` pointing to your Render backend URL.

---

## 🤝 Contributing

We welcome open-source contributions! Please check existing issues or submit a pull request for new language tracers (C++, Java, JS) or visual renderers.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
