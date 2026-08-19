@echo off
title PortfolioBuild Server
echo Starting PortfolioBuild local server...
start http://127.0.0.1:5000
python app.py
pause
