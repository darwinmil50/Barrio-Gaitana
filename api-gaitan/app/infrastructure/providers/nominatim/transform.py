"""Convierte resultados de Nominatim a entidades Place sin inventar datos."""

from app.domain.entities import Place
from app.domain.entities.source import Source
from app.domain.rules.geometry import in_geometry


def to_place(item: dict, category: str, source: Source, inside: bool,
             term: str) -> Place | None:
    """Sólo conserva resultados con coordenadas numéricas verificables."""
    try:
        lon, lat = float(item["lon"]), float(item["lat"])
    except (KeyError, TypeError, ValueError):
        return None
    identifier = f"osm/{item.get('osm_type', '?')}/{item.get('osm_id', '?')}"
    properties = {
        "osm_type": item.get("osm_type"),
        "osm_id": item.get("osm_id"),
        "osm_class": item.get("class"),
        "osm_type_tag": item.get("type"),
        "display_name": item.get("display_name"),
        "search_term": term,
        "scope": "neighborhood" if inside else "nearby",
    }
    return Place(
        id=identifier,
        name=item.get("name") or item.get("type") or identifier,
        category=category,
        latitude=lat,
        longitude=lon,
        geometry={"type": "Point", "coordinates": [lon, lat]},
        properties=properties,
        source=source,
    )


def collect(items: list[dict], category: str, source: Source,
            geometry: dict, term: str) -> tuple[list[Place], list[Place]]:
    """Separa los puntos dentro del barrio de los situados en barrios vecinos."""
    inside: list[Place] = []
    nearby: list[Place] = []
    for item in items:
        try:
            lon, lat = float(item["lon"]), float(item["lat"])
        except (KeyError, TypeError, ValueError):
            continue
        is_inside = in_geometry(lon, lat, geometry)
        place = to_place(item, category, source, is_inside, term)
        if place is not None:
            (inside if is_inside else nearby).append(place)
    return inside, nearby
