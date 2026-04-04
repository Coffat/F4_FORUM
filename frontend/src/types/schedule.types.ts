/**
 * Schedule - Interface tương tứng với ScheduleDTO từ Backend.
 * Đảm bảo đồng bộ kiểu dữ liệu giữa FE và BE.
 */
export interface Schedule {
  scheduleId: number;
  date: string; // ISO string 'yyyy-MM-dd'
  startTime: string; // 'HH:mm:ss'
  endTime: string; // 'HH:mm:ss'
  isOnline: boolean;
  meetingLink: string | null;
  className: string;
  courseName: string;
  courseColor: string;
  roomName: string;
  isPresent: boolean;
}
