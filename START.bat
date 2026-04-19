@echo off
title CampusAtlas AI - Startup Manager
color 0b

echo ==========================================
echo    CampusAtlas AI - Starting Services
echo ==========================================
echo.

echo [1/3] Starting Backend Server...
start "CampusAtlas Backend" cmd /k "cd backend && title CampusAtlas Backend && npm run dev"

echo [2/3] Starting Frontend Vite Server...
start "CampusAtlas Frontend" cmd /k "cd frontend && title CampusAtlas Frontend && npm run dev"

echo [3/3] Opening Browser...
timeout /t 3 /nobreak >nul
start http://localhost:5174

echo.
echo ==========================================
echo    All services are launching!
echo    URL: http://localhost:5174
echo ==========================================
echo.
pause
