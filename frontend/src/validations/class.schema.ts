import { z } from 'zod';

export const classSchema = z.object({
  courseId: z.coerce.number().min(1, 'Vui lòng chọn khóa học!'),
  roomId: z.coerce.number().optional().nullable(),
  classCode: z.string().min(1, 'Mã lớp không được để trống!'),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc!'),
  endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc!'),
  maxStudents: z.coerce.number().min(1, 'Số lượng sinh viên tối đa phải lớn hơn 0!')
}).refine((data) => {
  if (!data.startDate || !data.endDate) return true;
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: "Ngày kết thúc phải lớn hơn ngày bắt đầu!",
  path: ["endDate"], 
});

export const updateClassSchema = z.object({
  roomId: z.coerce.number().optional().nullable(),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc!'),
  endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc!'),
  maxStudents: z.coerce.number().min(1, 'Số lượng sinh viên tối đa phải lớn hơn 0!')
}).refine((data) => {
  if (!data.startDate || !data.endDate) return true;
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: "Ngày kết thúc phải lớn hơn ngày bắt đầu!",
  path: ["endDate"],
});
