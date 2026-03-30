import { Card } from "@/components/ui/card";

export default function TeacherClassesOverviewPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 pb-10">
      <Card className="rounded-2xl border-slate-100 p-6 lg:col-span-2">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
          DANH SÁCH LỚP
        </p>
        <div className="space-y-3">
          {["FON-2026-01", "ELM-2026-01", "INT-2026-01"].map((code) => (
            <div
              key={code}
              className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4"
            >
              <div>
                <p className="font-bold text-slate-900">{code}</p>
                <p className="text-xs text-slate-500 font-medium">
                  (Placeholder) 0 học viên • 0 buổi/tuần
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl">
                OPEN
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-2xl border-slate-100 p-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
          VIỆC CẦN LÀM
        </p>
        <div className="space-y-3">
          {[
            "Chấm bài tập (0)",
            "Điểm danh hôm nay (0)",
            "Nhập điểm (0)",
            "Upload tài liệu (0)",
          ].map((item) => (
            <div
              key={item}
              className="bg-white border border-slate-100 rounded-2xl p-4"
            >
              <p className="text-sm font-bold text-slate-800">{item}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Placeholder cho dữ liệu backend.
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

