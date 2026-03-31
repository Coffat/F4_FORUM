import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import { BookOpen, CalendarDays, ClipboardCheck } from "lucide-react";

type TeacherProfileResponse = {
  username: string;
  role: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  specialty: string | null;
  hireDate: string | null;
  lastLogin: string | null;
};

const TEACHER_PROFILE_URL = "http://localhost:8080/api/v1/teachers/me";
const TEACHER_OVERVIEW_URL = "http://localhost:8080/api/v1/teachers/me/overview";

type TeacherOverviewResponse = {
  activeClassesCount: number;
  pendingSubmissionsCount: number;
  weeklySessionsCount: number;
};

async function getTeacherProfile(): Promise<TeacherProfileResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(TEACHER_PROFILE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[TeacherProfile] Failed:", await res.text());
      return null;
    }

    return (await res.json()) as TeacherProfileResponse;
  } catch (err) {
    console.error("[TeacherProfile] Backend connection failed:", err);
    return null;
  }
}

async function getTeacherOverview(): Promise<TeacherOverviewResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(TEACHER_OVERVIEW_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[TeacherOverview] Failed:", await res.text());
      return null;
    }

    return (await res.json()) as TeacherOverviewResponse;
  } catch (err) {
    console.error("[TeacherOverview] Backend connection failed:", err);
    return null;
  }
}

export default async function TeacherProfilePage() {
  const profile = await getTeacherProfile();
  const overview = await getTeacherOverview();

  const METRICS = [
    {
      title: "ACTIVE CLASSES",
      value:
        overview?.activeClassesCount !== undefined
          ? overview.activeClassesCount.toLocaleString()
          : "—",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "PENDING SUBMISSIONS",
      value:
        overview?.pendingSubmissionsCount !== undefined
          ? overview.pendingSubmissionsCount.toLocaleString()
          : "—",
      icon: ClipboardCheck,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "THIS WEEK SESSIONS",
      value:
        overview?.weeklySessionsCount !== undefined
          ? overview.weeklySessionsCount.toLocaleString()
          : "—",
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Teacher Dashboard
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Snapshot metrics and your profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {m.title}
                </p>
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold text-[#0B3A9A] tracking-tight">
                  {m.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-slate-100 p-6">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
            PROFILE
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Full name</span>
              <span className="text-sm font-medium text-slate-600">
                {profile?.fullName ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Email</span>
              <span className="text-sm font-medium text-slate-600">
                {profile?.email ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Specialty</span>
              <span className="text-sm font-medium text-slate-600">
                {profile?.specialty ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Hire date</span>
              <span className="text-sm font-medium text-slate-600">
                {profile?.hireDate ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Last login</span>
              <span className="text-sm font-medium text-slate-600">
                {profile?.lastLogin ?? "—"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-100 p-6 lg:col-span-2">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
            SYSTEM STATUS
          </p>
          {!profile ? (
            <div className="bg-amber-50 border border-amber-100 text-amber-900 rounded-2xl p-4">
              <p className="text-sm font-bold">Could not load profile.</p>
              <p className="text-xs font-medium mt-1 text-amber-800">
                Check backend is running and you are logged in as teacher.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Username
                </p>
                <p className="text-xl font-bold text-slate-900 mt-2">
                  {profile.username}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Role
                </p>
                <p className="text-xl font-bold text-slate-900 mt-2">
                  {profile.role}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

