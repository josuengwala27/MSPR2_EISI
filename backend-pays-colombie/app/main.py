from fastapi import FastAPI

from app.routers import health

app = FastAPI(
    title="FutureKawa — Backend pays Colombie",
    description="API locale : lots, mesures IoT, alertes (MSPR TPRE814)",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.include_router(health.router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "backend-pays-colombie",
        "status": "skeleton",
        "docs": "/docs",
    }
