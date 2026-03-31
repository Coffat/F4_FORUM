"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { Mail, Phone, Search } from "lucide-react";

type TeacherClassStudent = {
  enrollmentId: number;
  studentId: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  enrollmentStatus: string;
};

const DEBOUNCE_MS = 250;

function normalize(input: string) {
  return input.trim().toLowerCase();
}

export default function TeacherClassStudentsTableClient({
  students,
}: {
  students: TeacherClassStudent[];
}) {
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSync = useCallback((next: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      setQuery(next);
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return students;

    return students.filter((s) => {
      const hay = [
        s.fullName,
        s.email ?? "",
        s.phone ?? "",
        String(s.studentId),
        String(s.enrollmentId),
        s.enrollmentStatus,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, students]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    scheduleSync(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900 w-full sm:w-auto">
          Student Directory
        </h3>

        <div className="relative w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="search"
            value={value}
            onChange={handleChange}
            placeholder="Search name, email..."
            autoComplete="off"
            aria-label="Search students by name, email, phone, or id"
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr>
              <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">
                Student
              </th>
              <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">
                Contact Info
              </th>
              <th className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-slate-400 border-b border-slate-100 bg-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((student) => (
              <tr
                key={student.enrollmentId}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden shrink-0 bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold uppercase">
                      {student.fullName.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {student.fullName}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        #{student.studentId}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-medium">
                        {student.email ?? "--"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-medium">
                        {student.phone ?? "--"}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md whitespace-nowrap border border-blue-100">
                    {student.enrollmentStatus}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-slate-500 text-sm font-medium"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

