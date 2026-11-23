# Entrega para importación manual

Aquí tienes los dos proyectos listos para copiar en tus repositorios.

## Opción A: copiar carpetas

- Copia TODO el contenido de `api-gaitan/` en la raíz de tu repositorio backend.
- Copia TODO el contenido de `frontend-gaitan/` en la raíz de tu repositorio frontend.

Las carpetas **no incluyen** `.git`, `node_modules`, `.venv`, `dist` ni
resultados de pruebas. Si tu repositorio ya tiene `.git`, conserva el tuyo.

## Opción B: subir ZIP

Sube `api-gaitan.zip` y `frontend-gaitan.zip` a GitHub y créalos como
repositorios independientes, o descomprímelos dentro de repositorios ya
existentes.

## Puesta en marcha rápida (Windows)

Doble clic en `INICIAR.bat`. Abrirá dos ventanas (API y frontend) y el
navegador en `http://localhost:5173`. La primera vez instalará dependencias.

## Puesta en marcha manual

```bash
# Backend
cd api-gaitan
python -m venv .venv && . .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend-gaitan
npm install
npm run dev
```

Copia `.env.example` a `.env` si necesitas ajustar CORS, timeouts o URLs de
proveedores. No hay claves API en el código.

## Verificación incluida

- 15 endpoints REST y Swagger en `/docs`.
- 90 pruebas backend, 38 pruebas frontend y 4 pruebas E2E.
- Ningún archivo supera 100 líneas físicas.
- El polígono es el barrio oficial SDIS 110292 "La Gaitana" de Suba
  (sector catastral 009216 como metadato).

La sección Seguridad muestra tasas y totales oficiales de criminalidad de Suba
(SCJ, series 2018–2026 sobre población de 2019) y el Inicio muestra datos
generales de la localidad. Los datos agregados aparecen solo como
`scope=locality`; las cámaras y los hurtos a nivel de barrio se entregan vacíos
con explicación porque no existe fuente pública autorizada a ese nivel.

La interfaz tiene estética de cómic infantil con colores vivos, burbujas y un
guía animado. La insignia «EN VIVO» sincroniza mapa, criminalidad y datos
generales cada 20 segundos; también permite pausar o actualizar al instante.
