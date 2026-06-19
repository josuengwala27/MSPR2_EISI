from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Alerte, TypeAlerte
from app.schemas import AlerteResponse, TypeAlerte as TypeAlerteSchema

router = APIRouter(prefix="/alertes", tags=["alertes"])


@router.get("", response_model=list[AlerteResponse])
def list_alertes(
    pays: str | None = Query(None),
    db: Session = Depends(get_db),
) -> list[AlerteResponse]:
    query = db.query(Alerte).filter(Alerte.resolue.is_(False))
    if pays:
        query = query.filter(Alerte.pays == pays)
    alertes = query.order_by(Alerte.created_at.desc()).all()
    return [
        AlerteResponse(
            id=a.id,
            type=TypeAlerteSchema(a.type.value),
            lot_id=a.lot_id,
            pays=a.pays,
            message=a.message,
            created_at=a.created_at,
            resolue=a.resolue,
        )
        for a in alertes
    ]
