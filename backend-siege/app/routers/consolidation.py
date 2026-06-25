import logging

from fastapi import APIRouter, HTTPException

from app.schemas import (
    AlerteConsolidee,
    AlerteResponse,
    AlertesConsolidees,
    LotConsolide,
    LotResponse,
    StocksConsolides,
)
from app.services.country_client import PAYS_CONFIG, country_client

logger = logging.getLogger(__name__)

router = APIRouter(tags=["consolidation"])


@router.get("/stocks", response_model=StocksConsolides)
async def stocks_consolides() -> StocksConsolides:
    lots: list[LotConsolide] = []
    par_pays: dict[str, int] = {}

    for code, meta in PAYS_CONFIG.items():
        try:
            data = await country_client.get_json(code, "/api/v1/lots")
            par_pays[code] = len(data)
            for item in data:
                lot = LotResponse.model_validate(item)
                lots.append(
                    LotConsolide(
                        **lot.model_dump(),
                        pays_nom=str(meta["nom"]),
                        source=meta["statut_backend"],
                    )
                )
        except HTTPException:
            par_pays[code] = 0
            logger.warning("Stocks indisponibles pour %s", code)

    lots.sort(key=lambda lot: lot.date_stockage)
    return StocksConsolides(total_lots=len(lots), par_pays=par_pays, lots=lots)


@router.get("/alertes/consolidees", response_model=AlertesConsolidees)
async def alertes_consolidees() -> AlertesConsolidees:
    alertes: list[AlerteConsolidee] = []
    par_pays: dict[str, int] = {}

    for code, meta in PAYS_CONFIG.items():
        try:
            data = await country_client.get_json(code, "/api/v1/alertes")
            par_pays[code] = len(data)
            for item in data:
                alerte = AlerteResponse.model_validate(item)
                alertes.append(
                    AlerteConsolidee(
                        **alerte.model_dump(),
                        pays_nom=str(meta["nom"]),
                    )
                )
        except HTTPException:
            par_pays[code] = 0
            logger.warning("Alertes indisponibles pour %s", code)

    alertes.sort(key=lambda alerte: alerte.created_at, reverse=True)
    return AlertesConsolidees(total=len(alertes), par_pays=par_pays, alertes=alertes)
