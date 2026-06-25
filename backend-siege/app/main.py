import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import consolidation, debug, health, iot, pays
from app.services.country_client import PAYS_CONFIG

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="FutureKawa — Backend siege",
    description="Agregation multi-pays : Colombie (live) + Bresil/Equateur (mocks)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(pays.router, prefix="/api/v1")
app.include_router(consolidation.router, prefix="/api/v1")
app.include_router(iot.router, prefix="/api/v1")
app.include_router(debug.router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "backend-siege",
        "status": "ok",
        "docs": "/docs",
        "pays": ",".join(PAYS_CONFIG.keys()),
    }
