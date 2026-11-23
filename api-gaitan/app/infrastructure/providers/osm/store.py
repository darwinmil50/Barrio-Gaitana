"""Descarga única y caché en disco de los datos OSM ya verificados."""

import asyncio
import json
import time
from pathlib import Path

from app.domain.interfaces import BoundaryReader
from app.infrastructure.http.client import HttpClient
from app.infrastructure.providers.osm.parse import parse_items
from app.infrastructure.providers.osm.tags import bounding_box

CACHE_FILE = Path(__file__).resolve().parent.parent / "data" / "osm-items.json"
TTL_SECONDS = 86400
_LOCK = asyncio.Lock()


def _load(allow_stale: bool = False) -> list[dict] | None:
    try:
        payload = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        items = payload.get("items")
        age = time.time() - float(payload.get("timestamp", 0))
        if isinstance(items, list) and (age <= TTL_SECONDS or allow_stale):
            return items
    except (OSError, ValueError, TypeError):
        pass
    return None


def _save(items: list[dict]) -> None:
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    CACHE_FILE.write_text(json.dumps(
        {"timestamp": time.time(), "items": items}, ensure_ascii=False
    ), encoding="utf-8")


async def items(http: HttpClient, url: str, boundary: BoundaryReader,
                allow_stale: bool = True) -> list[dict]:
    """Sirve la caché vigente o descarga una sola vez el XML completo."""
    cached = _load()
    if cached is not None:
        return cached
    async with _LOCK:
        cached = _load()
        if cached is not None:
            return cached
        geometry = await boundary.read()
        box = bounding_box(geometry.properties["bbox"])
        xml = await http.get_text(url, {"bbox": box})
        parsed = parse_items(xml)
        if parsed:
            _save(parsed)
        return parsed or (_load(allow_stale=True) or [])
