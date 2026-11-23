from app.application.use_cases.base import FetchPlaces


class GetStreets(FetchPlaces):
    """Consultar vías del barrio, con surface/smoothness cuando existan."""
