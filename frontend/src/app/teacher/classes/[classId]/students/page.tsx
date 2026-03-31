import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import Link from "next/link";
import TeacherClassStudentsTableClient from "./TeacherClassStudentsTableClient";

type TeacherClassStudent = {
  enrollmentId: number;
  studentId: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  enrollmentStatus: string;
};

const TEACHER_STUDENTS_URL = "http://localhost:8080/api/v1/teachers/classes";

async function getClassStudents(classId: string): Promise<TeacherClassStudent[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return [];

  try {
    const res = await fetch(`${TEACHER_STUDENTS_URL}/${classId}/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as TeacherClassStudent[];
  } catch {
    return [];
  }
}

export default async function TeacherClassStudentsPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const students = await getClassStudents(classId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            Danh sách học viên của lớp
          </h3>
          <p className="text-slate-500 mt-1 font-medium">Class ID: {classId}</p>
        </div>
        <Link
          href={`/teacher/classes/${classId}`}
          className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl hover:bg-blue-100 transition"
        >
          Quay lại lớp
        </Link>
      </div>

      <Card className="rounded-2xl border-slate-100 p-0 overflow-hidden">
        {students.length === 0 ? (
          <p className="text-sm text-slate-500 font-medium p-6">
            Chưa có học viên nào trong lớp này.
          </p>
        ) : (
          <div className="p-6">
            <TeacherClassStudentsTableClient students={students} />
          </div>
        )}
      </Card>
    </div>
  );
}

