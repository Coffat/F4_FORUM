import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import GradesSheetClient from "./GradesSheetClient";
import ClassFilterAutoLoad from "../_components/ClassFilterAutoLoad";

type TeacherClassSummary = {
  classId: number;
  classCode: string;
  courseName: string;
};

type GradeRow = {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  midtermScore: number | null;
  finalScore: number | null;
  grade: string | null;
  teacherComment: string | null;
};

const TEACHER_BASE = "http://localhost:8080/api/v1/teachers";

async function fetchWithToken(path: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const res = await fetch(`${TEACHER_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res;
}

export default async function TeacherGradesPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string }>;
}) {
  const params = await searchParams;
  const classesRes = await fetchWithToken("/me/classes");
  const classes: TeacherClassSummary[] = classesRes ? await classesRes.json() : [];
  const selectedClassId = params.classId ?? (classes[0] ? String(classes[0].classId) : "");

  const gradesRes = selectedClassId ? await fetchWithToken(`/classes/${selectedClassId}/grades`) : null;
  const rows: GradeRow[] = gradesRes ? await gradesRes.json() : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="rounded-2xl border-slate-100 p-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
          NHẬP ĐIỂM
        </p>
        <div className="space-y-5">
          <ClassFilterAutoLoad
            classes={classes}
            selectedClassId={selectedClassId}
            targetPath="/teacher/classes/grades"
          />

          {selectedClassId ? (
            <GradesSheetClient classId={selectedClassId} rows={rows} />
          ) : (
            <p className="text-sm text-slate-500 font-medium">
              Bạn chưa có lớp để nhập điểm.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

