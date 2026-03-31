"use client";

import React, { useState, useEffect } from "react";
import { X, Search, UserPlus, CheckCircle2, CalendarDays, User, Clock } from "lucide-react";
import { getAvailableStudents, addStudentToClass, getAttendanceHistory } from "./class-actions";

interface ClassType {
  id: number;
  classCode: string;
  courseName: string;
  schedule: string;
  room: string;
  enrollment: number;
  maxEnrollment: number;
  status: string;
}

interface ManageStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassType | null;
}

interface StudentType {
  id: number;
  studentCode: string;
  fullName: string;
  email: string;
}

export function ManageStudentsModal({ isOpen, onClose, classData }: ManageStudentsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [availableStudents, setAvailableStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingIds, setAddingIds] = useState<number[]>([]);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen && classData) {
      setLoading(true);
      getAvailableStudents(classData.id).then(res => {
        if (res.success) setAvailableStudents(res.data);
        setLoading(false);
      });
    } else {
      setAvailableStudents([]);
      setAddedIds([]);
    }
  }, [isOpen, classData]);

  if (!isOpen || !classData) return null;

  const handleAdd = async (studentId: number) => {
    setAddingIds(prev => [...prev, studentId]);
    const result = await addStudentToClass(classData.id, studentId);
    if (result.success) {
      setAddedIds(prev => [...prev, studentId]);
    } else {
      alert(result.error || "Failed to add student");
    }
    setAddingIds(prev => prev.filter(id => id !== studentId));
  };

  const filteredStudents = availableStudents.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Add Students to Class</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Class: {classData.classCode} ({classData.courseName})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 h-[400px] flex flex-col">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search available students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
            {loading ? (
              <div className="flex justify-center py-8 text-slate-400 text-sm">Loading students...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex justify-center py-8 text-slate-400 text-sm italic">No students found</div>
            ) : filteredStudents.map(student => {
              const isAdded = addedIds.includes(student.id);
              const isAdding = addingIds.includes(student.id);
              
              return (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{student.fullName}</p>
                      <p className="text-xs font-medium text-slate-500">{student.studentCode} • {student.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAdd(student.id)}
                    disabled={isAdded || isAdding}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isAdded 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : isAdding 
                          ? "bg-blue-100 text-blue-400 cursor-wait"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Added
                      </>
                    ) : isAdding ? (
                      <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        Add
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

interface ViewAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassType | null;
}

interface AttendanceSession {
  date: string;
  presentCount: number;
  absentCount: number;
}

export function ViewAttendanceModal({ isOpen, onClose, classData }: ViewAttendanceModalProps) {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && classData) {
      setLoading(true);
      getAttendanceHistory(classData.id).then(res => {
        if (res.success) setSessions(res.data);
        setLoading(false);
      });
    }
  }, [isOpen, classData]);

  if (!isOpen || !classData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Attendance History</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Class: {classData.classCode} • {sessions.length} recorded sessions
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 italic">No attendance records found for this class.</div>
            ) : sessions.map((session, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex flex-col justify-center items-center shrink-0">
                      <CalendarDays className="w-5 h-5 mb-0.5" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-slate-800 text-sm">
                        {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 inline-flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Recorded Session
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 shrink-0 bg-slate-50 rounded-xl p-2.5 px-4">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Present</p>
                      <p className="text-sm font-black text-emerald-600 inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {session.presentCount}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Absent</p>
                      <p className="text-sm font-black text-rose-500 inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {session.absentCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
            <div className="mt-0.5 text-blue-600">
               <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 font-bold text-xs">i</span>
            </div>
            <p className="text-xs font-medium text-blue-800 leading-relaxed">
              Attendance records show past history. To mark attendance for today's session, navigate to the <span className="font-bold">Active Sessions</span> dashboard.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
