'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Plus, 
  AlertCircle,
  Loader2,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react'
import { createCourse, updateCourse, deleteCourse } from './course-actions'
import { EditIcon } from '@/components/icons/EditIcon'
import { DeleteIcon } from '@/components/icons/DeleteIcon'

// Match the model exactly to what page.tsx receives or the raw DTO
interface CourseData {
  id: string; // This is the string code for display
  name: string;
  category: string;
  enrollment: number;
  maxEnrollment: number;
  price: number;
  status: string;
  image: string;
  imageColor: string;
  originalId: string; // The numeric DB ID
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. DELETE CONFIRMATION
   ───────────────────────────────────────────────────────────────────────────── */
export function DeleteCourseButton({ 
    courseId, 
    courseName, 
    onSuccess 
}: { 
    courseId: string, 
    courseName: string,
    onSuccess?: () => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const res = await deleteCourse(Number(courseId))
    setIsDeleting(false)
    if (res.success) {
      setIsOpen(false)
      onSuccess?.()
    } else {
      alert(res.error || 'Failed to archive course')
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        title="Archive Course"
        className="p-2 w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
      >
        <DeleteIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isDeleting && setIsOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Archive Course?</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                You are about to archive <span className="font-bold text-slate-900">{courseName}</span>. It will be hidden from public listings but its historical enrollment data will remain intact.
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
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Archive"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. ADD / EDIT COURSE DIALOG
   ───────────────────────────────────────────────────────────────────────────── */
export function CourseFormModal({ 
    mode = 'create', 
    initialData, 
    onSuccess 
}: { 
    mode?: 'create' | 'edit', 
    initialData?: CourseData,
    onSuccess?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    // Convert necessary types (fee -> number)
    const rawData = Object.fromEntries(formData)
    
    const payload = {
      ...rawData,
      fee: parseFloat(rawData.fee as string) || 0,
      maxEnrollment: parseInt(rawData.maxEnrollment as string) || 100,
    }
    
    // Create/Update call
    const res = mode === 'create' 
      ? await createCourse(payload) 
      : await updateCourse(Number(initialData!.originalId), payload)

    setIsSubmitting(false)
    if (res.success) {
      setIsOpen(false)
      if (mode === 'create') (e.target as HTMLFormElement).reset()
      onSuccess?.()
    } else {
      setError(res.error || 'Operation failed')
    }
  }

  return (
    <>
      {mode === 'create' ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#0B3A9A] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-md shadow-blue-200 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Course
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          title="Edit Course"
          className="p-2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
        >
          <EditIcon className="w-4 h-4" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-[#0B3A9A]">{mode === 'create' ? "Configure New Course" : "Update Course Profile"}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Make changes to educational offerings and limits.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 pb-4 space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Course Name</label>
                    <input 
                      name="name" 
                      required 
                      defaultValue={initialData?.name}
                      placeholder="e.g. Master IELTS 7.0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Code</label>
                       <input 
                         name="code" 
                         required 
                         defaultValue={initialData?.id} // ID maps to code visually
                         disabled={mode === 'edit'}
                         placeholder="IELTS-70"
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium disabled:opacity-50" 
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Program</label>
                       <div className="relative">
                         <select 
                           name="category"
                           defaultValue={initialData?.category || 'IELTS'}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium pr-10"
                         >
                           <option value="IELTS">IELTS</option>
                           <option value="Business">Business</option>
                           <option value="General">General</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                       </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tuition Fee (VND)</label>
                       <input 
                         name="fee" 
                         type="number"
                         step="1"
                         required 
                         defaultValue={initialData?.price || 0}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Capacity</label>
                       <input 
                         name="maxEnrollment" 
                         type="number"
                         min="1"
                         required 
                         defaultValue={initialData?.maxEnrollment || 100}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                       />
                     </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Cover Image URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ImageIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        name="imageUrl" 
                        defaultValue={initialData?.image || ''}
                        placeholder="https://images.unsplash..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Status</label>
                       <div className="relative">
                         <select 
                           name="status"
                           defaultValue={initialData?.status === 'Published' ? 'PUBLISHED' : (initialData?.status === 'Draft' ? 'DRAFT' : 'PUBLISHED')}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium pr-10"
                         >
                           <option value="PUBLISHED">Published</option>
                           <option value="DRAFT">Draft</option>
                           <option value="ARCHIVED">Archived</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                       </div>
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Color Theme</label>
                       <div className="relative">
                         <select 
                           name="imageColor"
                           defaultValue={initialData?.imageColor || 'bg-slate-900'}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium pr-10"
                         >
                           <option value="bg-slate-900">Midnight Black</option>
                           <option value="bg-blue-900">Navy Blue</option>
                           <option value="bg-indigo-900">Deep Indigo</option>
                           <option value="bg-purple-900">Rich Purple</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                       </div>
                     </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Short Description</label>
                     <textarea 
                        name="description" 
                        rows={3}
                        defaultValue={initialData?.category || ''} // Using category to mock desc if blank for UI parity
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium resize-none" 
                        placeholder="Brief overview of the course curriculum."
                     />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-3 mt-4">
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-[#0B3A9A] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'create' ? "Create Course" : "Save Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function CourseTableRowActions({ course, onSuccess }: { course: CourseData, onSuccess?: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <CourseFormModal mode="edit" initialData={course} onSuccess={onSuccess} />
      <DeleteCourseButton courseId={course.originalId} courseName={course.name} onSuccess={onSuccess} />
    </div>
  )
}
