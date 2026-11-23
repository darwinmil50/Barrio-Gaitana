from app.domain.entities import neighborhood
from app.domain.interfaces import BoundaryReader


class GetBoundary:
    """Entrega el GeoJSON verificado tal cual, sin polígonos inventados."""

    def __init__(self, boundary: BoundaryReader) -> None:
        self.boundary = boundary

    async def execute(self) -> dict:
        boundary = await self.boundary.read()
        properties = dict(boundary.properties)
        properties.setdefault("name", neighborhood.NAME)
        properties.setdefault("locality", neighborhood.LOCALITY)
        properties.setdefault("code", neighborhood.CODE)
        properties.setdefault(
            "cadastral_sector",
            properties.get("SCACODIGO", neighborhood.CADASTRAL_SECTOR),
        )
        return {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": boundary.geometry,
                "properties": properties,
            }],
            "source": boundary.source.to_dict() if boundary.source else {},
        }
