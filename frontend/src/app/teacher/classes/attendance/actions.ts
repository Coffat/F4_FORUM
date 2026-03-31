"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

type AttendanceEntry = {
  enrollmentId: number;
  isPresent: boolean;
  remarks: string;
};

export async function saveAttendanceAction(
  classId: string,
  scheduleId: string,
  entries: AttendanceEntry[]
): Promise<{ error: string | null; success: boolean }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return { error: "Bạn chưa đăng nhập!", success: false };
  }

  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/teachers/classes/${classId}/attendance?scheduleId=${scheduleId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entries }),
      }
    );

    if (!res.ok) {
      return { error: (await res.text()) || "Lưu điểm danh thất bại!", success: false };
    }

    revalidatePath("/teacher/classes/attendance");
    return { error: null, success: true };
  } catch (error) {
    console.error("[Attendance] Save failed:", error);
    return { error: "Không kết nối được backend!", success: false };
  }
}

