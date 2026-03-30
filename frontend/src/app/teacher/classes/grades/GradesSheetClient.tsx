"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveGradesAction } from "./actions";

type GradeRow = {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  midtermScore: number | null;
  finalScore: number | null;
  grade: string | null;
  teacherComment: string | null;
};

type EditableRow = GradeRow & {
  editableMidterm: string;
  editableFinal: string;
  editableGrade: string;
  editableComment: string;
};

export default function GradesSheetClient({
  classId,
  rows,
}: {
  classId: string;
  rows: GradeRow[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editableRows, setEditableRows] = useState<EditableRow[]>(
    rows.map((r) => ({
      ...r,
      editableMidterm: r.midtermScore == null ? "" : String(r.midtermScore),
      editableFinal: r.finalScore == null ? "" : String(r.finalScore),
      editableGrade: r.grade ?? "",
      editableComment: r.teacherComment ?? "",
    }))
  );

  const onSave = () => {
    setMessage(null);
    startTransition(async () => {
      const payload = editableRows.map((r) => ({
        enrollmentId: r.enrollmentId,
        midtermScore: r.editableMidterm.trim() === "" ? null : Number(r.editableMidterm),
        finalScore: r.editableFinal.trim() === "" ? null : Number(r.editableFinal),
        grade: r.editableGrade,
        teacherComment: r.editableComment,
      }));
      const result = await saveGradesAction(classId, payload);
      if (result.success) {
        setMessage("Lưu điểm thành công!");
        router.refresh();
      } else {
        setMessage(result.error ?? "Có lỗi xảy ra!");
      }
    });
  };

  if (editableRows.length === 0) {
    return <p className="text-sm text-slate-500 font-medium">Lớp này chưa có học viên để nhập điểm.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {editableRows.map((row) => (
          <div key={row.enrollmentId} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-900 mb-3">{row.studentName}</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="number"
                min="0"
                max="100"
                step="0.25"
                placeholder="Midterm"
                value={row.editableMidterm}
                onChange={(e) =>
                  setEditableRows((prev) =>
                    prev.map((item) =>
                      item.enrollmentId === row.enrollmentId
                        ? { ...item, editableMidterm: e.target.value }
                        : item
                    )
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <input
                type="number"
                min="0"
                max="100"
                step="0.25"
                placeholder="Final"
                value={row.editableFinal}
                onChange={(e) =>
                  setEditableRows((prev) =>
                    prev.map((item) =>
                      item.enrollmentId === row.enrollmentId
                        ? { ...item, editableFinal: e.target.value }
                        : item
                    )
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Grade (A/B/C...)"
                value={row.editableGrade}
                onChange={(e) =>
                  setEditableRows((prev) =>
                    prev.map((item) =>
                      item.enrollmentId === row.enrollmentId
                        ? { ...item, editableGrade: e.target.value }
                        : item
                    )
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Nhận xét"
                value={row.editableComment}
                onChange={(e) =>
                  setEditableRows((prev) =>
                    prev.map((item) =>
                      item.enrollmentId === row.enrollmentId
                        ? { ...item, editableComment: e.target.value }
                        : item
                    )
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
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
          {isPending ? "Đang lưu..." : "Lưu điểm"}
        </button>
      </div>
    </div>
  );
}

