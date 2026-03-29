import BranchManagementClient from "@/app/admin/branches/BranchClient";
import { getBranchList } from "./actions";

export const dynamic = 'force-dynamic';

export default async function BranchManagementPage() {
  const branchList = await getBranchList();

  return (
    <BranchManagementClient
      initialList={branchList}
    />
  );
}
