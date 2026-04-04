'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Video, 
  MapPin, 
  Clock,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { getSchedules, deleteSchedule, ScheduleData } from './schedule-actions';
import ScheduleForm from './ScheduleForm';

export default function ScheduleViewClient() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleData | null>(null);

  // Time range for the calendar (7 AM to 10 PM)
  const hours = Array.from({ length: 16 }, (_, i) => i + 7);
  
  // Get days of the current week
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, [currentDate]);

  const loadSchedules = async () => {
    setLoading(true);
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const start = formatDate(weekDays[0]);
    const end = formatDate(weekDays[6]);
    const res = await getSchedules(start, end);
    if (res.success) setSchedules(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadSchedules();
  }, [weekDays]);

  const navigateWeek = (dir: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (dir * 7));
    setCurrentDate(newDate);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch này?")) {
      const res = await deleteSchedule(id);
      if (res.success) loadSchedules();
      else alert(res.error || "Failed to delete schedule");
    }
  };

  const getPosition = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    const top = (startH - 7) * 64 + (startM / 60) * 64;
    const height = ((endH - startH) * 64) + ((endM - startM) / 60) * 64;
    
    return { top, height };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Week of {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Staff Class Scheduling</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button onClick={() => navigateWeek(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-900 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
              Today
            </button>
            <button onClick={() => navigateWeek(1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-900 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={() => { setEditingSchedule(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Modern Grid Calendar */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 bg-slate-50/50">
          <div className="p-4"></div>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div key={i} className={`p-5 flex flex-col items-center gap-1 border-l border-slate-100 ${isToday ? "bg-blue-50/30" : ""}`}>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? "text-blue-600" : "text-slate-400"}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`text-2xl font-black tracking-tighter ${isToday ? "text-blue-600" : "text-slate-900"}`}>
                  {day.getDate()}
                </span>
                {isToday && <div className="w-1 h-1 rounded-full bg-blue-600 mt-1 shadow-[0_0_10px_rgba(37,99,235,1)]"></div>}
              </div>
            )
          })}
        </div>

        {/* Calendar Body */}
        <div className="relative grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] h-[1024px] overflow-y-auto">
          {/* Time Labels */}
          <div className="bg-slate-50/30">
            {hours.map(h => (
              <div key={h} className="h-16 flex justify-center items-start pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tabular-nums">
                  {h}:00
                </span>
              </div>
            ))}
          </div>

          {/* Grid Columns */}
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} className="relative border-l border-slate-100">
              {/* Hour Grid Lines */}
              {hours.map(h => (
                <div key={h} className="h-16 border-b border-slate-50"></div>
              ))}

              {/* Events for this day */}
              {schedules
                .filter(s => {
                  const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                  return s.date === dayStr;
                })
                .map(schedule => {
                  const { top, height } = getPosition(schedule.startTime, schedule.endTime);
                  return (
                    <div 
                      key={schedule.id}
                      className="absolute left-1 right-1 rounded-2xl p-3 border shadow-sm group hover:shadow-xl hover:scale-[1.02] hover:z-10 transition-all cursor-pointer overflow-hidden"
                      style={{ 
                        top: `${top}px`, 
                        height: `${height}px`,
                        backgroundColor: schedule.isOnline ? '#eff6ff' : '#ecfdf5',
                        borderColor: schedule.isOnline ? '#bfdbfe' : '#d1fae5',
                      }}
                      onClick={() => { setEditingSchedule(schedule); setIsFormOpen(true); }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            schedule.isOnline ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                          }`}>
                            {schedule.isOnline ? "Online" : "Office"}
                          </span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(schedule.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/50 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <h4 className="text-xs font-black text-slate-900 truncate leading-tight mt-1">{schedule.className}</h4>
                        
                        <div className="mt-auto space-y-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">
                            <Clock className="w-3 h-3" />
                            {schedule.startTime.substring(0, 5)} - {schedule.endTime.substring(0, 5)}
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 truncate">
                            {schedule.isOnline ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-emerald-500" />}
                            {schedule.isOnline ? "Click to join" : schedule.roomName}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="fixed bottom-8 right-8 bg-white border border-slate-100 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-900">Syncing Lịch học...</span>
        </div>
      )}

      {/* Form Modal */}
      <ScheduleForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingSchedule(null); }}
        onSuccess={loadSchedules}
        initialData={editingSchedule}
      />
    </div>
  );
}
