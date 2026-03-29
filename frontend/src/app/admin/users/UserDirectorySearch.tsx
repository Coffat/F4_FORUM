'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

const DEBOUNCE_MS = 350

/**
 * Ô tìm kiếm user: debounce rồi cập nhật query (?search=&page=) để RSC refetch danh sách,
 * không cần nhấn Enter (đồng bộ với GET /api/admin/users?search=...).
 */
export const UserDirectorySearch = ({ initialSearch }: { initialSearch: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialSearch)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<string | null>(null)

  useEffect(() => {
    setValue(initialSearch)
  }, [initialSearch])

  const pushSearchToUrl = useCallback(
    (raw: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const trimmed = raw.trim()
      if (trimmed) {
        params.set('search', trimmed)
      } else {
        params.delete('search')
      }
      params.set('page', '0')
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const scheduleSync = useCallback(
    (next: string) => {
      pendingRef.current = next
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null
        const v = pendingRef.current ?? ''
        pushSearchToUrl(v)
      }, DEBOUNCE_MS)
    },
    [pushSearchToUrl]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setValue(next)
    scheduleSync(next)
  }

  return (
    <div className="relative flex-1 sm:w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search name, email..."
        autoComplete="off"
        aria-label="Search users by name or email"
        className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
      />
    </div>
  )
}
