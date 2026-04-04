'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BE_URL_SCHEDULES = 'http://localhost:8080/api/v1/staff/schedules';

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

export interface ScheduleData {
  id: number;
  classId: number;
  className: string;
  roomId?: number;
  roomName?: string;
  date: string;
  startTime: string;
  endTime: string;
  isOnline: boolean;
  meetingLink?: string;
}

export async function getSchedules(start: string, end: string) {
  try {
    const res = await fetch(`${BE_URL_SCHEDULES}?start=${start}&end=${end}`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: parsed.text?.trim() ? JSON.parse(parsed.text) as ScheduleData[] : [] };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function createSchedule(payload: {
  classId: number;
  roomId?: number;
  date: string;
  startTime: string;
  endTime: string;
  isOnline: boolean;
  meetingLink?: string;
}) {
  try {
    const res = await fetch(BE_URL_SCHEDULES, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(payload),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    revalidatePath('/staff/schedules');
    return { success: true, data: parsed.text?.trim() ? JSON.parse(parsed.text) : null };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function updateSchedule(id: number, payload: {
  roomId?: number;
  date: string;
  startTime: string;
  endTime: string;
  isOnline: boolean;
  meetingLink?: string;
}) {
  try {
    const res = await fetch(`${BE_URL_SCHEDULES}/${id}`, {
      method: 'PUT',
      headers: await getAuthHeader(),
      body: JSON.stringify(payload),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    revalidatePath('/staff/schedules');
    return { success: true, data: parsed.text?.trim() ? JSON.parse(parsed.text) : null };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function deleteSchedule(id: number) {
  try {
    const res = await fetch(`${BE_URL_SCHEDULES}/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    revalidatePath('/staff/schedules');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function getRooms() {
  try {
    const res = await fetch('http://localhost:8080/api/v1/staff/rooms', {
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

export async function getClassesForSchedule() {
  try {
    const res = await fetch('http://localhost:8080/api/v1/staff/classes', {
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
