from app.domain.entities import Boundary, Source, neighborhood

SOURCE = Source("Fuente de prueba", "https://example.org")
SQUARE = {"type": "Polygon", "coordinates": [
    [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]],
]}


class FakeBoundary:
    """Lector de polígono simulado con bbox coherente para Overpass."""

    def __init__(self, geometry=None):
        self.geometry = geometry or SQUARE
        self.properties = {"bbox": [0, 0, 2, 2]}
        self.source = SOURCE

    async def read(self) -> Boundary:
        return Boundary(self.geometry, self.properties, self.source)


def neighborhood_payload():
    info = neighborhood.to_dict()
    return {
        "scope": "neighborhood", "neighborhood": info, "source": SOURCE.to_dict(),
        "count": 1, "data": info, "note": None,
    }


def boundary_payload():
    return {
        "type": "FeatureCollection",
        "features": [{"type": "Feature", "geometry": SQUARE, "properties": {
            "name": "La Gaitana", "locality": "Suba", "code": "110292",
            "cadastral_sector": "009216",
        }}],
        "source": SOURCE.to_dict(),
    }
