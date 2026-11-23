import json
import time

from app.infrastructure.providers.nominatim import disk_cache


def test_guarda_y_recupera_items_reales(monkeypatch, tmp_path):
    monkeypatch.setattr(disk_cache, "CACHE_FILE", tmp_path / "cache.json")
    items = [{"osm_type": "node", "osm_id": 1, "lat": "4.74", "lon": "-74.11"}]
    disk_cache.write("restaurants", items)
    assert disk_cache.read("restaurants") == items
    assert disk_cache.read("sports") is None


def test_ignora_cache_vencida_salvo_en_fallback(monkeypatch, tmp_path):
    path = tmp_path / "cache.json"
    monkeypatch.setattr(disk_cache, "CACHE_FILE", path)
    path.write_text(json.dumps({
        "restaurants": {"timestamp": time.time() - 90000, "items": [{"id": 1}]},
    }), encoding="utf-8")
    assert disk_cache.read("restaurants") is None
    assert disk_cache.read("restaurants", allow_stale=True) == [{"id": 1}]


def test_archivo_inexistente_o_invalido_devuelve_none(monkeypatch, tmp_path):
    path = tmp_path / "cache.json"
    monkeypatch.setattr(disk_cache, "CACHE_FILE", path)
    assert disk_cache.read("restaurants") is None
    path.write_text("no es json", encoding="utf-8")
    assert disk_cache.read("restaurants") is None
