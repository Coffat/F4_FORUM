import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import MaterialsListClient from "./MaterialsListClient";
import ClassFilterAutoLoad from "../_components/ClassFilterAutoLoad";

type TeacherClassSummary = {
  classId: number;
  classCode: string;
  courseName: string;
};

type MaterialItem = {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  uploadDate: string | null;
};

const TEACHER_BASE = "http://localhost:8080/api/v1/teachers";

async function fetchWithToken(path: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const res = await fetch(`${TEACHER_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res;
}

export default async function TeacherMaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string }>;
}) {
  const params = await searchParams;
  const classesRes = await fetchWithToken("/me/classes");
  const classes: TeacherClassSummary[] = classesRes ? await classesRes.json() : [];
  const selectedClassId = params.classId ?? (classes[0] ? String(classes[0].classId) : "");

  const materialsRes = selectedClassId
    ? await fetchWithToken(`/classes/${selectedClassId}/materials`)
    : null;
  const materials: MaterialItem[] = materialsRes ? await materialsRes.json() : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="rounded-2xl border-slate-100 p-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
          UP TÀI LIỆU
        </p>
        <div className="space-y-5">
          <ClassFilterAutoLoad
            classes={classes}
            selectedClassId={selectedClassId}
            targetPath="/teacher/classes/materials"
          />

          {selectedClassId ? (
            <MaterialsListClient classId={selectedClassId} materials={materials} />
          ) : (
            <p className="text-sm text-slate-500 font-medium">
              Bạn chưa có lớp để upload tài liệu.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

