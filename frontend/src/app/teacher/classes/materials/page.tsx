import { Card } from "@/components/ui/card";

export default function TeacherMaterialsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="rounded-2xl border-slate-100 p-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
          UP TÀI LIỆU
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Chọn course / class",
            "Chọn loại tài liệu (material_type)",
            "Upload file / nhập URL (placeholder)",
            "Danh sách tài liệu theo lớp (placeholder)",
          ].map((item) => (
            <div
              key={item}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-5"
            >
              <p className="text-sm font-bold text-slate-900">{item}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                UI placeholder, sẽ nối API sau.
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

