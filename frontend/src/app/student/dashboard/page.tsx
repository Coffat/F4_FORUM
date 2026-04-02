import { cookies } from "next/headers";
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  SearchX, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/** 
 * Interface định nghĩa dữ liệu DashBoard học viên 
 * Tương ứng với StudentDashboardResponse.java (Backend)
 */
interface EnrolledClass {
  id: number;
  classCode: string;
  courseName: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface StudentDashboardData {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  enrolledClasses: EnrolledClass[];
}

/**
 * Server Function: Fetch dữ liệu Dashboard từ Backend
 */
async function fetchStudentDashboard(): Promise<StudentDashboardData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const response = await fetch("http://localhost:8080/api/v1/student/dashboard", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 } // Cache trong 60 giây
    });

    if (!response.ok) {
        if(response.status === 401 || response.status === 403) return null;
        throw new Error("Không thể kết nối tới máy chủ.");
    }

    return await response.json();
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return null;
  }
}

/**
 * Main Student Dashboard Component (Server Side)
 */
export default async function StudentDashboardPage() {
  const data = await fetchStudentDashboard();

  // 1. Xử lý trường hợp không có dữ liệu hoặc lỗi (Empty State)
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
          <SearchX className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Chưa tìm thấy dữ liệu Dashboard</h2>
        <p className="text-slate-500 max-w-sm mx-auto mb-8">
          Có vẻ như phiên làm việc của bạn đã hết hạn hoặc bạn chưa tham gia khóa học nào. Hãy liên hệ bộ phận hỗ trợ nếu đây là lỗi.
        </p>
        <Link href="/login">
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                Quay lại đăng nhập <ArrowRight className="w-4 h-4" />
            </button>
        </Link>
      </div>
    );
  }

  const { fullName, enrolledClasses } = data;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header Chào mừng (Hero Section) */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Chào mừng quay lại, <span className="text-indigo-600">{fullName}</span>! 👋
          </h1>
          <p className="text-slate-500 text-lg font-medium mt-2">
            Đừng quên xem lịch học tuần này để không bỏ lỡ kiến thức quan trọng.
          </p>
        </div>
        <div className="flex gap-3">
            <Badge variant="outline" className="bg-indigo-50 border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" /> Hôm nay: {new Date().toLocaleDateString('vi-VN')}
            </Badge>
        </div>
      </section>

      {/* Thẻ Thống kê (Quick Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card className="border-none shadow-xl shadow-indigo-100 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl overflow-hidden relative">
            <CardHeader className="relative z-10">
                <CardTitle className="text-indigo-100 text-xs font-black uppercase tracking-widest opacity-80">Đang theo học</CardTitle>
                <div className="text-5xl font-extrabold flex items-baseline gap-2 mt-2">
                    {enrolledClasses.length} <span className="text-lg font-medium opacity-60">Lớp học</span>
                </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-4">
                <p className="text-sm text-indigo-100/80 font-medium">Bạn đang nỗ lực hết mình!</p>
            </CardContent>
            {/* Background Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <TrendingUp className="absolute top-6 right-6 w-12 h-12 opacity-10" />
        </Card>

        {/* Các thẻ phụ (Placeholder mockup) */}
        <Card className="border border-slate-100 shadow-sm rounded-3xl group hover:shadow-lg transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Tiến độ tổng quát</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="pt-2">
                <div className="text-3xl font-bold">85%</div>
                <p className="text-xs text-slate-500 mt-1">Hoàn thành các bài tập tuần này</p>
            </CardContent>
        </Card>
      </div>

      {/* Danh sách lớp học đang tham gia */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-indigo-600" /> Các lớp học sắp tới
            </h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">Xem lịch chi tiết</button>
        </div>

        {enrolledClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledClasses.map((item) => (
              <Card key={item.id} className="border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all duration-500 group overflow-hidden bg-white">
                <div className="h-3 bg-gradient-to-r from-indigo-500 to-blue-500" />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight">
                      {item.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                    {item.courseName}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs font-bold text-slate-400">
                    CODE: {item.classCode}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-6">
                  <div className="flex items-center gap-3 text-slate-500 p-3 bg-slate-50 rounded-2xl">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Khai giảng</span>
                        <span className="text-sm font-bold text-slate-700">{item.startDate}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-50 pt-4 pb-4">
                    <button className="w-full py-3 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                        Vào lớp học <ArrowRight className="w-4 h-4" />
                    </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-16 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Bạn chưa đăng ký lớp học nào trong kỳ này.</p>
          </div>
        )}
      </section>
    </div>
  );
}
