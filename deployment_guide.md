# CodeFlow Production Deployment Guide

This guide provides step-by-step instructions for deploying CodeFlow to production using **Render** (FastAPI Backend) and **Vercel** (Next.js Frontend).

---

## 1. Prerequisites & GitHub Repository Setup

1. Commit your codebase to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial CodeFlow production release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/CodeFlow.git
   git push -u origin main
   ```

---

## 2. Deploy Backend to Render

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ Select **Web Service**.
3. Connect your GitHub repository `CodeFlow`.
4. Configure settings:
   - **Name:** `codeflow-backend`
   - **Region:** Choose nearest region (e.g. Oregon / Frankfurt)
   - **Root Directory:** `services/backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `PYTHON_VERSION`: `3.11.4`
   - `CORS_ORIGINS`: `https://codeflow-web.vercel.app` (or your custom frontend URL)
6. Set Health Check Path: `/health`.
7. Click **Create Web Service**.
8. Copy your deployed backend URL: `https://codeflow-backend.onrender.com`.

---

## 3. Deploy Frontend to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository `CodeFlow`.
4. Configure Project Settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** Edit to `apps/web`
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
5. Add Environment Variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://codeflow-backend.onrender.com` (Your Render Backend URL)
6. Click **Deploy**.

---

## 4. Verification & Health Checks

- **Backend Health Check:**  
  Visit `https://codeflow-backend.onrender.com/health`  
  *Expected Output:* `{"status":"ok","service":"codeflow-backend","version":"1.0.0"}`

- **Frontend E2E Flow:**  
  Open your Vercel URL `https://codeflow-web.vercel.app`.  
  Paste Python code, click **"Visualize Execution"**, and scrub timeline steps to confirm backend communication.

---

## 5. Troubleshooting Guide

* **CORS Error on Frontend:**  
  *Symptom:* `Access to fetch at ... from origin ... has been blocked by CORS policy`.  
  *Fix:* Update `CORS_ORIGINS` environment variable on Render to match your exact Vercel frontend URL, or set `CORS_ORIGINS=*` temporarily.

* **Render Cold Start Latency:**  
  Free tier instances on Render spin down after 15 minutes of inactivity. The first execution request may take ~30 seconds while spinning up. Upgrading to a paid Render Web Service ($7/mo) prevents cold starts.
