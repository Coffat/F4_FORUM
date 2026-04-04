"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";
import type { CreateAssignmentState, MutateAssignmentState } from "./actions";
import { createAssignmentAction, deleteAssignmentAction, updateAssignmentAction } from "./actions";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";

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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AssignmentItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [state, setState] = useState<CreateAssignmentState>(initialState);
  const [editState, setEditState] = useState<MutateAssignmentState>({ error: null, success: false });
  const [deleteState, setDeleteState] = useState<MutateAssignmentState>({ error: null, success: false });
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

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

  const openEdit = (item: AssignmentItem) => {
    setSelected(item);
    setEditState({ error: null, success: false });
    setFileName(null);
    setEditOpen(true);
  };

  const openDelete = (item: AssignmentItem) => {
    setSelected(item);
    setDeleteState({ error: null, success: false });
    setDeleteOpen(true);
  };

  const handleEditSubmit = (formData: FormData) => {
    if (!selected) return;
    startTransition(async () => {
      const result = await updateAssignmentAction(classId, selected.id, formData);
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
      const result = await deleteAssignmentAction(classId, selected.id);
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
        <h4 className="text-xl font-bold text-slate-900">Danh sách bài tập</h4>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0B3A9A] text-white px-4 py-2 text-sm font-bold hover:bg-blue-800 transition"
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

        {assignments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">
                    Assignment
                  </th>
                  <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">
                    Due date
                  </th>
                  <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">
                    Attachment
                  </th>
                  <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {assignments.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">
                        {item.description || "Không có mô tả"}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {item.dueDate ? (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md whitespace-nowrap border border-blue-100">
                          {item.dueDate}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">
                          --
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      {item.attachmentUrl ? (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md whitespace-nowrap border border-blue-100">
                          File
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">
                          --
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          title="Edit"
                          className="p-2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(item)}
                          title="Delete"
                          className="p-2 w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      ? "border-blue-500 bg-blue-50"
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
                    className="mt-3 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-blue-700"
                    onChange={(e) =>
                      setFileName(e.currentTarget.files?.[0]?.name ?? null)
                    }
                  />
                  {fileName && (
                    <p className="mt-2 text-xs font-semibold text-blue-700">
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
                  className="rounded-xl bg-[#0B3A9A] px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-70"
                >
                  {isPending ? "Đang thêm..." : "Thêm bài tập"}
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
              <h5 className="text-lg font-bold text-slate-900">Cập nhật bài tập</h5>
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
                <label htmlFor="edit-title" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tiêu đề bài tập
                </label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  defaultValue={selected.title}
                  disabled={isPending}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-dueDateTime" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Hạn nộp (ngày giờ)
                  </label>
                  <input
                    id="edit-dueDateTime"
                    name="dueDateTime"
                    type="datetime-local"
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Bỏ trống để giữ nguyên.
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-maxScore" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Điểm tối đa
                  </label>
                  <input
                    id="edit-maxScore"
                    name="maxScore"
                    type="number"
                    min="1"
                    step="0.5"
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Bỏ trống để giữ nguyên.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Mô tả bài tập
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={5}
                  defaultValue={selected.description ?? ""}
                  disabled={isPending}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Thay file đính kèm (optional)
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
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isPending && setDeleteOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <DeleteIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Xóa bài tập?</h3>
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

