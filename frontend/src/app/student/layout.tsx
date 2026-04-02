import { StudentSidebar } from "@/components/student/StudentSidebar";
import { Bell, HelpCircle, Search, User } from "lucide-react";
import Image from "next/image";

/**
 * StudentPortalLayout - Kiến trúc Server Component trung tâm.
 * Cấu hình này tuân thủ chuẩn Next.js 15, tối ưu Core Web Vitals.
 */
export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar - Điều hướng chính */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        
        {/* Top Floating Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 z-40 sticky top-0">
          {/* Search Bar - Mockup */}
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu, lớp học..."
              className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Action Icons Panel */}
          <div className="flex items-center gap-5 border-l border-slate-100 pl-4">
            <button className="relative p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group">
              <Bell className="w-5 h-5 group-hover:animate-pulse" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <button className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
              <HelpCircle className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-slate-200 mx-1" />

            {/* Profile Brief */}
            <div className="flex items-center gap-3 pr-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Học viên F4</p>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">Student Account</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden shrink-0 shadow-sm relative group cursor-pointer hover:border-indigo-600 transition-all duration-500">
                <div className="absolute inset-0 bg-slate-100 animate-pulse -z-10" />
                <Image
                  src="https://i.pravatar.cc/100?img=12"
                  alt="Student Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content với hiệu ứng Fade-in mượt mà */}
        <main className="flex-1 overflow-auto animate-in fade-in duration-700 ease-out fill-mode-both">
          <div className="p-8 max-w-7xl mx-auto min-h-full">
            {children}
          </div>
        </main>

        {/* Footer - Copyright */}
        <footer className="h-14 border-t border-slate-100 px-8 flex items-center justify-between text-xs font-bold text-slate-400">
          <p>© 2026 F4 Forum Academy System. All rights reserved.</p>
          <div className="flex items-center gap-4">
              <span className="hover:text-indigo-600 cursor-pointer">Terms of Service</span>
              <span className="hover:text-indigo-600 cursor-pointer">Privacy Policy</span>
          </div>
        </footer>
        
      </div>
    </div>
  );
}
