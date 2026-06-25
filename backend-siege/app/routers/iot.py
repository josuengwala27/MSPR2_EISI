from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.country_client import PAYS_CONFIG, country_client

router = APIRouter(prefix="/iot", tags=["iot"])

ENTREPOTS: dict[str, dict[str, str]] = {
    "CO": {"id": "ENT-CO-BOGOTA-01", "nom": "Hub logistique Bogotá"},
    "BR": {"id": "ENT-BR-SAO-PAULO-01", "nom": "Hub logistique São Paulo"},
    "EC": {"id": "ENT-EC-QUITO-01", "nom": "Hub logistique Quito"},
}

SEUILS: dict[str, dict[str, float]] = {
    "CO": {"temp_min": 23.0, "temp_max": 29.0, "hum_min": 78.0, "hum_max": 82.0},
    "BR": {"temp_min": 26.0, "temp_max": 32.0, "hum_min": 53.0, "hum_max": 57.0},
    "EC": {"temp_min": 28.0, "temp_max": 34.0, "hum_min": 58.0, "hum_max": 62.0},
}


class SurveillanceEntrepot(BaseModel):
    pays: str
    pays_nom: str
    entrepot_id: str
    entrepot_nom: str
    temperature: float | None = None
    humidite: float | None = None
    horodatage: datetime | None = None
    conditions_ok: bool | None = None
    actif: bool = True
    seuils_temp: str
    seuils_hum: str


def _conditions_ok(code: str, temperature: float, humidite: float) -> bool:
    s = SEUILS[code]
    return s["temp_min"] <= temperature <= s["temp_max"] and s["hum_min"] <= humidite <= s["hum_max"]


@router.get("/surveillance", response_model=list[SurveillanceEntrepot])
async def surveillance_entrepots() -> list[SurveillanceEntrepot]:
    results: list[SurveillanceEntrepot] = []
    for code, meta in PAYS_CONFIG.items():
        ent = ENTREPOTS[code]
        s = SEUILS[code]
        seuils_temp = f"{s['temp_min']:.0f}–{s['temp_max']:.0f} °C"
        seuils_hum = f"{s['hum_min']:.0f}–{s['hum_max']:.0f} %"
        base = SurveillanceEntrepot(
            pays=code,
            pays_nom=str(meta["nom"]),
            entrepot_id=ent["id"],
            entrepot_nom=ent["nom"],
            seuils_temp=seuils_temp,
            seuils_hum=seuils_hum,
        )
        try:
            data = await country_client.get_json(
                code, f"/api/v1/mesures/dernieres?entrepot={ent['id']}"
            )
            temp = float(data["temperature"])
            hum = float(data["humidite"])
            results.append(
                base.model_copy(
                    update={
                        "temperature": temp,
                        "humidite": hum,
                        "horodatage": data.get("horodatage"),
                        "conditions_ok": _conditions_ok(code, temp, hum),
                        "actif": True,
                    }
                )
            )
        except HTTPException:
            results.append(base.model_copy(update={"actif": False}))
    return results


@router.get("/surveillance/{country_code}", response_model=SurveillanceEntrepot)
async def surveillance_pays(country_code: str) -> SurveillanceEntrepot:
    code = country_code.upper()
    if code not in ENTREPOTS:
        raise HTTPException(status_code=404, detail="Pays inconnu")
    items = await surveillance_entrepots()
    for item in items:
        if item.pays == code:
            return item
    raise HTTPException(status_code=404, detail="Surveillance indisponible")
