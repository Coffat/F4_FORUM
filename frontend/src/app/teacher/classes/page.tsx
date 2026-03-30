import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import Link from "next/link";

type TeacherClassSummary = {
  classId: number;
  classCode: string;
  courseName: string;
  status: string;
  activeStudents: number;
  weeklySessions: number;
};

const TEACHER_CLASSES_URL = "http://localhost:8080/api/v1/teachers/me/classes";

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

    if (!res.ok) {
      console.error("[TeacherClasses] Failed:", await res.text());
      return [];
    }

    return (await res.json()) as TeacherClassSummary[];
  } catch (err) {
    console.error("[TeacherClasses] Backend connection failed:", err);
    return [];
  }
}

export default async function TeacherClassesOverviewPage() {
  const classes = await getTeacherClasses();

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500 pb-10">
      <Card className="rounded-2xl border-slate-100 p-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
          DANH SÁCH LỚP
        </p>
        <div className="space-y-3">
          {classes.length === 0 && (
            <p className="text-sm text-slate-500 font-medium">
              Hiện tại bạn chưa được gán vào lớp nào.
            </p>
          )}

          {classes.map((clazz) => (
            <Link
              key={clazz.classId}
              href={`/teacher/classes/${clazz.classId}`}
              className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4"
            >
              <div>
                <p className="font-bold text-slate-900">
                  {clazz.classCode} — {clazz.courseName}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {clazz.activeStudents} học viên • {clazz.weeklySessions} buổi/tuần
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl">
                {clazz.status}
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

