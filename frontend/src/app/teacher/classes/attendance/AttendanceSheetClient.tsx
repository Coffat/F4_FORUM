"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAttendanceAction } from "./actions";

type AttendanceStudent = {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  enrollmentStatus: string;
  present: boolean;
  remarks: string | null;
};

type EditableRow = AttendanceStudent & {
  editablePresent: boolean;
  editableRemarks: string;
};

export default function AttendanceSheetClient({
  classId,
  scheduleId,
  students,
}: {
  classId: string;
  scheduleId: string;
  students: AttendanceStudent[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<EditableRow[]>(
    students.map((s) => ({
      ...s,
      editablePresent: s.present,
      editableRemarks: s.remarks ?? "",
    }))
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveAttendanceAction(
        classId,
        scheduleId,
        rows.map((r) => ({
          enrollmentId: r.enrollmentId,
          isPresent: r.editablePresent,
          remarks: r.editableRemarks,
        }))
      );
      if (result.success) {
        setMessage("Lưu điểm danh thành công!");
        router.refresh();
      } else {
        setMessage(result.error ?? "Có lỗi xảy ra!");
      }
    });
  };

  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-500 font-medium">
        Lớp này chưa có học viên ENROLLED để điểm danh.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.enrollmentId}
            className="border border-slate-100 bg-slate-50 rounded-2xl p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">{row.studentName}</p>
                <p className="text-xs text-slate-500">Enrollment: {row.enrollmentStatus}</p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={row.editablePresent}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((item) =>
                        item.enrollmentId === row.enrollmentId
                          ? { ...item, editablePresent: e.target.checked }
                          : item
                      )
                    )
                  }
                />
                Có mặt
              </label>
            </div>
            <textarea
              value={row.editableRemarks}
              onChange={(e) =>
                setRows((prev) =>
                  prev.map((item) =>
                    item.enrollmentId === row.enrollmentId
                      ? { ...item, editableRemarks: e.target.value }
                      : item
                  )
                )
              }
              rows={2}
              placeholder="Ghi chú điểm danh (nếu có)"
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3">
        {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
        <button
          type="button"
          onClick={onSave}
          disabled={isPending}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-70"
        >
          {isPending ? "Đang lưu..." : "Lưu điểm danh"}
        </button>
      </div>
    </div>
  );
}

