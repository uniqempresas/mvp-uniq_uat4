@echo off
echo ==========================================
echo   RESTAURAR PROJETO DO GITHUB
echo ==========================================
echo.
echo Este script vai:
echo - Descartar TODAS as alteracoes locais
echo - Restaurar arquivos deletados
echo - Baixar a versao mais recente do GitHub
echo.
echo ATENCAO: Suas mudancas nao salvas serao PERDIDAS!
echo.
pause

set "PATH=%~dp0mingit\cmd;%PATH%"

echo.
echo 1. Descartando alteracoes locais...
git reset --hard HEAD
if %errorlevel% neq 0 (
    echo [ERRO ao descartar alteracoes]
    goto fim
)
echo Feito.
echo.

echo 2. Limpando arquivos nao rastreados (exceto .bat)...
git clean -fd -e *.bat
if %errorlevel% neq 0 (
    echo [ERRO na limpeza]
    goto fim
)
echo Feito.
echo.

echo 3. Sincronizando com GitHub...
git pull origin main
if %errorlevel% neq 0 (
    echo [ERRO ao sincronizar]
    goto fim
)
echo.

echo ==========================================
echo   PROJETO RESTAURADO COM SUCESSO!
echo ==========================================
echo Todos os arquivos estao sincronizados
echo com a versao do GitHub.
echo.
goto fim

:fim
pause
