"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Users, GraduationCap, CalendarCheck, SlidersHorizontal, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { StaffFormModal, DeleteStaffButton } from "./StaffForms";

// The mock data is removed here
interface StaffRole {
  id: string;
  label: string;
  color: string;
}

interface StaffPerson {
  id: number;
  name: string;
  joined: string;
  avatar: string;
  isActive: boolean;
  roles: StaffRole[];
  specialty?: string;
  department?: string;
  email: string;
  phone: string;
}

const tabs = ["All Personnel", "Academic", "Administrative"];

export default function StaffManagementClient({ initialList = [], initialStats = {} }: { initialList: StaffPerson[], initialStats: any }) {
  const [activeTab, setActiveTab] = useState("All Personnel");

  // Map backend stats to the UI structure
  const stats = [
    {
      label: "TOTAL FACULTY",
      value: initialStats?.totalFaculty?.toString() || "0",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "ACTIVE SESSIONS",
      value: initialStats?.activeSessions?.toString() || "0",
      icon: GraduationCap,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "ON-DUTY RATIO",
      value: initialStats?.onDutyRatio?.toString() || "0%",
      icon: CalendarCheck,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  // Filter based on tab (assuming Academic = Teacher, Administrative = Support for demo)
  const filteredList = initialList.filter(staff => {
      if (activeTab === "All Personnel") return true;
      if (activeTab === "Academic") return staff.roles.some((r) => r.label === "TEACHER");
      if (activeTab === "Administrative") return staff.roles.some((r) => r.label === "SUPPORT" || r.label === "MANAGER");
      return true;
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-blue-600 tracking-wider mb-2 uppercase">
            Institutional Directory
          </p>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Staff Management
          </h1>
          <p className="text-slate-500 max-w-2xl text-base leading-relaxed">
            Coordinate our elite team of educators and operational leaders across all language programs.
          </p>
        </div>
        <StaffFormModal mode="create" />
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2 whitespace-nowrap">{stat.label}</p>
                <h3 className="text-3xl font-black text-blue-600 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        
        {/* Toolbar: Tabs & Filter */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Refine Search
          </button>
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-12 gap-4 pb-4 border-b border-slate-100 text-xs font-bold text-slate-400 tracking-wider">
          <div className="col-span-4 pl-4">PERSONNEL NAME</div>
          <div className="col-span-2">CORPORATE ROLE</div>
          <div className="col-span-3">ACADEMIC SPECIALTY</div>
          <div className="col-span-2">CONTACT REACH</div>
          <div className="col-span-1 text-right pr-4">ACTIONS</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {filteredList.map((staff) => (
            <div key={staff.id} className="grid grid-cols-12 gap-4 py-6 items-center hover:bg-slate-50/50 transition-colors rounded-xl -mx-4 px-4">
              
              {/* Personnel Name */}
              <div className="col-span-4 flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
                    <Image
                      src={staff.avatar}
                      alt={staff.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${staff.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[15px]">{staff.name}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{staff.joined}</p>
                </div>
              </div>

              {/* Roles */}
              <div className="col-span-2 flex flex-col items-start justify-center divide-y divide-transparent">
                  {staff.roles.map((r: any) => (
                     <div key={r.id} className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1 last:mb-0 ${r.color}`}>
                       {r.label}
                     </div>
                  ))}
              </div>

              {/* Specialty */}
              <div className="col-span-3 text-sm font-semibold text-slate-700 whitespace-pre-line leading-snug">
                {staff.specialty}
              </div>

              {/* Contact Reach */}
              <div className="col-span-2">
                <p className="text-sm font-bold text-slate-900">{staff.email}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{staff.phone}</p>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end pr-4 gap-1">
                <StaffFormModal mode="edit" initialData={staff} iconOnly={true} />
                <DeleteStaffButton staffId={staff.id} staffName={staff.name} iconOnly={true} />
              </div>

            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-4">
          <p className="text-sm font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-bold">1-10</span> of <span className="text-slate-900 font-bold">42</span> personnel
          </p>
          
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0B3A9A] text-white font-bold transition-colors">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
              3
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
