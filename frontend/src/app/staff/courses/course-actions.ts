'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BE_URL_ADMIN = 'http://localhost:8080/api/v1/courses';
const BE_URL_STAFF = 'http://localhost:8080/api/v1/staff/courses';

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

export async function getCourseCatalogStaff() {
  try {
    const res = await fetch(BE_URL_STAFF, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: parsed.text?.trim() ? JSON.parse(parsed.text) : {} };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function getCourseStatsStaff() {
  try {
    const res = await fetch(`${BE_URL_STAFF}/stats`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: parsed.text?.trim() ? JSON.parse(parsed.text) : {} };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function updateCourseStaff(id: number, data: any) {
  try {
    const res = await fetch(`${BE_URL_STAFF}/${id}`, {
      method: 'PUT',
      headers: await getAuthHeader(),
      body: JSON.stringify(data)
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail || 'Failed to update course' };
    revalidatePath('/staff/courses');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

// Materials API
export async function getCourseMaterials(courseId: number) {
  try {
    const res = await fetch(`${BE_URL_STAFF}/${courseId}/materials`, {
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

export async function createCourseMaterial(courseId: number, data: any) {
  try {
    const res = await fetch(`${BE_URL_STAFF}/${courseId}/materials`, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(data),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    revalidatePath('/staff/courses');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function deleteCourseMaterial(materialId: number) {
  try {
    const res = await fetch(`${BE_URL_STAFF}/materials/${materialId}`, {
      method: 'DELETE',
      headers: await getAuthHeader(),
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    revalidatePath('/staff/courses');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}
