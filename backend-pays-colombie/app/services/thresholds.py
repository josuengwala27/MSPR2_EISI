from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import yaml

from app.core.config import get_settings


@dataclass
class SeuilsPays:
    temp_min: float
    temp_max: float
    hum_min: float
    hum_max: float
    email: str


def load_seuils_colombie() -> SeuilsPays:
    settings = get_settings()
    path = Path(settings.config_dir) / "thresholds.yaml"
    if not path.exists():
        path = Path(__file__).resolve().parents[3] / "config" / "thresholds.yaml"

    with path.open(encoding="utf-8") as f:
        data = yaml.safe_load(f)

    col = data["pays"]["colombie"]
    return SeuilsPays(
        temp_min=col["temperature"]["min"],
        temp_max=col["temperature"]["max"],
        hum_min=col["humidite"]["min"],
        hum_max=col["humidite"]["max"],
        email=col["email_responsable_exploitation"],
    )


def load_peremption_jours() -> int:
    settings = get_settings()
    path = Path(settings.config_dir) / "thresholds.yaml"
    if not path.exists():
        path = Path(__file__).resolve().parents[3] / "config" / "thresholds.yaml"

    with path.open(encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return int(data["alertes"]["peremption_jours"])


def load_anti_spam_minutes() -> int:
    settings = get_settings()
    path = Path(settings.config_dir) / "alerting.yaml"
    if not path.exists():
        path = Path(__file__).resolve().parents[3] / "config" / "alerting.yaml"

    with path.open(encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return int(data["regles"]["conditions_non_ideales"]["anti_spam_minutes"])


def conditions_ok(temperature: float, humidite: float, seuils: SeuilsPays) -> bool:
    return (
        seuils.temp_min <= temperature <= seuils.temp_max
        and seuils.hum_min <= humidite <= seuils.hum_max
    )
