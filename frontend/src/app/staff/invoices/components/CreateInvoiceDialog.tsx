'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Check,
  Loader2,
  FileText,
  User,
  GraduationCap,
  Calendar,
  Plus,
  CreditCard
} from 'lucide-react';
import { 
  searchStudents, 
  getCourses, 
  createInvoice,
  getStudentEnrollments,
  getPromotions,
  StudentInfo,
  CourseInfo,
  EnrollmentInfo,
  PromotionInfo,
  CreateInvoiceData
} from '../invoice-actions';

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateInvoiceDialog({ isOpen, onClose, onSuccess }: CreateInvoiceDialogProps) {
  const [step, setStep] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Student search
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<StudentInfo[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(null);
  const [searching, setSearching] = useState(false);
  
  // Courses for invoice
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  // Promotions/Vouchers
  const [promotions, setPromotions] = useState<PromotionInfo[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionInfo | null>(null);
  
  // Invoice details
  const [dueDate, setDueDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = selectedCourses.reduce((sum, courseId) => {
    const course = courses.find(c => c.id === courseId);
    return sum + (course?.fee || 0);
  }, 0);

  const discountAmount = selectedPromotion 
    ? (selectedPromotion.discountType === 'PERCENT' 
        ? Math.min(
            totalAmount * (selectedPromotion.discountValue / 100),
            selectedPromotion.maxDiscountAmount || Infinity
          )
        : Math.min(
            selectedPromotion.discountValue,
            selectedPromotion.maxDiscountAmount || Infinity
          ))
    : 0;
  const finalAmount = totalAmount - discountAmount;

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSearchKeyword('');
      setSearchResults([]);
      setSelectedStudent(null);
      setCourses([]);
      setSelectedCourses([]);
      setPromotions([]);
      setSelectedPromotion(null);
      setDueDate('');
      setPaymentMethod('');
      setError('');
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Search students
  useEffect(() => {
    if (searchKeyword.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      setSearching(true);
      const res = await searchStudents(searchKeyword);
      if (res.success && res.data) {
        setSearchResults(res.data);
      }
      setSearching(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchKeyword]);
  
  // Load courses and promotions when entering Step 2
  useEffect(() => {
    if (step < 2) return;
    
    setLoadingCourses(true);
    Promise.all([
      getCourses(),
      getPromotions()
    ]).then(([coursesRes, promotionsRes]) => {
      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data);
      }
      if (promotionsRes.success && promotionsRes.data) {
        setPromotions(promotionsRes.data);
      }
      setLoadingCourses(false);
    });
  }, [step]);
  
  const toggleCourse = (id: number) => {
    setSelectedCourses(prev => 
      prev.includes(id) 
        ? prev.filter(e => e !== id)
        : [...prev, id]
    );
  };
  
  const handleCreateInvoice = async () => {
    if (!selectedStudent || selectedCourses.length === 0) {
      setError('Vui lòng chọn ít nhất một khóa học');
      return;
    }
    
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      return;
    }
    
    setCreating(true);
    setError('');
    
    const data: CreateInvoiceData = {
      studentId: selectedStudent.id,
      dueDate: dueDate || undefined,
      paymentMethod: paymentMethod || undefined,
      promotionIds: selectedPromotion ? [selectedPromotion.id] : undefined,
      details: selectedCourses.map(courseId => {
        const course = courses.find(c => c.id === courseId);
        return {
          courseId,
          description: course?.name || '',
          unitPrice: course?.fee || 0
        };
      })
    };
    
    const res = await createInvoice(data);
    setCreating(false);
    
    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(res.error || 'Tạo hóa đơn thất bại');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={dialogRef}
        className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Tạo hóa đơn mới</h3>
            <p className="text-sm text-slate-500">Tạo hóa đơn cho học viên</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 px-6 py-4 bg-slate-50 border-b border-slate-100">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs font-medium ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
                {s === 1 ? 'Học viên' : s === 2 ? 'Khóa học' : 'Xác nhận'}
              </span>
              {s < 3 && <div className="w-6 h-px bg-slate-200 ml-1" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
          
          {/* Step 1: Search & Select Student */}
          {step === 1 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Tìm kiếm học viên
              </h4>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nhập tên, email hoặc số điện thoại..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                )}
              </div>
              
              {searchResults.length > 0 && !selectedStudent && (
                <div className="space-y-2 mb-4">
                  {searchResults.map(student => (
                    <button
                      key={student.id}
                      onClick={() => {
                        setSelectedStudent(student);
                        setSearchResults([]);
                        setSearchKeyword('');
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors text-left"
                    >
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{student.fullName}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {selectedStudent && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900">{selectedStudent.fullName}</p>
                      <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Step 2: Select Enrollments */}
          {step === 2 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Chọn khóa học
              </h4>
              
              {loadingCourses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">Học viên chưa đăng ký khóa học nào</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {courses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => toggleCourse(course.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        selectedCourses.includes(course.id)
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedCourses.includes(course.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-slate-300'
                      }`}>
                        {selectedCourses.includes(course.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm text-slate-900">{course.name}</p>
                        <p className="text-xs text-slate-500">Mã: {course.code} · {course.fee?.toLocaleString('vi-VN')} ₫</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Step 3: Confirm & Create */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Học viên</p>
                <p className="font-medium text-sm text-slate-900">{selectedStudent?.fullName}</p>
                <p className="text-xs text-slate-500">{selectedStudent?.email}</p>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Khóa học ({selectedCourses.length})</p>
                <div className="space-y-2">
                  {selectedCourses.map(id => {
                    const course = courses.find(c => c.id === id);
                    return (
                      <div key={id} className="flex justify-between text-xs">
                        <span className="text-slate-600">{course?.name}</span>
                        <span className="font-medium text-slate-900">{course?.fee?.toLocaleString('vi-VN')} ₫</span>
                      </div>
                    );
                  })}
                  {selectedPromotion && (
                    <div className="flex justify-between text-xs text-green-600">
                      <span>Giảm giá ({selectedPromotion.discountType === 'PERCENT' ? selectedPromotion.discountValue + '%' : selectedPromotion.discountValue.toLocaleString('vi-VN') + 'VNĐ'})</span>
                      <span>-{discountAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                    <span className="text-sm font-medium text-slate-900">Tổng cộng</span>
                    <span className="text-sm font-bold text-blue-600">{totalAmount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  {selectedPromotion && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-900">Thanh toán</span>
                      <span className="text-sm font-bold text-green-600">{finalAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Voucher giảm giá
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPromotion(null)}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                      !selectedPromotion
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Không sử dụng voucher</span>
                    </div>
                  </button>
                  {promotions.filter(p => p.valid).map(promo => (
                    <button
                      key={promo.id}
                      type="button"
                      onClick={() => setSelectedPromotion(promo)}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                        selectedPromotion?.id === promo.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium text-slate-900">{promo.code}</span>
                          <span className="text-xs text-green-600 ml-2">Giảm {promo.discountType === 'PERCENT' ? promo.discountValue + '%' : promo.discountValue?.toLocaleString('vi-VN') + 'VNĐ'}</span>
                        </div>
                        {promo.maxDiscountAmount && (
                          <span className="text-xs text-slate-500">Max: {Number(promo.maxDiscountAmount).toLocaleString('vi-VN')}₫</span>
                        )}
                      </div>
                    </button>
                  ))}
                  {promotions.filter(p => p.valid).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-2">Chưa có voucher khả dụng</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'CASH', label: 'Tiền mặt', icon: '💵' },
                    { value: 'CARD', label: 'Quẹt thẻ', icon: '💳' },
                    { value: 'MOMO', label: 'MoMo', icon: '📱' }
                  ].map(method => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === method.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{method.icon}</div>
                      <div className="text-xs font-medium text-slate-700">{method.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Ngày đến hạn (tùy chọn)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          {step === 1 ? (
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedStudent}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Tiếp theo
                <Plus className="w-4 h-4 rotate-90" />
              </button>
            </div>
          ) : step === 2 ? (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl border border-slate-200 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selectedCourses.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Tiếp theo
                <Plus className="w-4 h-4 rotate-90" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl border border-slate-200 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={creating}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium rounded-xl transition-colors"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Tạo hóa đơn
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}