"use client";

import { useRouter } from "next/navigation";

type ClassOption = {
  classId: number;
  classCode: string;
  courseName: string;
};

export default function ClassFilterAutoLoad({
  classes,
  selectedClassId,
  targetPath,
}: {
  classes: ClassOption[];
  selectedClassId: string;
  targetPath: string;
}) {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
        Chọn lớp
      </label>
      <select
        value={selectedClassId}
        onChange={(e) => {
          const params = new URLSearchParams();
          if (e.target.value) params.set("classId", e.target.value);
          router.replace(`${targetPath}?${params.toString()}`);
        }}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
      >
        {classes.map((clazz) => (
          <option key={clazz.classId} value={clazz.classId}>
            {clazz.classCode} - {clazz.courseName}
          </option>
        ))}
      </select>
    </div>
  );
}

