@echo off
echo ==========================================
echo   LIMPAR PROJETO DA MAQUINA
echo ==========================================
echo.
echo Este script vai DELETAR todo o projeto,
echo mantendo apenas:
echo - Scripts .bat
echo - mingit (Git portatil)
echo - node-v24.13.0-win-x64 (caso esteja aqui)
echo.
echo ATENCAO: Todo o codigo sera APAGADO!
echo Use "restaurar.bat" para baixar novamente.
echo.
pause

echo.
echo Limpando projeto...
echo.

REM Deleta todas as pastas principais do projeto
for /d %%D in (*) do (
    if /i not "%%D"=="mingit" (
        if /i not "%%D"=="node-v24.13.0-win-x64" (
            echo Deletando pasta: %%D
            rmdir /s /q "%%D" 2>nul
        )
    )
)

REM Deleta todos os arquivos exceto .bat
for %%F in (*) do (
    if /i not "%%~xF"==".bat" (
        echo Deletando arquivo: %%F
        del /q "%%F" 2>nul
    )
)

echo.
echo ==========================================
echo   PROJETO LIMPO COM SUCESSO!
echo ==========================================
echo.
echo A maquina esta limpa agora.
echo Execute "restaurar.bat" quando quiser
echo baixar o projeto novamente.
echo.
pause
