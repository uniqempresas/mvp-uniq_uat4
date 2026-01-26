@echo off
echo Configurando ambiente Node.js Portatil (c:\hq\node-v24.13.0-win-x64)...
set "PATH=c:\hq\node-v24.13.0-win-x64;%PATH%"
echo.
echo Iniciando servidor de desenvolvimento...
call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo Ocorreu um erro ao iniciar o servidor.
    pause
)
