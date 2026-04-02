import { cookies } from "next/headers";
import { StudentProfile } from "@/types/student.types";

/**
 * fetchStudentProfile: Server Component Data Fetching.
 * Bảo mật: Truyền JWT từ Cookie để BE xác thực danh tính.
 */
export async function fetchStudentProfile(): Promise<StudentProfile | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const response = await fetch("http://localhost:8080/api/v1/student/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Không cache để Profile luôn cập nhật sau khi Update
      cache: 'no-store'
    });

    if (!response.ok) {
        if(response.status === 401 || response.status === 403) return null;
        throw new Error("Lỗi kết nối máy chủ hồ sơ");
    }

    return await response.json();
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return null;
  }
}
