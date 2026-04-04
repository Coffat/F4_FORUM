"use client";

import React, { useState } from "react";
import { StudentAcademicResponse } from "@/types/academic.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Award, BookOpen, CheckCircle, GraduationCap, XCircle, FileWarning, Medal } from "lucide-react";

interface Props {
  initialData: StudentAcademicResponse;
}

export default function StudentAcademicResultsClient({ initialData }: Props) {
  const { placementTests, certificates, courseResults } = initialData;
  const [activeTab, setActiveTab] = useState("overview");

  const latestPlacementTest = placementTests.length > 0 ? placementTests[placementTests.length - 1] : null;

  const placementChartData = latestPlacementTest ? [
    { subject: 'Listening', A: latestPlacementTest.listening, fullMark: 9 },
    { subject: 'Speaking', A: latestPlacementTest.speaking, fullMark: 9 },
    { subject: 'Reading', A: latestPlacementTest.reading, fullMark: 9 },
    { subject: 'Writing', A: latestPlacementTest.writing, fullMark: 9 },
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
            Kết Quả Học Tập
          </h1>
          <p className="text-slate-500 text-lg font-medium mt-2">
            Theo dõi tiến độ chuyên cần, điểm thi và các chứng chỉ bạn đã đạt được.
          </p>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-6 rounded-xl w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
            Hồ sơ đầu vào & Chứng chỉ
          </TabsTrigger>
          <TabsTrigger value="transcripts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
            Bảng Điểm Môn Học
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Radar Chart cho Placement Test */}
            <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white hover:shadow-lg transition-all">
              <div className="h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-violet-500" />
                  Năng Lực Đầu Vào
                </CardTitle>
                <CardDescription>Biểu đồ phân tích độ bao phủ các kỹ năng</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {latestPlacementTest ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={placementChartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" className="text-sm font-bold text-slate-600" />
                      <PolarRadiusAxis angle={30} domain={[0, 9]} tick={{ fill: "transparent" }} />
                      <Radar name="Học viên" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    Bạn chưa có điểm thi đầu vào
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white hover:shadow-lg transition-all">
              <div className="h-2 bg-gradient-to-r from-emerald-400 to-cyan-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-emerald-500" />
                  Chứng Chỉ Của Bạn
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certificates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certificates.map((cert, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-2xl relative overflow-hidden group cursor-pointer"
                      >
                        <div className="absolute -right-4 -bottom-4 text-emerald-500/10 group-hover:scale-110 transition-transform">
                          <Medal className="w-24 h-24" />
                        </div>
                        <h4 className="font-extrabold text-emerald-900 mb-1">{cert.type}</h4>
                        <div className="text-sn text-emerald-700 font-bold mb-3 border-b border-emerald-200/50 pb-2 inline-block">Score: {cert.score}</div>
                        <p className="text-xs text-slate-500">Cấp ngày: {new Date(cert.issueDate).toLocaleDateString("vi-VN")}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                    <FileWarning className="w-10 h-10 mb-2 opacity-50" />
                    <p>Chưa có chứng chỉ nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transcripts">
          {courseResults.length > 0 ? (
            <Accordion className="w-full space-y-4">
              {courseResults.map((course, idx) => {
                const progressColor = 
                  course.attendance.attendancePercentage >= 80 ? "bg-emerald-500" :
                  course.attendance.attendancePercentage >= 50 ? "bg-amber-500" : "bg-red-500";

                return (
                  <AccordionItem value={`course-${idx}`} key={idx} className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white mb-4 [&[data-state=open]]:shadow-md transition-all px-2">
                    <AccordionTrigger className="hover:no-underline px-6 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center w-full gap-4 text-left">
                        <div className="flex-1">
                          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-500" />
                            {course.courseName}
                          </h3>
                          <p className="text-sm font-mono text-slate-500 mt-1">Lớp: {course.classCode}</p>
                        </div>
                        <div className="w-full sm:w-48 space-y-1.5 mr-4 shrink-0">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>Chuyên cần</span>
                            <span>{Math.round(course.attendance.attendancePercentage)}%</span>
                          </div>
                          <Progress value={course.attendance.attendancePercentage} className={`h-2 [&_[data-slot=progress-indicator]]:${progressColor}`} />
                          <div className="text-[10px] text-slate-400">
                            Vắng {course.attendance.absentSessions}/{course.attendance.totalSessions} buổi
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center justify-end w-20">
                           {course.finalResult?.grade === "PASS" ? (
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none"><CheckCircle className="w-3 h-3 mr-1"/> Đã Qua</Badge>
                           ) : course.finalResult?.grade === "FAIL" ? (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none shadow-none"><XCircle className="w-3 h-3 mr-1"/> Chưa Đạt</Badge>
                           ) : (
                              <Badge variant="outline" className="text-slate-500">Đang học</Badge>
                           )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-6 pb-6 pt-2">
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                        
                        {/* Submissions Table */}
                        <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/50">
                          <div className="bg-slate-100/80 px-4 py-2 font-bold text-sm text-slate-700 border-b border-slate-100">
                            Chi Tiết Bài Tập
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tên bài tập</TableHead>
                                <TableHead className="w-[100px] text-right">Điểm số</TableHead>
                                <TableHead className="w-[150px]">Tình trạng</TableHead>
                                <TableHead className="w-[300px]">Lời phê</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {course.assignmentScores.length > 0 ? course.assignmentScores.map(sub => (
                                <TableRow key={sub.submissionId} className="hover:bg-slate-50 transition-colors bg-white">
                                  <TableCell className="font-semibold text-slate-700">{sub.assignmentTitle}</TableCell>
                                  <TableCell className="text-right font-mono font-bold text-indigo-600">
                                    {sub.score !== null ? `${sub.score}/${sub.maxScore}` : '-'}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={sub.status === "GRADED" ? "bg-green-50 text-green-700 border-green-200" : ""}>
                                      {sub.status || "Chưa nộp"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-slate-500 italic">
                                    {sub.teacherComment || "-"}
                                  </TableCell>
                                </TableRow>
                              )) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-slate-400 py-4">Chưa có bài tập nào</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Final Result / Teacher Comment */}
                        <div className="flex flex-col md:flex-row gap-6 items-stretch">
                           <Card className="flex-1 border-none shadow-md bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                              <CardContent className="p-6 h-full flex flex-col justify-center">
                                 <h4 className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-4">Điểm thi cuối khóa</h4>
                                 <div className="flex gap-8">
                                    <div>
                                      <div className="text-sm text-indigo-200 mb-1">Giữa kỳ</div>
                                      <div className="text-4xl font-extrabold">{course.finalResult?.midtermScore || "-"}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-indigo-200 mb-1">Cuối kỳ</div>
                                      <div className="text-4xl font-extrabold">{course.finalResult?.finalScore || "-"}</div>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>

                           <Card className="flex-[2] border-slate-100 shadow-sm rounded-3xl bg-amber-50/30 border border-amber-100">
                              <CardContent className="p-6">
                                 <h4 className="text-amber-800 text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Medal className="w-4 h-4" /> Đánh giá từ giảng viên
                                 </h4>
                                 <blockquote className="border-l-4 border-amber-300 pl-4 space-y-2">
                                    <p className="text-slate-700 italic font-medium leading-relaxed">
                                      {course.finalResult?.teacherComment ? 
                                        `"${course.finalResult.teacherComment}"` : 
                                        "Giảng viên chưa cập nhật nhận xét cuối khóa cho bạn."}
                                    </p>
                                 </blockquote>
                              </CardContent>
                           </Card>
                        </div>

                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
              <FileWarning className="w-12 h-12 mb-4 text-slate-300" />
              <p className="font-bold text-lg text-slate-600">Chưa có dữ liệu khóa học</p>
              <p className="text-sm mt-1 mb-4">Bạn chưa tham gia khóa học nào hoặc chưa có điểm số nào được ghi nhận.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
