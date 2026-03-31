'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Video, Info } from 'lucide-react';
import { createSchedule, updateSchedule, getRooms, getClassesForSchedule, ScheduleData } from './schedule-actions';

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ScheduleData | null;
}

export default function ScheduleForm({ isOpen, onClose, onSuccess, initialData }: ScheduleFormProps) {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    classId: '',
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    isOnline: false,
    meetingLink: ''
  });

  useEffect(() => {
    if (isOpen) {
      // Load data for selects
      getClassesForSchedule().then(res => {
        if (res.success) setClasses(res.data);
      });
      getRooms().then(res => {
        if (res.success) setRooms(res.data);
      });

      if (initialData) {
        setFormData({
          classId: initialData.classId.toString(),
          roomId: initialData.roomId?.toString() || '',
          date: initialData.date,
          startTime: initialData.startTime.substring(0, 5),
          endTime: initialData.endTime.substring(0, 5),
          isOnline: initialData.isOnline,
          meetingLink: initialData.meetingLink || ''
        });
      } else {
        setFormData({
          classId: '',
          roomId: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '08:00',
          endTime: '10:00',
          isOnline: false,
          meetingLink: ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      classId: parseInt(formData.classId),
      roomId: formData.isOnline ? undefined : parseInt(formData.roomId),
      date: formData.date,
      startTime: formData.startTime + ':00',
      endTime: formData.endTime + ':00',
      isOnline: formData.isOnline,
      meetingLink: formData.isOnline ? formData.meetingLink : undefined
    };

    let result;
    if (initialData) {
      result = await updateSchedule(initialData.id, payload);
    } else {
      result = await createSchedule(payload);
    }

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      alert(result.error || "Failed to save schedule. Check for room conflicts!");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Chỉnh sửa lịch' : 'Thêm lịch học mới'}
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Xếp lịch hằng tuần</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-slate-200 text-slate-400 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lớp học</label>
            <select 
              required
              disabled={!!initialData}
              value={formData.classId}
              onChange={(e) => setFormData({...formData, classId: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
            >
              <option value="">Chọn lớp học...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.classCode} - {c.courseName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày học</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hình thức</label>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isOnline: !formData.isOnline})}
                  className={`w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border font-bold text-sm transition-all ${
                    formData.isOnline 
                      ? "bg-blue-50 border-blue-200 text-blue-600" 
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  {formData.isOnline ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  {formData.isOnline ? "Online" : "Offline"}
                </button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bắt đầu</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kết thúc</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
             </div>
          </div>

          {formData.isOnline ? (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Link</label>
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input 
                  type="url"
                  required
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                  className="w-full bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 pl-11 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phòng học</label>
              <select 
                required
                value={formData.roomId}
                onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="">Chọn phòng học...</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.capacity} chỗ)</option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
             <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
             <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
               Lưu ý: Hệ thống sẽ tự động kiểm tra xung đột phòng học. Nếu phòng đã có lịch trùng giờ, yêu cầu sẽ bị từ chối.
             </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-black uppercase tracking-widest rounded-2xl transition-all"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Lưu lịch học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
