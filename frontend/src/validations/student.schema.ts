import { z } from "zod";

/**
 * updateProfileSchema: Quy trình Validation ngay tại Client Layer.
 * Ràng buộc số điện thoại, ngày sinh và điểm mục tiêu IELTS (0.0 - 9.0).
 */
export const updateProfileSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại ít nhất 10 số")
    .max(11, "Số điện thoại tối đa 11 số")
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa chữ số"),
  
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    return dob < new Date();
  }, "Ngày sinh phải nằm trong quá khứ"),

  avatarUrl: z.string().url("Định dạng URL avatar không hợp lệ").optional().or(z.literal('')),
  
  targetScore: z.coerce
    .number()
    .min(0, "Điểm mục tiêu không thể âm")
    .max(9, "Điểm IELTS tối đa là 9.0"),

  email: z.string().email("Định dạng email không hợp lệ")
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
