from typing import Any

from app.domain.entities import Place
from app.domain.entities.source import Source
from app.domain.rules.geometry import center, in_geometry


def to_places(
    elements: list[dict],
    category: str,
    geometry: dict[str, Any],
    source: Source,
) -> list[Place]:
    """Convierte nodos/ways y descarta todo punto fuera del polígono oficial."""
    places: list[Place] = []
    for element in elements:
        lon, lat = center(element)
        if not in_geometry(lon, lat, geometry):
            continue
        tags = dict(element.get("tags") or {})
        identifier = f"{element.get('type', 'unknown')}/{element.get('id', '?')}"
        places.append(Place(
            id=identifier,
            name=tags.get("name") or tags.get("ref") or identifier,
            category=category,
            latitude=lat,
            longitude=lon,
            geometry={"type": "Point", "coordinates": [lon, lat]},
            properties=tags,
            source=source,
        ))
    return places
