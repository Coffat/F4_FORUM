"use client";

import { Class } from "@/types/class.types";
import { Users, Calendar, MapPin, BookOpen } from "lucide-react";
import { ReactNode } from "react";

interface ClassDataTableProps {
  classes: Class[];
  // Prop renderActions ứng dụng nguyên lý "Composition over Inheritance"
  renderActions: (item: Class) => ReactNode;
}

/**
 * Helper: Format ngày YYYY-MM-DD → DD/MM/YYYY
 * Dùng split() thay vì new Date() để tránh timezone mismatch giữa SSR và Client
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return "—";
  const parts = dateString.split("-"); // ["YYYY", "MM", "DD"]
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export function ClassDataTable({ classes, renderActions }: ClassDataTableProps) {

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-slate-50/50">Mã Lớp / Khóa Học</th>
              <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-slate-50/50">Trạng Thái</th>
              <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-slate-50/50">Lịch Trình</th>
              <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-slate-50/50">Phòng / Sĩ Số</th>
              <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-slate-50/50 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 relative">
            {(!classes || classes.length === 0) ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-sm">
                  <div className="flex flex-col items-center justify-center">
                    <BookOpen className="w-10 h-10 text-slate-200 mb-3" />
                    <p>Chưa có dữ liệu lớp học nào.</p>
                  </div>
                </td>
              </tr>
            ) : (
              classes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Cột: Mã Lớp / Khóa */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {c.classCode}
                      </span>
                      <span className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                        {c.courseName}
                      </span>
                    </div>
                  </td>
                  
                  {/* Cột: Trạng Thái */}
                  <td className="px-6 py-4">
                    {c.status === 'OPEN' && (
                      <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-md border border-green-100">
                        Mở Ghi Danh
                      </span>
                    )}
                    {c.status === 'IN_PROGRESS' && (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md border border-blue-100">
                        Đang Diễn Ra
                      </span>
                    )}
                    {c.status === 'CLOSED' && (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md border border-slate-200">
                        Đã Đóng
                      </span>
                    )}
                    {c.status === 'CANCELLED' && (
                      <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-md border border-red-100">
                        Đã Hủy
                      </span>
                    )}
                  </td>

                  {/* Cột: Lịch Trình */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-medium">Từ {formatDate(c.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-transparent" />
                      <span className="text-xs font-medium">Đến {formatDate(c.endDate)}</span>
                    </div>
                  </td>

                  {/* Cột: Phòng Học & Sĩ Số (Visual Level Indicator) */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium">{c.roomName || "Chưa xếp phòng"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 mt-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium">
                          {c.currentEnrollment} / {c.maxStudents} Học viên
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 max-w-[120px]">
                        <div 
                          className={`h-full rounded-full transition-all ${c.currentEnrollment >= c.maxStudents ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${Math.min(100, (c.currentEnrollment / c.maxStudents) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  
                  {/* Cột: Thao Tác - Nhận Inject Động từ Component Ngoài */}
                  <td className="px-6 py-4 text-right">
                    {renderActions(c)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
