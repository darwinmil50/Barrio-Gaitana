"""Point-in-polygon (ray casting) sobre coordenadas EPSG:4326: (lon, lat)."""

from typing import Any


def in_ring(lon: float, lat: float, ring: list) -> bool:
    """Devuelve True si el punto cae dentro del anillo (bordes: regla par-impar)."""
    inside = False
    previous = ring[-1]
    for current in ring:
        x1, y1 = float(previous[0]), float(previous[1])
        x2, y2 = float(current[0]), float(current[1])
        if (y1 > lat) != (y2 > lat):
            crossing = x1 + (lat - y1) * (x2 - x1) / (y2 - y1)
            if lon < crossing:
                inside = not inside
        previous = current
    return inside


def in_geometry(lon: float | None, lat: float | None, geometry: dict | None) -> bool:
    """Acepta Polygon y MultiPolygon; respeta huecos en Polygon."""
    if geometry is None or lon is None or lat is None:
        return False
    kind = geometry.get("type")
    coords = geometry.get("coordinates", [])
    if kind == "Polygon" and coords:
        return in_ring(lon, lat, coords[0]) and not any(
            in_ring(lon, lat, hole) for hole in coords[1:]
        )
    if kind == "MultiPolygon":
        return any(in_ring(lon, lat, polygon[0]) for polygon in coords if polygon)
    return False


def bbox(geometry: dict[str, Any]) -> list[float]:
    """Devuelve [min_lon, min_lat, max_lon, max_lat] del polígono oficial."""
    xs: list[float] = []
    ys: list[float] = []
    for ring in (geometry.get("coordinates") or []):
        for polygon in ring if geometry.get("type") == "MultiPolygon" else [ring]:
            for point in polygon:
                xs.append(float(point[0]))
                ys.append(float(point[1]))
    return [min(xs), min(ys), max(xs), max(ys)]


def center(element: dict) -> tuple[float | None, float | None]:
    """Extrae (lon, lat) de un node de Overpass o del center de un way."""
    if element.get("type") == "node":
        return element.get("lon"), element.get("lat")
    point = element.get("center") or {}
    return point.get("lon"), point.get("lat")
