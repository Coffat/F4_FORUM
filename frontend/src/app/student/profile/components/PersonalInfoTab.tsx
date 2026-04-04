"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useEffect } from "react";
import { updateProfileSchema, UpdateProfileInput } from "@/validations/student.schema";
import { updateStudentProfileAction } from "../profile-actions";
import { StudentProfile } from "@/types/student.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, User as UserIcon } from "lucide-react";

interface Props {
  profile: StudentProfile;
}

export function PersonalInfoTab({ profile }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema) as any,
    defaultValues: {
      phoneNumber: profile.phoneNumber || "",
      dateOfBirth: profile.dateOfBirth || "",
      avatarUrl: profile.avatarUrl || "",
      targetScore: profile.targetScore || 0,
      email: profile.email || "",
    },
  });

  // Cập nhật lại form nếu profile payload thay đổi (Server-side revalidation)
  useEffect(() => {
    form.reset({
      phoneNumber: profile.phoneNumber || "",
      dateOfBirth: profile.dateOfBirth || "",
      avatarUrl: profile.avatarUrl || "",
      targetScore: profile.targetScore || 0,
      email: profile.email || "",
    });
  }, [profile, form]);

  const onSubmit = (data: UpdateProfileInput) => {
    startTransition(async () => {
      const result = await updateStudentProfileAction(data);
      if (result.success) {
        alert("Cập nhật hồ sơ thành công!");
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Summary Card */}
      <Card className="lg:col-span-1 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white h-fit">
        <div className="h-24 bg-gradient-to-r from-indigo-500 to-blue-600" />
        <CardContent className="pt-0 -mt-12 flex flex-col items-center text-center pb-8">
          <div className="p-1 bg-white rounded-full shadow-lg mb-4">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={profile.avatarUrl || "https://i.pravatar.cc/150?img=12"} alt={profile.firstName} />
              <AvatarFallback>{profile.firstName?.[0]}</AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-xl font-black text-slate-800">
            {profile.lastName} {profile.firstName}
          </h3>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">Student Account</p>
          
          <div className="w-full mt-8 space-y-3 px-4 text-left">
             <div className="flex flex-col p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase">Email hiện tại</span>
                <span className="text-sm font-bold text-slate-700 truncate">{profile.email}</span>
             </div>
             <div className="flex flex-col p-3 bg-indigo-50/50 rounded-2xl">
                <span className="text-[10px] font-black text-indigo-400 uppercase">Ngày gia nhập</span>
                <span className="text-sm font-bold text-indigo-600 truncate">{profile.admissionDate}</span>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form Card */}
      <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white">
        <CardContent className="p-8">
          <header className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserIcon className="w-5 h-5" />
              </div>
              <div>
                  <h4 className="text-lg font-extrabold text-slate-800">Chỉnh sửa hồ sơ</h4>
                  <p className="text-xs font-medium text-slate-400">Cập nhật thông tin cá nhân và email liên hệ</p>
              </div>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Địa chỉ Email (Dòng riêng vì quan trọng) */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-black text-slate-500 uppercase">Địa chỉ Email</FormLabel>
                      <FormControl>
                        <Input 
                            placeholder="example@gmail.com" 
                            {...field} 
                            value={field.value || ""} // Chống lỗi uncontrolled input
                            className="rounded-2xl border-slate-100 bg-slate-50/50 h-12 focus:bg-white transition-all font-bold" 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                {/* 2. Số điện thoại */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black text-slate-500 uppercase">Số điện thoại</FormLabel>
                      <FormControl>
                        <Input 
                            placeholder="09xxxxxxxx" 
                            {...field} 
                            value={field.value || ""}
                            className="rounded-2xl border-slate-100 bg-slate-50/50 h-12 focus:bg-white transition-all font-bold" 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                
                {/* 3. Ngày sinh */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black text-slate-500 uppercase">Ngày sinh</FormLabel>
                      <FormControl>
                        <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ""}
                            className="rounded-2xl border-slate-100 bg-slate-50/50 h-12 focus:bg-white transition-all font-bold" 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                {/* 4. Điểm IELTS mục tiêu */}
                <FormField
                  control={form.control}
                  name="targetScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black text-slate-500 uppercase">Điểm IELTS mục tiêu</FormLabel>
                      <FormControl>
                        <Input 
                            type="number" 
                            step="0.5" 
                            {...field} 
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="rounded-2xl border-slate-100 bg-slate-50/50 h-12 focus:bg-white transition-all font-bold" 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500" />
                    </FormItem>
                  )}
                />

                {/* 5. URL Ảnh đại diện */}
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black text-slate-500 uppercase">URL Ảnh đại diện</FormLabel>
                      <FormControl>
                        <Input 
                            placeholder="https://..." 
                            {...field} 
                            value={field.value || ""}
                            className="rounded-2xl border-slate-100 bg-slate-50/50 h-12 focus:bg-white transition-all font-bold" 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl px-10 h-14 font-black transition-all shadow-lg shadow-indigo-100 flex items-center gap-3 group"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  {isPending ? "ĐANG LƯU..." : "CẬP NHẬT HỒ SƠ"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
