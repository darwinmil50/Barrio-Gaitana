import asyncio
import time


class RateLimiter:
    """Token bucket simple: a lo sumo `rate` peticiones por `period` segundos."""

    def __init__(self, rate: int = 30, period: float = 60.0) -> None:
        self.rate = max(1, rate)
        self.period = period
        self.tokens = float(self.rate)
        self.updated = time.monotonic()
        self._lock = asyncio.Lock()

    async def acquire(self) -> None:
        while True:
            async with self._lock:
                now = time.monotonic()
                self.tokens = min(
                    float(self.rate),
                    self.tokens + (now - self.updated) * self.rate / self.period,
                )
                self.updated = now
                if self.tokens >= 1:
                    self.tokens -= 1
                    return
                wait = (1 - self.tokens) * self.period / self.rate
            await asyncio.sleep(wait)
