import { fetchStudentProfile } from "./profile-api";
import { ProfileContent } from "./components/ProfileContent";
import { Card, CardContent } from "@/components/ui/card";
import { UserX } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin cá nhân | F4 Forum Hub",
  description: "Trang thông tin cá nhân và học tập cho học viên tại F4 Forum."
}

/**
 * ProfilePage - Next.js 15 Server Component.
 * Fetching dữ liệu an toàn tại Server Side.
 */
export default async function ProfilePage() {
  const profile = await fetchStudentProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[600px] px-8 py-24">
        <Card className="max-w-md w-full border-none shadow-2xl shadow-indigo-100 rounded-3xl p-12 text-center bg-white">
          <CardContent className="p-0 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-100 animate-pulse">
                <UserX className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Hồ sơ không tồn tại</h2>
            <p className="text-sm font-bold text-slate-400 leading-relaxed">
                Chúng tôi không thể tìm thấy dữ liệu hồ sơ của bạn. Vui lòng kiểm tra lại quyền truy cập hoặc đăng nhập lại.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFE]">
        <ProfileContent profile={profile} />
    </main>
  );
}
