"use client";

import { Class } from "@/types/class.types";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Component thao tác Lớp Học Dành riêng cho Quản trị viên (ADMIN)
 */
export function AdminClassActions({ data }: { data: Class }) {
  // Chỉ cho phép Xóa/Hủy những lớp chưa có người học (Nguyên tắc Frontend-Backend Đồng bộ)
  const canCancel = data.status === 'OPEN' && data.currentEnrollment === 0;

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-lg text-slate-500 hover:text-blue-600 border-slate-200 transition-colors"
      >
        <Edit className="w-4 h-4" />
        <span className="sr-only">Sửa lớp này</span>
      </Button>
      
      {canCancel ? (
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200 transition-colors"
          onClick={() => {
            // Chuẩn bị thực hiện gọi `softDeleteClassAction` ở đây
            alert(`Sẽ gọi Logic Hủy lớp: ${data.classCode}`);
          }}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Hủy lớp này</span>
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="icon" 
          disabled 
          className="h-8 w-8 rounded-lg text-slate-300 border-slate-100"
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Không thể hủy</span>
        </Button>
      )}
    </div>
  );
}
