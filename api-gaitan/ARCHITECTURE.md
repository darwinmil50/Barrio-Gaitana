# Decisiones arquitectónicas

## Diagrama

```text
  Cliente (frontend Vite)
          | HTTP/JSON
          v
  app/main.py  -- CORS, /docs, handlers centralizados
          |
          v
  presentation/routes --> application/use_cases --> domain (entidades, reglas)
          |                     |                          ^
          |                     v                          |
          +--> infrastructure/dependencies.py (Container) --+
                     |        |        |
                providers  repositorio HTTP/caché/logging
                     |
        OSM API | Catastro | SITP | SCAJ | Cámaras | Suba
```

## Decisiones

1. **Dominio puro.** No importa FastAPI, httpx ni pydantic-settings.
   `in_ring`, `in_geometry` y `matching` son funciones deterministas.
2. **Polígono oficial como dato.** `GeoJsonBoundaryReader` lee el GeoJSON
   verificado del barrio 110292 (Barrio Común SDIS). Nadie puede construir otro
   polígono.
3. **Contrato estable.** Todos los endpoints ( salvo `/boundary` ) devuelven
   el mismo envelope. El frontend consume esa forma exacta.
4. **Un caso de uso por operación.** Cada clase recibe una interfaz por
   constructor; no conocen HTTP ni proveedores concretos.
5. **Registry por categoría.** `ProviderRegistry` guarda fábricas; agregar una
   fuente no obliga a tocar los casos de uso.
6. **Firma única.** Todo proveedor expone `async fetch(query, limit)` y
   devuelve `FetchResult(data, note, context)`.
7. **Aislamiento geográfico.** Se filtra con point-in-polygon ; los puntos de barrios vecinos se marcan `properties.scope=nearby` y se
   devuelven como contexto explícito, nunca como datos del barrio.
8. **Fallo aislado.** Excepciones de fuentes se convierten en `data=[]` y
   `note`; nunca se propagan como 500. El limitador y la caché son compartidos.
9. **Sin secretos.** URLs y tiempos se configuran por entorno con prefijo
   `GAITAN_`; `camera_url` vacía implica cero consultas.
10. **Caché persistente.** Los resultados OSM se versionan en disco con TTL de
    24 h; si la fuente falla se sirven datos reales ya verificados.

## Envelope

```json
{
  "scope": "neighborhood",
  "neighborhood": {"name": "La Gaitana", "official_name": "LA GAITANA",
                   "code": "110292", "cadastral_sector": "009216", "locality": "Suba",
                    "city": "Bogotá D.C."},
  "source": {"name": "...", "url": "...", "license": "...",
             "updated_at": null},
  "count": 1,
  "data": [],
  "note": null
}
```

`context` aparece sólo cuando hay agregados reales de localidad. Cada entrada
de `context` lleva `scope: "locality"`. `/api/neighborhood/boundary` devuelve
un `FeatureCollection` con un miembro extra `source`.

## Flujo de una consulta

```text
GET /api/veterinaries?q=vet&limit=20
 -> GetVeterinaries.execute(q, limit)
 -> OsmProvider.fetch(q, limit) [caché en disco + rate limit]
 -> GET OSM API /map con bbox ampliado (una sola descarga)
 -> parse_items() + in_geometry() (separa barrio y barrios vecinos)
 -> select() por texto y límite
 -> make(FetchResult, source) -> JSON
```

## Notas de datos

- `/api/crimes`: nunca reparte agregados por barrio.
- `/api/security/cameras`: nota fija, sin ubicaciones.
- `/api/streets`: etiquetas OSM disponibles; el dataset de estado superficial
  el dataset de estado superficial no se procesa en runtime.
