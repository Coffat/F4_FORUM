"use client";

import { PlacementTest } from "@/types/student.types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

interface Props {
  data: PlacementTest[];
}

/**
 * PlacementTestTab - Hiển thị danh sách điểm đầu vào.
 * Tuân thủ chuẩn UI đồng bộ.
 */
export function PlacementTestTab({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm rounded-3xl bg-slate-50 py-12">
        <CardContent className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                <ClipboardList className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-400">Chưa có kết quả bài kiểm tra đầu vào nào.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[150px]">Ngày kiểm tra</TableHead>
              <TableHead>Listening</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Writing</TableHead>
              <TableHead>Speaking</TableHead>
              <TableHead className="text-indigo-600 font-black">OVERALL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((test, index) => (
              <TableRow key={index} className="hover:bg-indigo-50/30 transition-colors">
                <TableCell className="font-bold text-slate-700">{test.testDate}</TableCell>
                <TableCell className="font-medium text-slate-600">{test.listening}</TableCell>
                <TableCell className="font-medium text-slate-600">{test.reading}</TableCell>
                <TableCell className="font-medium text-slate-600">{test.writing}</TableCell>
                <TableCell className="font-medium text-slate-600">{test.speaking}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm">
                    {test.overall}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
