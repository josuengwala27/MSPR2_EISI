from fastapi import APIRouter, HTTPException, Query

from app.core.config import get_settings
from app.schemas import (
    AlerteResponse,
    LotResponse,
    MesureResponse,
    PaysResume,
    StatutBackend,
)
from app.services.country_client import PAYS_CONFIG, country_client, _backend_url

router = APIRouter(prefix="/pays", tags=["pays"])


def _validate_country(country_code: str) -> str:
    code = country_code.upper()
    if code not in PAYS_CONFIG:
        raise HTTPException(status_code=404, detail=f"Pays inconnu: {code}")
    return code


@router.get("", response_model=list[PaysResume])
async def list_pays() -> list[PaysResume]:
    settings = get_settings()
    result: list[PaysResume] = []
    for code, meta in PAYS_CONFIG.items():
        disponible, erreur = await country_client.check_health(code)
        statut = meta["statut_backend"]
        if not disponible:
            statut = StatutBackend.indisponible
        result.append(
            PaysResume(
                code=code,
                nom=str(meta["nom"]),
                statut_backend=statut,
                url_backend=_backend_url(settings, code),
                disponible=disponible,
                message_erreur=erreur,
            )
        )
    return result


@router.get("/{country_code}/lots", response_model=list[LotResponse])
async def lots_pays(
    country_code: str,
    entrepot: str | None = Query(None),
    statut: str | None = Query(None),
) -> list[LotResponse]:
    code = _validate_country(country_code)
    query = []
    if entrepot:
        query.append(f"entrepot={entrepot}")
    if statut:
        query.append(f"statut={statut}")
    suffix = f"?{'&'.join(query)}" if query else ""
    data = await country_client.get_json(code, f"/api/v1/lots{suffix}")
    return [LotResponse.model_validate(item) for item in data]


@router.get("/{country_code}/lots/{lot_id}", response_model=LotResponse)
async def lot_detail(country_code: str, lot_id: str) -> LotResponse:
    code = _validate_country(country_code)
    data = await country_client.get_json(code, f"/api/v1/lots/{lot_id}")
    return LotResponse.model_validate(data)


@router.get("/{country_code}/lots/{lot_id}/mesures", response_model=list[MesureResponse])
async def mesures_lot(country_code: str, lot_id: str) -> list[MesureResponse]:
    code = _validate_country(country_code)
    data = await country_client.get_json(code, f"/api/v1/lots/{lot_id}/mesures")
    return [MesureResponse.model_validate(item) for item in data]


@router.get("/{country_code}/alertes", response_model=list[AlerteResponse])
async def alertes_pays(
    country_code: str,
    pays: str | None = Query(None),
) -> list[AlerteResponse]:
    code = _validate_country(country_code)
    suffix = f"?pays={pays}" if pays else ""
    data = await country_client.get_json(code, f"/api/v1/alertes{suffix}")
    return [AlerteResponse.model_validate(item) for item in data]
