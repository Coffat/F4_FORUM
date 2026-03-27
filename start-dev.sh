#!/bin/bash

echo "🚀Khởi động Database..."
docker-compose up -d

echo "🟢Khởi chạy Backend (Spring Boot)..."
cd backend && mvn spring-boot:run &
BE_PID=$!

echo "🔵Khởi chạy Frontend (Next.js)..."
cd frontend && pnpm run dev &
FE_PID=$!

echo "🛠Tất cả đã sẵn sàng. Nhấn Ctrl+C ở đây để TẮT tất cả."

# Bắt sự kiện Ctrl+C (Tín hiệu INT) để tắt tiến trình Java và Node.
trap "echo '🔴Đang đóng hệ thống...'; kill -9 \$(lsof -t -i:8080) \$(lsof -t -i:3000) 2>/dev/null; docker-compose stop; exit" SIGINT SIGTERM EXIT

wait
