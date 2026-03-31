"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Activity,
  CheckCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  Zap,
  Calendar,
  ShieldCheck,
  Cpu,
  Wifi,
  FlaskConical,
  Package,
  FileText,
  Download,
  AlertTriangle,
  ExternalLink,
  Search,
} from "lucide-react";

// ── Type Definitions ─────────────────────────────────────────────────────────
export interface StaffMemberActivity {
  id: number;
  fullName: string;
  role: string;
  department: string;
  lastActive: string;
  status: "ONLINE" | "AWAY" | "OFFLINE";
}

export interface StaffDashboardMetrics {
  totalFaculty: number;
  activeSessions: number;
  onDutyRatio: string;
  activeStaffCount: number;
  totalTeachers: number;
  totalAdminStaff: number;
  recentlyActive: StaffMemberActivity[];
}

// ── Metric Card (4 main KPIs) ───────────────────────────────────────────────
function MetricCard({
  title,
  value,
  badge,
  badgeColor,
  icon: Icon,
  iconBg,
}: {
  title: string;
  value: string | number;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {badge && (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeColor || 'bg-slate-100 text-slate-500'}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Operation Card (Operation Overview) ─────────────────────────────────────────
function OpCard({ title, icon: Icon, color, val, desc }: { title: string, icon: any, color: string, val: number, desc: string }) {
  return (
    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 group transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      </div>
      <div className="space-y-2">
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${val}%` }} />
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-slate-400 uppercase tracking-tighter">{desc}</span>
          <span className="text-slate-900">{val}%</span>
        </div>
      </div>
    </div>
  );
}

// ── Main UI Component ─────────────────────────────────────────────────────
export default function StaffDashboardClient({
  metrics,
}: {
  metrics: StaffDashboardMetrics;
}) {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 p-2">
      
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-[#0B3A9A] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-block bg-white/10 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[2px] mb-6">
              Operations Center
            </span>
            <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
              Good morning,<br /> 
              <span className="opacity-80">Marcus.</span>
            </h1>
            <p className="text-blue-100 font-medium leading-relaxed max-w-md text-lg">
              System status is <span className="text-white font-black underline decoration-2 underline-offset-4">stable</span>. 
              There are 4 pending center-wide tasks requiring your attention today.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <button className="bg-white text-[#0B3A9A] px-8 py-3.5 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg active:scale-95">
                View Tasks
              </button>
              <button className="bg-transparent border-2 border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-white/5 transition-all">
                Operational Log
              </button>
            </div>
          </div>

          <div className="flex gap-4 shrink-0">
             <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-w-[140px] text-center">
                <p className="text-[10px] font-black text-blue-200 uppercase mb-2 tracking-widest">Server Uptime</p>
                <p className="text-3xl font-black">99.9%</p>
             </div>
             <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-w-[140px] text-center">
                <p className="text-[10px] font-black text-blue-200 uppercase mb-2 tracking-widest">Safety Drills</p>
                <p className="text-lg font-black bg-white/20 rounded-lg px-2 py-1 mt-1">Verified</p>
             </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.05] rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400 opacity-[0.08] rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
      </section>

      {/* ── MAIN KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard 
          title="Center Revenue" 
          value="$142,850" 
          badge="+12.4%" 
          badgeColor="bg-emerald-100 text-emerald-600"
          icon={Package} 
          iconBg="bg-blue-600"
        />
        <MetricCard 
          title="Staff Attendance" 
          value="91.4%" 
          badge="Target: 95%" 
          badgeColor="bg-[#EEF2FF] text-[#4F46E5]"
          icon={Users} 
          iconBg="bg-[#4F46E5]"
        />
        <MetricCard 
          title="Active Facilities" 
          value="24 / 28" 
          badge="Active" 
          badgeColor="bg-[#FFFBEB] text-[#D97706]"
          icon={FlaskConical} 
          iconBg="bg-[#D97706]"
        />
        <MetricCard 
          title="Resource Utilization" 
          value="88.2%" 
          badge="High" 
          badgeColor="bg-[#FFF1F2] text-[#E11D48]"
          icon={Cpu} 
          iconBg="bg-slate-800"
        />
      </div>

      {/* ── SECONDARY CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Operations & Inventory */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Operations Overview */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Center Operations Overview</h3>
               <button className="text-blue-600 font-bold text-xs hover:underline uppercase tracking-widest">Full Status Report</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <OpCard title="HVAC System" icon={ShieldCheck} color="bg-emerald-500" val={94} desc="Optimal Performance" />
              <OpCard title="WiFi Network" icon={Wifi} color="bg-amber-500" val={68} desc="Lab B Node fluctuating" />
              <OpCard title="Lab Availability" icon={Activity} color="bg-blue-600" val={82} desc="All 4 Labs booked" />
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Inventory Quick View</h3>
               <div className="flex gap-2">
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"><AlertTriangle className="w-4 h-4" /></button>
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"><Activity className="w-4 h-4" /></button>
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[1.5px] border-b border-slate-50">
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Stock Level</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <InventoryRow icon={Package} name="Textbooks (A-Level Bio)" level="142 units" status="IN STOCK" sColor="bg-emerald-100 text-emerald-600" action="Audit" />
                  <InventoryRow icon={Activity} name={'Staff iPads (Pro 11")'} level="12 units" status="LOW STOCK" sColor="bg-rose-100 text-rose-600" action="Order" />
                  <InventoryRow icon={FlaskConical} name="Lab Consumables" level="65% Full" status="MONITORING" sColor="bg-blue-50 text-blue-600" action="Audit" />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Blocks */}
        <div className="space-y-8">
           
           {/* Quick Actions */}
           <div className="bg-[#F8F9FB] rounded-[2.5rem] p-8 border border-slate-100">
              <h3 className="font-black text-slate-900 text-lg mb-6 tracking-tight">Quick Actions</h3>
              <div className="space-y-3">
                 <ActionBtn icon={Activity} label="Issue Announcement" color="bg-blue-100 text-blue-600" href="/staff/announcements" />
                 <ActionBtn icon={Calendar} label="Manage Schedules" color="bg-emerald-100 text-emerald-600" href="/staff/schedules" />
                 <ActionBtn icon={FileText} label="Inventory Audit" color="bg-indigo-100 text-indigo-600" href="/staff/curriculum" />
                 <ActionBtn icon={Download} label="Financial Export" color="bg-orange-100 text-orange-600" href="/staff/analytics" />
              </div>
           </div>

           {/* System Alerts */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-900 text-lg tracking-tight">System Alerts</h3>
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <div className="space-y-6">
                 <AlertItem label="Emergency Maintenance" title="East Wing elevator service interruption" time="14:00 - 16:00 today" color="text-blue-600" />
                 <AlertItem label="Operational Update" title="Summer term schedule finalization" time="Deadline: Friday, 5:00 PM" color="text-[#D97706]" />
                 <AlertItem label="Policy Change" title="Updated guest login protocols for WiFi" time="Effective immediately" color="text-[#4F46E5]" />
              </div>
           </div>

           {/* Checked-In Staff */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-900 text-lg mb-6 tracking-tight">Checked-In Staff</h3>
             <div className="space-y-4 mb-6">
               {(metrics.recentlyActive || []).slice(0, 3).map((member) => (
                 <div key={member.id} className="flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center font-black text-slate-400 text-sm italic">
                        {(member.fullName || "U").charAt(0)}
                     </div>
                     <div>
                       <p className="text-xs font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{member.fullName}</p>
                       <p className="text-[10px] font-bold text-slate-400 capitalize">{member.department}</p>
                     </div>
                   </div>
                   <span className="text-[10px] font-black text-emerald-500 tabular-nums">08:45 AM</span>
                 </div>
               ))}
               {(!metrics.recentlyActive || metrics.recentlyActive.length === 0) && (
                 <p className="text-xs text-slate-400 font-medium">No active staff found.</p>
               )}
             </div>
             <button className="w-full py-3.5 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[1.5px] transition-all active:scale-95">
                View All Staff ({(metrics.recentlyActive || []).length} Active)
             </button>
           </div>

        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────

function InventoryRow({ icon: Icon, name, level, status, sColor, action }: any) {
  return (
    <tr className="group">
      <td className="py-5 pr-4 border-b border-transparent">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
             <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-black text-slate-800 tracking-tight">{name}</span>
        </div>
      </td>
      <td className="py-5 text-sm font-bold text-slate-500">{level}</td>
      <td className="py-5">
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider ${sColor}`}>
           {status}
        </span>
      </td>
      <td className="py-5 text-right font-black text-blue-600 text-xs hover:underline cursor-pointer group-hover:translate-x-1 transition-transform">
        {action}
      </td>
    </tr>
  );
}

function ActionBtn({ icon: Icon, label, color, href }: any) {
  return (
    <Link 
      href={href || "#"} 
      className="w-full bg-white flex items-center justify-between p-4 rounded-2xl hover:shadow-lg transition-all border border-slate-100 group active:scale-[0.98]"
    >
       <div className="flex items-center gap-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
             <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-black text-slate-800 tracking-tight">{label}</span>
       </div>
       <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
    </Link>
  );
}

function AlertItem({ label, title, time, color }: any) {
  return (
    <div className="group cursor-pointer">
       <span className={`text-[9px] font-black uppercase tracking-widest mb-1.5 block ${color}`}>{label}</span>
       <p className="text-sm font-black text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors tracking-tight">{title}</p>
       <p className="text-[10px] font-bold text-slate-400 tracking-tight uppercase">{time}</p>
    </div>
  );
}
