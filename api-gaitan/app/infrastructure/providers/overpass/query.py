"""Construcción determinista de la consulta Overpass sobre el bbox oficial."""


def build_query(box: list[float], fragment: str) -> str:
    """`box` = [min_lon, min_lat, max_lon, max_lat] -> Overpass sur,oeste,norte,este."""
    south, west, north, east = box[1], box[0], box[3], box[2]
    bbox = f"{south},{west},{north},{east}"
    return f"[out:json][timeout:25];{fragment.format(bbox=bbox)}out center;"
