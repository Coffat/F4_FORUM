import { WeeklyCalendarClient } from "./components/WeeklyCalendarClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lịch học - Student Hub | F4 Forum",
  description: "Quản lý lịch học hàng tuần, xem thông tin phòng học và bài giảng trực tuyến dành cho học viên.",
}

/**
 * SchedulesPage - Server Component (Next.js 15).
 * Truyền tham số ngày ban đầu cho Client Component.
 */
export default function SchedulesPage() {
  // Lấy ngày hiện tại để làm điểm xuất phát cho lịch
  const initialDate = new Date().toISOString().split('T')[0]

  return (
    <main className="min-h-full">
      {/* Header Section */}
      <div className="mb-10 animate-in slide-in-from-top-4 duration-700 ease-out fill-mode-both">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Lịch học tuần này</h1>
        <p className="text-base font-bold text-slate-400">
          Hãy theo dõi sát lịch để không bỏ lỡ kiến thức quan trọng!
        </p>
      </div>

      {/* Tích hợp Client Component */}
      <WeeklyCalendarClient initialDate={initialDate} />
    </main>
  )
}
