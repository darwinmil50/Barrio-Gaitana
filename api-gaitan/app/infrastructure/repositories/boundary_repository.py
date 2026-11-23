import json
from pathlib import Path

from app.domain.entities import Boundary
from app.domain.rules.geometry import bbox
from app.infrastructure.providers.sources import BARRIO

BOUNDARY_FILE = (
    Path(__file__).resolve().parent.parent
    / "providers" / "data" / "la-gaitana-boundary.geojson"
)


class GeoJsonBoundaryReader:
    """Lee el polígono oficial verificado; nunca genera uno propio."""

    def __init__(self, path: Path | None = None) -> None:
        self.path = path or BOUNDARY_FILE

    async def read(self) -> Boundary:
        with self.path.open(encoding="utf-8") as handle:
            payload = json.load(handle)
        feature = payload["features"][0]
        geometry = feature["geometry"]
        properties = dict(feature.get("properties") or {})
        properties["bbox"] = bbox(geometry)
        return Boundary(geometry=geometry, properties=properties, source=BARRIO)
