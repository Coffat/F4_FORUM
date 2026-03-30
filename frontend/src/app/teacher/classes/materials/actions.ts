"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type CreateMaterialState = {
  error: string | null;
  success: boolean;
};

const schema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề tài liệu!"),
  description: z.string().optional(),
});

export async function createMaterialAction(
  classId: string,
  formData: FormData
): Promise<CreateMaterialState> {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Vui lòng kéo thả hoặc chọn file tài liệu!", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return { error: "Bạn chưa đăng nhập!", success: false };

  const payload = new FormData();
  payload.append("title", parsed.data.title);
  if (parsed.data.description && parsed.data.description.trim().length > 0) {
    payload.append("description", parsed.data.description);
  }
  payload.append("file", file);

  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/teachers/classes/${classId}/materials`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      }
    );
    if (!res.ok) {
      return { error: (await res.text()) || "Upload tài liệu thất bại!", success: false };
    }

    revalidatePath("/teacher/classes/materials");
    return { error: null, success: true };
  } catch (error) {
    console.error("[Materials] Upload failed:", error);
    return { error: "Không kết nối được backend!", success: false };
  }
}

