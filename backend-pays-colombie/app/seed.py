from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models import Entrepot, Lot, StatutLot

logger = logging.getLogger(__name__)

ENTREPOT_ID = "ENT-CO-BOGOTA-01"


def seed_demo_data(db: Session) -> None:
    settings = get_settings()
    if not settings.seed_demo_data:
        return

    if db.query(Entrepot).filter(Entrepot.id == ENTREPOT_ID).first():
        return

    entrepot = Entrepot(
        id=ENTREPOT_ID,
        nom="Hub logistique Bogota",
        pays_code="CO",
    )
    db.add(entrepot)

    now = datetime.now(timezone.utc)
    demo_lots = [
        Lot(
            id="LOT-CO-2024-001",
            pays="CO",
            exploitation="EXP-CO-CUNDINAMARCA-01",
            entrepot_id=ENTREPOT_ID,
            date_stockage=now - timedelta(days=400),
            statut=StatutLot.conforme,
        ),
        Lot(
            id="LOT-CO-2026-001",
            pays="CO",
            exploitation="EXP-CO-CUNDINAMARCA-01",
            entrepot_id=ENTREPOT_ID,
            date_stockage=now - timedelta(days=45),
            statut=StatutLot.conforme,
        ),
        Lot(
            id="LOT-CO-2026-002",
            pays="CO",
            exploitation="EXP-CO-ANTIOQUIA-01",
            entrepot_id=ENTREPOT_ID,
            date_stockage=now - timedelta(days=12),
            statut=StatutLot.conforme,
        ),
    ]
    db.add_all(demo_lots)
    db.commit()
    logger.info("Donnees de demo inserees (%s lots)", len(demo_lots))

