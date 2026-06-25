from __future__ import annotations

import logging
from typing import Any

import httpx
from fastapi import HTTPException

from app.core.config import Settings, get_settings
from app.schemas import StatutBackend

logger = logging.getLogger(__name__)

PAYS_CONFIG: dict[str, dict[str, str | StatutBackend]] = {
    "CO": {
        "nom": "Colombie",
        "statut_backend": StatutBackend.complet,
        "url_key": "backend_co_url",
    },
    "BR": {
        "nom": "Bresil",
        "statut_backend": StatutBackend.mock,
        "url_key": "backend_br_url",
    },
    "EC": {
        "nom": "Equateur",
        "statut_backend": StatutBackend.mock,
        "url_key": "backend_ec_url",
    },
}


def _backend_url(settings: Settings, country_code: str) -> str:
    config = PAYS_CONFIG[country_code.upper()]
    url_key = str(config["url_key"])
    return getattr(settings, url_key).rstrip("/")


class CountryClient:
    def __init__(self, settings: Settings | None = None) -> None:
        self._settings = settings or get_settings()

    def _client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(timeout=self._settings.http_timeout_seconds)

    async def check_health(self, country_code: str) -> tuple[bool, str | None]:
        url = _backend_url(self._settings, country_code)
        try:
            async with self._client() as client:
                response = await client.get(f"{url}/api/v1/health")
                response.raise_for_status()
                return True, None
        except Exception as exc:
            logger.warning("Backend %s indisponible: %s", country_code, exc)
            return False, str(exc)

    async def get_json(self, country_code: str, path: str) -> Any:
        url = _backend_url(self._settings, country_code)
        try:
            async with self._client() as client:
                response = await client.get(f"{url}{path}")
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=f"Backend {country_code}: {exc.response.text}",
            ) from exc
        except Exception as exc:
            logger.error("Erreur appel backend %s %s: %s", country_code, path, exc)
            raise HTTPException(
                status_code=502,
                detail=f"Backend pays {country_code} indisponible: {exc}",
            ) from exc


country_client = CountryClient()
