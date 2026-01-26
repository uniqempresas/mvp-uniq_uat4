@echo off
echo Sincronizando projeto com GitHub...
set "PATH=%~dp0mingit\cmd;%PATH%"
git pull
if %errorlevel% neq 0 (
    echo.
    echo Erro ao sincronizar. Verifique sua conexao.
) else (
    echo.
    echo Projeto atualizado com sucesso!
)
pause
