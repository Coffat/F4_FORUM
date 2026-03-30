"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";
import type { CreateAssignmentState } from "./actions";
import { createAssignmentAction } from "./actions";

type AssignmentItem = {
  id: number;
  title: string;
  description: string | null;
  attachmentUrl: string | null;
  dueDate: string | null;
};

type Props = {
  classId: string;
  assignments: AssignmentItem[];
};

const initialState: CreateAssignmentState = { error: null, success: false };

export default function ClassAssignmentsPanel({ classId, assignments }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [state, setState] = useState<CreateAssignmentState>(initialState);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createAssignmentAction(classId, formData);
      setState(result);
      if (result.success) {
        setOpen(false);
        setFileName(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-slate-900">Danh sách bài tập</h4>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-bold hover:bg-emerald-700 transition"
        >
          <Plus className="w-4 h-4" />
          Thêm bài tập
        </button>
      </div>

      <div className="space-y-3">
        {assignments.length === 0 && (
          <p className="text-sm text-slate-500 font-medium">
            Lớp này chưa có bài tập nào.
          </p>
        )}

        {assignments.map((item) => (
          <div
            key={item.id}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4"
          >
            <p className="text-sm font-bold text-slate-900">{item.title}</p>
            <p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">
              {item.description || "Không có mô tả"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.attachmentUrl && (
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg">
                  File: {item.attachmentUrl}
                </span>
              )}
              {item.dueDate && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                  Hạn nộp: {item.dueDate}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h5 className="text-lg font-bold text-slate-900">Thêm bài tập mới</h5>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              action={handleSubmit}
              className="p-6 space-y-5"
            >
              {state.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Tiêu đề bài tập
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  disabled={isPending}
                  placeholder="VD: Homework 03 - Reading Practice"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="dueDateTime"
                    className="text-xs font-bold uppercase tracking-wider text-slate-600"
                  >
                    Hạn nộp (ngày giờ)
                  </label>
                  <input
                    id="dueDateTime"
                    name="dueDateTime"
                    type="datetime-local"
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="maxScore"
                    className="text-xs font-bold uppercase tracking-wider text-slate-600"
                  >
                    Điểm tối đa
                  </label>
                  <input
                    id="maxScore"
                    name="maxScore"
                    type="number"
                    min="1"
                    step="0.5"
                    disabled={isPending}
                    placeholder="Để trống = 100"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Mô tả bài tập
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  disabled={isPending}
                  placeholder="Nhập mô tả yêu cầu bài tập cho học viên..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  File đính kèm (không bắt buộc)
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const dropped = e.dataTransfer.files?.[0];
                    if (!dropped || !fileInputRef.current) return;
                    const transfer = new DataTransfer();
                    transfer.items.add(dropped);
                    fileInputRef.current.files = transfer.files;
                    setFileName(dropped.name);
                  }}
                  className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    Kéo thả file vào đây hoặc chọn file
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Bạn có thể bỏ trống nếu không cần đính kèm.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="file"
                    disabled={isPending}
                    className="mt-3 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-emerald-700"
                    onChange={(e) =>
                      setFileName(e.currentTarget.files?.[0]?.name ?? null)
                    }
                  />
                  {fileName && (
                    <p className="mt-2 text-xs font-semibold text-emerald-700">
                      Đã chọn: {fileName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-70"
                >
                  {isPending ? "Đang thêm..." : "Thêm bài tập"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

