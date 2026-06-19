from fastapi import FastAPI

from app.routers import health

app = FastAPI(
    title="FutureKawa — Backend siège",
    description="Agrégation multi-pays, proxy API, intégration ERP",
    version="0.1.0",
)

app.include_router(health.router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "backend-siege", "status": "skeleton", "docs": "/docs"}
