from dataclasses import dataclass, field
from typing import Any

from app.domain.entities.source import Source


@dataclass(frozen=True)
class Boundary:
    """Polígono oficial verificado (EPSG:4326) del sector catastral 009216."""

    geometry: dict[str, Any]
    properties: dict[str, Any] = field(default_factory=dict)
    source: Source | None = None

    @property
    def rings(self) -> list:
        kind = self.geometry.get("type")
        coords = self.geometry.get("coordinates", [])
        if kind == "Polygon":
            return coords
        if kind == "MultiPolygon":
            return [ring for polygon in coords for ring in polygon]
        return []
