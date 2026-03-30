"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Tổng quan", href: "/teacher/classes" },
  { label: "Giao bài tập", href: "/teacher/classes/assignments" },
  { label: "Điểm danh", href: "/teacher/classes/attendance" },
  { label: "Nhập điểm", href: "/teacher/classes/grades" },
  { label: "Up tài liệu", href: "/teacher/classes/materials" },
];

export default function TeacherClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Lớp học
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Quản lý lớp: giao bài tập, điểm danh, nhập điểm, tài liệu (khung giao
          diện).
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}

