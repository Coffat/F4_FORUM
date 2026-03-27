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
    return { error: validated.error.errors[0].message };
  }
  
  let resultToken = null;
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated.data)
    });
    
    if (!response.ok) {
      const errMessage = await response.text();
      // Server backend trả về badRequest với body là chuỗi lỗi
      return { error: errMessage || 'Tài khoản hoặc mật khẩu không chính xác!' };
    }
    
    const payload = await response.json();
    resultToken = payload.token;
  } catch (error) {
    console.error('Lỗi khi kết nối BE:', error);
    return { error: 'Backend Server không phản hồi! (Lỗi Connection)' };
  }
  
  // Lưu token vào Browser Cookies (Async in Next 15)
  const cookieStore = await cookies();
  cookieStore.set('auth_token', resultToken, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  
  // Thực hiện điều hướng trang sau khi Login thành công
  // Lệnh này throw lỗi ngầm để Next App Router bắt nên bắt buộc để ngoài try/catch
  redirect('/dashboard');
}
