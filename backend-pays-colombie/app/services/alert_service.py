from __future__ import annotations

import logging
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models import Alerte, Lot, StatutLot, TypeAlerte
from app.services.thresholds import SeuilsPays, conditions_ok, load_anti_spam_minutes, load_seuils_colombie

logger = logging.getLogger(__name__)


def _send_email(subject: str, body: str, to_email: str) -> bool:
    settings = get_settings()
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
            smtp.send_message(msg)
        return True
    except Exception:
        logger.exception("Echec envoi email vers %s", to_email)
        return False


def _recent_alerte_exists(
    db: Session,
    lot_id: str,
    alert_type: TypeAlerte,
    within_minutes: int,
) -> bool:
    since = datetime.now(timezone.utc) - timedelta(minutes=within_minutes)
    return (
        db.query(Alerte)
        .filter(
            and_(
                Alerte.lot_id == lot_id,
                Alerte.type == alert_type,
                Alerte.created_at >= since,
            )
        )
        .first()
        is not None
    )


def evaluate_conditions_for_entrepot(
    db: Session,
    entrepot_id: str,
    temperature: float,
    humidite: float,
    seuils: SeuilsPays | None = None,
) -> None:
    seuils = seuils or load_seuils_colombie()
    anti_spam = load_anti_spam_minutes()
    lots = (
        db.query(Lot)
        .filter(Lot.entrepot_id == entrepot_id, Lot.statut != StatutLot.perime)
        .all()
    )

    if conditions_ok(temperature, humidite, seuils):
        for lot in lots:
            if lot.statut == StatutLot.alerte:
                lot.statut = StatutLot.conforme
        db.commit()
        return

    message = (
        f"Conditions hors plage pour l'entrepot {entrepot_id}: "
        f"T={temperature:.1f}°C (attendu {seuils.temp_min}-{seuils.temp_max}), "
        f"H={humidite:.1f}% (attendu {seuils.hum_min}-{seuils.hum_max})."
    )

    for lot in lots:
        lot.statut = StatutLot.alerte
        if _recent_alerte_exists(db, lot.id, TypeAlerte.conditions_non_ideales, anti_spam):
            continue

        alerte = Alerte(
            type=TypeAlerte.conditions_non_ideales,
            lot_id=lot.id,
            pays=lot.pays,
            message=message,
            resolue=False,
        )
        db.add(alerte)
        db.flush()

        subject = f"[FutureKawa ALERTE] Conditions stockage — {lot.pays} — Lot {lot.id}"
        if _send_email(subject, message, seuils.email):
            alerte.email_envoye = True

    db.commit()


def check_peremption(db: Session, peremption_jours: int) -> int:
    seuils = load_seuils_colombie()
    anti_spam = 24 * 60
    limit = datetime.now(timezone.utc) - timedelta(days=peremption_jours)
    lots = (
        db.query(Lot)
        .filter(Lot.date_stockage <= limit, Lot.statut != StatutLot.perime)
        .all()
    )

    count = 0
    for lot in lots:
        lot.statut = StatutLot.perime
        if _recent_alerte_exists(db, lot.id, TypeAlerte.peremption, anti_spam):
            continue

        message = (
            f"Lot {lot.id} en stock depuis plus de {peremption_jours} jours "
            f"(entree: {lot.date_stockage.date()})."
        )
        alerte = Alerte(
            type=TypeAlerte.peremption,
            lot_id=lot.id,
            pays=lot.pays,
            message=message,
            resolue=False,
        )
        db.add(alerte)
        db.flush()

        subject = f"[FutureKawa ALERTE] Peremption stock — {lot.pays} — Lot {lot.id}"
        if _send_email(subject, message, seuils.email):
            alerte.email_envoye = True
        count += 1

    db.commit()
    return count
