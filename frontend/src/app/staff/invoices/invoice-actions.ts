'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BE_URL = 'http://localhost:8080/api/v1/staff/invoices';

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

export interface InvoiceDetailItem {
  courseId: number;
  description: string;
  unitPrice: number;
  discountAmount?: number;
}

export interface CreateInvoiceData {
  studentId: number;
  dueDate?: string;
  paymentMethod?: string;
  details: InvoiceDetailItem[];
  promotionIds?: number[];
}

export interface InvoiceResponse {
  id: number;
  invoiceCode: string;
  student: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
  };
  baseAmount: number;
  finalAmount: number;
  status: string;
  dueDate: string;
  details: Array<{
    id: number;
    courseId: number;
    courseName: string;
    description: string;
    unitPrice: number;
    discountAmount: number;
    finalPrice: number;
  }>;
  promotions: Array<{
    id: number;
    code: string;
    name: string;
    discountType: string;
    discountValue: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export async function createInvoice(data: CreateInvoiceData) {
  try {
    const res = await fetch(BE_URL, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(data),
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    revalidatePath('/staff/invoices');
    const text = parsed.text?.trim() || '{}';
    return { success: true, data: JSON.parse(text) as InvoiceResponse };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function getInvoices(page: number = 0, size: number = 10) {
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

export async function getInvoiceById(id: number) {
  try {
    const res = await fetch(`${BE_URL}/${id}`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    return { success: true, data: JSON.parse(parsed.text) as InvoiceResponse };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export interface StudentInfo {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

export interface EnrollmentInfo {
  id: number;
  classId: number;
  classCode: string;
  courseName: string;
}

export interface CourseInfo {
  id: number;
  code: string;
  name: string;
  fee: number;
  level: string;
}

export async function searchStudents(keyword: string) {
  try {
    const res = await fetch(`${BE_URL}/students/search?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    const text = parsed.text?.trim() || '[]';
    return { success: true, data: JSON.parse(text) as StudentInfo[] };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function getStudentEnrollments(studentId: number) {
  try {
    const res = await fetch(`${BE_URL}/students/${studentId}/enrollments`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    const text = parsed.text?.trim() || '[]';
    return { success: true, data: JSON.parse(text) as EnrollmentInfo[] };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function getCourses() {
  try {
    const res = await fetch(`${BE_URL}/courses`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    const text = parsed.text?.trim() || '[]';
    return { success: true, data: JSON.parse(text) as CourseInfo[] };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export interface PromotionInfo {
  id: number;
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount: number;
  endDate: string;
  valid: boolean;
}

export async function getPromotions() {
  try {
    const res = await fetch(`${BE_URL}/promotions`, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    const parsed = await parseApiResponse(res);
    if (!parsed.ok) return { error: parsed.detail };
    const text = parsed.text?.trim() || '[]';
    return { success: true, data: JSON.parse(text) as PromotionInfo[] };
  } catch {
    return { error: 'Backend connection failed' };
  }
}
