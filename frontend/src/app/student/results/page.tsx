import { cookies } from "next/headers";
import { SearchX, ArrowRight } from "lucide-react";
import Link from "next/link";
import StudentAcademicResultsClient from "@/components/student/academic-results-client";
import { StudentAcademicResponse } from "@/types/academic.types";

async function fetchAcademicResults(): Promise<StudentAcademicResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const response = await fetch("http://localhost:8080/api/v1/student/me/academic-results", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 } // Always fetch fresh data for results
    });

    if (!response.ok) {
        if(response.status === 401 || response.status === 403) return null;
        throw new Error("Không thể kết nối tới máy chủ.");
    }

    return await response.json();
  } catch (error) {
    console.error("Academic Results Fetch Error:", error);
    return null;
  }
}

export default async function StudentResultsPage() {
  const data = await fetchAcademicResults();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <SearchX className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Chưa tìm thấy dữ liệu kết quả học tập</h2>
        <p className="text-slate-500 max-w-sm mx-auto mb-8">
          Hệ thống không tìm thấy kết quả học tập nào của bạn. Hãy liên hệ bộ phận hỗ trợ nếu đây là lỗi.
        </p>
        <Link href="/student/dashboard">
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                Quay lại Dashboard <ArrowRight className="w-4 h-4" />
            </button>
        </Link>
      </div>
    );
  }

  return <StudentAcademicResultsClient initialData={data} />;
}
