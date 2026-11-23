import asyncio

from app.infrastructure.cache.memory import TTLCache


async def test_missing_key_returns_none():
    assert await TTLCache().get("no-existe") is None


async def test_set_and_get():
    cache = TTLCache()
    await cache.set("clave", [1, 2])
    assert await cache.get("clave") == [1, 2]


async def test_expired_key_returns_none():
    cache = TTLCache(ttl_seconds=0.001)
    await cache.set("clave", "valor")
    await asyncio.sleep(0.01)
    assert await cache.get("clave") is None


async def test_clear_removes_values():
    cache = TTLCache()
    await cache.set("a", 1)
    await cache.clear()
    assert await cache.get("a") is None
