"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type ScheduleEvent = {
  scheduleId: number;
  classId: number;
  classCode: string;
  courseName: string;
  date: string; // yyyy-mm-dd
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  roomName: string | null;
  branchName: string | null;
  online: boolean;
  meetingLink: string | null;
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toIsoDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map((x) => Number(x));
  return h * 60 + m;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function TeacherScheduleWeekClient({
  weekStartIso,
  events,
}: {
  weekStartIso: string; // monday yyyy-mm-dd
  events: ScheduleEvent[];
}) {
  const router = useRouter();

  const weekStart = useMemo(() => {
    const [y, m, d] = weekStartIso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [weekStartIso]);

  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)), [weekStart]);
  const dayKeys = useMemo(() => days.map(toIsoDate), [days]);

  const [nowTick, setNowTick] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    for (const [k, list] of map.entries()) {
      list.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
      map.set(k, list);
    }
    return map;
  }, [events]);

  const onWeekChange = (deltaWeeks: number) => {
    const next = addDays(weekStart, deltaWeeks * 7);
    router.replace(`/teacher/schedule?week=${toIsoDate(next)}`);
  };

  // "Real-time": update current time line every minute
  useEffect(() => {
    const t = setInterval(() => setNowTick((x) => x + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  // Scroll to current time when viewing current week
  useEffect(() => {
    const today = new Date();
    const curWeek = startOfWeek(today);
    if (toIsoDate(curWeek) !== weekStartIso) return;
    const minutes = today.getHours() * 60 + today.getMinutes();
    const hourHeight = 56; // px per hour
    const scrollTop = clamp((minutes / 60) * hourHeight - 240, 0, 99999);
    scrollerRef.current?.scrollTo({ top: scrollTop });
  }, [weekStartIso]);

  const isCurrentWeek = useMemo(() => {
    const today = new Date();
    return toIsoDate(startOfWeek(today)) === weekStartIso;
  }, [weekStartIso]);

  const now = useMemo(() => {
    nowTick; // depend
    return new Date();
  }, [nowTick]);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const hourHeight = 56;
  const gridStartHour = 6;
  const gridEndHour = 22;
  const totalHours = gridEndHour - gridStartHour;
  const gridHeight = totalHours * hourHeight;

  const sessions = useMemo(
    () => [
      { key: "morning", label: "SÁNG", fromHour: 6, toHour: 12 },
      { key: "afternoon", label: "CHIỀU", fromHour: 12, toHour: 18 },
      { key: "evening", label: "TỐI", fromHour: 18, toHour: 22 },
    ],
    []
  );

  const nowTop = ((nowMinutes - gridStartHour * 60) / 60) * hourHeight;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2.4fr_1fr] gap-6">
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Weekly Schedule</h3>
            <p className="text-sm text-slate-500">
              Week of {weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onWeekChange(-1)}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onWeekChange(1)}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-slate-100 bg-white">
          <div />
          {days.map((d, idx) => {
            const isToday = isCurrentWeek && toIsoDate(d) === toIsoDate(now);
            return (
              <div key={idx} className="px-3 py-3 border-l border-slate-100">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {WEEKDAY_LABELS[idx]}
                </p>
                <p className={`text-sm font-bold ${isToday ? "text-[#0B3A9A]" : "text-slate-900"}`}>
                  {d.getDate()}/{d.getMonth() + 1}
                </p>
              </div>
            );
          })}
        </div>

        <div ref={scrollerRef} className="max-h-[640px] overflow-auto">
          <div className="relative">
            {/* Time labels */}
            <div className="absolute left-0 top-0 w-[72px]">
              {/* Session labels (morning/afternoon/evening) */}
              <div className="absolute inset-0">
                {sessions.map((s) => {
                  const top = (s.fromHour - gridStartHour) * hourHeight;
                  const height = (s.toHour - s.fromHour) * hourHeight;
                  return (
                    <div
                      key={s.key}
                      className="absolute left-0 right-0 px-2"
                      style={{ top, height }}
                    >
                      <div className="h-full rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                        <span className="text-[10px] font-black tracking-widest text-slate-500">
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {Array.from({ length: totalHours + 1 }).map((_, i) => {
                const hour = gridStartHour + i;
                return (
                  <div
                    key={hour}
                    className="h-[56px] flex items-start justify-end pr-2 pt-1 text-[10px] font-bold text-slate-400"
                    style={{ boxSizing: "border-box" }}
                  >
                    {pad2(hour)}:00
                  </div>
                );
              })}
            </div>

            {/* Grid */}
            <div className="ml-[72px] grid grid-cols-7" style={{ height: gridHeight }}>
              {dayKeys.map((dayKey) => (
                <div key={dayKey} className="relative border-l border-slate-100">
                  {/* session bands */}
                  <div className="absolute inset-0 pointer-events-none">
                    {sessions.map((s) => {
                      const top = (s.fromHour - gridStartHour) * hourHeight;
                      const height = (s.toHour - s.fromHour) * hourHeight;
                      return (
                        <div
                          key={s.key}
                          className="absolute left-0 right-0"
                          style={{ top, height }}
                        >
                          <div className="h-full bg-slate-50/40" />
                          <div className="absolute inset-x-0 top-0 h-px bg-slate-100" />
                        </div>
                      );
                    })}
                  </div>

                  {/* hour lines */}
                  {Array.from({ length: totalHours }).map((_, i) => (
                    <div key={i} className="h-[56px] border-b border-slate-100 bg-white" />
                  ))}

                  {/* Events layer */}
                  <div className="absolute inset-0">
                    {(eventsByDay.get(dayKey) ?? []).map((e) => {
                      const startMin = timeToMinutes(e.startTime);
                      const endMin = timeToMinutes(e.endTime);
                      const top = ((startMin - gridStartHour * 60) / 60) * hourHeight;
                      const height = ((endMin - startMin) / 60) * hourHeight;

                      const safeTop = clamp(top, 0, gridHeight);
                      const safeHeight = clamp(height, 18, gridHeight - safeTop);

                      return (
                        <button
                          key={e.scheduleId}
                          type="button"
                          className="group absolute left-1 right-1 rounded-xl bg-blue-50 border border-blue-100 text-left px-2 py-2 hover:bg-blue-100 transition shadow-sm relative z-10"
                          style={{ top: safeTop, height: safeHeight }}
                          title={`${e.classCode} ${e.startTime.slice(0, 5)}-${e.endTime.slice(0, 5)}`}
                        >
                          <p className="text-[11px] font-black text-blue-800 truncate">
                            {e.classCode}
                          </p>
                          <p className="text-[10px] font-bold text-slate-600 truncate">
                            {e.startTime.slice(0, 5)} - {e.endTime.slice(0, 5)}
                          </p>
                          <p className="text-[10px] font-medium text-slate-500 truncate">
                            {e.roomName ?? (e.online ? "Online" : "TBD")}
                          </p>

                          {/* Hover details (replaces right-side card) */}
                          <div
                            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[240px] max-w-[240px]
                              opacity-0 group-hover:opacity-100 transition-opacity duration-150
                              z-20"
                          >
                            <div className="rounded-xl border border-blue-100 bg-white shadow-lg p-3">
                              <p className="text-[11px] font-bold text-[#0B3A9A] truncate">
                                {e.classCode} — {e.courseName}
                              </p>
                              <p className="text-[10px] font-medium text-slate-500 mt-1 truncate">
                                {e.date} · {e.startTime.slice(0, 5)} - {e.endTime.slice(0, 5)}
                              </p>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-bold text-slate-400">Branch</span>
                                  <span className="text-[10px] font-medium text-slate-700 truncate">
                                    {e.branchName ?? "—"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-bold text-slate-400">Room</span>
                                  <span className="text-[10px] font-medium text-slate-700 truncate">
                                    {e.roomName ?? (e.online ? "Online" : "—")}
                                  </span>
                                </div>
                                {e.online && e.meetingLink && (
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-slate-400">Link</span>
                                    <span className="text-[10px] font-medium text-blue-700 truncate">
                                      {e.meetingLink}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Now line (only if current week + same day) */}
                  {isCurrentWeek && dayKey === toIsoDate(now) && nowTop >= 0 && nowTop <= gridHeight && (
                    <div className="absolute left-0 right-0" style={{ top: nowTop }}>
                      <div className="h-px bg-red-500" />
                      <div className="absolute -left-1 -top-1.5 w-2.5 h-2.5 rounded-full bg-red-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

