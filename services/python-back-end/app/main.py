from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI

from app.api.v1.routes.cv import router as cv_router
from app.api.v1.routes.health import router as health_router
from app.domains.investing.routes.investing import router as investing_router

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

app = FastAPI(title="Valuation API", version="1.0.0")

app.include_router(health_router, prefix="/api/v1", tags=["health"])
app.include_router(cv_router, prefix="/api/v1", tags=["cv"])
app.include_router(investing_router, prefix="/api/v1", tags=["investing"])
