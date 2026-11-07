@echo off
title Sunlight Researcher - Sunlight Studio
color 0b
echo ===============================================================================
echo        SUNLIGHT RESEARCHER - AD INTELLIGENCE & CAMPAIGN ENGINEERING
echo ===============================================================================
echo.

:: 1. Verificare existenta Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [EROARE] Node.js nu este instalat pe acest calculator!
    echo.
    echo Te rugam sa descarci si sa instalezi versiunea Node.js LTS (recomandat v20+):
    echo -> https://nodejs.org/
    echo.
    echo Dupa instalarea Node.js, reporneste acest fisier (start.bat).
    echo ===============================================================================
    pause
    exit /b
)

:: 2. Verificare dependente node_modules
if not exist node_modules (
    echo [PASUL 1/3] Instalam dependentele aplicatiei (npm install)...
    echo Acest pas se executa doar prima data si dureaza aproximativ 20-30 secunde.
    call npm install
    if %errorlevel% neq 0 (
        echo [EROARE] Instalarea dependintelor a esuat. Verifica conexiunea la internet.
        pause
        exit /b
    )
    echo [OK] Dependente instalate cu succes!
    echo.
)

:: 3. Initializare fisier configurare .env daca nu exista
if not exist .env (
    if exist .env.example (
        echo [PASUL 2/3] Initializam fisierul de configurare .env din .env.example...
        copy .env.example .env >nul
        echo [OK] Fisierul .env a fost creat! Poti adauga in el META_ACCESS_TOKEN sau OPENAI_API_KEY.
        echo.
    )
)

:: 4. Pornire server si deschidere automata in browser
echo [PASUL 3/3] Pornim serverul pe http://localhost:3000 ...
echo [INFO] Se deschide interfata in browserul tau implicit...
start http://localhost:3000

echo.
echo ===============================================================================
echo Serverul ruleaza activ! Pentru a opri aplicatia, inchide aceasta fereastra.
echo ===============================================================================
echo.
call npm start
pause
