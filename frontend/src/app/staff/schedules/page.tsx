import { Metadata } from 'next';
import ScheduleViewClient from './ScheduleViewClient';

export const metadata: Metadata = {
  title: 'Xếp lịch - F4 FORUM',
  description: 'Quản lý lịch học của trung tâm',
};

export default function SchedulesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Xếp lịch học</h2>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <ScheduleViewClient />
      </div>
    </div>
  );
}
