import { fetchClasses } from "@/app/admin/classes/class-api";
import { StaffClassesTable } from "./StaffClassesTable";

export default async function StaffClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 0;
  
  // Call helper API chung
  const data = await fetchClasses({ page, size: 20 });
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Giao diện Header đơn giản hơn Admin — KHÔNG có nút Thêm Lớp */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tuyển sinh &amp; Tổ chức Lớp</h2>
        <p className="text-slate-500 font-medium">Bảng tra cứu danh sách Lớp học phục vụ ghi danh Học viên.</p>
      </div>

      {/*
        StaffClassesTable là Client Component — nó tự xử lý composition bên trong.
        Server Component chỉ truyền `classes` (array, serializable).
      */}
      <StaffClassesTable classes={data?.content || []} />
    </div>
  );
}
