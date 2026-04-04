'use server'

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type ActionState = {
  error: string | null;
};

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập Username hoặc Email!'),
  password: z.string().min(1, 'Vui lòng nhập Mật khẩu!')
});

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData);
  const validated = loginSchema.safeParse(data);
  
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }
  
  let resultToken = null;
  let resultRole = null;
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated.data)
    });
    
    if (!response.ok) {
      const errMessage = await response.text();
      return { error: errMessage || 'Tài khoản hoặc mật khẩu không chính xác!' };
    }
    
    const payload = await response.json();
    resultToken = payload.token;
    resultRole = payload.role;
  } catch (error) {
    console.error('Lỗi khi kết nối BE:', error);
    return { error: 'Backend Server không phản hồi! (Lỗi Connection)' };
  }
  
  const cookieStore = await cookies();

  // Lưu JWT token vào httpOnly cookie
  cookieStore.set('auth_token', resultToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 ngày
    sameSite: 'lax',
  });

  // Lưu role vào cookie (httpOnly: false để middleware đọc được)
  // Security: Thêm sameSite: 'strict' để giảm XSS risk
  // Note: Nên decode role từ JWT payload thay vì lưu cookie riêng
  cookieStore.set('auth_role', resultRole, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 ngày
    sameSite: 'lax',
  });

  // Điều hướng đúng theo từng role từ backend enum AccountRole
  switch (resultRole) {
    case 'ROLE_ADMIN':
      redirect('/admin');
    case 'ROLE_STAFF':
      redirect('/staff/dashboard');
    case 'ROLE_TEACHER':
      redirect('/teacher/profile');
    case 'ROLE_STUDENT':
      redirect('/student/dashboard');
    default:
      redirect('/login');
  }
}

/**
 * Server Action: Đăng xuất — xóa cookie và redirect về trang login
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  cookieStore.delete('auth_role');
  redirect('/login');
}
