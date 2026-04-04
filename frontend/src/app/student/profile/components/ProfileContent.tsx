"use client";

import { useState } from "react";
import { StudentProfile } from "@/types/student.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoTab } from "./PersonalInfoTab";
import { PlacementTestTab } from "./PlacementTestTab";
import { CertificatesTab } from "./CertificatesTab";
import { User, ClipboardList, Award } from "lucide-react";

interface Props {
  profile: StudentProfile;
}

/**
 * ProfileContent - Client Component điều phối các Tab và dữ liệu học viên.
 * Thiết kế hiện đại với Lucide Icons và Tab System tùy chỉnh.
 */
export function ProfileContent({ profile }: Props) {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Hồ Sơ Học Viên</h1>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Quản lý lộ trình và thành tích học tập của bạn</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-12 bg-white/50 backdrop-blur-md p-1.5 shadow-sm border border-slate-100 h-14">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="placement" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Điểm đầu vào
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Chứng chỉ
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[400px]">
          <TabsContent value="personal">
            <PersonalInfoTab profile={profile} />
          </TabsContent>

          <TabsContent value="placement">
            <PlacementTestTab data={profile.placementTests} />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificatesTab data={profile.certificates} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
