"""Convierte el XML real de OSM en registros con coordenadas verificables."""

import xml.etree.ElementTree as ET

from app.infrastructure.providers.osm.tags import category_for, primary_tag


def _tags(element: ET.Element) -> dict[str, str]:
    return {tag.get("k", ""): tag.get("v", "") for tag in element.findall("tag")}


def _coordinates(point: ET.Element) -> tuple[float, float] | None:
    try:
        return float(point.get("lon")), float(point.get("lat"))
    except (TypeError, ValueError):
        return None


def _record(element: ET.Element, lon: float, lat: float,
            tags: dict[str, str], category: str) -> dict:
    key, value = primary_tag(tags)
    osm_type = "n" if element.tag == "node" else "w"
    label = tags.get("name") or f"{key}={value}"
    return {
        "lon": lon,
        "lat": lat,
        "category": category,
        "osm_type": osm_type,
        "osm_id": element.get("id"),
        "name": label,
        "class": key,
        "type": value,
        "display_name": ", ".join(
            part for part in (tags.get("addr:street"), tags.get("addr:city"))
            if part
        ) or None,
        "tags": tags,
    }


def parse_items(xml: str) -> list[dict]:
    """Extrae nodos y ways categorizados; calcula el centroide de los ways."""
    root = ET.fromstring(xml)
    nodes: dict[str, tuple[float, float]] = {}
    items: list[dict] = []
    for element in root:
        if element.tag == "node":
            coords = _coordinates(element)
            if coords is not None:
                nodes[element.get("id", "")] = coords
    for element in root:
        if element.tag not in ("node", "way"):
            continue
        tags = _tags(element)
        category = category_for(tags)
        if category is None:
            continue
        if element.tag == "node":
            coords = _coordinates(element)
        else:
            points = [nodes[ref.get("ref", "")]
                      for ref in element.findall("nd")
                      if ref.get("ref") in nodes]
            coords = (sum(p[0] for p in points) / len(points),
                      sum(p[1] for p in points) / len(points)) if points else None
        if coords is not None:
            items.append(_record(element, coords[0], coords[1], tags, category))
    return items
