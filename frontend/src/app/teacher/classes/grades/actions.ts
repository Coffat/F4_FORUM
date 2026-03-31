"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

type GradeEntry = {
  enrollmentId: number;
  midtermScore: number | null;
  finalScore: number | null;
  grade: string;
  teacherComment: string;
};

export async function saveGradesAction(
  classId: string,
  entries: GradeEntry[]
): Promise<{ error: string | null; success: boolean }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return { error: "Bạn chưa đăng nhập!", success: false };

  try {
    const res = await fetch(`http://localhost:8080/api/v1/teachers/classes/${classId}/grades`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entries }),
    });

    if (!res.ok) return { error: (await res.text()) || "Lưu điểm thất bại!", success: false };
    revalidatePath("/teacher/classes/grades");
    return { error: null, success: true };
  } catch (error) {
    console.error("[Grades] Save failed:", error);
    return { error: "Không kết nối được backend!", success: false };
  }
}

