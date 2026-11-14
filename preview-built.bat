@echo off
setlocal
cd /d "%~dp0"
echo Starting the included production build at http://localhost:4173
node preview-dist.mjs
pause
