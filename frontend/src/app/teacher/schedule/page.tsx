import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import TeacherScheduleCalendarClient from "./TeacherScheduleCalendarClient";

type ScheduleEvent = {
  scheduleId: number;
  classId: number;
  classCode: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  roomName: string | null;
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
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year ?? now.getFullYear());
  const month = Number(params.month ?? now.getMonth() + 1);

  const firstDay = new Date(year, month - 1, 1);
  const from = new Date(firstDay);
  const fromOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  from.setDate(firstDay.getDate() - fromOffset);

  const to = new Date(from);
  to.setDate(from.getDate() + 41);

  const toIsoDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const events = await getScheduleEvents(toIsoDate(from), toIsoDate(to));

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
        <TeacherScheduleCalendarClient year={year} month={month} events={events} />
      </Card>
    </div>
  );
}

