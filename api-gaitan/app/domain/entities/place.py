from dataclasses import dataclass, field
from typing import Any

from app.domain.entities.source import Source


@dataclass(frozen=True)
class Place:
    """Lugar normalizado; contrato JSON idéntico para todas las categorías."""

    id: str
    name: str
    category: str
    latitude: float | None
    longitude: float | None
    geometry: dict | None
    properties: dict[str, Any] = field(default_factory=dict)
    source: Source | None = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "geometry": self.geometry,
            "properties": self.properties,
            "source": self.source.to_dict() if self.source else {},
        }
