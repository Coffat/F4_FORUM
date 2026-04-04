'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

/**
 * QueryProvider - Cung cấp QueryClient cho TanStack Query v5.
 * Được thiết kế để bọc ứng dụng và duy trì trạng thái cache trong quá trình Hydration.
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Đảm bảo mỗi instance (hoặc trang) có một QueryClient riêng biệt để tránh memory leak trong SSR
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Dữ liệu được coi là mới trong 60 giây
        refetchOnWindowFocus: false, // Tránh refetch không cần thiết
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
