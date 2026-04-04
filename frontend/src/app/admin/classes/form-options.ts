/**
 * Server-side helpers: Fetch Courses và Rooms cho Admin Class Form
 * Dùng trong Server Component (page.tsx) → truyền xuống Client Component dưới dạng props.
 */

import { cookies } from 'next/headers';

export interface CourseOption {
  id: number;
  name: string;
  code: string;
}

export interface RoomOption {
  id: number;
  name: string;
  branchName?: string;
  capacity?: number;
}

async function getHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchCourseOptions(): Promise<CourseOption[]> {
  try {
    const res = await fetch('http://localhost:8080/api/v1/courses', {
      headers: await getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    // API có thể trả về array hoặc Page object
    const list = Array.isArray(data) ? data : (data.content ?? []);
    return list.map((c: { id: number; name: string; code: string }) => ({
      id: c.id,
      name: c.name,
      code: c.code,
    }));
  } catch {
    return [];
  }
}

export async function fetchRoomOptions(): Promise<RoomOption[]> {
  try {
    const res = await fetch('http://localhost:8080/api/v1/rooms', {
      headers: await getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const rooms = await res.json();
    const list = Array.isArray(rooms) ? rooms : (rooms.content ?? []);
    return list.map((r: { id: number; name: string; capacity?: number; branch?: { name: string } }) => ({
      id: r.id,
      name: r.name,
      branchName: r.branch?.name,
      capacity: r.capacity,
    }));
  } catch {
    return [];
  }
}
