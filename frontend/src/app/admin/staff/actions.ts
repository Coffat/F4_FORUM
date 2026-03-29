'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BE_URL = 'http://localhost:8080/api/v1/personnel';

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return { 
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json'
  };
}

export async function getPersonnelList() {
  try {
    const res = await fetch(BE_URL, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    if (!res.ok) {
        console.error('Failed to fetch personnel list:', await res.text());
        return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Backend connection failed:', error);
    return [];
  }
}

export async function getPersonnelStats() {
    try {
      const res = await fetch(`${BE_URL}/stats`, {
        method: 'GET',
        headers: await getAuthHeader(),
        cache: 'no-store'
      });
      if (!res.ok) {
          console.error('Failed to fetch personnel stats:', await res.text());
          return null;
      }
      return await res.json();
    } catch (error) {
      console.error('Backend connection failed:', error);
      return null;
    }
}

// Reuse User Management Endpoints
const ADMIN_USERS_URL = 'http://localhost:8080/api/admin/users';

export async function createStaff(data: unknown) {
  try {
    const res = await fetch(ADMIN_USERS_URL, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const msg = await res.text();
      return { error: msg || 'Failed to add staff member' };
    }
    revalidatePath('/admin/staff');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function updateStaff(id: number, data: unknown) {
  try {
    const res = await fetch(`${ADMIN_USERS_URL}/${id}`, {
      method: 'PUT',
      headers: await getAuthHeader(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      return { error: 'Failed to update user' };
    }
    revalidatePath('/admin/staff');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}

export async function deleteStaff(id: number) {
  try {
    const res = await fetch(`${ADMIN_USERS_URL}/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeader()
    });
    if (!res.ok) {
      return { error: 'Failed to disable staff member' };
    }
    revalidatePath('/admin/staff');
    return { success: true };
  } catch {
    return { error: 'Backend connection failed' };
  }
}
