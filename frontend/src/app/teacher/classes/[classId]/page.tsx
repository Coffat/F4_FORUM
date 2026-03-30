import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import Link from "next/link";
import ClassAssignmentsPanel from "./ClassAssignmentsPanel";

type TeacherClassSummary = {
  classId: number;
  classCode: string;
  courseName: string;
  status: string;
  activeStudents: number;
  weeklySessions: number;
};

const TEACHER_CLASSES_URL = "http://localhost:8080/api/v1/teachers/me/classes";
const TEACHER_ASSIGNMENTS_URL = "http://localhost:8080/api/v1/teachers/classes";

async function getTeacherClasses(): Promise<TeacherClassSummary[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return [];

  try {
    const res = await fetch(TEACHER_CLASSES_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return (await res.json()) as TeacherClassSummary[];
  } catch {
    return [];
  }
}

type TeacherAssignmentResponse = {
  id: number;
  title: string;
  description: string | null;
  attachmentUrl: string | null;
  dueDate: string | null;
};

async function getClassAssignments(
  classId: string
): Promise<TeacherAssignmentResponse[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return [];

  try {
    const res = await fetch(`${TEACHER_ASSIGNMENTS_URL}/${classId}/assignments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as TeacherAssignmentResponse[];
  } catch {
    return [];
  }
}

export default async function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const classes = await getTeacherClasses();
  const currentClass = classes.find((item) => String(item.classId) === classId);
  const assignments = await getClassAssignments(classId);

  if (!currentClass) {
    return (
      <Card className="rounded-2xl border-slate-100 p-6">
        <p className="text-lg font-bold text-slate-900">Không tìm thấy lớp học</p>
        <p className="text-sm text-slate-500 mt-1">
          Lớp này không tồn tại hoặc bạn không có quyền truy cập.
        </p>
        <Link
          href="/teacher/classes"
          className="inline-block mt-4 text-sm font-bold text-emerald-700 hover:underline"
        >
          Quay về danh sách lớp
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {currentClass.classCode} — {currentClass.courseName}
          </h3>
          <p className="text-slate-500 mt-1 font-medium">
            {currentClass.activeStudents} học viên • {currentClass.weeklySessions} buổi/tuần
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/teacher/classes/${classId}/students`}
            className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl hover:bg-blue-100 transition"
          >
            Xem tất cả học viên
          </Link>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl">
            {currentClass.status}
          </span>
        </div>
      </div>

      <Card className="rounded-2xl border-slate-100 p-6">
        <ClassAssignmentsPanel classId={classId} assignments={assignments} />
      </Card>
    </div>
  );
}

