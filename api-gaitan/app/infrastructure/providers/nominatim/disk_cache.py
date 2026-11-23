import json
import time
from pathlib import Path

CACHE_FILE = (
    Path(__file__).resolve().parent.parent / "data" / "nominatim-cache.json"
)
TTL_SECONDS = 86400


def _read_all() -> dict:
    try:
        return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def read(category: str, *, allow_stale: bool = False) -> list[dict] | None:
    """Devuelve datos reales ya verificados; `allow_stale` sirve ante fallos."""
    entry = _read_all().get(category) or {}
    items = entry.get("items")
    if not isinstance(items, list):
        return None
    age = time.time() - float(entry.get("timestamp", 0))
    if age <= TTL_SECONDS or allow_stale:
        return items
    return None


def write(category: str, items: list[dict]) -> None:
    payload = _read_all()
    payload[category] = {"timestamp": time.time(), "items": items}
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    CACHE_FILE.write_text(
        json.dumps(payload, ensure_ascii=False), encoding="utf-8"
    )
