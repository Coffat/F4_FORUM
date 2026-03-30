import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Hồ sơ giảng viên
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Thông tin cá nhân và cấu hình cơ bản.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-slate-100 p-6">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
            THÔNG TIN
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Họ tên</span>
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
              <span className="text-sm font-bold text-slate-700">Chuyên môn</span>
              <span className="text-sm font-medium text-slate-600">
                {profile?.specialty ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Ngày vào làm</span>
              <span className="text-sm font-medium text-slate-600">
                {profile?.hireDate ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Lần đăng nhập</span>
              <span className="text-sm font-medium text-slate-600">
                {profile?.lastLogin ?? "—"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-100 p-6 lg:col-span-2">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
            TỔNG QUAN
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Lớp đang dạy",
                value:
                  overview?.activeClassesCount !== undefined
                    ? String(overview.activeClassesCount)
                    : "—",
              },
              {
                label: "Bài tập chờ chấm",
                value:
                  overview?.pendingSubmissionsCount !== undefined
                    ? String(overview.pendingSubmissionsCount)
                    : "—",
              },
              {
                label: "Buổi dạy tuần này",
                value:
                  overview?.weeklySessionsCount !== undefined
                    ? String(overview.weeklySessionsCount)
                    : "—",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-5"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {item.label}
                </p>
                <p className="text-3xl font-bold text-emerald-700 mt-2">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {!profile && (
            <div className="mt-6 bg-amber-50 border border-amber-100 text-amber-900 rounded-2xl p-4">
              <p className="text-sm font-bold">Chưa tải được hồ sơ.</p>
              <p className="text-xs font-medium mt-1 text-amber-800">
                Kiểm tra backend đang chạy và bạn đã đăng nhập role teacher.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

