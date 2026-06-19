from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://futurekawa:futurekawa@localhost:5432/futurekawa_co"
    mqtt_host: str = "localhost"
    mqtt_port: int = 1883
    mqtt_topic: str = "futurekawa/co/ent-co-bogota-01/mesures"
    country_code: str = "CO"
    config_dir: str = "/config"

    smtp_host: str = "localhost"
    smtp_port: int = 1025
    smtp_from: str = "noreply@futurekawa.com"
    alert_email_to: str = "exploitation.colombie@futurekawa.com"

    seed_demo_data: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
