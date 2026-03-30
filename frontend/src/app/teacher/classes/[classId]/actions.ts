"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type CreateAssignmentState = {
  error: string | null;
  success: boolean;
};

const assignmentSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề bài tập!"),
  description: z.string().min(1, "Vui lòng nhập mô tả bài tập!"),
  dueDateTime: z.string().optional(),
  maxScore: z.string().optional(),
});

export async function createAssignmentAction(
  classId: string,
  formData: FormData
): Promise<CreateAssignmentState> {
  const parsed = assignmentSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    dueDateTime: formData.get("dueDateTime"),
    maxScore: formData.get("maxScore"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return { error: "Bạn chưa đăng nhập!", success: false };
  }

  const payload = new FormData();
  payload.append("title", parsed.data.title);
  payload.append("description", parsed.data.description);
  if (parsed.data.dueDateTime && parsed.data.dueDateTime.trim().length > 0) {
    payload.append("dueDateTime", parsed.data.dueDateTime);
  }
  if (parsed.data.maxScore && parsed.data.maxScore.trim().length > 0) {
    payload.append("maxScore", parsed.data.maxScore);
  }

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    payload.append("file", file);
  }

  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/teachers/classes/${classId}/assignments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }
    );

    if (!res.ok) {
      const message = await res.text();
      return { error: message || "Tạo bài tập thất bại!", success: false };
    }

    revalidatePath(`/teacher/classes/${classId}`);
    revalidatePath("/teacher/classes");
    return { error: null, success: true };
  } catch (error) {
    console.error("[CreateAssignment] Backend connection failed:", error);
    return { error: "Không kết nối được backend!", success: false };
  }
}

