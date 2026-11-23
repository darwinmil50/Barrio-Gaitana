import asyncio

from app.domain.entities import FetchResult
from app.infrastructure.providers.sources import TRANSPORT


class TransportProvider:
    """Agrega paraderos SITP, paradas OSM y plataformas/estaciones."""

    category = "transport"
    source = TRANSPORT

    def __init__(self, stops, platforms, sitp) -> None:
        self.stops = stops
        self.platforms = platforms
        self.sitp = sitp

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        results = await asyncio.gather(
            self.stops.fetch(query, limit),
            self.platforms.fetch(query, limit),
            self.sitp.fetch(query, limit),
        )
        merged = []
        seen: set[str] = set()
        notes = []
        for result in results:
            if result.note:
                notes.append(result.note)
            for place in result.data:
                if place.id in seen:
                    continue
                seen.add(place.id)
                merged.append(place)
        return FetchResult(merged[:limit], " | ".join(notes) if notes else None)
