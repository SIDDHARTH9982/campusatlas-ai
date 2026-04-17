@echo off
title CampusAtlas AI - Startup Manager
color 0b

echo ==========================================
echo    CampusAtlas AI - Starting Services
echo ==========================================
echo.

echo [1/2] Starting Backend Server...
start "CampusAtlas Backend" cmd /k "cd backend && title CampusAtlas Backend && npm run dev"

echo [2/2] Starting Frontend Vite Server...
start "CampusAtlas Frontend" cmd /k "cd frontend && title CampusAtlas Frontend && npm run dev"

echo.
echo ==========================================
echo    All services are launching!
echo    Frontend: http://localhost:5173
echo ==========================================
echo.
pause
