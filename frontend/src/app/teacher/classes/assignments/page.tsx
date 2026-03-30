import { Card } from "@/components/ui/card";

export default function TeacherAssignmentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="rounded-2xl border-slate-100 p-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
          GIAO BÀI TẬP
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Tạo bài tập", desc: "Form tạo assignment (placeholder)" },
            {
              label: "Danh sách bài tập",
              desc: "Lọc theo lớp / hạn nộp (placeholder)",
            },
            {
              label: "Bài nộp",
              desc: "Chấm điểm / phản hồi (placeholder)",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-5"
            >
              <p className="text-sm font-bold text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

