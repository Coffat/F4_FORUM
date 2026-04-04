'use server'

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { classSchema, updateClassSchema } from '@/validations/class.schema';

export type ActionState = {
  error: string | null;
  success?: boolean;
};

/**
 * Trích xuất JWT Token từ HTTP-only cookie để giao tiếp với BE
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

/**
 * Server Action: Tạo Lớp học mới
 */
export async function createClassAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData);
  // Convert 'null' string from Select back to literal null for numeric fields
  if (data.roomId === 'null') data.roomId = null as any;
  const validated = classSchema.safeParse(data);
  
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }
  
  try {
    const headers = await getAuthHeaders();
    const response = await fetch('http://localhost:8080/api/v1/classes', {
      method: 'POST',
      headers,
      body: JSON.stringify(validated.data)
    });
    
    if (!response.ok) {
      const errMessage = await response.text();
      console.error('SERVER ERROR:', errMessage);
      return { error: errMessage || 'Lỗi từ phía máy chủ khi tạo Lớp học!' };
    }
    
    revalidatePath('/admin/classes');
    revalidatePath('/staff/classes');
    return { error: null, success: true };
  } catch (error) {
    console.error('Lỗi khi gọi API tạo Lớp học:', error);
    return { error: 'Backend Server không phản hồi!' };
  }
}

/**
 * Server Action: Cập nhật Lớp học (Sửa thông tin)
 * Yêu cầu bind ID vào Server Action.
 */
export async function updateClassAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData);
  const validated = updateClassSchema.safeParse(data);
  
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }
  
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`http://localhost:8080/api/v1/classes/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(validated.data)
    });
    
    if (!response.ok) {
      const errMessage = await response.text();
      return { error: errMessage || 'Lỗi khi cập nhật thông tin Lớp học!' };
    }
    
    revalidatePath('/admin/classes');
    return { error: null, success: true };
  } catch (error) {
    console.error('Lỗi khi gọi API cập nhật Lớp học:', error);
    return { error: 'Backend Server không phản hồi!' };
  }
}

/**
 * Server Action: Hủy Lớp học (Soft Delete)
 */
export async function softDeleteClassAction(id: number): Promise<ActionState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`http://localhost:8080/api/v1/classes/${id}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      const errMessage = await response.text();
      return { error: errMessage || 'Không thể thao tác Hủy lớp học này!' };
    }
    
    revalidatePath('/admin/classes');
    return { error: null, success: true };
  } catch (error) {
    console.error('Lỗi khi gọi API hủy Lớp học:', error);
    return { error: 'Backend Server không phản hồi!' };
  }
}
