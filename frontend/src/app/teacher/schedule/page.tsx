import { Card } from "@/components/ui/card";

export default function TeacherSchedulePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Lịch dạy
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Xem lịch theo tuần/ngày và phòng học.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-slate-100 p-6 lg:col-span-2">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
            LỊCH TUẦN
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Mon", "Wed", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-5"
              >
                <p className="text-sm font-bold text-slate-900">{day}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  (Placeholder) 0 ca học
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-100 p-6">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">
            BỘ LỌC
          </p>
          <div className="space-y-3">
            {["Chi nhánh", "Phòng học", "Lớp", "Online/Offline"].map((item) => (
              <div
                key={item}
                className="bg-white border border-slate-100 rounded-2xl p-4"
              >
                <p className="text-sm font-bold text-slate-800">{item}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Placeholder.
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

