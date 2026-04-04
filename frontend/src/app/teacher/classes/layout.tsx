"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Danh sách các lớp", href: "/teacher/classes" },
  { label: "Điểm danh", href: "/teacher/classes/attendance" },
  { label: "Nhập điểm", href: "/teacher/classes/grades" },
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
          Quản lý lớp: điểm danh, nhập điểm.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isClassesListTab = tab.href === "/teacher/classes";
            const isActive = isClassesListTab
              ? pathname === tab.href
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                  isActive
                    ? "bg-[#0B3A9A] text-white shadow-sm"
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

