'use client'

import { useQuery } from "@tanstack/react-query"
import { fetchSchedulesAction } from "@/app/student/schedules/schedule-api"
import { toast } from "sonner"
import { useEffect } from "react"

/**
 * useSchedules - Custom Hook quản lý trạng thái lịch học.
 * Sử dụng TanStack Query v5 để caching và quản lý Lifecycle của dữ liệu.
 * 
 * @param startDate Ngày bắt đầu (yyyy-MM-dd)
 * @param endDate Ngày kết thúc (yyyy-MM-dd)
 */
export const useSchedules = (startDate: string, endDate: string) => {
  const query = useQuery({
    queryKey: ['schedules', startDate, endDate],
    queryFn: () => fetchSchedulesAction(startDate, endDate),
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    retry: 1, // Chỉ thử lại 1 lần nếu lỗi
  })

  // Theo dõi lỗi và hiển thị Toast chuyên nghiệp
  useEffect(() => {
    if (query.error) {
      toast.error(query.error instanceof Error ? query.error.message : "Có lỗi xảy ra khi lấy lịch học!")
    }
  }, [query.error])

  return query
}
