'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const getBaseUrl = (branchId: number) => `http://localhost:8080/api/v1/branches/${branchId}/rooms`;

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return { 
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json'
  };
}

export interface RoomCommandData {
  name: string;
  capacity: number;
  roomType: string;
}

export async function getRoomList(branchId: number) {
  try {
    const res = await fetch(getBaseUrl(branchId), {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return [];
  }
}

export async function createRoom(branchId: number, data: RoomCommandData) {
  try {
    const res = await fetch(getBaseUrl(branchId), {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend room create error [${res.status}]:`, errorText);
        return { error: `Failed: ${res.status}` };
    }
    revalidatePath('/admin/branches');
    return { success: true };
  } catch (error) {
    console.error('Network error during room creation:', error);
    return { error: 'Network Failed' };
  }
}

export async function updateRoom(branchId: number, roomId: number, data: RoomCommandData) {
    try {
      const res = await fetch(`${getBaseUrl(branchId)}/${roomId}`, {
        method: 'PUT',
        headers: await getAuthHeader(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend room update error [${res.status}]:`, errorText);
        return { error: `Failed: ${res.status}` };
      }
      revalidatePath('/admin/branches');
      return { success: true };
    } catch (error) {
      console.error('Network error during room update:', error);
      return { error: 'Failed' };
    }
}

export async function deleteRoom(branchId: number, roomId: number) {
    try {
      const res = await fetch(`${getBaseUrl(branchId)}/${roomId}`, {
        method: 'DELETE',
        headers: await getAuthHeader()
      });
      if (!res.ok) {
        console.error(`Backend room delete error [${res.status}]`);
        return { error: 'Failed' };
      }
      revalidatePath('/admin/branches');
      return { success: true };
    } catch (error) {
      console.error('Network error during room deletion:', error);
      return { error: 'Failed' };
    }
}
