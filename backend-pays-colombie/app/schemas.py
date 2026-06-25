from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class StatutLot(str, Enum):
    conforme = "conforme"
    alerte = "alerte"
    perime = "perime"


class TypeAlerte(str, Enum):
    conditions_non_ideales = "conditions_non_ideales"
    peremption = "peremption"


class LotCreate(BaseModel):
    id: str
    pays: str = "CO"
    exploitation: str
    entrepot: str
    date_stockage: datetime


class LotResponse(BaseModel):
    id: str
    pays: str
    exploitation: str
    entrepot: str
    date_stockage: datetime
    statut: StatutLot

    model_config = {"from_attributes": True}


class MesureResponse(BaseModel):
    id: int
    entrepot: str
    lot_id: str | None
    temperature: float
    humidite: float
    horodatage: datetime
    device_id: str | None = None

    model_config = {"from_attributes": True}


class AlerteResponse(BaseModel):
    id: int
    type: TypeAlerte
    lot_id: str
    pays: str
    message: str
    created_at: datetime
    resolue: bool
    email_envoye: bool = False

    model_config = {"from_attributes": True}


class MqttMesurePayload(BaseModel):
    device_id: str | None = None
    entrepot_id: str | None = None
    temperature: float
    humidite: float
    horodatage: datetime | None = None
