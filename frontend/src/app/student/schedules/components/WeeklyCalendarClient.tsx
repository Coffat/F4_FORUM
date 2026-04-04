'use client'

import { useState, useMemo } from 'react'
import { 
  format, 
  addDays, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  parseISO 
} from 'date-fns'
import { vi } from 'date-fns/locale'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Video, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react'
import { useSchedules } from '@/hooks/use-schedules'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { TimeColumn } from './TimeColumn'
import { GridSessionCard } from './GridSessionCard'
import { ScrollArea } from '@/components/ui/scroll-area'

/**
 * WeeklyCalendarClient: Client Component chính của trang Lịch học.
 * Nâng cấp: Custom CSS Grid 8 cột, 60 hàng (mỗi 15 phút là 1 hàng).
 */
export const WeeklyCalendarClient = ({ initialDate }: { initialDate: string }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(initialDate))

  const { weekStart, weekEnd, weekDays } = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i))
    return {
      weekStart: format(start, 'yyyy-MM-dd'),
      weekEnd: format(end, 'yyyy-MM-dd'),
      weekDays: days
    }
  }, [currentDate])

  const { data: schedules, isLoading } = useSchedules(weekStart, weekEnd)

  const goToPreviousWeek = () => setCurrentDate(prev => subDays(prev, 7))
  const goToNextWeek = () => setCurrentDate(prev => addDays(prev, 7))
  const goToToday = () => setCurrentDate(new Date())

  // Logic tính toán Grid Row: bắt đầu từ 07:00, bước 15 phút
  const getGridRowConfig = (timeStr: string, endTimeStr: string) => {
    const [hStart, mStart] = timeStr.split(':').map(Number)
    const [hEnd, mEnd] = endTimeStr.split(':').map(Number)

    const rowStart = (hStart - 7) * 4 + Math.floor(mStart / 15) + 1
    const totalMinutes = (hEnd * 60 + mEnd) - (hStart * 60 + mStart)
    const rowSpan = Math.ceil(totalMinutes / 15)

    return { rowStart, rowSpan }
  }

  return (
    <div className="flex flex-col h-[800px] bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-indigo-100 overflow-hidden">
      {/* ── Calendar Top Header ──────────────────────────────────────── */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
               <CalendarIcon className="w-5 h-5 text-white" />
           </div>
           <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {format(currentDate, 'MM, yyyy', { locale: vi })}
              </h2>
           </div>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goToPreviousWeek} className="rounded-xl">
               <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={goToToday} className="rounded-xl font-black text-xs uppercase px-5">
               Tuần hiện tại
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNextWeek} className="rounded-xl">
               <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
      </div>

      {/* ── Days Sticky Header (8 columns) ────────────────────────────── */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-slate-100 bg-white sticky top-0 z-20">
         <div className="h-14 border-r border-slate-50" /> {/* Góc trống phía trên TimeColumn */}
         {weekDays.map((day, i) => (
            <div key={i} className="h-14 flex flex-col items-center justify-center border-r border-slate-50 last:border-r-0">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  {format(day, 'EEE', { locale: vi })}
               </span>
               <span className={cn(
                  "text-sm font-black mt-0.5",
                  isSameDay(day, new Date()) ? "text-indigo-600 underline underline-offset-4 decoration-2" : "text-slate-700"
               )}>
                  {format(day, 'dd/MM')}
               </span>
            </div>
         ))}
      </div>

      {/* ── Main Calendar Body (Scrollable) ────────────────────────────── */}
      <ScrollArea className="flex-1">
         <div className="grid grid-cols-[80px_repeat(7,1fr)] relative min-h-[1440px]">
            {/* Background Grid Lines & Time Column */}
            <div className="border-r border-slate-50 bg-slate-50/10 py-4">
                <TimeColumn />
            </div>

            {/* Các cột ngày và ô Grid */}
            {weekDays.map((day, dayIndex) => {
               const dayStr = format(day, 'yyyy-MM-dd')
               const daySchedules = schedules?.filter(s => s.date === dayStr) || []

               return (
                  <div key={dayStr} className="relative border-r border-slate-50 last:border-r-0 group/col">
                     {/* Horizontal Grid lines */}
                     {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="absolute w-full h-[1px] bg-slate-100 top-0 mt-0" style={{ top: `${i * 96}px` }} />
                     ))}

                     {/* Session Cards */}
                     {daySchedules.map(session => {
                        const { rowStart, rowSpan } = getGridRowConfig(session.startTime, session.endTime)
                        return (
                           <GridSessionCard 
                              key={session.scheduleId}
                              session={session}
                              rowStart={rowStart}
                              rowSpan={rowSpan}
                           />
                        )
                     })}

                     {/* Today Highlight Column */}
                     {isSameDay(day, new Date()) && (
                        <div className="absolute inset-0 bg-indigo-50/10 -z-10 pointer-events-none" />
                     )}
                  </div>
               )
            })}
         </div>
      </ScrollArea>
    </div>
  )
}
