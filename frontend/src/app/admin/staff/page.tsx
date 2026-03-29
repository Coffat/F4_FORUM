import StaffManagementClient from "./StaffClient";
import { getPersonnelList, getPersonnelStats } from "./actions";

export default async function StaffManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; segment?: string }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const rawSeg =
    typeof params.segment === "string" ? params.segment.toUpperCase() : "ALL";
  const segment =
    rawSeg === "ACADEMIC" || rawSeg === "ADMINISTRATIVE" ? rawSeg : "ALL";

  const [staffList, staffStats] = await Promise.all([
    getPersonnelList(search, segment),
    getPersonnelStats(),
  ]);

  return (
    <StaffManagementClient
      initialList={staffList}
      initialStats={staffStats}
      initialSearch={search}
      initialSegment={segment}
    />
  );
}
