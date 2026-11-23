from app.infrastructure.providers.crimes_series import build
from app.infrastructure.providers.locality import PROPERTIES


def test_crime_rates_come_from_official_aggregates():
    rates = build({
        "CMMES": "Ene-Sep (2018vs2026)",
        "CMH18CONT": 10,
        "CMH19CONT": 20,
        "CMLP18CONT": 5,
        "CMHTOTAL": 30,
        "CMHVAR": -20,
    })
    assert rates["scope"] == "locality"
    assert rates["population"] == PROPERTIES["population_2019"]
    assert len(rates["series"]) == 9
    first = rates["series"][0]
    assert first["year"] == 2018
    assert first["Homicidios"] == 10
    assert first["total"] == 15
    assert first["rate_per_100k"] == round(15 / 1348372 * 100000, 2)
    assert rates["totals"]["Homicidios"] == 30
    assert rates["variation_pct"]["Homicidios"] == -20


def test_crime_rates_ignore_missing_values_without_inventing_data():
    rates = build({})
    assert all(row["total"] == 0 for row in rates["series"])
    assert all(value is None for value in rates["totals"].values())
