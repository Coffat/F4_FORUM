import { fetchClasses } from "./class-api";
import { AdminClassesTable } from "./AdminClassesTable";
import { fetchCourseOptions, fetchRoomOptions } from "./form-options";

export default async function AdminClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 0;
  
  const [data, courses, rooms] = await Promise.all([
    fetchClasses({ page, size: 20 }),
    fetchCourseOptions(),
    fetchRoomOptions(),
  ]);
  
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/*
        AdminClassesTable (Client Component) tự render cả header + nút Thêm Lớp + Bảng.
        Server Component chỉ truyền classes, courses, và rooms (serializable).
      */}
      <AdminClassesTable 
        classes={data?.content || []} 
        courses={courses}
        rooms={rooms}
      />
    </div>
  );
}
