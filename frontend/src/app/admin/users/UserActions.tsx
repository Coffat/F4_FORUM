'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'
import { DeleteUserButton, UserFormModal } from './UserForms'

interface User {
  id: number
  fullName: string
  email: string
  phone: string
  userType: string
  role: string
  status: string
}

export function UserTableRowActions({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-slate-200 text-slate-700' : 'text-slate-400 hover:bg-slate-100'}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="px-4 py-2 border-b border-slate-50">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management Actions</p>
          </div>
          
          <UserFormModal mode="edit" initialData={user} />
          
          <DeleteUserButton userId={user.id} userName={user.fullName} />
        </div>
      )}
    </div>
  )
}
