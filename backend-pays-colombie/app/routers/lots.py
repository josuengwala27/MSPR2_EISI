from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Lot, StatutLot
from app.schemas import LotCreate, LotResponse, StatutLot as StatutLotSchema

router = APIRouter(prefix="/lots", tags=["lots"])


def _to_response(lot: Lot) -> LotResponse:
    return LotResponse(
        id=lot.id,
        pays=lot.pays,
        exploitation=lot.exploitation,
        entrepot=lot.entrepot_id,
        date_stockage=lot.date_stockage,
        statut=StatutLotSchema(lot.statut.value),
    )


@router.get("", response_model=list[LotResponse])
def list_lots(
    entrepot: str | None = Query(None),
    statut: StatutLotSchema | None = Query(None),
    db: Session = Depends(get_db),
) -> list[LotResponse]:
    """Liste des lots tries par date de stockage ASC (FIFO)."""
    query = db.query(Lot)
    if entrepot:
        query = query.filter(Lot.entrepot_id == entrepot)
    if statut:
        query = query.filter(Lot.statut == StatutLot(statut.value))
    lots = query.order_by(Lot.date_stockage.asc()).all()
    return [_to_response(lot) for lot in lots]


@router.post("", response_model=LotResponse, status_code=status.HTTP_201_CREATED)
def create_lot(payload: LotCreate, db: Session = Depends(get_db)) -> LotResponse:
    if db.get(Lot, payload.id):
        raise HTTPException(status_code=409, detail="Lot deja existant")

    lot = Lot(
        id=payload.id,
        pays=payload.pays,
        exploitation=payload.exploitation,
        entrepot_id=payload.entrepot,
        date_stockage=payload.date_stockage,
        statut=StatutLot.conforme,
    )
    db.add(lot)
    db.commit()
    db.refresh(lot)
    return _to_response(lot)


@router.get("/{lot_id}", response_model=LotResponse)
def get_lot(lot_id: str, db: Session = Depends(get_db)) -> LotResponse:
    lot = db.get(Lot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Lot introuvable")
    return _to_response(lot)
