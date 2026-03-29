import StaffDashboardClient from "@/app/admin/staff/dashboard/StaffDashboardClient";
import type { StaffDashboardMetrics } from "@/app/admin/staff/dashboard/page";

const BE_METRICS_URL = "http://localhost:8080/api/v1/staff-dashboard/metrics";

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
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[StaffDashboard] Failed to fetch metrics:", await res.text());
      return FALLBACK_METRICS;
    }

    return (await res.json()) as StaffDashboardMetrics;
  } catch (err) {
    console.error("[StaffDashboard] Backend connection failed:", err);
    return FALLBACK_METRICS;
  }
}

export default async function StaffPortalDashboardPage() {
  const metrics = await getDashboardMetrics();
  return <StaffDashboardClient metrics={metrics} />;
}
