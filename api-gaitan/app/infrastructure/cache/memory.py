import asyncio
import time
from typing import Any


class TTLCache:
    """Caché TTL en memoria; todas las operaciones están protegidas por un Lock."""

    def __init__(self, ttl_seconds: float = 900.0) -> None:
        self.ttl = float(ttl_seconds)
        self._entries: dict[str, tuple[float, Any]] = {}
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Any | None:
        async with self._lock:
            entry = self._entries.get(key)
            if entry is None:
                return None
            created, value = entry
            if time.monotonic() - created >= self.ttl:
                self._entries.pop(key, None)
                return None
            return value

    async def set(self, key: str, value: Any) -> None:
        async with self._lock:
            self._entries[key] = (time.monotonic(), value)

    async def clear(self) -> None:
        async with self._lock:
            self._entries.clear()
