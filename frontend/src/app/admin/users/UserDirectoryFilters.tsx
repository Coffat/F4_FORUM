'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'

/**
 * Panel lọc theo userType / status / role; ghi vào URL (giữ search), reset page=0.
 * Giá trị khớp enum backend (UserType, UserStatus, AccountRole).
 */
export const UserDirectoryFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const userType = searchParams.get('userType') ?? ''
  const status = searchParams.get('status') ?? ''
  const role = searchParams.get('role') ?? ''

  const activeCount = [userType, status, role].filter(Boolean).length

  const applyParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const trimmed = value.trim()
    if (trimmed) params.set(key, trimmed)
    else params.delete(key)
    params.set('page', '0')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('userType')
    params.delete('status')
    params.delete('role')
    params.set('page', '0')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    setOpen(false)
  }

  return (
    <div className="relative shrink-0" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filters</span>
        {activeCount > 0 && (
          <span className="min-w-[1.25rem] h-5 px-1 rounded-full bg-[#0B3A9A] text-white text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Filter user directory"
          className="absolute right-0 top-full mt-2 z-40 w-[min(100vw-2rem,20rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filters</p>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Member type
              </label>
              <select
                value={userType || ''}
                onChange={(e) => applyParam('userType', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All types</option>
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Instructor</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Account status
              </label>
              <select
                value={status || ''}
                onChange={(e) => applyParam('status', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                System role
              </label>
              <select
                value={role || ''}
                onChange={(e) => applyParam('role', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All roles</option>
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_TEACHER">Instructor</option>
                <option value="ROLE_STAFF">Staff</option>
                <option value="ROLE_ADMIN">Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      )}
    </div>
  )
}
