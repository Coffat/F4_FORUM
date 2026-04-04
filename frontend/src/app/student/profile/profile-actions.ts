"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { UpdateProfileInput } from "@/validations/student.schema";

/**
 * updateStudentProfileAction: Server Action cho Form cập nhật.
 * Đảm bảo dữ liệu được cập nhật tại Backend và UI đồng bộ qua revalidatePath.
 */
export async function updateStudentProfileAction(data: UpdateProfileInput) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Phiên làm việc hết hạn!" };
    }

    const response = await fetch("http://localhost:8080/api/v1/student/profile", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return { success: false, message: errorMsg || "Cập nhật hồ sơ thất bại!" };
    }

    // Làm mới cache cho trang profile để hiển thị dữ liệu mới
    revalidatePath("/student/profile");
    
    return { success: true, message: "Cập nhật hồ sơ thành công!" };
  } catch (error) {
    console.error("Profile Action Error:", error);
    return { success: false, message: "Lỗi kết nối nghiêm trọng!" };
  }
}
