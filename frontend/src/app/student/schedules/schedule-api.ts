'use server'

import { cookies } from "next/headers";
import { Schedule } from "@/types/schedule.types";

/**
 * fetchSchedulesAction - Một Server Action của Next.js 15.
 * Bảo mật: Lấy Token từ HttpOnly Cookie trực tiếp tại Server.
 * Throughput: Gọi đến Backend Spring Boot (đã bật Virtual Threads).
 */
export async function fetchSchedulesAction(startDate: string, endDate: string): Promise<Schedule[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
    }

    const response = await fetch(
      `http://localhost:8080/api/v1/student/me/schedules?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store' // Đảm bảo luôn lấy lịch mới nhất
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Bạn không có quyền truy cập dữ liệu lịch học.");
      }
      throw new Error("Hệ thống lịch học đang bảo trì. Vui lòng thử lại sau.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Schedule API Error:", error);
    throw new Error(error.message || "Không thể kết nối đến máy chủ lịch học.");
  }
}
