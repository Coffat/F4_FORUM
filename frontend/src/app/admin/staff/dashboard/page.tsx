import StaffDashboardClient from "./StaffDashboardClient";

const BE_METRICS_URL = "http://localhost:8080/api/v1/staff-dashboard/metrics";

// Kiểu dữ liệu map với StaffDashboardMetricsResponse từ BE
export interface RecentStaffEntry {
  id: number;
  name: string;
  departmentOrSpecialty: string;
  roleLabel: string;
  avatar: string;
  isActive: boolean;
}

export interface StaffDashboardMetrics {
  totalFaculty: number;
  activeSessions: number;
  onDutyRatio: string;
  activeStaffCount: number;
  totalTeachers: number;
  totalAdminStaff: number;
  recentlyActive: RecentStaffEntry[];
}

// Giá trị fallback khi BE chưa sẵn sàng hoặc lỗi
const FALLBACK_METRICS: StaffDashboardMetrics = {
  totalFaculty: 0,
  activeSessions: 0,
  onDutyRatio: "N/A",
  activeStaffCount: 0,
  totalTeachers: 0,
  totalAdminStaff: 0,
  recentlyActive: [],
};

async function getDashboardMetrics(): Promise<StaffDashboardMetrics> {
  try {
    const res = await fetch(BE_METRICS_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Luôn lấy dữ liệu mới nhất
    });

    if (!res.ok) {
      console.error(
        "[StaffDashboard] Failed to fetch metrics:",
        await res.text()
      );
      return FALLBACK_METRICS;
    }

    return (await res.json()) as StaffDashboardMetrics;
  } catch (err) {
    console.error("[StaffDashboard] Backend connection failed:", err);
    return FALLBACK_METRICS;
  }
}

// Server Component - fetch phía server, truyền data xuống Client Component
export default async function StaffDashboardPage() {
  const metrics = await getDashboardMetrics();

  return <StaffDashboardClient metrics={metrics} />;
}
