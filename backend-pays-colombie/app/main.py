import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.database import Base, SessionLocal, engine
from app.routers import alertes, health, lots, mesures
from app.seed import seed_demo_data
from app.services.alert_service import check_peremption
from app.services.mqtt_subscriber import mqtt_subscriber
from app.services.scheduler import start_scheduler, stop_scheduler
from app.services.thresholds import load_peremption_jours

logger = logging.getLogger(__name__)


def _wait_for_db(retries: int = 30, delay: float = 2.0) -> None:
    from sqlalchemy import text

    for attempt in range(retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return
        except Exception:
            logger.warning("PostgreSQL indisponible (%s/%s)...", attempt + 1, retries)
            time.sleep(delay)
    raise RuntimeError("Impossible de se connecter a PostgreSQL")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    logging.basicConfig(level=logging.INFO)
    _wait_for_db()
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_demo_data(db)
    finally:
        db.close()

    db = SessionLocal()
    try:
        check_peremption(db, load_peremption_jours())
    finally:
        db.close()

    mqtt_subscriber.start()
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(
    title="FutureKawa — Backend pays Colombie",
    description="API locale : lots, mesures IoT, alertes (MSPR TPRE814)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(lots.router, prefix="/api/v1")
app.include_router(mesures.router, prefix="/api/v1")
app.include_router(alertes.router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "backend-pays-colombie",
        "status": "ok",
        "docs": "/docs",
    }
