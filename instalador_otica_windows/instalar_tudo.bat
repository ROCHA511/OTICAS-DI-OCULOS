
@echo off
echo INICIANDO INSTALACAO AUTOMATICA DO SISTEMA OTICA INTELIGENTE...
REM Instalar Node.js
start /wait node-lts.msi

REM Instalar PostgreSQL
start /wait postgresql-15-windows-x64.exe --mode unattended --superpassword admin123 --servicename pgOtica

REM Criar banco e importar dump
cd database
psql -U postgres -c "CREATE DATABASE otica;"
psql -U postgres -d otica -f dump.sql

REM Iniciar backend
cd ../backend
start cmd /k "pip install -r requirements.txt && uvicorn main:app --reload"

REM Iniciar frontend
cd ../frontend
start cmd /k "npm install && npm run dev"

echo INSTALACAO FINALIZADA.
pause
