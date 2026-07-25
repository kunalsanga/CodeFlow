# CodeFlow — AI-Powered Code Execution & Data Structure Visualizer

CodeFlow turns code execution into an interactive, frame-by-frame visual movie. Understand variables, function stack frames, heap memory objects, pointer movements, and AI step summaries in real time.

---

## 🌟 Tech Stack

- **Frontend:** Next.js 14/15, React 18/19, TypeScript, Tailwind CSS, Monaco Editor, React Flow (`@xyflow/react`), Framer Motion, Zustand
- **Backend:** FastAPI, Python 3.11+, Pydantic v2, Uvicorn, Docker
- **Deployment:** Vercel (Frontend) + Render (Backend)

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Setup Backend
```bash
cd services/backend
pip install -r requirements.txt
py -m uvicorn app.main:app --reload --port 8000
```
*Backend API will be running at `http://localhost:8000` (Health Check: `http://localhost:8000/health`).*

### 2. Setup & Run Frontend
```bash
cd apps/web
npm install
npm run dev
```
*Frontend workspace will be running at `http://localhost:3000`.*

---

## 🛠 Production Deployment

### Deploy Backend to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository and set **Root Directory** to `services/backend`.
3. Set **Runtime** to `Python 3` and **Build Command** to `pip install -r requirements.txt`.
4. Set **Start Command** to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Set Environment Variable `CORS_ORIGINS` to your Vercel URL (e.g., `https://codeflow-web.vercel.app`).

### Deploy Frontend to Vercel
1. Import repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `apps/web`.
3. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://<your-render-backend-url>.onrender.com`
4. Click **Deploy**.

---

## 📄 License
MIT License - see [LICENSE](LICENSE) for details.
