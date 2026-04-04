"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  Users,
  GraduationCap,
  CalendarCheck,
  MoreHorizontal,
  UserPlus,
  Clock,
  BookOpen
} from "lucide-react";
import { ManageStudentsModal, ViewAttendanceModal } from "./ClassForms";
import { getAllClassesStaff } from "./class-actions";

interface ClassType {
  id: number;
  classCode: string;
  courseName: string;
  schedule: string;
  room: string;
  enrollment: number;
  maxEnrollment: number;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "CANCELLED";
}

export default function ClassesManagementPage() {
  const [activeModal, setActiveModal] = useState<"students" | "attendance" | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchClasses = async () => {
    setLoading(true);
    const result = await getAllClassesStaff();
    if (result.success) {
      setClasses(result.data);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenStudents = (cls: ClassType) => {
    setSelectedClass(cls);
    setActiveModal("students");
  };

  const handleOpenAttendance = (cls: ClassType) => {
    setSelectedClass(cls);
    setActiveModal("attendance");
  };

  const closeModal = () => {
    setActiveModal(null);
    setTimeout(() => setSelectedClass(null), 200); 
    fetchClasses(); // Refresh data in case something changed
  };

  const getStatusDisplay = (status: ClassType["status"]) => {
    switch (status) {
      case "IN_PROGRESS":
        return { label: "Active", color: "text-emerald-700", bg: "bg-emerald-500", box: "bg-emerald-50 text-emerald-600" };
      case "OPEN":
        return { label: "Upcoming", color: "text-blue-700", bg: "bg-blue-400", box: "bg-blue-50 text-blue-600" };
      case "CLOSED":
        return { label: "Completed", color: "text-slate-500", bg: "bg-slate-400", box: "bg-slate-50 text-slate-600" };
      case "CANCELLED":
        return { label: "Cancelled", color: "text-rose-500", bg: "bg-rose-400", box: "bg-rose-50 text-rose-600" };
      default:
        return { label: status, color: "text-slate-500", bg: "bg-slate-400", box: "bg-slate-50 text-slate-600" };
    }
  };

  const filteredClasses = classes.filter(cls => 
    cls.classCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cls.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: classes.length,
    active: classes.filter(c => c.status === "IN_PROGRESS").length,
    totalStudents: classes.reduce((acc, curr) => acc + curr.enrollment, 0),
    avgAttendance: "94%" // Keeping mock for now as backend doesn't provide avg % yet
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B3A9A]">My Classes</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage your assigned classes, add students, and track attendance history.
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {stats.active > 0 && (
              <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">
                {stats.active} Active Now
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">Assigned Classes</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-black text-slate-800 leading-none">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">Total Students</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-black text-slate-800 leading-none">
                {stats.totalStudents}
              </p>
              <p className="text-sm font-medium text-slate-400 mb-[2px]">students</p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-bold">
              Excellent
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">Average Attendance</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-black text-slate-800 leading-none">
                {stats.avgAttendance}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 relative z-10">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by class code or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
          
          <div className="flex gap-3 shrink-0">
            <button className="flex items-center gap-6 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              All Status
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            <button className="flex items-center justify-center w-[42px] h-[42px] bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors" onClick={() => fetchClasses()}>
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider">
                  <th className="text-left py-4 px-2 uppercase group-first:pl-0">CLASS NAME & COURSE</th>
                  <th className="text-left py-4 px-2 uppercase">SCHEDULE & ROOM</th>
                  <th className="text-left py-4 px-2 uppercase">ENROLLMENT</th>
                  <th className="text-left py-4 px-2 uppercase">STATUS</th>
                  <th className="text-right py-4 pl-2 pr-4 uppercase">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((cls, idx) => {
                  const statusInfo = getStatusDisplay(cls.status);
                  return (
                    <tr 
                      key={cls.id} 
                      className={`group border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx === filteredClasses.length - 1 ? 'border-none' : ''}`}
                    >
                      <td className="py-5 px-2">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${statusInfo.box}`}>
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">[{cls.classCode}] {cls.courseName}</p>
                            <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                              <span className="font-bold text-blue-600/60 uppercase tracking-wider">Class Code: {cls.classCode}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-2">
                        <div>
                          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {cls.schedule}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500 mt-1 pl-5">{cls.room}</p>
                        </div>
                      </td>
                      <td className="py-5 px-2">
                        <div className="flex items-center gap-3 max-w-[140px]">
                          <span className="text-sm font-bold text-slate-800 w-8">{cls.enrollment}/{cls.maxEnrollment}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${cls.enrollment >= cls.maxEnrollment ? 'bg-red-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(100, (cls.enrollment / (cls.maxEnrollment || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 border border-slate-100">
                          <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.bg}`}></div>
                          <span className={statusInfo.color}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 pl-2 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenStudents(cls)}
                            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors border border-slate-200 hover:border-blue-200"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Students
                          </button>
                          <button 
                            onClick={() => handleOpenAttendance(cls)}
                            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors border border-slate-200"
                          >
                            <CalendarCheck className="w-3.5 h-3.5" />
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ManageStudentsModal 
         isOpen={activeModal === "students"} 
         onClose={closeModal} 
         classData={selectedClass} 
      />
      
      <ViewAttendanceModal 
         isOpen={activeModal === "attendance"} 
         onClose={closeModal} 
         classData={selectedClass} 
      />
    </div>
  );
}
