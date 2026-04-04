"use client";

import { Class } from "@/types/class.types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

/**
 * Component Thao tác dành riêng cho Tuyển sinh (STAFF)
 */
export function StaffEnrollButton({ data }: { data: Class }) {
  // Logic kiểm tra điều kiện y hệt Backend canEnroll()
  const isAvailable = data.status === 'OPEN' && data.currentEnrollment < data.maxStudents;
  
  return (
    <Button 
      variant={isAvailable ? "default" : "outline"}
      disabled={!isAvailable}
      className={`h-8 px-3 rounded-lg text-xs font-bold shadow-sm transition-all ${
        isAvailable 
          ? "bg-blue-600 hover:bg-blue-700 text-white" 
          : "text-slate-400 border-slate-200 bg-slate-50 cursor-not-allowed"
      }`}
      onClick={() => {
         // Chuyển hướng hoặc Mở Modal Ghi danh tại đây
         if(isAvailable) alert(`Đang tiến hành ghi danh cho Lớp ${data.classCode}`);
      }}
    >
      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
      {isAvailable ? "Ghi danh" : "Đã Đóng"}
    </Button>
  );
}
