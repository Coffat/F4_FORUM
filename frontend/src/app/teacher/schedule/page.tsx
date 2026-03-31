import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import TeacherScheduleWeekClient from "./TeacherScheduleWeekClientHover";

type ScheduleEvent = {
  scheduleId: number;
  classId: number;
  classCode: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  roomName: string | null;
  branchName: string | null;
  online: boolean;
  meetingLink: string | null;
};

const TEACHER_BASE = "http://localhost:8080/api/v1/teachers";

async function getScheduleEvents(from: string, to: string): Promise<ScheduleEvent[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return [];

  try {
    const res = await fetch(`${TEACHER_BASE}/me/schedule?from=${from}&to=${to}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as ScheduleEvent[];
  } catch {
    return [];
  }
}

export default async function TeacherSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const weekParam = typeof params.week === "string" ? params.week : null;
  const base = weekParam ? new Date(`${weekParam}T00:00:00`) : now;
  const day = base.getDay(); // 0 Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(base);
  weekStart.setDate(base.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const toIsoDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const weekStartIso = toIsoDate(weekStart);
  const events = await getScheduleEvents(weekStartIso, toIsoDate(weekEnd));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Lịch dạy
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Theo dõi lịch dạy theo dạng Calendar.
        </p>
      </div>

      <Card className="rounded-2xl border-slate-100 p-4">
        <TeacherScheduleWeekClient weekStartIso={weekStartIso} events={events} />
      </Card>
    </div>
  );
}

