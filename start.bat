@echo off
REM Electricity Usage Advisor - Windows Startup Script

echo ==================================================
echo   Electricity Usage Advisor - Startup Script
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "server" (
    echo ERROR: Please run this script from the project root directory
    echo        (the directory containing 'server' and 'client' folders)
    pause
    exit /b 1
)

REM Check Python installation
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed
    echo        Please install Python 3.7 or higher
    pause
    exit /b 1
)

echo Python found
echo.

REM Install dependencies
echo Installing Python dependencies...
cd server
python -m pip install -r requirements.txt --quiet

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo        Try running: pip install -r server\requirements.txt
    pause
    exit /b 1
)

echo Dependencies installed
echo.

REM Start the Flask server
echo Starting Flask backend server...
echo Server will be available at: http://localhost:5000
echo.
echo To access the application:
echo   1. Keep this window open
echo   2. Open client\index.html in your web browser
echo   OR
echo   3. In another terminal, run: python -m http.server 8000
echo      Then open: http://localhost:8000
echo.
echo ==================================================
echo.

REM Start the server
python app.py