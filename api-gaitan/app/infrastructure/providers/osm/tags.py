"""Reglas deterministas que enlazan etiquetas OSM reales con categorías."""

BBOX_PADDING = 0.004


def bounding_box(box: list[float], padding: float = BBOX_PADDING) -> str:
    """Amplía la bbox oficial para poder informar de barrios vecinos."""
    min_lon, min_lat, max_lon, max_lat = box
    coords = (round(min_lon - padding, 8), round(min_lat - padding, 8),
              round(max_lon + padding, 8), round(max_lat + padding, 8))
    return ",".join(str(value) for value in coords)


def category_for(tags: dict[str, str]) -> str | None:
    """Clasifica un elemento OSM sin inventar su naturaleza."""
    if tags.get("amenity") == "veterinary":
        return "veterinaries"
    if tags.get("shop") == "books":
        return "bookstores"
    if tags.get("amenity") in ("restaurant", "fast_food"):
        return "restaurants"
    if tags.get("amenity") in ("school", "kindergarten", "college", "university"):
        return "education"
    if tags.get("leisure") in ("park", "garden", "nature_reserve"):
        return "green_areas"
    if ("sport" in tags or tags.get("leisure") in
            ("pitch", "playground", "fitness_station", "sports_centre")):
        return "sports"
    if tags.get("amenity") == "police":
        return "police"
    if (tags.get("highway") == "bus_stop" or
            tags.get("public_transport") in ("platform", "stop_position")):
        return "transport"
    if "highway" in tags:
        return "streets"
    return None


def primary_tag(tags: dict[str, str]) -> tuple[str, str]:
    """Devuelve la etiqueta OSM principal para mostrar como tipo."""
    for key in ("amenity", "leisure", "shop", "sport", "highway",
                "public_transport", "natural"):
        if key in tags:
            return key, tags[key]
    return "osm", "elemento"
