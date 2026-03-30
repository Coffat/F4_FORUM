"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function TeacherScheduleCalendarClient({
  year,
  month,
  events,
}: {
  year: number;
  month: number;
  events: ScheduleEvent[];
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const currentMonthDate = new Date(year, month - 1, 1);
  const monthLabel = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const first = new Date(year, month - 1, 1);
    const start = new Date(first);
    const day = first.getDay(); // 0 Sun
    const mondayOffset = day === 0 ? 6 : day - 1;
    start.setDate(first.getDate() - mondayOffset);

    return Array.from({ length: 42 }).map((_, idx) => {
      const d = new Date(start);
      d.setDate(start.getDate() + idx);
      return d;
    });
  }, [year, month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    for (const event of events) {
      const key = event.date;
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const selectedDayEvents = selectedDate ? eventsByDate.get(selectedDate) ?? [] : [];

  const onMonthChange = (delta: number) => {
    const next = new Date(year, month - 1 + delta, 1);
    const nextYear = next.getFullYear();
    const nextMonth = next.getMonth() + 1;
    router.replace(`/teacher/schedule?year=${nextYear}&month=${nextMonth}`);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2.3fr_1fr] gap-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Teaching Calendar</h3>
            <p className="text-sm text-slate-500">{monthLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onMonthChange(-1)}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onMonthChange(1)}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAY_LABELS.map((w) => (
            <div key={w} className="text-center text-xs font-black tracking-wide text-slate-500 py-2">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dateObj) => {
            const key = toDateKey(dateObj);
            const dayEvents = eventsByDate.get(key) ?? [];
            const isCurrentMonth = dateObj.getMonth() === month - 1;
            const isSelected = selectedDate === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDate(key)}
                className={`min-h-24 rounded-xl border p-2 text-left transition ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className={`text-xs font-bold ${isCurrentMonth ? "text-slate-800" : "text-slate-400"}`}>
                  {dateObj.getDate()}
                </div>
                <div className="mt-2 space-y-1">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div
                      key={e.scheduleId}
                      className="truncate rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800"
                    >
                      {e.startTime.slice(0, 5)} {e.classCode}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] font-semibold text-slate-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <h4 className="text-lg font-bold text-slate-900">Lịch trong ngày</h4>
        <p className="text-xs text-slate-500 mt-1">
          {selectedDate ? parseLocalDate(selectedDate).toDateString() : "Chọn một ngày trên lịch"}
        </p>

        <div className="mt-4 space-y-3">
          {!selectedDate && (
            <p className="text-sm text-slate-500">Chưa chọn ngày.</p>
          )}
          {selectedDate && selectedDayEvents.length === 0 && (
            <p className="text-sm text-slate-500">Không có buổi dạy.</p>
          )}
          {selectedDayEvents.map((event) => (
            <div key={event.scheduleId} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm font-bold text-slate-900">
                {event.classCode} - {event.courseName}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {event.startTime.slice(0, 5)} - {event.endTime.slice(0, 5)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {event.online ? "Online session" : `Room: ${event.roomName ?? "N/A"}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

