from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from zoneinfo import ZoneInfo

from app.core.database import SessionLocal
from app.services.alert_service import check_peremption
from app.services.thresholds import load_peremption_jours

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(timezone=ZoneInfo("America/Bogota"))


def _job_peremption() -> None:
    db = SessionLocal()
    try:
        jours = load_peremption_jours()
        count = check_peremption(db, jours)
        if count:
            logger.info("Peremption: %s lot(s) alerte(s)", count)
    finally:
        db.close()


def start_scheduler() -> None:
    if scheduler.running:
        return
    scheduler.add_job(
        _job_peremption,
        CronTrigger(hour=6, minute=0, timezone=ZoneInfo("America/Bogota")),
        id="peremption_daily",
        replace_existing=True,
    )
    scheduler.add_job(
        _job_peremption,
        "interval",
        hours=1,
        id="peremption_hourly_demo",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler alertes demarre (peremption 06:00 + controle horaire demo)")


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
