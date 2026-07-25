import sys
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add backend root to sys.path so app module resolves cleanly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_v1_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("codeflow.main")

app = FastAPI(
    title="CodeFlow Backend Engine API",
    description="AI-Powered Code Visualization & Step Execution Engine API",
    version="1.0.0"
)

# Parse CORS Origins from Environment
cors_origins_env = os.getenv("CORS_ORIGINS", "*")
if cors_origins_env == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router)

@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    return {
        "service": "CodeFlow Visualization Engine",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Production health check endpoint for Render monitoring."""
    return {
        "status": "ok",
        "service": "codeflow-backend",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
