from fastapi import APIRouter, HTTPException

from app.schemas import ErreurPaysResponse
from app.services.country_client import PAYS_CONFIG, country_client

router = APIRouter(prefix="/debug", tags=["debug"])


@router.get("/panne/{country_code}", response_model=ErreurPaysResponse)
async def simuler_panne(country_code: str) -> ErreurPaysResponse:
    """Force un appel vers un backend pour demontrer la gestion d'erreur 502."""
    code = country_code.upper()
    if code not in PAYS_CONFIG:
        raise HTTPException(status_code=404, detail="Pays inconnu")
    try:
        await country_client.get_json(code, "/api/v1/lots/__inexistant_panne_test__")
    except HTTPException as exc:
        return ErreurPaysResponse(
            erreur=str(exc.detail),
            pays=code,
            code_http=exc.status_code,
        )
    return ErreurPaysResponse(erreur="Aucune erreur", pays=code, code_http=200)
