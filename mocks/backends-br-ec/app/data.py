"""Donnees demo mocks Brésil et Équateur (seuils config/thresholds.yaml)."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

NOW = datetime.now(timezone.utc)

COUNTRIES = {
    "BR": {
        "code": "BR",
        "nom": "Bresil",
        "entrepot_id": "ENT-BR-SAO-PAULO-01",
        "entrepot_nom": "Hub logistique Sao Paulo",
        "temperature": 29.0,
        "humidite": 55.0,
        "lots": [
            {
                "id": "LOT-BR-2026-001",
                "pays": "BR",
                "exploitation": "EXP-BR-SAO-PAULO-01",
                "entrepot": "ENT-BR-SAO-PAULO-01",
                "date_stockage": (NOW - timedelta(days=28)).isoformat(),
                "statut": "conforme",
            },
            {
                "id": "LOT-BR-2026-002",
                "pays": "BR",
                "exploitation": "EXP-BR-MINAS-01",
                "entrepot": "ENT-BR-SAO-PAULO-01",
                "date_stockage": (NOW - timedelta(days=8)).isoformat(),
                "statut": "conforme",
            },
        ],
        "alertes": [],
    },
    "EC": {
        "code": "EC",
        "nom": "Equateur",
        "entrepot_id": "ENT-EC-QUITO-01",
        "entrepot_nom": "Hub logistique Quito",
        "temperature": 31.0,
        "humidite": 60.0,
        "lots": [
            {
                "id": "LOT-EC-2026-001",
                "pays": "EC",
                "exploitation": "EXP-EC-PICHINCHA-01",
                "entrepot": "ENT-EC-QUITO-01",
                "date_stockage": (NOW - timedelta(days=35)).isoformat(),
                "statut": "conforme",
            },
            {
                "id": "LOT-EC-2025-001",
                "pays": "EC",
                "exploitation": "EXP-EC-GUAYAS-01",
                "entrepot": "ENT-EC-QUITO-01",
                "date_stockage": (NOW - timedelta(days=380)).isoformat(),
                "statut": "perime",
            },
        ],
        "alertes": [
            {
                "id": 1,
                "type": "peremption",
                "lot_id": "LOT-EC-2025-001",
                "pays": "EC",
                "message": "Lot LOT-EC-2025-001 en stock depuis plus de 365 jours.",
                "created_at": (NOW - timedelta(days=5)).isoformat(),
                "resolue": False,
                "email_envoye": True,
            }
        ],
    },
}


def get_country(code: str) -> dict:
    country = COUNTRIES.get(code.upper())
    if not country:
        raise KeyError(code)
    return country


def build_mesures(country: dict, lot_id: str | None = None) -> list[dict]:
    base = {
        "entrepot": country["entrepot_id"],
        "lot_id": lot_id,
        "temperature": country["temperature"],
        "humidite": country["humidite"],
        "device_id": f"FK-{country['code']}-ENT01-TH01",
    }
    return [
        {**base, "id": 1, "horodatage": (NOW - timedelta(hours=2)).isoformat()},
        {**base, "id": 2, "horodatage": (NOW - timedelta(minutes=30)).isoformat()},
    ]
