@echo off
set "ADHERA_ROOT=%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%ADHERA_ROOT%tools\open-local.ps1" -Page portal
