"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  GraduationCap, 
  Settings, 
  LogOut,
  Activity,
  User
} from "lucide-react";
import { logoutAction } from "@/app/actions";

const STUDENT_NAV = [
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "Lịch học", href: "/student/schedules", icon: Calendar },
    { name: "Kết quả học tập", href: "/student/results", icon: GraduationCap },
];

export function StudentSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="font-bold text-slate-800 text-lg leading-tight">F4 Forum</h1>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Student Hub</p>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                <p className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Hành trình học tập</p>
                {STUDENT_NAV.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                                isActive 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]" 
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "group-hover:text-indigo-600"}`} />
                            {item.name}
                            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Menu */}
            <div className="p-4 border-t border-slate-100 space-y-2">
                <Link
                    href="/student/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                    <User className="w-5 h-5" />
                    Hồ sơ cá nhân
                </Link>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                    </button>
                </form>
            </div>
        </aside>
    );
}
