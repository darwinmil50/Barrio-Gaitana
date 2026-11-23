from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuración por entorno; sin credenciales ni secretos en código."""

    model_config = SettingsConfigDict(
        env_prefix="GAITAN_", env_file=".env", extra="ignore"
    )

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    overpass_url: str = "https://overpass-api.de/api/interpreter"
    nominatim_url: str = "https://nominatim.openstreetmap.org/search"
    osm_api_url: str = "https://api.openstreetmap.org/api/0.6/map"
    catastro_url: str = (
        "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/"
        "catastro/sectorcatastral/MapServer/0/query"
    )
    crimes_url: str = (
        "https://oaiee.scj.gov.co/agc/rest/services/Tematicos_Pub/"
        "CifrasSCJ/MapServer/0/query"
    )
    sitp_url: str = (
        "https://datosabiertos.bogota.gov.co/dataset/5ba19d20-06af-4c04-b50c-"
        "8ecb9472327d/resource/624bb288-2a6d-466f-801a-93e5497cd879/"
        "download/paraderos.json"
    )
    cameras_url: str | None = None
    cache_ttl_seconds: int = 900
    requests_per_minute: int = 60
    http_timeout_seconds: float = 20.0
    log_level: str = "INFO"

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
