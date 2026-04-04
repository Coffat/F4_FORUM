@echo off
TITLE F4 Forum Dev Console
echo [1/3] Khoi dong Database qua Docker...
docker-compose up -d

echo.
echo [2/3] Dang khoi chay Backend (Spring Boot)...
start "F4-Backend" cmd /k "cd backend && mvn clean spring-boot:run"

echo.
echo [3/3] Dang khoi chay Frontend (Next.js)...
start "F4-Frontend" cmd /k "cd frontend && pnpm dev"

echo.
echo ======================================================
echo DA GUI LENH KHOI CHAY TAT CA!
echo - Backend: http://localhost:8080
echo - Frontend: http://localhost:3000
echo ======================================================
pause
