from dataclasses import dataclass


@dataclass(frozen=True)
class Source:
    """Metadatos de procedencia de cada respuesta."""

    name: str
    url: str
    license: str = "Datos abiertos, citar fuente"
    updated_at: str | None = None

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "url": self.url,
            "license": self.license,
            "updated_at": self.updated_at,
        }
