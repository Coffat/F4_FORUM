'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

const DEBOUNCE_MS = 350

/** Debounce search → URL (?search=), giữ ?segment= */
export const StaffPersonnelSearch = ({ initialSearch }: { initialSearch: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialSearch)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<string | null>(null)

  useEffect(() => {
    setValue(initialSearch)
  }, [initialSearch])

  const pushToUrl = useCallback(
    (raw: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const trimmed = raw.trim()
      if (trimmed) params.set('search', trimmed)
      else params.delete('search')
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
        pushToUrl(pendingRef.current ?? '')
      }, DEBOUNCE_MS)
    },
    [pushToUrl]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div className="relative w-full max-w-xs min-w-[200px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => {
          const next = e.target.value
          setValue(next)
          scheduleSync(next)
        }}
        placeholder="Search name, email, department..."
        autoComplete="off"
        aria-label="Search personnel"
        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
      />
    </div>
  )
}
