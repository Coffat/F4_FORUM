export type ClassStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';

export interface Class {
  id: number;
  classCode: string;
  courseName: string;
  roomName: string | null;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  maxStudents: number;
  currentEnrollment: number;
  status: ClassStatus;
}

export interface PaginatedClassResponse {
  content: Class[];
  totalElements: number;
  totalPages: number;
  number: number;
}
