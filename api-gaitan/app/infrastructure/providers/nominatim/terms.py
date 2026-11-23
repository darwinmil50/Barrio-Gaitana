"""Términos de búsqueda OSM por categoría (nombres reales en español e inglés)."""

TERMS: dict[str, tuple[str, ...]] = {
    "veterinaries": ("veterinaria", "veterinary"),
    "bookstores": ("libreria", "librería"),
    "restaurants": ("restaurante", "panaderia"),
    "education": ("colegio", "escuela"),
    "sports": ("cancha", "gimnasio"),
    "green_areas": ("parque",),
    "police": ("CAI", "policia"),
    "transport": ("bus stop", "paradero"),
    "streets": ("transversal", "avenida"),
}

BOUNDARY_PADDING = 0.008


def viewbox(box: list[float]) -> str:
    """Amplía la bbox oficial para poder informar de lugares en barrios vecinos."""
    min_lon, min_lat, max_lon, max_lat = box
    pad = BOUNDARY_PADDING
    return f"{min_lon - pad},{max_lat + pad},{max_lon + pad},{min_lat - pad}"
