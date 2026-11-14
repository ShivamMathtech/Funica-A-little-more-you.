@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 22.12 or newer, then run this file again.
  pause
  exit /b 1
)
echo Installing exact dependencies from package-lock.json...
call npm ci
if errorlevel 1 (
  echo Install failed. Check Node.js version and internet access.
  pause
  exit /b 1
)
echo Starting Funica. Open the Local URL shown below.
call npm run dev
pause
