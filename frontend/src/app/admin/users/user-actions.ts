'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BE_URL = 'http://localhost:8080/api/admin/users';

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return { 
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json'
  };
}

export async function createUser(data: any) {
  try {
    const res = await fetch(BE_URL, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const msg = await res.text();
      return { error: msg || 'Failed to create user' };
    }
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    return { error: 'Backend connection failed' };
  }
}

export async function updateUser(id: number, data: any) {
  try {
    const res = await fetch(`${BE_URL}/${id}`, {
      method: 'PUT',
      headers: await getAuthHeader(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      return { error: 'Failed to update user' };
    }
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    return { error: 'Backend connection failed' };
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await fetch(`${BE_URL}/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeader()
    });
    if (!res.ok) {
      return { error: 'Failed to delete user' };
    }
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    return { error: 'Backend connection failed' };
  }
}
