#!/bin/bash

# Ép hệ thống dùng Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"

echo "🧹 Dọn dẹp các cổng bị kẹt (3000, 8080)..."
kill -9 $(lsof -t -i:8080) $(lsof -t -i:3000) 2>/dev/null

echo "🚀Khởi động Database..."
docker-compose up -d

# Chờ Database khởi động xong hoàn toàn
echo "⏳ Đang đợi MySQL sẵn sàng..."
until docker exec f4_forum_db mysqladmin ping -uroot -proot --silent; do
  echo "  ...MySQL vẫn đang khởi động, đợi 2 giây..."
  sleep 2
done
echo "✅ MySQL đã sẵn sàng!"

echo "🟢Khởi chạy Backend (Spring Boot)..."
cd backend && mvn clean spring-boot:run &
BE_PID=$!

echo "🔵Khởi chạy Frontend (Next.js)..."
cd frontend && pnpm run dev &
FE_PID=$!

echo "🛠Tất cả đã sẵn sàng. Nhấn Ctrl+C ở đây để TẮT tất cả."

# Bắt sự kiện Ctrl+C (Tín hiệu INT) để tắt tiến trình Java và Node.
trap "echo '🔴Đang đóng hệ thống...'; kill -9 \$(lsof -t -i:8080) \$(lsof -t -i:3000) 2>/dev/null; docker-compose stop; exit" SIGINT SIGTERM EXIT

wait
