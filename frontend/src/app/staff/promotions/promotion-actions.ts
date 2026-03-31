'use server'

import { cookies } from 'next/headers';

const BE_URL = 'http://localhost:8080/api/v1/staff/promotions';

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
    if (!text.trim()) {
      return { ok: true as const, text: '{}' };
    }
    return { ok: true as const, text };
  }
  let detail = text?.trim() || `HTTP ${res.status}`;
  try {
    const json = JSON.parse(text) as { message?: string };
    if (json.message) detail = json.message;
  } catch {
    detail = `Lỗi ${res.status}: ${res.statusText}`;
  }
  return { ok: false as const, detail };
}

export interface PromotionResponse {
  id: number;
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount: number;
  endDate: string;
  valid: boolean;
}

export interface PromotionRequest {
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount?: number;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export async function getPromotions(page: number = 0, size: number = 10) {
  try {
    const res = await fetch(`${BE_URL}?page=${page}&size=${size}&sort=id,desc`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    const text = parsed.text?.trim() || '{}';
    return { success: true, data: JSON.parse(text) };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function getPromotionById(id: number) {
  try {
    const res = await fetch(`${BE_URL}/${id}`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: JSON.parse(parsed.text) as PromotionResponse };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function createPromotion(data: PromotionRequest) {
  try {
    const res = await fetch(BE_URL, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(data),
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: JSON.parse(parsed.text) as PromotionResponse };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function updatePromotion(id: number, data: PromotionRequest) {
  try {
    const res = await fetch(`${BE_URL}/${id}`, {
      method: 'PUT',
      headers: await getAuthHeader(),
      body: JSON.stringify(data),
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: JSON.parse(parsed.text) as PromotionResponse };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function deletePromotion(id: number) {
  try {
    const res = await fetch(`${BE_URL}/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeader(),
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}
