from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Lot, Mesure
from app.schemas import MesureResponse

router = APIRouter(tags=["mesures"])


def _mesure_to_response(m: Mesure) -> MesureResponse:
    return MesureResponse(
        id=m.id,
        entrepot=m.entrepot_id,
        lot_id=m.lot_id,
        temperature=m.temperature,
        humidite=m.humidite,
        horodatage=m.horodatage,
        device_id=m.device_id,
    )


@router.get("/lots/{lot_id}/mesures", response_model=list[MesureResponse])
def list_mesures_lot(
    lot_id: str,
    depuis: datetime | None = Query(None),
    db: Session = Depends(get_db),
) -> list[MesureResponse]:
    lot = db.get(Lot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Lot introuvable")

    query = db.query(Mesure).filter(
        Mesure.entrepot_id == lot.entrepot_id,
        Mesure.horodatage >= (depuis or lot.date_stockage),
    )
    mesures = query.order_by(Mesure.horodatage.asc()).all()
    return [_mesure_to_response(m) for m in mesures]


@router.get("/mesures/dernieres", response_model=MesureResponse)
def derniere_mesure(
    entrepot: str = Query(...),
    db: Session = Depends(get_db),
) -> MesureResponse:
    mesure = (
        db.query(Mesure)
        .filter(Mesure.entrepot_id == entrepot)
        .order_by(Mesure.horodatage.desc())
        .first()
    )
    if not mesure:
        raise HTTPException(status_code=404, detail="Aucune mesure pour cet entrepot")
    return _mesure_to_response(mesure)
