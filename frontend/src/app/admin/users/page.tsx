import { 
  Users, 
  ShieldCheck, 
  UserX, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone,
  ArrowUpRight,
  ShieldAlert,
  GraduationCap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { UserFormModal } from "./UserForms";
import { UserTableRowActions } from "./UserActions";
import { UserDirectorySearch } from "./UserDirectorySearch";

// Types mapping to Backend DTOs
interface UserDirectoryResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  userType: string;
  role: string;
  status: string;
  lastLogin: string;
}

interface UserMetricsResponse {
  totalUsers: number;
  activeStudents: number;
  instructors: number;
  restrictedUsers: number;
}

interface PaginatedResponse {
  content: UserDirectoryResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? params.page : '0';
  const searchTerm = typeof params.search === 'string' ? params.search : '';

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  const headers: Record<string, string> = { 
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Safe fetch function
  async function fetchWithAuth(url: string) {
    try {
      const res = await fetch(url, { headers, cache: 'no-store' });
      if (!res.ok) {
        console.error(`Fetch error ${res.status} for ${url}`);
        return null;
      }
      return res.json();
    } catch (err) {
      console.error(`Fetch exception for ${url}:`, err);
      return null;
    }
  }

  // Fetch Metrics & User Directory in parallel
  const [metrics, usersPage] = await Promise.all([
    fetchWithAuth('http://localhost:8080/api/admin/users/metrics') as Promise<UserMetricsResponse | null>,
    fetchWithAuth(`http://localhost:8080/api/admin/users?page=${page}&size=20${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`) as Promise<PaginatedResponse | null>
  ]);

  const METRIC_CARDS = metrics ? [
    {
      title: "TOTAL USERS",
      value: metrics.totalUsers.toLocaleString(),
      trend: "+12",
      trendText: "this month",
      trendColor: "text-green-500",
      trendBg: "bg-green-50",
      icon: Users,
    },
    {
      title: "ACTIVE STUDENTS",
      value: metrics.activeStudents.toLocaleString(),
      trend: "Online",
      trendText: "engagement",
      trendColor: "text-blue-600",
      trendBg: "bg-blue-50",
      icon: GraduationCap,
    },
    {
      title: "INSTRUCTORS",
      value: metrics.instructors.toLocaleString(),
      trend: "+2",
      trendText: "new hire",
      trendColor: "text-purple-600",
      trendBg: "bg-purple-50",
      icon: ShieldCheck,
    },
    {
      title: "RESTRICTED",
      value: metrics.restrictedUsers.toLocaleString(),
      trend: "Review",
      trendText: "needed",
      trendColor: "text-red-600",
      trendBg: "bg-red-50",
      icon: UserX,
    },
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage all students, instructors, and platform administrators.</p>
        </div>
        <UserFormModal mode="create" />
      </div>

      {(!metrics && !usersPage) ? (
        <div className="flex justify-center p-10"><span className="text-slate-500">Connecting to Backend... Try Logging In again if access denied.</span></div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {METRIC_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{card.title}</p>
                    <div className={`p-2 rounded-lg ${card.trendBg}`}>
                      <Icon className={`w-4 h-4 ${card.trendColor}`} />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-bold text-[#0B3A9A] tracking-tight">{card.value}</span>
                    <div className="text-right">
                       <div className={`flex items-center justify-end gap-1 ${card.trendColor} font-bold text-xs`}>
                          {card.trend !== 'Review' && card.trend !== 'Online' && <ArrowUpRight className="w-3.5 h-3.5" />}
                          {card.trend === 'Review' && <ShieldAlert className="w-3.5 h-3.5" />}
                          {card.trend}
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 mt-0.5">{card.trendText}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data Table Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            
            {/* Table Toolbar */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
               <h3 className="text-lg font-bold text-slate-900 w-full sm:w-auto">User Directory</h3>
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <Suspense
                   fallback={
                     <div className="flex-1 sm:w-64 h-10 rounded-xl border border-slate-200 bg-white animate-pulse" />
                   }
                 >
                   <UserDirectorySearch initialSearch={searchTerm} />
                 </Suspense>
                 {/* Filter */}
                 <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm shrink-0">
                   <Filter className="w-4 h-4" />
                   <span className="hidden sm:inline">Filters</span>
                 </button>
               </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">User</th>
                    <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">Role</th>
                    <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">Contact Info</th>
                    <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">Status</th>
                    <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">Last Login</th>
                    <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 relative">
                  {usersPage?.content.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Avatar & Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden shrink-0 bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold uppercase">
                            {user.fullName.substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{user.fullName}</p>
                            <p className="text-xs text-slate-400 font-medium">#{user.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        {user.role === 'ROLE_ADMIN' && (
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase rounded-md whitespace-nowrap border border-purple-100">
                            Administrator
                          </span>
                        )}
                        {(user.userType === 'TEACHER' || user.role === 'ROLE_TEACHER') && user.role !== 'ROLE_ADMIN' && (
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md whitespace-nowrap border border-blue-100">
                            Instructor
                          </span>
                        )}
                        {(user.userType === 'STUDENT' || user.role === 'ROLE_STUDENT') && (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md whitespace-nowrap border border-slate-200">
                            Student
                          </span>
                        )}
                        {user.userType === 'STAFF' && user.role !== 'ROLE_ADMIN' && (
                          <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded-md whitespace-nowrap border border-orange-100">
                            Support Staff
                          </span>
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-medium">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-medium">{user.phone || '--'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {user.status === 'ACTIVE' && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <span className="text-xs font-bold text-slate-700">Active</span>
                          </div>
                        )}
                        {user.status === 'INACTIVE' && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            <span className="text-xs font-bold text-slate-500">Inactive</span>
                          </div>
                        )}
                        {(user.status === 'BANNED' || user.status === 'RESTRICTED') && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            <span className="text-xs font-bold text-red-600">Restricted</span>
                          </div>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-500">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <UserTableRowActions user={user} />
                      </td>
                    </tr>
                  ))}
                  {(!usersPage?.content || usersPage.content.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                        No users found in the directory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {usersPage && usersPage.totalPages > 0 && (
              <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Showing {(usersPage.number * 20) + 1} to {Math.min((usersPage.number + 1) * 20, usersPage.totalElements)} of {usersPage.totalElements} entries
                  </span>
                  <div className="flex items-center gap-1">
                     {usersPage.number > 0 ? (
                       <Link 
                         href={`/admin/users?page=${usersPage.number - 1}${searchTerm ? `&search=${searchTerm}` : ''}`}
                         className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                       >
                         Previous
                       </Link>
                     ) : (
                       <span className="px-3 py-1.5 text-xs font-bold text-slate-400 opacity-50 cursor-not-allowed">Previous</span>
                     )}
                     
                     <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">{usersPage.number + 1}</span>
                     
                     {usersPage.number < usersPage.totalPages - 1 ? (
                       <Link 
                         href={`/admin/users?page=${usersPage.number + 1}${searchTerm ? `&search=${searchTerm}` : ''}`}
                         className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                       >
                         Next
                       </Link>
                     ) : (
                       <span className="px-3 py-1.5 text-xs font-bold text-slate-400 opacity-50 cursor-not-allowed">Next</span>
                     )}
                  </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
