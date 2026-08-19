@echo off
title PortfolioBuild Server
echo ===================================================
echo   PortfolioBuild - تشغيل خادم التطبيق المحلي
echo ===================================================
echo.
echo جاري تشغيل السيرفر...
start http://127.0.0.1:5000
python app.py
pause
