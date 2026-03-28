'use client'

import { useState } from 'react'
import { 
  X, 
  UserPlus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react'
import { createUser, updateUser, deleteUser } from './user-actions'

interface User {
  id: number
  fullName: string
  email: string
  phone: string
  userType: string
  role: string
  status: string
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. DELETE CONFIRMATION
   ───────────────────────────────────────────────────────────────────────────── */
export function DeleteUserButton({ userId, userName }: { userId: number, userName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const res = await deleteUser(userId)
    setIsDeleting(false)
    if (res.success) {
      setIsOpen(false)
    } else {
      alert(res.error || 'Failed to delete user')
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
      >
        <Trash2 className="w-4 h-4" />
        Remove Account
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isDeleting && setIsOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete Account?</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                You are about to permanently delete <span className="font-bold text-slate-900">{userName}</span>. This action cannot be undone and will remove all associated login access.
              </p>
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-end gap-3 px-6">
              <button 
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. ADD / EDIT DIALOG
   ───────────────────────────────────────────────────────────────────────────── */
export function UserFormModal({ mode = 'create', initialData }: { mode?: 'create' | 'edit', initialData?: User }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    
    // Create/Update call
    const res = mode === 'create' 
      ? await createUser(data) 
      : await updateUser(initialData!.id, data)

    setIsSubmitting(false)
    if (res.success) {
      setIsOpen(false)
      if (mode === 'create') (e.target as HTMLFormElement).reset()
    } else {
      setError(res.error || 'Operation failed')
    }
  }

  return (
    <>
      {mode === 'create' ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#0B3A9A] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-md shadow-blue-200 whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium border-b border-slate-100"
        >
          <Edit3 className="w-4 h-4" />
          Edit Basic Info
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{mode === 'create' ? "Register New User" : "Update Account"}</h3>
                <p className="text-xs text-slate-500 font-medium">Please fill in the official details for the system records.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <input 
                    name="fullName" 
                    required 
                    defaultValue={initialData?.fullName}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Official Email</label>
                  <input 
                    name="email" 
                    type="email"
                    required 
                    defaultValue={initialData?.email}
                    placeholder="example@f4forum.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                  <input 
                    name="phone" 
                    defaultValue={initialData?.phone}
                    placeholder="09xx xxx xxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Account Status</label>
                  <div className="relative">
                    <select 
                      name="status"
                      defaultValue={initialData?.status || 'ACTIVE'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium pr-10"
                    >
                      <option value="ACTIVE">Active Account</option>
                      <option value="INACTIVE">Inactive (Disabled)</option>
                      <option value="BANNED">Restricted (Suspended)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {mode === 'create' && (
                <>
                  <hr className="border-slate-100" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                      <input 
                        name="username" 
                        required 
                        placeholder="Login username"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                      <input 
                        name="rawPassword" 
                        type="password"
                        required 
                        placeholder="System password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Member Type</label>
                      <div className="relative">
                        <select 
                          name="userType"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium pr-10"
                        >
                          <option value="STUDENT">Student Candidate</option>
                          <option value="TEACHER">Official Instructor</option>
                          <option value="STAFF">Management Staff</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5 font-medium">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">System Role</label>
                      <div className="relative">
                        <select 
                          name="role"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium pr-10"
                        >
                          <option value="ROLE_STUDENT">Student Role</option>
                          <option value="ROLE_TEACHER">Instructor Role</option>
                          <option value="STAFF">Staff Role</option>
                          <option value="ROLE_ADMIN">System Administrator</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-[#0B3A9A] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'create' ? "Confirm Registration" : "Save Updates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
