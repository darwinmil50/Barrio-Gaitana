# Publicar GAITÁN TERRITORIAL con GitHub Pages

GitHub Pages publica solo archivos estáticos. No ejecuta Python, por lo que
la API debe desplegarse por separado en un servicio con HTTPS.

## 1. Publicar la API

1. Crea una cuenta en `https://render.com` y conecta tu GitHub.
2. Pulsa **New + → Web Service** y selecciona `darwinmil50/Barrio-Gaitana`.
3. Configura:
   - **Root Directory**: `api-gaitan`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Añade la variable de entorno:
   - `GAITAN_CORS_ORIGINS` = `https://darwinmil50.github.io`
5. Despliega y copia la URL resultante, por ejemplo
   `https://gaitan-api.onrender.com`.

También sirve Railway, Fly.io o PythonAnywhere. La URL debe empezar con
`https://`; `http://localhost:8000` solo funciona en tu PC.

## 2. Crear el secreto de GitHub

En `https://github.com/darwinmil50/Barrio-Gaitana`:

1. **Settings → Secrets and variables → Actions**.
2. **New repository secret**.
3. Nombre: `VITE_API_URL`.
4. Valor: la URL pública de la API del paso 1, sin barra final.

## 3. Activar Pages

1. **Settings → Pages**.
2. En **Source**, elige **GitHub Actions**.

## 4. Publicar

Cada push a `main` ejecuta `.github/workflows/deploy-pages.yml`, compila el
frontend con `VITE_API_URL` y publica `dist`.

La carpeta `frontend-gaitan/dist` también queda versionada como copia de la
versión pública compilada. Para regenerarla localmente:

```bash
cd frontend-gaitan
$env:VITE_API_URL="https://barrio-gaitana.onrender.com"
npm run build
```

También puedes ir a **Actions → Desplegar frontend en GitHub Pages → Run
workflow**.

La dirección final será:

`https://darwinmil50.github.io/Barrio-Gaitana/`

## Prueba rápida antes de publicar

En tu PC, desde `frontend-gaitan`:

```bash
npm install
$env:VITE_API_URL="https://TU-API-PUBLICA"
npm run build
npm run preview
```

Si la página muestra datos, el despliegue funcionará.
