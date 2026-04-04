'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BE_URL_CLASSES = 'http://localhost:8080/api/v1/staff/classes';

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return { 
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json'
  };
}

async function parseApiResponse(res: Response) {
  const text = await res.text();
  if (res.ok) {
    return { ok: true as const, text };
  }
  let detail = text?.trim() || `HTTP ${res.status}`;
  try {
    const json = JSON.parse(text) as { message?: string };
    if (json.message) detail = json.message;
  } catch {
    // Keep plain text body from backend
  }
  return { ok: false as const, detail };
}

export async function getAllClassesStaff() {
  try {
    const res = await fetch(BE_URL_CLASSES, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: parsed.text?.trim() ? JSON.parse(parsed.text) : [] };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function getAvailableStudents(classId: number) {
  try {
    const res = await fetch(`${BE_URL_CLASSES}/${classId}/available-students`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: parsed.text?.trim() ? JSON.parse(parsed.text) : [] };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function addStudentToClass(classId: number, studentId: number) {
  try {
    const res = await fetch(`${BE_URL_CLASSES}/${classId}/students`, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify({ studentId }),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    revalidatePath('/staff/classes');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function getAttendanceHistory(classId: number) {
  try {
    const res = await fetch(`${BE_URL_CLASSES}/${classId}/attendance`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: parsed.text?.trim() ? JSON.parse(parsed.text) : [] };
  } catch {
    return { error: 'Backend connection failed' };
  }
}
