"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { logoutAction } from "../actions";

const TEACHER_NAV = [
  { name: "Profile", icon: User, href: "/teacher/profile" },
  { name: "Lớp", icon: GraduationCap, href: "/teacher/classes" },
  { name: "Lịch dạy", icon: CalendarDays, href: "/teacher/schedule" },
];

export default function TeacherPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#F8F9FB] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between flex-shrink-0 z-20 shadow-sm relative">
        <div>
          {/* Portal Identity */}
          <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">
                F4 Forum
              </h1>
              <p className="text-xs text-emerald-700 font-bold">
                Teacher Portal
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-8 space-y-1">
            {TEACHER_NAV.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div>
          <div className="px-4 pb-8 space-y-1 border-t border-slate-100 pt-4 mx-2">
            <Link
              href="/teacher/settings"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              SETTINGS
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                LOGOUT
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
          {/* Search Bar (UI only) */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm lớp, học viên, tài liệu..."
              className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>

          {/* Profile (placeholder) */}
          <div className="flex items-center gap-4 border-l border-slate-200 pl-4 ml-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-tight uppercase tracking-tight">
                  TEACHER
                </p>
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">
                  Academic Portal
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-emerald-200 overflow-hidden shrink-0 shadow-sm">
                <Image
                  src="https://i.pravatar.cc/100?u=teacher_portal"
                  alt="Teacher Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

