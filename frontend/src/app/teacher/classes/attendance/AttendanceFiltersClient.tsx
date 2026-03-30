"use client";

import { useRouter } from "next/navigation";

type ClassOption = {
  classId: number;
  classCode: string;
  courseName: string;
};

type SessionOption = {
  scheduleId: number;
  date: string;
  startTime: string;
  endTime: string;
};

export default function AttendanceFiltersClient({
  classes,
  sessions,
  selectedClassId,
  selectedScheduleId,
}: {
  classes: ClassOption[];
  sessions: SessionOption[];
  selectedClassId: string;
  selectedScheduleId: string;
}) {
  const router = useRouter();

  const onClassChange = (classId: string) => {
    const params = new URLSearchParams();
    if (classId) params.set("classId", classId);
    // reset schedule khi đổi lớp để server tự chọn buổi hợp lệ đầu tiên
    router.replace(`/teacher/classes/attendance?${params.toString()}`);
  };

  const onScheduleChange = (scheduleId: string) => {
    const params = new URLSearchParams();
    if (selectedClassId) params.set("classId", selectedClassId);
    if (scheduleId) params.set("scheduleId", scheduleId);
    router.replace(`/teacher/classes/attendance?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Chọn lớp
        </label>
        <select
          value={selectedClassId}
          onChange={(e) => onClassChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
        >
          {classes.map((clazz) => (
            <option key={clazz.classId} value={clazz.classId}>
              {clazz.classCode} - {clazz.courseName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Chọn buổi học
        </label>
        <select
          value={selectedScheduleId}
          onChange={(e) => onScheduleChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
        >
          {sessions.map((session) => (
            <option key={session.scheduleId} value={session.scheduleId}>
              {session.date} ({session.startTime} - {session.endTime})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

