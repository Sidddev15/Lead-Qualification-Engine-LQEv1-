from fastapi import FastAPI
from .core.config import settings
from .api.health import router as health_router
from .api.pipeline import router as pipeline_router

app = FastAPI(
    title="LQE Worker",
    version="0.1.0",
    description="FastAPI worker for Lead Qualification Engine",
)

app.include_router(health_router, prefix="")
app.include_router(pipeline_router, prefix="")


# For uvicorn CLI
def get_app():
    return app
