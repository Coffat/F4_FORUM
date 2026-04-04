"use client";

import { useEffect, useMemo, useState } from "react";
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

function parseLocalMinutes(time: string) {
  const [h, m] = time.split(":").map((x) => Number(x));
  return h * 60 + m;
}

export default function TeacherScheduleWeekClientHover({
  weekStartIso,
  events,
}: {
  weekStartIso: string; // monday yyyy-mm-dd
  events: ScheduleEvent[];
}) {
  const router = useRouter();

  // Prevent hydration mismatch: server and client render could have different `now`,
  // which would toggle "current session" highlight classes.
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [selected, setSelected] = useState<ScheduleEvent | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time-ish refresh: update current session highlight.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const weekStart = useMemo(() => {
    const [y, m, d] = weekStartIso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [weekStartIso]);

  const days = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  const dayKeys = useMemo(() => days.map(toIsoDate), [days]);

  const sessions = useMemo(
    () => [
      { key: "morning", label: "SÁNG", fromMin: 6 * 60, toMin: 12 * 60 },
      { key: "afternoon", label: "CHIỀU", fromMin: 12 * 60, toMin: 18 * 60 },
      { key: "evening", label: "TỐI", fromMin: 18 * 60, toMin: 22 * 60 },
    ],
    []
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    for (const [k, list] of map.entries()) {
      list.sort(
        (a, b) =>
          parseLocalMinutes(a.startTime) - parseLocalMinutes(b.startTime)
      );
      map.set(k, list);
    }
    return map;
  }, [events]);

  const isCurrentWeek = useMemo(
    () => mounted && toIsoDate(startOfWeek(now)) === weekStartIso,
    [mounted, now, weekStartIso]
  );
  const currentDayKey = useMemo(() => (mounted ? toIsoDate(now) : null), [mounted, now]);

  const currentSessionKey = useMemo(() => {
    if (!mounted || !isCurrentWeek) return null;
    const mins = now.getHours() * 60 + now.getMinutes();
    const s = sessions.find((x) => mins >= x.fromMin && mins < x.toMin);
    return s?.key ?? null;
  }, [mounted, isCurrentWeek, now, sessions]);

  const onWeekChange = (deltaWeeks: number) => {
    const next = addDays(weekStart, deltaWeeks * 7);
    router.replace(`/teacher/schedule?week=${toIsoDate(next)}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2.4fr_1fr] gap-6">
      <div
        className={`rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden ${
          selected ? "lg:col-span-1" : "lg:col-span-2"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Weekly Schedule</h3>
            <p className="text-sm text-slate-500">
              Week of{" "}
              {weekStart.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
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

        {/* Day header */}
        <div className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-slate-100 bg-white">
          <div />
          {days.map((d, idx) => {
            const isToday = isCurrentWeek && toIsoDate(d) === currentDayKey;
            return (
              <div key={idx} className="px-3 py-3 border-l border-slate-100">
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  {WEEKDAY_LABELS[idx]}
                </p>
                <p className={`text-base font-bold ${isToday ? "text-[#0B3A9A]" : "text-slate-900"}`}>
                  {d.getDate()}/{d.getMonth() + 1}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3 session rows */}
        <div className="grid grid-rows-3">
          {sessions.map((session) => (
            <div
              key={session.key}
              className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-slate-100 last:border-b-0 bg-white"
            >
              {/* Session label */}
              <div className="flex items-center justify-end pr-3 bg-slate-50">
                <span className="text-xs font-black tracking-widest text-slate-500">
                  {session.label}
                </span>
              </div>

              {/* Day cells */}
              {dayKeys.map((dayKey, idx) => {
                const allEvents = eventsByDay.get(dayKey) ?? [];
                const slotEvents = allEvents.filter((e) => {
                  const startMin = parseLocalMinutes(e.startTime);
                  return startMin >= session.fromMin && startMin < session.toMin;
                });

                const highlight =
                  isCurrentWeek &&
                  dayKey === currentDayKey &&
                  currentSessionKey === session.key;

                return (
                  <div
                    key={`${dayKey}-${session.key}`}
                    className={`border-l border-slate-100 px-2 py-2 ${
                      highlight ? "bg-blue-100/70" : "bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap gap-2 items-start">
                      {slotEvents.map((e) => (
                        <div
                          key={e.scheduleId}
                          className="group relative z-10"
                        >
                          <div
                            className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2 text-left hover:bg-blue-100 transition shadow-sm cursor-default min-w-[120px] max-w-full"
                            title={`${e.classCode} ${e.startTime.slice(0, 5)}-${e.endTime.slice(0, 5)}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelected(e)}
                            onKeyDown={(evt) => {
                              if (evt.key === "Enter" || evt.key === " ") {
                                evt.preventDefault();
                                setSelected(e);
                              }
                            }}
                          >
                            <p className="text-sm font-black text-blue-800 truncate">
                              {e.classCode}
                            </p>
                            <p className="text-xs font-bold text-slate-600 truncate">
                              {e.startTime.slice(0, 5)} - {e.endTime.slice(0, 5)}
                            </p>
                            <p className="text-xs font-medium text-slate-500 truncate">
                              {e.roomName ?? (e.online ? "Online" : "TBD")}
                            </p>
                          </div>

                          {/* Hover tooltip (no right panel) */}
                          <div
                            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20"
                          >
                            <div className="rounded-xl border border-blue-100 bg-white shadow-lg p-4 w-[280px] max-w-[280px]">
                              <p className="text-sm font-bold text-[#0B3A9A] truncate">
                                {e.classCode} — {e.courseName}
                              </p>
                              <p className="text-xs font-medium text-slate-500 mt-1 truncate">
                                {e.date} · {e.startTime.slice(0, 5)} - {e.endTime.slice(0, 5)}
                              </p>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-slate-400">
                                    Phòng
                                  </span>
                                  <span className="text-xs font-medium text-slate-700 truncate">
                                    {e.roomName ?? (e.online ? "Online" : "—")}
                                  </span>
                                </div>
                                {e.online && e.meetingLink && (
                                  <div className="pt-1">
                                    <a
                                      href={e.meetingLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs font-bold text-blue-700 hover:underline truncate block"
                                    >
                                      Meeting link
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {slotEvents.length === 0 && (
                        <div className="text-xs font-medium text-slate-300 py-1 px-1">
                          {/* empty */}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm self-start lg:col-span-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Chi tiết buổi học
              </p>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                {selected.classCode} — {selected.courseName}
              </h4>
              <p className="text-sm font-medium text-slate-600 mt-1">
                {selected.date} · {selected.startTime.slice(0, 5)} -{" "}
                {selected.endTime.slice(0, 5)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-slate-700">Phòng</span>
                <span className="text-sm font-medium text-slate-600 text-right truncate">
                  {selected.roomName ??
                    (selected.online ? "Online" : "—")}
                </span>
              </div>
            </div>

            {selected.online && selected.meetingLink && (
              <a
                href={selected.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
              >
                Open meeting link
              </a>
            )}

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Đóng panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

