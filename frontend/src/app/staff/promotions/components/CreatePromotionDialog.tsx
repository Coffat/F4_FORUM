'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check,
  Loader2,
  Tag,
  Percent,
  Banknote
} from 'lucide-react';
import { 
  createPromotion,
  updatePromotion,
  PromotionResponse,
  PromotionRequest
} from '../promotion-actions';

interface CreatePromotionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editPromotion?: PromotionResponse | null;
}

export default function CreatePromotionDialog({ 
  isOpen, 
  onClose, 
  onSuccess,
  editPromotion 
}: CreatePromotionDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENT');
  const [discountValue, setDiscountValue] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (editPromotion) {
      setCode(editPromotion.code);
      setDiscountType(editPromotion.discountType || 'PERCENT');
      setDiscountValue(editPromotion.discountValue?.toString() || '');
      setMaxDiscountAmount(editPromotion.maxDiscountAmount?.toString() || '');
      setEndDate(editPromotion.endDate || '');
    } else {
      setCode('');
      setDiscountType('PERCENT');
      setDiscountValue('');
      setMaxDiscountAmount('');
      setEndDate('');
    }
  }, [editPromotion, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Vui lòng nhập mã voucher');
      return;
    }
    if (!discountValue || parseFloat(discountValue) <= 0) {
      setError('Vui lòng nhập giá trị giảm giá');
      return;
    }

    setLoading(true);
    setError('');

    const data: PromotionRequest = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : undefined,
      endDate: endDate || undefined
    };

    let res;
    if (editPromotion) {
      res = await updatePromotion(editPromotion.id, data);
    } else {
      res = await createPromotion(data);
    }

    setLoading(false);

    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(res.error || 'Thao tác thất bại');
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
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {editPromotion ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}
            </h3>
            <p className="text-sm text-slate-500">
              {editPromotion ? 'Cập nhật thông tin voucher' : 'Tạo voucher khuyến mãi mới'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Mã voucher *
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="VD: WELCOME20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Loại giảm giá *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDiscountType('PERCENT')}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  discountType === 'PERCENT'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Percent className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <span className="text-xs font-medium text-slate-700">Phần trăm (%)</span>
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('FIXED')}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  discountType === 'FIXED'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <span className="text-xs font-medium text-slate-700">Tiền mặt (VNĐ)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Giá trị giảm giá {discountType === 'PERCENT' ? '(%)' : '(VNĐ)'} *
            </label>
            <input
              type="number"
              placeholder={discountType === 'PERCENT' ? 'VD: 20' : 'VD: 100000'}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              min="0"
              max={discountType === 'PERCENT' ? "100" : undefined}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {discountType === 'PERCENT' && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Giảm giá tối đa (VNĐ)
              </label>
              <input
                type="number"
                placeholder="VD: 500000"
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Ngày hết hạn
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl border border-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {editPromotion ? 'Cập nhật' : 'Tạo mới'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
