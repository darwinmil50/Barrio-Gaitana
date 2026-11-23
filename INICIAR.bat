@echo off
echo Iniciando GAITAN TERRITORIAL...
start "GAITAN API" cmd /c ""%~dp0INICIAR_API.bat""
start "GAITAN WEB" cmd /c ""%~dp0INICIAR_WEB.bat""
echo API:   http://localhost:8000/docs
echo WEB:   http://localhost:5173
timeout /t 12 >nul
start http://localhost:5173
