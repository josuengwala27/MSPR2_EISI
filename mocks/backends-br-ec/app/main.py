import os

from fastapi import FastAPI, HTTPException, Query

from app.data import build_mesures, get_country

COUNTRY_CODE = os.environ.get("COUNTRY_CODE", "BR").upper()

try:
    COUNTRY = get_country(COUNTRY_CODE)
except KeyError:
    raise RuntimeError(f"COUNTRY_CODE invalide: {COUNTRY_CODE}")

SERVICE_NAME = f"mock-{COUNTRY['nom'].lower().replace(' ', '-')}"

app = FastAPI(
    title=f"FutureKawa — Mock backend {COUNTRY['nom']}",
    description="API pays simulee (etape 6 MSPR)",
    version="1.0.0",
)


@app.get("/api/v1/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": SERVICE_NAME, "pays": COUNTRY_CODE}


@app.get("/")
def root() -> dict[str, str]:
    return {"service": SERVICE_NAME, "status": "ok", "pays": COUNTRY_CODE, "docs": "/docs"}


@app.get("/api/v1/lots")
def list_lots(
    entrepot: str | None = Query(None),
    statut: str | None = Query(None),
) -> list[dict]:
    lots = COUNTRY["lots"]
    if entrepot:
        lots = [lot for lot in lots if lot["entrepot"] == entrepot]
    if statut:
        lots = [lot for lot in lots if lot["statut"] == statut]
    return sorted(lots, key=lambda lot: lot["date_stockage"])


@app.get("/api/v1/lots/{lot_id}")
def get_lot(lot_id: str) -> dict:
    for lot in COUNTRY["lots"]:
        if lot["id"] == lot_id:
            return lot
    raise HTTPException(status_code=404, detail="Lot introuvable")


@app.get("/api/v1/lots/{lot_id}/mesures")
def list_mesures_lot(lot_id: str) -> list[dict]:
    if not any(lot["id"] == lot_id for lot in COUNTRY["lots"]):
        raise HTTPException(status_code=404, detail="Lot introuvable")
    return build_mesures(COUNTRY, lot_id)


@app.get("/api/v1/mesures/dernieres")
def derniere_mesure(entrepot: str = Query(...)) -> dict:
    if entrepot != COUNTRY["entrepot_id"]:
        raise HTTPException(status_code=404, detail="Aucune mesure pour cet entrepot")
    mesures = build_mesures(COUNTRY)
    return mesures[-1]


@app.get("/api/v1/alertes")
def list_alertes(pays: str | None = Query(None)) -> list[dict]:
    alertes = COUNTRY["alertes"]
    if pays:
        alertes = [a for a in alertes if a["pays"] == pays.upper()]
    return alertes
