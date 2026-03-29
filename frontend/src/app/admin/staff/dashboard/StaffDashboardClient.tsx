"use client";

import {
  BarChart3,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Zap,
  Wifi,
  FlaskConical,
  Package,
  ChevronRight,
  Activity,
  Megaphone,
  ClipboardList,
  Download,
  GraduationCap,
  UserCheck,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import type { StaffDashboardMetrics } from "./page";

// Dữ liệu tĩnh (không cần từ BE) - vận hành/inventory/alerts
const OPS_OVERVIEW = [
  {
    name: "HVAC System",
    status: "Optimal Performance: 72°F Average",
    icon: Zap,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    progress: 85,
    progressColor: "bg-emerald-500",
  },
  {
    name: "WiFi Network",
    status: "Lab B Node fluctuating",
    icon: Wifi,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    progress: 65,
    progressColor: "bg-orange-400",
  },
  {
    name: "Lab Availability",
    status: "All 4 Labs currently booked",
    icon: FlaskConical,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    progress: 100,
    progressColor: "bg-blue-500",
  },
];

const INVENTORY = [
  {
    category: "Textbooks (A-Level Bio)",
    stock: "142 units",
    status: "IN STOCK",
    statusColor: "bg-emerald-100 text-emerald-700",
    icon: Package,
  },
  {
    category: 'Staff iPads (Pro 11")',
    stock: "12 units",
    status: "LOW STOCK",
    statusColor: "bg-red-100 text-red-700",
    icon: Package,
  },
  {
    category: "Lab Consumables",
    stock: "65% Full",
    status: "MONITORING",
    statusColor: "bg-blue-100 text-blue-700",
    icon: FlaskConical,
  },
];

const ALERTS = [
  {
    title: "EMERGENCY MAINTENANCE",
    desc: "East Wing elevator service interruption",
    time: "Scheduled: 14:00 - 16:00 today",
    type: "emergency",
  },
  {
    title: "OPERATIONAL UPDATE",
    desc: "Summer term schedule finalization",
    time: "Deadline: Friday, 5:00 PM",
    type: "update",
  },
  {
    title: "POLICY CHANGE",
    desc: "Updated guest login protocols for WiFi",
    time: "Effective immediately",
    type: "policy",
  },
];

// Props từ Server Component (dữ liệu thực từ BE)
interface Props {
  metrics: StaffDashboardMetrics;
}

export default function StaffDashboardClient({ metrics }: Props) {
  // ===== Xây dựng KPI cards từ dữ liệu thực của BE =====
  const KPI_CARDS = [
    {
      title: "TOTAL FACULTY",
      value: metrics.totalFaculty.toString(),
      trend: `${metrics.totalTeachers}T + ${metrics.totalAdminStaff}S`,
      trendColor: "text-blue-500",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "ACTIVE SESSIONS",
      value: metrics.activeSessions.toString(),
      trend: "Live Classes",
      trendColor: "text-emerald-500",
      icon: BookOpen,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "ON-DUTY RATIO",
      value: metrics.onDutyRatio,
      trend: "Teachers",
      trendColor: "text-purple-500",
      icon: GraduationCap,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "ACTIVE STAFF",
      value: metrics.activeStaffCount.toString(),
      trend: `of ${metrics.totalFaculty} total`,
      trendColor: "text-slate-400",
      icon: UserCheck,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-700">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B3A9A] to-[#1E4DAB] rounded-[2rem] p-10 text-white shadow-xl shadow-blue-900/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black tracking-widest uppercase mb-6 border border-white/10">
              Operations Center
            </span>
            <h1 className="text-5xl font-black mb-4 tracking-tight leading-[1.1]">
              Staff Dashboard
              <br />
              <span className="text-blue-200 text-3xl font-bold">
                Operations Overview
              </span>
            </h1>
            <p className="text-blue-100 text-lg font-medium max-w-md leading-relaxed">
              Đang quản lý{" "}
              <span className="text-white font-bold">{metrics.totalFaculty}</span>{" "}
              nhân sự. Hiện có{" "}
              <span className="text-white font-bold">{metrics.activeSessions}</span>{" "}
              lớp đang hoạt động.
            </p>

            <div className="flex gap-4 mt-10">
              <button className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg shadow-black/5">
                View Tasks
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
                Operational Log
              </button>
            </div>
          </div>

          {/* KPI tiles trong banner */}
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1 text-center">
                Teachers
              </span>
              <span className="text-2xl font-black">{metrics.totalTeachers}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1 text-center">
                Admin Staff
              </span>
              <span className="text-2xl font-black">{metrics.totalAdminStaff}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1 text-center">
                On Duty
              </span>
              <span className="text-2xl font-black">{metrics.onDutyRatio}</span>
            </div>
          </div>
        </div>

        {/* Decorative bg elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl" />
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left: 3 columns */}
        <div className="xl:col-span-3 space-y-8">
          {/* KPI Cards — dữ liệu thực từ BE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KPI_CARDS.map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.iconBg} ${card.iconColor} group-hover:scale-110 transition-transform`}
                  >
                    <card.icon size={24} />
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-50 ${card.trendColor}`}
                  >
                    {card.trend}
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1 uppercase">
                  {card.title}
                </p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Center Operations Overview */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Center Operations Overview
                </h2>
                <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">
                  Full Status Report
                </button>
              </div>

              <div className="space-y-8">
                {OPS_OVERVIEW.map((op, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${op.iconBg} ${op.iconColor}`}
                    >
                      <op.icon size={24} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-slate-900">{op.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400">
                          {op.status}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${op.progressColor} rounded-full transition-all duration-500`}
                          style={{ width: `${op.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#EBECEF] rounded-[2rem] p-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">
                Quick Actions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Issue Announcement",
                    icon: Megaphone,
                    color: "text-blue-600",
                    bg: "bg-blue-100",
                  },
                  {
                    label: "Inventory Audit",
                    icon: ClipboardList,
                    color: "text-purple-600",
                    bg: "bg-purple-100",
                  },
                  {
                    label: "Financial Export",
                    icon: Download,
                    color: "text-orange-600",
                    bg: "bg-orange-100",
                  },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    className="w-full bg-white p-5 rounded-2xl flex items-center gap-5 hover:shadow-lg transition-all group border border-slate-100/50"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 transition-all`}
                    >
                      <action.icon size={20} />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">
                      {action.label}
                    </span>
                    <ChevronRight className="ml-auto text-slate-300 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inventory Quick View */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Inventory Quick View
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="text-left pb-4 font-black">Category</th>
                    <th className="text-left pb-4 font-black">Stock Level</th>
                    <th className="text-left pb-4 font-black">Status</th>
                    <th className="text-right pb-4 font-black">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {INVENTORY.map((item, idx) => (
                    <tr
                      key={idx}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                          <item.icon size={18} />
                        </div>
                        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-6 text-sm font-medium text-slate-500 whitespace-nowrap">
                        {item.stock}
                      </td>
                      <td className="py-6">
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.statusColor}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-6 text-right font-black">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors text-xs uppercase tracking-widest">
                          {item.status === "LOW STOCK" ? "Order" : "Audit"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: 1 column sidebar */}
        <div className="space-y-8">
          {/* System Alerts */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                System Alerts
              </h2>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            </div>

            <div className="space-y-10">
              {ALERTS.map((alert, idx) => (
                <div
                  key={idx}
                  className="relative pl-6 border-l-2 border-slate-100 hover:border-blue-200 transition-colors py-1"
                >
                  <p
                    className={`text-[10px] font-black tracking-widest uppercase mb-2 ${
                      alert.type === "emergency"
                        ? "text-red-500"
                        : "text-blue-600"
                    }`}
                  >
                    {alert.title}
                  </p>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                    {alert.desc}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {alert.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Staff Widget — dữ liệu THỰC từ BE */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
              Active Staff
            </h2>
            <p className="text-xs text-slate-400 font-medium mb-8">
              Fetched live from database
            </p>

            {metrics.recentlyActive.length > 0 ? (
              <div className="space-y-6">
                {metrics.recentlyActive.map((staff, idx) => (
                  <div key={staff.id ?? idx} className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-50 overflow-hidden">
                        <Image
                          src={staff.avatar}
                          alt={staff.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      {/* Status dot */}
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          staff.isActive ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {staff.name}
                      </h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                        {staff.departmentOrSpecialty}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg tabular-nums shrink-0 ${
                        staff.roleLabel === "TEACHER"
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-600 bg-slate-100"
                      }`}
                    >
                      {staff.roleLabel}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8 font-medium">
                No active staff data available
              </p>
            )}

            <button className="w-full mt-10 py-4 bg-slate-50 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-colors">
              View All Staff ({metrics.activeStaffCount} Active)
            </button>
          </div>

          {/* Staff Segment Summary */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] p-8 text-white shadow-lg shadow-blue-200">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-6 h-6 text-blue-200" />
              <h2 className="text-lg font-black tracking-tight">
                Staff Breakdown
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <GraduationCap size={16} />
                  </div>
                  <span className="text-sm font-bold text-blue-100">
                    Academic Teachers
                  </span>
                </div>
                <span className="text-xl font-black">{metrics.totalTeachers}</span>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  <span className="text-sm font-bold text-blue-100">
                    Administrative Staff
                  </span>
                </div>
                <span className="text-xl font-black">{metrics.totalAdminStaff}</span>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Activity size={16} />
                  </div>
                  <span className="text-sm font-bold text-blue-100">
                    On-Duty Rate
                  </span>
                </div>
                <span className="text-xl font-black">{metrics.onDutyRatio}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
