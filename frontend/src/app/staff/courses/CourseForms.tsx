'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  AlertCircle,
  Loader2,
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Trash2,
  Plus,
  PlayCircle,
  Link as LinkIcon,
  FileBox,
  BookOpen
} from 'lucide-react'
import { updateCourseStaff, getCourseMaterials, createCourseMaterial, deleteCourseMaterial } from './course-actions'
import { EditIcon } from '@/components/icons/EditIcon'
import { DeleteIcon } from '@/components/icons/DeleteIcon'

interface CourseData {
  id: string; 
  name: string;
  category: string;
  enrollment: number;
  maxEnrollment: number;
  price: number;
  status: string;
  image: string;
  imageColor: string;
  level: string;
  originalId: string; 
}

interface MaterialData {
  id: number;
  title: string;
  materialType: string;
  fileUrl: string;
  uploadDate: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. EDIT COURSE DIALOG (STAFF)
   ───────────────────────────────────────────────────────────────────────────── */
export function StaffEditCourseModal({ 
    initialData, 
    onSuccess,
    variant = 'icon'
}: { 
    initialData: CourseData,
    onSuccess?: () => void,
    variant?: 'icon' | 'button'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData)
    
    const payload = {
      ...rawData,
      fee: initialData.price, // Staff cannot change fee
      maxEnrollment: parseInt(rawData.maxEnrollment as string) || initialData.maxEnrollment,
      level: rawData.level as string || initialData.level,
    }
    
    const res = await updateCourseStaff(Number(initialData.originalId), payload)

    setIsSubmitting(false)
    if (res.success) {
      setIsOpen(false)
      onSuccess?.()
    } else {
      setError(res.error || 'Operation failed')
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        title="Edit Details"
        className={variant === 'icon' 
          ? "p-2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#0B3A9A] hover:bg-blue-50 transition-colors shrink-0"
          : "h-10 px-5 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-sm hover:border-blue-500 hover:text-[#0B3A9A] transition-all flex items-center justify-center gap-2 group/btn shrink-0"
        }
      >
        {variant === 'icon' ? <EditIcon className="w-4 h-4" /> : (
          <>
            <EditIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>Edit Profile</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-[#0B3A9A]">Update Course Profile</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Make changes to educational offerings. Fee updating is restricted for staff.</p>
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
                      defaultValue={initialData.name}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Code</label>
                       <input 
                         name="code" 
                         required 
                         defaultValue={initialData.id}
                         disabled
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium disabled:opacity-50" 
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Program</label>
                       <div className="relative">
                         <select 
                           name="category"
                           defaultValue={initialData.category || 'IELTS'}
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

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Difficulty Level</label>
                    <div className="relative">
                      <select 
                        name="level"
                        defaultValue={initialData.level || 'Intermediate'}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium pr-10"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Elementary">Elementary</option>
                        <option value="Pre-Intermediate">Pre-Intermediate</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Upper-Intermediate">Upper-Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5 opacity-60">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tuition Fee (VND)</label>
                       <input 
                         type="number"
                         value={initialData.price}
                         disabled
                         title="Staff cannot edit tuition fees"
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm cursor-not-allowed outline-none font-medium text-slate-500" 
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Capacity</label>
                       <input 
                         name="maxEnrollment" 
                         type="number"
                         min="1"
                         required 
                         defaultValue={initialData.maxEnrollment || 100}
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
                        defaultValue={initialData.image || ''}
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
                           defaultValue={initialData.status === 'Published' ? 'PUBLISHED' : (initialData.status === 'Draft' ? 'DRAFT' : 'PUBLISHED')}
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
                           defaultValue={initialData.imageColor || 'bg-slate-900'}
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
                        defaultValue={initialData.category || ''} 
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
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. MANAGE MATERIALS DIALOG (STAFF)
   ───────────────────────────────────────────────────────────────────────────── */
export function StaffManageMaterialsModal({ 
  course, 
  variant = 'icon'
}: { 
  course: CourseData,
  variant?: 'icon' | 'button'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [materials, setMaterials] = useState<MaterialData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [materialUrl, setMaterialUrl] = useState('')
  const [materialType, setMaterialType] = useState('PDF')
  const [isUploadMode, setIsUploadMode] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const detectType = (url: string) => {
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.mov')) {
      return 'VIDEO'
    }
    if (lowerUrl.endsWith('.pdf')) {
      return 'PDF'
    }
    if (lowerUrl.endsWith('.doc') || lowerUrl.endsWith('.docx')) {
      return 'DOC'
    }
    return 'OTHER'
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setMaterialUrl(url)
    setMaterialType(detectType(url))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setMaterialType(detectType(file.name))
      // Simulate file upload by setting a fake path
      setMaterialUrl(`/uploads/${file.name}`)
    }
  }

  const fetchMaterials = async () => {
    setIsLoading(true)
    const res = await getCourseMaterials(Number(course.originalId))
    if (res.success) {
      setMaterials(res.data)
    } else {
      setError(res.error || 'Failed to load materials')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      fetchMaterials()
    }
  }, [isOpen])

  const handleAddMaterial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    let finalUrl = materialUrl

    // If real upload was here, we would call an upload API first
    if (isUploadMode && !selectedFile) {
      setError("Please select a file to upload")
      setIsSubmitting(false)
      return
    }

    const payload = {
      title: formData.get('title'),
      materialType: materialType, // Use state instead of form data
      fileUrl: finalUrl
    }

    const res = await createCourseMaterial(Number(course.originalId), payload)
    setIsSubmitting(false)

    if (res.success) {
      (e.target as HTMLFormElement).reset()
      setMaterialUrl('')
      setMaterialType('PDF')
      setSelectedFile(null)
      fetchMaterials()
    } else {
      setError(res.error || 'Failed to add material')
    }
  }

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return {
          icon: <PlayCircle className="w-5 h-5" />,
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-600'
        }
      case 'PDF':
        return {
          icon: <FileText className="w-5 h-5" />,
          bgColor: 'bg-rose-50',
          textColor: 'text-rose-600'
        }
      case 'DOC':
        return {
          icon: <FileText className="w-5 h-5" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600'
        }
      default:
        return {
          icon: <LinkIcon className="w-5 h-5" />,
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-600'
        }
    }
  }

  const handleDeleteMaterial = async (materialId: number) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    setIsLoading(true)
    const res = await deleteCourseMaterial(materialId)
    if (res.success) {
      fetchMaterials()
    } else {
      setError(res.error || 'Failed to delete material')
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        title="Manage Materials"
        className={variant === 'icon' 
          ? "p-2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0"
          : "h-10 px-5 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-sm hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 group/btn shrink-0"
        }
      >
        {variant === 'icon' ? <FileText className="w-4 h-4" /> : (
          <>
            <FileBox className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>Materials</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-[#0B3A9A]">Course Materials</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Manage documents and links for {course.name}.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Add Material Form */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-600" />
                    New Material
                  </h4>
                  <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                    <button 
                       type="button"
                       onClick={() => setIsUploadMode(false)}
                       className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!isUploadMode ? 'bg-[#0B3A9A] text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Paste Link
                    </button>
                    <button 
                       type="button"
                       onClick={() => setIsUploadMode(true)}
                       className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${isUploadMode ? 'bg-[#0B3A9A] text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Title</label>
                    <input 
                      name="title" required placeholder="e.g. Course Slides"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">{isUploadMode ? 'Choose File' : 'URL / Link'}</label>
                    {isUploadMode ? (
                      <div className="relative">
                        <input 
                          type="file" 
                          onChange={handleFileChange}
                          id="material-upload"
                          className="hidden"
                        />
                        <label 
                          htmlFor="material-upload"
                          className="w-full bg-white border border-slate-200 border-dashed rounded-xl py-2 px-3 text-xs text-slate-500 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-all font-medium"
                        >
                          <span className="truncate">{selectedFile ? selectedFile.name : 'Click to upload...'}</span>
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        </label>
                      </div>
                    ) : (
                      <input 
                        name="fileUrl" 
                        required 
                        value={materialUrl}
                        onChange={handleUrlChange}
                        placeholder="https://..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    )}
                  </div>
                  
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Type (Auto)</label>
                    <div className="relative">
                      <input 
                         name="materialType" 
                         value={materialType}
                         readOnly
                         className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-[#0B3A9A] outline-none" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <button 
                      type="submit" disabled={isSubmitting}
                      className="w-full h-[38px] flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              </div>

              {/* Material List */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4">Existing Materials</h4>
                {isLoading && !materials.length ? (
                   <p className="text-sm text-slate-500 py-4 text-center">Loading materials...</p>
                ) : materials.length === 0 ? (
                   <p className="text-sm text-slate-500 py-4 text-center border-2 border-dashed border-slate-100 rounded-xl">No materials uploaded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {materials.map(mat => {
                      const style = getMaterialIcon(mat.materialType);
                      return (
                        <div key={mat.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-blue-200 transition-all group">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-xl ${style.bgColor} ${style.textColor} flex items-center justify-center shrink-0`}>
                                {style.icon}
                             </div>
                             <div>
                                <a href={mat.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                  {mat.title}
                                </a>
                                <div className="flex gap-2 items-center mt-0.5">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${style.textColor}`}>{mat.materialType}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span className="text-[11px] font-medium text-slate-500">
                                    {mat.uploadDate ? new Date(mat.uploadDate).toLocaleDateString() : 'N/A'}
                                  </span>
                                </div>
                             </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteMaterial(mat.id)}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. COURSE PROFILE DIALOG (STAFF)
   ───────────────────────────────────────────────────────────────────────────── */
export function StaffCourseProfileModal({ 
  course, 
  isOpen, 
  onClose 
}: { 
  course: CourseData, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [materials, setMaterials] = useState<MaterialData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const fetchMaterials = async () => {
        setIsLoading(true)
        const res = await getCourseMaterials(Number(course.originalId))
        if (res.success) setMaterials(res.data)
        setIsLoading(false)
      }
      fetchMaterials()
    }
  }, [isOpen, course.originalId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Aspect: Visual & Primary Stats */}
        <div className={`md:w-2/5 p-8 text-white ${course.imageColor} relative flex flex-col justify-between overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-xl border border-white/10">
               {course.category === 'IELTS' ? <BookOpen className="w-8 h-8" /> : 
                course.category === 'Business' ? <FileText className="w-8 h-8" /> : 
                <BookOpen className="w-8 h-8" />}
            </div>
            <h2 className="text-3xl font-black leading-[1.1] mb-2">{course.name}</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {course.id}
            </div>
          </div>

          <div className="relative z-10 space-y-6 mt-12 md:mt-0">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">ENROLLMENT</p>
                   <p className="text-xl font-black">{course.enrollment}<span className="text-sm font-medium text-white/40 ml-1">/ {course.maxEnrollment}</span></p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">LEVEL</p>
                   <p className="text-lg font-black uppercase">{course.level || 'N/A'}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">STATUS</p>
                   <p className="text-xl font-black">{course.status}</p>
                </div>
                <div className="bg-white/10 rounded-2xl border border-white/10 p-4">
                   <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">TUITION FEE</p>
                   <p className="text-xl font-black">{course.price.toLocaleString()} <span className="text-[10px] font-medium opacity-60">VND</span></p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Aspect: Description & Materials Area */}
        <div className="md:w-3/5 bg-white flex flex-col p-8 md:p-12 overflow-y-auto">
          <div className="flex justify-between items-start mb-8 shrink-0">
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Course Overview</p>
                <h3 className="text-2xl font-bold text-slate-900">Program Profile</h3>
             </div>
             <div className="flex items-center gap-3">
               <StaffManageMaterialsModal course={course} variant="button" />
               <StaffEditCourseModal initialData={course} variant="button" />
               <button 
                 onClick={onClose} 
                 className="w-10 h-10 bg-slate-50 hover:bg-red-50 rounded-xl transition-all border border-slate-100 hover:border-red-200 group flex items-center justify-center ml-2"
               >
                  <X className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
               </button>
             </div>
          </div>

          <div className="space-y-8 flex-1">
             <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Description</h4>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   {course.category === 'IELTS' 
                     ? "This comprehensive program is designed to elevate language proficiency to international standards, specifically focusing on the 4 key metrics of the IELTS examination suite. Students will engage in rigorous academic exercises and mock examinations."
                     : "Detailed curriculum information for this specialized training module focusing on professional development and career-ready skillsets. Designed for motivated learners."}
                </p>
             </section>

             <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Course Materials</h4>
                   <span className="text-[10px] font-black px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg">
                      {materials.length} ITEMS
                   </span>
                </div>
                
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center gap-3 text-slate-300">
                     <Loader2 className="w-8 h-8 animate-spin" />
                     <p className="text-[10px] font-bold uppercase tracking-widest">Scanning Cloud Storage...</p>
                  </div>
                ) : materials.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-center bg-slate-50/30">
                     <FileBox className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                     <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No materials linked yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {materials.slice(0, 3).map(mat => ( // Show first 3 for profile
                      <div key={mat.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:border-blue-200 hover:shadow-sm transition-all group/mat">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover/mat:bg-blue-50 transition-colors">
                           <FileText className="w-5 h-5 text-slate-400 group-hover/mat:text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-slate-800 truncate">{mat.title}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{mat.materialType}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90" />
                      </div>
                    ))}
                    {materials.length > 3 && (
                      <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">+ {materials.length - 3} more items</p>
                    )}
                  </div>
                )}
             </section>
          </div>

          {/* Bottom Area is now just empty space or footer if needed */}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. SHARED STAFF TABLE ACTIONS
   ───────────────────────────────────────────────────────────────────────────── */
export function StaffCourseTableRowActions({ course, onSuccess }: { course: CourseData, onSuccess?: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <StaffManageMaterialsModal course={course} />
      <StaffEditCourseModal initialData={course} onSuccess={onSuccess} />
    </div>
  )
}
