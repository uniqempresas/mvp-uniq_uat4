@echo off
set "PATH=%~dp0mingit\cmd;%PATH%"

echo ==========================================
echo      MODO DE TESTE SIMPLIFICADO
echo ==========================================
echo.

echo 1. Verificando Git...
git --version
echo.

echo 2. Adicionando arquivos ao palco (Stage)...
git add .
if %errorlevel% neq 0 echo [ERRO NO ADD]
echo Feito.
echo.

set /p msg="Digite a mensagem do commit: "
echo.

echo 3. Realizando Commit...
git commit -m "%msg%"
if %errorlevel% neq 0 echo [ERRO/AVISO NO COMMIT]
echo.

echo 4. Tentando enviar para o GitHub (Push)...
git push origin main

echo.
echo ==========================================
echo DIAGNOSTICO FINAL
echo ==========================================
echo Se apareceu erro acima, tire um print.
echo.
pause
