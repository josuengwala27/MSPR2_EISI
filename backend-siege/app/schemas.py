from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class StatutBackend(str, Enum):
    complet = "complet"
    mock = "mock"
    indisponible = "indisponible"


class PaysResume(BaseModel):
    code: str
    nom: str
    statut_backend: StatutBackend
    url_backend: str
    disponible: bool = True
    message_erreur: str | None = None


class LotResponse(BaseModel):
    id: str
    pays: str
    exploitation: str
    entrepot: str
    date_stockage: datetime
    statut: str


class LotConsolide(LotResponse):
    pays_nom: str
    source: StatutBackend


class MesureResponse(BaseModel):
    id: int | None = None
    entrepot: str
    lot_id: str | None = None
    temperature: float
    humidite: float
    horodatage: datetime
    device_id: str | None = None


class AlerteResponse(BaseModel):
    id: int
    type: str
    lot_id: str
    pays: str
    message: str
    created_at: datetime
    resolue: bool
    email_envoye: bool = False


class AlerteConsolidee(AlerteResponse):
    pays_nom: str


class StocksConsolides(BaseModel):
    total_lots: int
    par_pays: dict[str, int]
    lots: list[LotConsolide]


class AlertesConsolidees(BaseModel):
    total: int
    par_pays: dict[str, int]
    alertes: list[AlerteConsolidee]


class BackendError(BaseModel):
    pays: str
    detail: str


class ErreurPaysResponse(BaseModel):
    erreur: str = Field(description="Message d'erreur lisible")
    pays: str
    code_http: int = 502
