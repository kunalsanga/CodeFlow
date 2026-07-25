from fastapi import APIRouter
from app.api.v1.execute import router as execute_router
from app.api.v1.explain import router as explain_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(execute_router, tags=["Execution"])
api_v1_router.include_router(explain_router, tags=["AI Explanation"])
