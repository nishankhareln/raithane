@echo off
cd /d "%~dp0"
set "PATH=D:\hackathon\.node;%PATH%"
echo ============================================
echo   Kadam (Next.js) starting...
echo   Open http://localhost:3000 in your browser
echo   Keep this window open. Ctrl+C to stop.
echo ============================================
call "D:\hackathon\.node\node.exe" "%~dp0node_modules\next\dist\bin\next" dev
pause
