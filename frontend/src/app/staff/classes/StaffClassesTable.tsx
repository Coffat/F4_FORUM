"use client";

/**
 * StaffClassesTable — Client Component trung gian cho Staff Portal
 *
 * Lý do tồn tại: Tránh lỗi "Functions cannot be passed directly to Client Components"
 * khi truyền renderActions từ Server Component (page.tsx) → Client Component (ClassDataTable).
 * Staff chỉ thấy nút Ghi Danh, không có nút Sửa/Xóa.
 */

import { Class } from "@/types/class.types";
import { ClassDataTable } from "@/components/shared/ClassDataTable";
import { StaffEnrollButton } from "./StaffEnrollButton";

interface StaffClassesTableProps {
  classes: Class[];
}

export function StaffClassesTable({ classes }: StaffClassesTableProps) {
  return (
    <ClassDataTable
      classes={classes}
      renderActions={(item) => <StaffEnrollButton data={item} />}
    />
  );
}
