"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";
import type { CreateMaterialState, MutateMaterialState } from "./actions";
import { createMaterialAction, deleteMaterialAction, updateMaterialAction } from "./actions";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";

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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<MaterialItem | null>(null);
  const [state, setState] = useState<CreateMaterialState>(initialState);
  const [editState, setEditState] = useState<MutateMaterialState>({ error: null, success: false });
  const [deleteState, setDeleteState] = useState<MutateMaterialState>({ error: null, success: false });
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

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

  const openEdit = (m: MaterialItem) => {
    setSelected(m);
    setEditState({ error: null, success: false });
    setFileName(null);
    setEditOpen(true);
  };

  const openDelete = (m: MaterialItem) => {
    setSelected(m);
    setDeleteState({ error: null, success: false });
    setDeleteOpen(true);
  };

  const handleEditSubmit = (formData: FormData) => {
    if (!selected) return;
    startTransition(async () => {
      const result = await updateMaterialAction(classId, selected.id, formData);
      setEditState(result);
      if (result.success) {
        setEditOpen(false);
        setSelected(null);
        router.refresh();
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!selected) return;
    startTransition(async () => {
      const result = await deleteMaterialAction(classId, selected.id);
      setDeleteState(result);
      if (result.success) {
        setDeleteOpen(false);
        setSelected(null);
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
          className="inline-flex items-center gap-2 rounded-xl bg-[#0B3A9A] text-white px-4 py-2 text-sm font-bold hover:bg-blue-800 transition"
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
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-slate-900">{m.title}</p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(m)}
                  title="Edit"
                  className="p-2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openDelete(m)}
                  title="Delete"
                  className="p-2 w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    isDragging ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Kéo thả file vào đây hoặc chọn file</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="file"
                    disabled={isPending}
                    className="mt-3 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-blue-700"
                    onChange={(e) => setFileName(e.currentTarget.files?.[0]?.name ?? null)}
                  />
                  {fileName && (
                    <p className="mt-2 text-xs font-semibold text-blue-700">Đã chọn: {fileName}</p>
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
                  className="rounded-xl bg-[#0B3A9A] px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-70"
                >
                  {isPending ? "Đang upload..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h5 className="text-lg font-bold text-slate-900">Cập nhật tài liệu</h5>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="text-slate-500 hover:text-slate-700"
                disabled={isPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleEditSubmit} className="p-6 space-y-5">
              {editState.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {editState.error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tiêu đề
                </label>
                <input
                  name="title"
                  type="text"
                  defaultValue={selected.title}
                  disabled={isPending}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={selected.description ?? ""}
                  disabled={isPending}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Thay file (optional)
                </label>
                <input
                  ref={editFileInputRef}
                  type="file"
                  name="file"
                  disabled={isPending}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-blue-700"
                  onChange={(e) => setFileName(e.currentTarget.files?.[0]?.name ?? null)}
                />
                {fileName && (
                  <p className="text-xs font-semibold text-blue-700">
                    Đã chọn: {fileName}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#0B3A9A] px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-70"
                >
                  {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isPending && setDeleteOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <DeleteIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Xóa tài liệu?</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Bạn sắp xóa <span className="font-bold text-slate-900">{selected.title}</span>. Thao tác này không thể hoàn tác.
              </p>
              {deleteState.error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {deleteState.error}
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-end gap-3 px-6">
              <button
                disabled={isPending}
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
              >
                {isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

