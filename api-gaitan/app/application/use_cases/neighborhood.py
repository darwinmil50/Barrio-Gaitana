from app.domain.entities import neighborhood
from app.domain.interfaces import BoundaryReader


class GetNeighborhood:
    """Devuelve la identidad verificada del barrio (data es un objeto)."""

    def __init__(self, boundary: BoundaryReader) -> None:
        self.boundary = boundary

    async def execute(self) -> dict:
        boundary = await self.boundary.read()
        source = boundary.source.to_dict() if boundary.source else {}
        return {
            "scope": "neighborhood",
            "neighborhood": neighborhood.to_dict(),
            "source": source,
            "count": 1,
            "data": neighborhood.to_dict(),
            "note": None,
        }
