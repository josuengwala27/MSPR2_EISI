from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    backend_co_url: str = "http://localhost:8001"
    backend_br_url: str = "http://localhost:8002"
    backend_ec_url: str = "http://localhost:8003"
    http_timeout_seconds: float = 5.0


@lru_cache
def get_settings() -> Settings:
    return Settings()
