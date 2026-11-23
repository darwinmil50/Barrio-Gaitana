"""Convierte los agregados reales del SCJ en series y tasas verificables."""

from app.infrastructure.providers.locality import PROPERTIES

TYPES = (
    ("CMH", "Homicidios"),
    ("CMLP", "Lesiones personales"),
    ("CMHP", "Hurto a personas"),
    ("CMHR", "Hurto a residencias"),
    ("CMHA", "Hurto a automotores"),
    ("CMHC", "Hurto a comercios"),
    ("CMHM", "Hurto de motocicletas"),
    ("CMDS", "Delitos sexuales"),
    ("CMVI", "Violencia intrafamiliar"),
    ("CME", "Extorsión"),
    ("CMS", "Secuestro"),
    ("CMHF", "Feminicidio"),
)


def _value(attrs: dict, key: str) -> int | float | None:
    raw = attrs.get(key)
    try:
        return float(raw) if "." in str(raw) else int(raw)
    except (TypeError, ValueError):
        return None


def build(attrs: dict) -> dict:
    """Devuelve series anuales, totales, variación y tasas por 100 mil hab."""
    population = PROPERTIES["population_2019"]
    series: list[dict] = []
    for suffix in range(18, 27):
        row: dict = {
            label: _value(attrs, f"{code}{suffix}CONT")
            for code, label in TYPES
        }
        row["total"] = sum(value for value in row.values()
                           if isinstance(value, (int, float)))
        row["rate_per_100k"] = round(row["total"] / population * 100000, 2)
        series.append({"year": 2000 + suffix, **row})
    return {
        "type": "crime_rates",
        "scope": "locality",
        "locality": "Suba",
        "period": attrs.get("CMMES"),
        "population": population,
        "population_year": 2019,
        "rate_basis": "Delitos por 100.000 habitantes (población Suba 2019)",
        "series": series,
        "totals": {label: _value(attrs, f"{code}TOTAL") for code, label in TYPES},
        "variation_pct": {
            label: _value(attrs, f"{code}VAR") for code, label in TYPES
        },
    }
