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
  cookieStore.set('auth_token', resultToken, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  
  if (resultRole === 'ROLE_ADMIN' || resultRole === 'STAFF') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}
