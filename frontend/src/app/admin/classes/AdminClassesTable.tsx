"use client";

import { useState, useTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Class } from "@/types/class.types";
import { ClassDataTable } from "@/components/shared/ClassDataTable";
import {
  createClassAction,
  updateClassAction,
  softDeleteClassAction,
} from "./class-actions";
import { classSchema, updateClassSchema } from "@/validations/class.schema";
import { CourseOption, RoomOption } from "./form-options";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
type ModalMode = "create" | "edit" | "delete" | null;

interface AdminClassesTableProps {
  classes: Class[];
  courses: CourseOption[];
  rooms: RoomOption[];
}

// ────────────────────────────────────────────────────────────
// Sub-component: Row Actions
// ────────────────────────────────────────────────────────────
function AdminRowActions({
  data,
  onEdit,
  onDelete,
}: {
  data: Class;
  onEdit: (cls: Class) => void;
  onDelete: (cls: Class) => void;
}) {
  const canCancel = data.status === "OPEN" && data.currentEnrollment === 0;
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-lg text-slate-500 hover:text-blue-600 border-slate-200"
        onClick={() => onEdit(data)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={!canCancel}
        className={`h-8 w-8 rounded-lg border-slate-200 ${
          canCancel ? "text-slate-500 hover:text-red-600 hover:bg-red-50" : "text-slate-300"
        }`}
        onClick={() => onDelete(data)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────
export function AdminClassesTable({
  classes,
  courses,
  rooms,
}: AdminClassesTableProps) {
  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  // Form setup
  const currentSchema = modal === "edit" ? updateClassSchema : classSchema;
  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(currentSchema) as any,
    defaultValues: {
      classCode: "",
      courseId: 0,
      roomId: null,
      startDate: "",
      endDate: "",
      maxStudents: 20,
    },
  });

  const closeModal = () => {
    setModal(null);
    setSelectedClass(null);
    setServerError(null);
    form.reset();
  };

  const onEdit = (cls: Class) => {
    setSelectedClass(cls);
    form.reset({
      classCode: cls.classCode,
      courseId: 0, // Edit mode validation doesn't strictly need courseId sometimes based on schema
      roomId: null, // Room name lookup might be needed if we want to prefill
      startDate: cls.startDate,
      endDate: cls.endDate,
      maxStudents: cls.maxStudents,
    });
    setModal("edit");
  };

  const onDelete = (cls: Class) => {
    setSelectedClass(cls);
    setModal("delete");
  };

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== null && val !== undefined) formData.append(key, val.toString());
      });

      const result =
        modal === "create"
          ? await createClassAction({ error: null }, formData)
          : await updateClassAction(selectedClass!.id, { error: null }, formData);

      if (result.error) {
        setServerError(result.error);
      } else {
        closeModal();
      }
    });
  };

  const confirmDelete = () => {
    if (!selectedClass) return;
    startTransition(async () => {
      const result = await softDeleteClassAction(selectedClass.id);
      if (result.error) {
        setServerError(result.error);
      } else {
        closeModal();
      }
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Cấu hình Lớp học</h2>
          <p className="text-slate-500 mt-1 font-medium">Bảng điều khiển cho phép cấu hình, phân phòng, và quản trị lớp học.</p>
        </div>
        <Button
          onClick={() => setModal("create")}
          className="bg-blue-700 hover:bg-blue-800 text-white shadow-sm rounded-xl h-10 px-4 gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm Lớp Học
        </Button>
      </div>

      <ClassDataTable
        classes={classes}
        renderActions={(item) => (
          <AdminRowActions data={item} onEdit={onEdit} onDelete={onDelete} />
        )}
      />

      {/* MODAL FORM (Create/Edit) */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-slate-900">
                {modal === "create" ? "Tạo Lớp Học Mới" : `Sửa Lớp: ${selectedClass?.classCode}`}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Course Selection (Only for Create) */}
                  {modal === "create" && (
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Khóa Học</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                <SelectValue placeholder="Chọn Khóa Học" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {courses.length === 0 && (
                                <SelectItem value="0" disabled>Không có khóa học nào</SelectItem>
                              )}
                              {courses.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Class Code (Only for Create) */}
                  {modal === "create" && (
                    <FormField
                      control={form.control}
                      name="classCode"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Mã Lớp Học</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="VD: IELTS-F-001" className="rounded-xl h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Room Selection */}
                  <FormField
                    control={form.control}
                    name="roomId"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Phòng Học (Tùy chọn)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value?.toString() || "null"}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl h-11 border-slate-200">
                              <SelectValue placeholder="Chọn Phòng Học" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            <SelectItem value="null">Chưa xếp phòng</SelectItem>
                            {rooms.length === 0 && (
                              <SelectItem value="empty" disabled>Không tìm thấy phòng khả dụng</SelectItem>
                            )}
                            {rooms.map((r) => (
                              <SelectItem key={r.id} value={r.id.toString()}>
                                {r.name} {r.branchName ? ` - ${r.branchName}` : ""} (Sức chứa: {r.capacity})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dates */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày Bắt Đầu</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="rounded-xl h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày Kết Thúc</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="rounded-xl h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Max Students */}
                  <FormField
                    control={form.control}
                    name="maxStudents"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Sĩ Số Tối Đa</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="rounded-xl h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {serverError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {serverError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" onClick={closeModal} className="rounded-xl">Hủy</Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl min-w-[120px]"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (modal === 'create' ? 'Tạo Mới' : 'Cập Nhật')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modal === "delete" && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="text-red-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900">Xác nhận Hủy Lớp Học</h3>
            <p className="text-sm text-slate-500 text-center mt-2">
              Bạn có chắc muốn hủy lớp <span className="font-bold text-slate-700">{selectedClass.classCode}</span>? Thao tác này có thể ảnh hưởng đến lịch trình liên quan.
            </p>

            {serverError && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mt-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {serverError}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={closeModal} disabled={isPending}>Quay lại</Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl gap-2"
                onClick={confirmDelete}
                disabled={isPending}
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Hủy Lớp Học
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
