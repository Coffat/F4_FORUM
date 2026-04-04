'use client'

import { Schedule } from '@/types/schedule.types'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Video, MapPin, Clock, User, CheckCircle2, ChevronRight, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GridSessionCardProps {
  session: Schedule
  rowStart: number
  rowSpan: number
}

/**
 * GridSessionCard - Hiển thị buổi học trong Grid.
 * Phối hợp HoverCard (Tooltip nhanh) và Sheet (Chi tiết Slide-over).
 */
export const GridSessionCard = ({ session, rowStart, rowSpan }: GridSessionCardProps) => {
  // Tính toán màu nền nhạt từ mã màu courseColor (Hex)
  // Trong thực tế có thể dùng lib để làm nhạt màu, ở đây giả định màu border lấy từ session.courseColor
  const borderColor = session.courseColor || '#4F46E5'

  return (
    <div 
      className="absolute inset-x-1 p-0.5"
      style={{ 
        gridRowStart: rowStart, 
        gridRowEnd: `span ${rowSpan}`,
        zIndex: 10
      }}
    >
      <Sheet>
        <SheetTrigger asChild>
          <div 
            className={cn(
              "h-full w-full rounded-xl border-l-4 p-2.5 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
            )}
            style={{ borderLeftColor: borderColor }}
          >
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                {session.courseName}
              </h4>
              <div className="flex items-center gap-1 opacity-60">
                <Clock className="w-2.5 h-2.5 text-slate-400" />
                <span className="text-[9px] font-bold text-slate-500">
                    {session.startTime.substring(0, 5)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-1 border-t border-slate-50">
               {session.isOnline ? (
                  <Video className="w-3 h-3 text-indigo-400" />
               ) : (
                  <MapPin className="w-3 h-3 text-emerald-400" />
               )}
               <span className="text-[9px] font-black text-slate-300 group-hover:text-indigo-500 transition-colors">
                  <ChevronRight className="w-3 h-3" />
               </span>
            </div>
          </div>
        </SheetTrigger>

        {/* Detailed Side Panel */}
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: borderColor }}>
                  {session.isOnline ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
               </div>
               <div>
                  <SheetTitle>{session.courseName}</SheetTitle>
                  <SheetDescription>Chi tiết buổi học: {session.className}</SheetDescription>
               </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 py-4">
            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4">
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-indigo-100 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <Clock className="w-3 h-3" /> Thời gian học
                  </p>
                  <p className="text-lg font-black text-slate-900 leading-tight">
                     {session.startTime.substring(0, 5)} — {session.endTime.substring(0, 5)}
                  </p>
                  <p className="text-xs font-bold text-slate-400 mt-1 capitalize">
                     Thứ {parseDayOfWeek(session.date)}, {session.date}
                  </p>
               </div>

               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-indigo-100 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <Hash className="w-3 h-3" /> Địa điểm / Phòng
                  </p>
                  {session.isOnline ? (
                    <div className="space-y-3">
                       <p className="text-lg font-black text-indigo-600">Lớp học Trực tuyến</p>
                       <a 
                        href={session.meetingLink || '#'} 
                        target="_blank" 
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                       >
                          <Video className="w-4 h-4" /> Tham gia ngay
                       </a>
                    </div>
                  ) : (
                    <div>
                       <p className="text-lg font-black text-slate-900">{session.roomName}</p>
                       <p className="text-xs font-bold text-slate-400 mt-1">Cơ sở: Saigon Central</p>
                    </div>
                  )}
               </div>

               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-indigo-100 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <CheckCircle2 className="w-3 h-3" /> Trạng thái
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-3 h-3 rounded-full animate-pulse",
                        session.isPresent ? "bg-emerald-500" : "bg-amber-400"
                    )} />
                    <span className={cn(
                        "text-sm font-black",
                        session.isPresent ? "text-emerald-600" : "text-amber-600"
                    )}>
                        {session.isPresent ? "Đã điểm danh" : "Chờ điểm danh / Vắng mặt"}
                    </span>
                  </div>
               </div>
            </div>

            {/* Mockup Teacher Profile */}
            <div className="pt-6 border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User className="w-3 h-3" /> Giảng viên phụ trách
               </p>
               <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 animate-pulse overflow-hidden">
                      <img src="https://i.pravatar.cc/100?u=teacher" alt="Teacher" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Ms. Lan Anh</p>
                    <p className="text-[10px] font-bold text-slate-400">IELTS Senior Educator</p>
                  </div>
               </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function parseDayOfWeek(dateStr: string) {
  const d = new Date(dateStr)
  const days = ['Chủ Nhật', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy']
  return days[d.getDay()]
}
