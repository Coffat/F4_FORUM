'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BE_URL = 'http://localhost:8080/api/v1/courses';

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

export async function getCourseCatalog() {
  try {
    const res = await fetch(BE_URL, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) {
      return { error: parsed.detail };
    }
    const data = parsed.text?.trim() ? JSON.parse(parsed.text) : {};
    return { success: true, data };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function getCourseStats() {
  try {
    const res = await fetch(`${BE_URL}/stats`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) {
      return { error: parsed.detail };
    }
    const data = parsed.text?.trim() ? JSON.parse(parsed.text) : {};
    return { success: true, data };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function createCourse(data: Record<string, unknown>) {
  try {
    const res = await fetch(BE_URL, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(data),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) {
      return { error: parsed.detail || 'Failed to create course' };
    }
    revalidatePath('/admin/courses');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function updateCourse(id: number, data: any) {
  try {
    const res = await fetch(`${BE_URL}/${id}`, {
      method: 'PUT',
      headers: await getAuthHeader(),
      body: JSON.stringify(data)
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) {
      return { error: parsed.detail || 'Failed to update course' };
    }
    revalidatePath('/admin/courses');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function deleteCourse(id: number) {
  try {
    const res = await fetch(`${BE_URL}/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeader()
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) {
      return { error: parsed.detail || 'Failed to archive course' };
    }
    revalidatePath('/admin/courses');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}
