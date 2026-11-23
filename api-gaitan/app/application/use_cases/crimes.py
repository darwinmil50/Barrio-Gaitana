from app.application.use_cases.base import FetchPlaces


class GetCrimes(FetchPlaces):
    """Nunca entrega delitos por barrio: sólo contexto agregado de localidad."""
