import logging

from fastapi import FastAPI

from app.routers import consolidation, debug, health, pays
from app.services.country_client import PAYS_CONFIG

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="FutureKawa — Backend siege",
    description="Agregation multi-pays : Colombie (live) + Bresil/Equateur (mocks)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(pays.router, prefix="/api/v1")
app.include_router(consolidation.router, prefix="/api/v1")
app.include_router(debug.router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "backend-siege",
        "status": "ok",
        "docs": "/docs",
        "pays": ",".join(PAYS_CONFIG.keys()),
    }
