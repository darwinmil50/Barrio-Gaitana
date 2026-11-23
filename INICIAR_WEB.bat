@echo off
cd /d "%~dp0frontend-gaitan"
if not exist node_modules npm install
npm run dev
