import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import AttendanceSheetClient from "./AttendanceSheetClient";
import AttendanceFiltersClient from "./AttendanceFiltersClient";

type TeacherClassSummary = {
  classId: number;
  classCode: string;
  courseName: string;
  status: string;
  activeStudents: number;
  weeklySessions: number;
};

type Session = {
  scheduleId: number;
  date: string;
  startTime: string;
  endTime: string;
};

type AttendanceStudent = {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  enrollmentStatus: string;
  present: boolean;
  remarks: string | null;
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

export default async function TeacherAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; scheduleId?: string }>;
}) {
  const params = await searchParams;

  const classesRes = await fetchWithToken("/me/classes");
  const classes: TeacherClassSummary[] = classesRes ? await classesRes.json() : [];
  const selectedClassId = params.classId ?? (classes[0] ? String(classes[0].classId) : "");

  const sessionsRes = selectedClassId
    ? await fetchWithToken(`/classes/${selectedClassId}/attendance/sessions`)
    : null;
  const sessions: Session[] = sessionsRes ? await sessionsRes.json() : [];
  const selectedScheduleId = params.scheduleId ?? (sessions[0] ? String(sessions[0].scheduleId) : "");

  const studentsRes =
    selectedClassId && selectedScheduleId
      ? await fetchWithToken(`/classes/${selectedClassId}/attendance?scheduleId=${selectedScheduleId}`)
      : null;
  const students: AttendanceStudent[] = studentsRes ? await studentsRes.json() : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="rounded-2xl border-slate-100 p-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
          ĐIỂM DANH
        </p>
        <div className="space-y-5">
          <AttendanceFiltersClient
            classes={classes}
            sessions={sessions}
            selectedClassId={selectedClassId}
            selectedScheduleId={selectedScheduleId}
          />

          {selectedClassId && selectedScheduleId ? (
            <AttendanceSheetClient
              classId={selectedClassId}
              scheduleId={selectedScheduleId}
              students={students}
            />
          ) : (
            <p className="text-sm text-slate-500 font-medium">
              Vui lòng chọn lớp và buổi học để bắt đầu điểm danh.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

