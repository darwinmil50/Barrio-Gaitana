"""Errores del dominio y de integración con fuentes externas."""


class ProviderError(Exception):
    """Falla de una fuente externa; se traduce a `note`, nunca a 500."""

    def __init__(self, message: str, source: str = "desconocida") -> None:
        super().__init__(message)
        self.message = message
        self.source = source
