@echo off
echo 🤖 === MAIA Bot Manager ===
echo Gestor de Bot de Telegram para MAIA
echo.

:menu
echo Selecciona una opción:
echo.
echo 1. ▶️  Iniciar Bot Completo (con IA y Moodle)
echo 2. 🧪 Iniciar Bot Simple (solo pruebas)
echo 3. 📊 Ver estado del bot
echo 4. 🛑 Detener todos los bots
echo 5. 📋 Ver logs del bot
echo 6. 🚪 Salir
echo.

set /p choice="Ingresa tu opción (1-6): "

if "%choice%"=="1" goto fullbot
if "%choice%"=="2" goto simplebot
if "%choice%"=="3" goto status
if "%choice%"=="4" goto stop
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto exit

echo ❌ Opción inválida. Intenta de nuevo.
goto menu

:fullbot
echo.
echo 🚀 Iniciando Bot Completo con todas las funcionalidades...
echo ⚡ Bot: @MyMoodle_bot
echo 📚 Funciones: IA + Moodle + Análisis + Soporte
echo.
python moodle_cli_allinone.py --telegram
goto menu

:simplebot
echo.
echo 🧪 Iniciando Bot Simple para pruebas...
echo ⚡ Bot: @MyMoodle_bot
echo 📚 Funciones: Solo respuestas básicas
echo.
python telegram_bot_simple.py
goto menu

:status
echo.
echo 📊 Verificando estado del bot...
tasklist /fi "imagename eq python.exe" /fo table | findstr python.exe >nul
if %errorlevel%==0 (
    echo ✅ Bot activo - Procesos Python ejecutándose:
    tasklist /fi "imagename eq python.exe" /fo table
) else (
    echo ❌ Bot inactivo - No hay procesos Python ejecutándose
)
echo.
pause
goto menu

:stop
echo.
echo 🛑 Deteniendo todos los bots...
taskkill /f /im python.exe >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Bots detenidos correctamente
) else (
    echo ℹ️  No había bots ejecutándose
)
echo.
pause
goto menu

:logs
echo.
echo 📋 Logs recientes del bot:
echo ============================================
echo [Esta funcionalidad se implementará próximamente]
echo Los logs aparecen en la consola cuando el bot está ejecutándose
echo ============================================
echo.
pause
goto menu

:exit
echo.
echo 👋 ¡Hasta luego!
echo Todos los bots seguirán ejecutándose en segundo plano.
echo Usa la opción 4 para detenerlos si es necesario.
pause
