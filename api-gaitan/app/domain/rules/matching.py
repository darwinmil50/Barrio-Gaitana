"""Selección determinista de lugares por texto y límite."""

from app.domain.entities.place import Place


def matches(place: Place, query: str | None) -> bool:
    """Búsqueda insensible a mayúsculas sobre nombre y etiquetas del lugar."""
    if not query:
        return True
    term = query.strip().casefold()
    if not term:
        return True
    haystack = " ".join(
        [place.name, place.category, *[str(v) for v in place.properties.values()]]
    ).casefold()
    return term in haystack


def select(places: list[Place], query: str | None, limit: int) -> list[Place]:
    """Aplica `matches` y recorta a `limit` (1..200 validado en la API)."""
    return [place for place in places if matches(place, query)][:limit]
