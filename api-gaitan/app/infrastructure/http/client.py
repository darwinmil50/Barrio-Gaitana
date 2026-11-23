from typing import Any

import httpx

from app.infrastructure.config import Settings
from app.infrastructure.http.rate_limit import RateLimiter


class HttpClient:
    """Envoltorio compartido: timeouts, cabeceras y límite de peticiones."""

    def __init__(self, settings: Settings, limiter: RateLimiter | None = None) -> None:
        self.timeout = settings.http_timeout_seconds
        self.limiter = limiter or RateLimiter(settings.requests_per_minute)

    async def request(
        self, method: str, url: str, *, params: dict | None = None, data: dict | None = None
    ) -> Any:
        await self.limiter.acquire()
        headers = {"User-Agent": "gaitan-platform/1.0 (consulta de datos abiertos)"}
        async with httpx.AsyncClient(
            timeout=self.timeout, follow_redirects=True, headers=headers
        ) as client:
            response = await client.request(method, url, params=params, data=data)
            response.raise_for_status()
            return response.json()

    async def get(self, url: str, params: dict | None = None) -> Any:
        return await self.request("GET", url, params=params)

    async def get_text(self, url: str, params: dict | None = None) -> str:
        """Igual que `get`, pero para fuentes que devuelven XML/CSV."""
        await self.limiter.acquire()
        headers = {"User-Agent": "gaitan-platform/1.0 (consulta de datos abiertos)"}
        async with httpx.AsyncClient(
            timeout=self.timeout, follow_redirects=True, headers=headers
        ) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.text

    async def post(self, url: str, data: dict | None = None) -> Any:
        return await self.request("POST", url, data=data)
