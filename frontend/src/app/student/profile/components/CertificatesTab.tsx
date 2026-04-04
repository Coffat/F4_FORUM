"use client";

import { Certificate } from "@/types/student.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Calendar, ExternalLink, ShieldCheck } from "lucide-react";

interface Props {
  data: Certificate[];
}

export function CertificatesTab({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm rounded-3xl bg-slate-50 py-12">
        <CardContent className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                <Award className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-400">Bạn chưa có chứng chỉ nào được liên kết.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((cert, index) => (
        <Card 
          key={index} 
          className="group border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white transition-all hover:bg-slate-900 duration-500 overflow-hidden"
        >
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
                    <ShieldCheck className="w-7 h-7" />
                </div>
                <Badge className="bg-indigo-600/10 text-indigo-600 group-hover:bg-white/10 group-hover:text-white border-none py-1.5 px-4 font-black text-[10px] rounded-full uppercase tracking-widest">
                    Verified
                </Badge>
            </div>

            <h4 className="text-xl font-black text-slate-800 group-hover:text-white transition-colors mb-2">
                {cert.type}
            </h4>
            
            <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-400">Cấp ngày: {cert.issueDate}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-400">Điểm số: <span className="text-indigo-600 font-extrabold group-hover:text-amber-400">{cert.score}</span></span>
                </div>
            </div>

            {cert.url && (
              <Button 
                onClick={() => window.open(cert.url, '_blank')}
                className="w-full bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white font-black rounded-2xl h-14 border-none transition-all flex items-center gap-2 group-hover:bg-white group-hover:text-slate-950"
              >
                <ExternalLink className="w-4 h-4" />
                XEM CHỨNG CHỈ
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
