"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";
import type { CreateMaterialState } from "./actions";
import { createMaterialAction } from "./actions";

type MaterialItem = {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  uploadDate: string | null;
};

const initialState: CreateMaterialState = { error: null, success: false };

export default function MaterialsListClient({
  classId,
  materials,
}: {
  classId: string;
  materials: MaterialItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CreateMaterialState>(initialState);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createMaterialAction(classId, formData);
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
        <h4 className="text-xl font-bold text-slate-900">Tài liệu của lớp</h4>
        <button
          type="button"
          onClick={() => {
            setState(initialState);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-bold hover:bg-emerald-700 transition"
        >
          <Plus className="w-4 h-4" />
          Upload tài liệu
        </button>
      </div>

      <div className="space-y-3">
        {materials.length === 0 && (
          <p className="text-sm text-slate-500 font-medium">
            Lớp này chưa có tài liệu nào.
          </p>
        )}

        {materials.map((m) => (
          <div key={m.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <p className="text-sm font-bold text-slate-900">{m.title}</p>
            {m.description && (
              <p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">{m.description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg">
                File: {m.fileUrl}
              </span>
              {m.uploadDate && (
                <span className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-100 px-2 py-1 rounded-lg">
                  Ngày upload: {m.uploadDate}
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
              <h5 className="text-lg font-bold text-slate-900">Upload tài liệu</h5>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-5">
              {state.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tiêu đề
                </label>
                <input
                  name="title"
                  type="text"
                  disabled={isPending}
                  placeholder="VD: Slide buổi 1 - Unit 1"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  rows={4}
                  disabled={isPending}
                  placeholder="Mô tả ngắn về tài liệu (optional)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Kéo thả tài liệu
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
                    isDragging ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Kéo thả file vào đây hoặc chọn file</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="file"
                    disabled={isPending}
                    className="mt-3 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-emerald-700"
                    onChange={(e) => setFileName(e.currentTarget.files?.[0]?.name ?? null)}
                  />
                  {fileName && (
                    <p className="mt-2 text-xs font-semibold text-emerald-700">Đã chọn: {fileName}</p>
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
                  {isPending ? "Đang upload..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

