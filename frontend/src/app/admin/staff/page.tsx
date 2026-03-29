import StaffManagementClient from "./StaffClient";
import { getPersonnelList, getPersonnelStats } from "./actions";

export default async function StaffManagementPage() {
  const staffList = await getPersonnelList();
  const staffStats = await getPersonnelStats();

  return <StaffManagementClient initialList={staffList} initialStats={staffStats} />;
}
