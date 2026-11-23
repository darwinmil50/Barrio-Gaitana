from typing import Any

from app.domain.entities import FetchResult, Place, neighborhood
from app.domain.entities.source import Source


def make(
    result: FetchResult,
    source: dict[str, Any] | Source | None = None,
    scope: str = "neighborhood",
) -> dict:
    """Construye el envelope obligatorio compartido por todos los endpoints."""
    src = source.to_dict() if isinstance(source, Source) else (source or {})
    payload = {
        "scope": scope,
        "neighborhood": neighborhood.to_dict(),
        "source": src,
        "count": len(result.data),
        "data": [item.to_dict() if isinstance(item, Place) else item for item in result.data],
        "note": result.note,
    }
    if result.context:
        payload["context"] = result.context
    return payload
