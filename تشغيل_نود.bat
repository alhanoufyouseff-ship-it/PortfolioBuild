@echo off
title PortfolioBuild Node.js Server
echo ===================================================
echo   PortfolioBuild - تشغيل خادم Node.js (Express)
echo ===================================================
echo.
echo 1. جاري التحقق من الحزم وتثبيتها...
call npm install
echo.
echo 2. جاري تشغيل الخادم وفتح المتصفح...
start http://127.0.0.1:5000
node server.js
pause
