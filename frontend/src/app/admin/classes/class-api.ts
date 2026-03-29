import { cookies } from 'next/headers';
import { PaginatedClassResponse } from '@/types/class.types';

export interface FetchClassesParams {
  page?: number;
  size?: number;
  classCode?: string;
  status?: string;
}

/**
 * Helper Server-side: Fetch API danh sách Lớp học (có query filter)
 * Sử dụng an toàn trong Next.js Server Components
 */
export async function fetchClasses(params: FetchClassesParams): Promise<PaginatedClassResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Khởi tạo và đẩy Parameter
  const queryParams = new URLSearchParams();
  if (params.page !== undefined) queryParams.set('page', params.page.toString());
  if (params.size !== undefined) queryParams.set('size', params.size.toString());
  if (params.classCode) queryParams.set('classCode', params.classCode);
  if (params.status) queryParams.set('status', params.status);

  try {
    // Không dùng cache để đảm bảo dữ liệu hiển thị realtime khi user thay đổi config Lớp
    const response = await fetch(`http://localhost:8080/api/v1/classes?${queryParams.toString()}`, {
      headers,
      cache: 'no-store' 
    });

    if (!response.ok) {
      console.error(`Fetch API /api/v1/classes thất bại. Status: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi Exception khi Fetch Data danh sách lớp:', error);
    return null;
  }
}
