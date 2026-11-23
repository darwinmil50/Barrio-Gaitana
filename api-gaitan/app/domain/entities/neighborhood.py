"""Identidad oficial del barrio (SDIS Barrio Común + UAECD)."""

NAME = "La Gaitana"
OFFICIAL_NAME = "LA GAITANA"
CODE = "110292"
CADASTRAL_SECTOR = "009216"
LOCALITY = "Suba"
CITY = "Bogotá D.C."


def to_dict() -> dict:
    return {
        "name": NAME,
        "official_name": OFFICIAL_NAME,
        "code": CODE,
        "cadastral_sector": CADASTRAL_SECTOR,
        "locality": LOCALITY,
        "city": CITY,
    }
