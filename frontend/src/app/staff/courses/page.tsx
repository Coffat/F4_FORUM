"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  BookOpen,
  GraduationCap,
  Banknote,
} from "lucide-react";
import { StaffCourseTableRowActions, StaffCourseProfileModal } from "./CourseForms";
import { getCourseCatalogStaff, getCourseStatsStaff } from "./course-actions";

interface Course {
  id: string; 
  name: string;
  category: string;
  enrollment: number;
  maxEnrollment: number;
  price: number;
  status: string;
  image: string;
  imageColor: string;
  level: string;
  originalId: string;
}

export default function StaffCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedProfile, setSelectedProfile] = useState<Course | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // For pagination
  const [pageStats, setPageStats] = useState({ totalElements: 0, totalPages: 0, size: 10, number: 0 });

  const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResult, statsResult] = await Promise.all([
          getCourseCatalogStaff(),
          getCourseStatsStaff()
        ]);

        if (!("success" in coursesResult) || !("success" in statsResult)) {
          throw new Error(
            ("error" in coursesResult && coursesResult.error) ||
              ("error" in statsResult && statsResult.error) ||
              "Failed to load courses data"
          );
        }

        const coursesData = coursesResult.data || {};
        const statsData = statsResult.data || {};
        
        // Map backend DTO to matching UI fields
        const mappedCourses = (coursesData.content || []).map((c: any) => ({
            originalId: c.id,
            id: c.code || `ID-${c.id}`,
            name: c.name,
            category: c.category || 'General',
            level: c.level || 'Intermediate',
            enrollment: c.currentEnrollment || 0,
            maxEnrollment: c.maxEnrollment || 100,
            price: c.fee || 0,
            status: c.status === 'PUBLISHED' ? 'Published' : 'Draft',
            image: c.imageUrl || "https://images.unsplash.com/photo-1546410531-bea51404ea00?q=80&w=150&auto=format&fit=crop",
            imageColor: c.imageColor || "bg-slate-900"
        }));

        setCourses(mappedCourses);
        setStats(statsData);
        setPageStats({
            totalElements: coursesData.totalElements || mappedCourses.length,
            totalPages: coursesData.totalPages || 1,
            size: coursesData.size || 10,
            number: coursesData.number || 0
        });
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B3A9A]">Courses & Materials</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage course materials and update general information.
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">
              +{stats?.newThisMonth || 0} this month
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider">TOTAL ACTIVE COURSES</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-black text-slate-800 leading-none">
                {loading ? "..." : stats?.totalActiveCourses || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-bold">
              Stable
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider">AVERAGE ENROLLMENT</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-black text-slate-800 leading-none">
                {loading ? "..." : Math.floor(stats?.averageEnrollment || 0)}
              </p>
              <p className="text-sm font-medium text-slate-400 mb-[2px]">students/course</p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-bold">
              Quarterly Target: 85%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider">TOTAL COURSE REVENUE</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-black text-slate-800 leading-none">
                {loading ? "..." : `${(stats?.totalRevenue || 0).toLocaleString()} VND`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 relative z-10">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by course name or keyword..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
          
          <div className="flex gap-3 shrink-0">
            <button className="flex items-center gap-6 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              All Status
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            <button className="flex items-center gap-6 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              All Categories
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            <button className="flex items-center justify-center w-[42px] h-[42px] bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider">
                <th className="text-left py-4 px-2 uppercase group-first:pl-0">COURSE NAME</th>
                <th className="text-left py-4 px-2 uppercase">CATEGORY</th>
                <th className="text-left py-4 px-2 uppercase">ENROLLMENT</th>
                <th className="text-left py-4 px-2 uppercase">PRICE</th>
                <th className="text-left py-4 px-2 uppercase">STATUS</th>
                <th className="text-right py-4 pl-2 pr-4 uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={6} className="py-8 text-center text-slate-500 text-sm font-medium">Loading courses...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                   <td colSpan={6} className="py-8 text-center text-slate-500 text-sm font-medium">No courses found.</td>
                </tr>
              ) : courses.map((course, idx) => (
                <tr 
                  key={course.originalId} 
                  className={`group border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx === courses.length - 1 ? 'border-none' : ''}`}
                >
                  <td className="py-5 px-2">
                    <div 
                      onClick={() => {
                        setSelectedProfile(course);
                        setIsProfileOpen(true);
                      }}
                      className="flex items-center gap-4 cursor-pointer group/item"
                    >
                      <div className={`w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0 ${course.imageColor} relative group-hover/item:ring-2 ring-blue-500/50 transition-all`}>
                         <Image 
                           src={course.image} 
                           alt={course.name} 
                           fill 
                           className="object-cover opacity-80 mix-blend-overlay"
                           sizes="52px"
                         />
                         {/* Fallback pseudo-icon style based on image above */}
                         <div className="absolute inset-0 flex items-center justify-center text-white/90">
                            {course.category === 'IELTS' && <BookOpen className="w-6 h-6" />}
                            {course.category === 'Business' && <BriefcaseIcon className="w-6 h-6" />}
                            {course.category === 'General' && <SmileIcon className="w-6 h-6" />}
                         </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover/item:text-[#0B3A9A] transition-colors">{course.name}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">ID: {course.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-2">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      course.category === 'IELTS' ? 'bg-indigo-50 text-indigo-600' :
                      course.category === 'Business' ? 'bg-purple-50 text-purple-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {course.category}
                    </span>
                  </td>
                  <td className="py-5 px-2">
                    <div className="flex items-center gap-3 max-w-[140px]">
                      <span className="text-sm font-bold text-slate-800 w-8">{course.enrollment}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                             course.category === 'IELTS' ? 'bg-blue-600' :
                             course.category === 'Business' ? 'bg-purple-600' :
                             'bg-orange-600'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, (course.enrollment / course.maxEnrollment) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-2">
                    <p className="text-sm font-bold text-slate-900">{course.price.toLocaleString()} VND</p>
                  </td>
                  <td className="py-5 px-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50">
                      <div className={`w-1.5 h-1.5 rounded-full ${course.status === 'Published' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                      <span className={course.status === 'Published' ? 'text-emerald-700' : 'text-slate-500'}>
                        {course.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 pl-2 pr-4 text-right">
                    <StaffCourseTableRowActions course={course} onSuccess={fetchData} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-6">
          <p className="text-xs font-medium text-slate-500">
            Showing {courses.length > 0 ? pageStats.number * pageStats.size + 1 : 0} to{" "}
            {Math.min((pageStats.number + 1) * pageStats.size, pageStats.totalElements)} of{" "}
            {pageStats.totalElements} courses
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50" disabled={pageStats.number === 0}>Previous</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">{pageStats.number + 1}</button>
            {pageStats.number + 2 <= pageStats.totalPages && (
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors">{pageStats.number + 2}</button>
            )}
            <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50" disabled={pageStats.number + 1 >= pageStats.totalPages}>Next</button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <StaffCourseProfileModal 
          course={selectedProfile as any} 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
        />
      )}
    </div>
  );
}

// Quick fallback icons
function BriefcaseIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function SmileIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}
