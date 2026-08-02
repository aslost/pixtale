@echo off
cd /d "%~dp0"
if "%PORT%"=="" set PORT=8082
set HOSTNAME=0.0.0.0
start http://localhost:%PORT%
"%~dp0node.exe" server.js
