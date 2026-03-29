'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BE_URL = 'http://localhost:8080/api/v1/branches';

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return { 
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json'
  };
}

export async function getBranchList() {
  try {
    const res = await fetch(BE_URL, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch branches:', error);
    return [];
  }
}

export interface BranchCommandData {
  name: string;
  address: string;
  phone: string;
  status: string;
  capacity: number;
  currentEnrollment: number;
  managerId: number | null;
}

export async function createBranch(data: BranchCommandData) {
  try {
    const res = await fetch(BE_URL, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend create error [${res.status}]:`, errorText);
        return { error: `Failed: ${res.status}` };
    }
    revalidatePath('/admin/branches');
    return { success: true };
  } catch (error) {
    console.error('Network error during branch creation:', error);
    return { error: 'Network Failed' };
  }
}

export async function updateBranch(id: number, data: BranchCommandData) {
    try {
      const res = await fetch(`${BE_URL}/${id}`, {
        method: 'PUT',
        headers: await getAuthHeader(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend update error [${res.status}]:`, errorText);
        return { error: `Failed: ${res.status}` };
      }
      revalidatePath('/admin/branches');
      return { success: true };
    } catch (error) {
      console.error('Network error during branch update:', error);
      return { error: 'Failed' };
    }
}

export async function deleteBranch(id: number) {
    try {
      const res = await fetch(`${BE_URL}/${id}`, {
        method: 'DELETE',
        headers: await getAuthHeader()
      });
      if (!res.ok) {
        console.error(`Backend delete error [${res.status}]`);
        return { error: 'Failed' };
      }
      revalidatePath('/admin/branches');
      return { success: true };
    } catch (error) {
      console.error('Network error during branch deletion:', error);
      return { error: 'Failed' };
    }
}
