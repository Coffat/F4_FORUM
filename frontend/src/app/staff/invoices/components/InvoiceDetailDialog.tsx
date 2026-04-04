'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  FileText,
  User,
  GraduationCap,
  Tag,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { InvoiceResponse } from '../invoice-actions';

interface InvoiceDetailDialogProps {
  invoice: InvoiceResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceDetailDialog({ 
  invoice, 
  isOpen, 
  onClose 
}: InvoiceDetailDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      PAID: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle className="w-4 h-4" /> },
      PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Clock className="w-4 h-4" /> },
      OVERDUE: { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle className="w-4 h-4" /> },
      CANCELLED: { bg: 'bg-slate-100', text: 'text-slate-600', icon: <X className="w-4 h-4" /> },
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
        {config.icon}
        {status === 'PAID' ? 'Đã thanh toán' : status === 'PENDING' ? 'Chờ thanh toán' : status === 'OVERDUE' ? 'Quá hạn' : 'Đã hủy'}
      </span>
    );
  };

  const discountAmount = invoice ? invoice.baseAmount - invoice.finalAmount : 0;

  if (!isOpen || !invoice) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={dialogRef}
        className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{invoice.invoiceCode}</h3>
              <p className="text-sm text-slate-500">Ngày tạo: {formatDate(invoice.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(invoice.status)}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Student Info */}
          <div className="p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông tin học viên</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Họ tên</p>
                <p className="font-medium text-slate-900">{invoice.student.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="font-medium text-slate-900">{invoice.student.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Số điện thoại</p>
                <p className="font-medium text-slate-900">{invoice.student.phone || '-'}</p>
              </div>
              {invoice.dueDate && (
                <div>
                  <p className="text-xs text-slate-400">Ngày đến hạn</p>
                  <p className="font-medium text-slate-900">{formatDate(invoice.dueDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Courses Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Khóa học ({invoice.details.length})
              </span>
            </div>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-400">Khóa học</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-400">Đơn giá</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-400">Giảm giá</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-400">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.details.map((detail) => (
                    <tr key={detail.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{detail.courseName || detail.description}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-600">
                        {formatCurrency(detail.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-green-600">
                        {detail.discountAmount > 0 ? `-${formatCurrency(detail.discountAmount)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                        {formatCurrency(detail.finalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Promotions */}
          {invoice.promotions && invoice.promotions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Voucher áp dụng ({invoice.promotions.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {invoice.promotions.map((promo) => (
                  <div key={promo.id} className="px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
                    <span className="font-medium text-green-700">{promo.code}</span>
                    <span className="text-xs text-green-600 ml-2">
                      {promo.discountType === 'PERCENT' ? `-${promo.discountValue}%` : `-${formatCurrency(promo.discountValue)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tổng tiền</span>
                <span className="text-slate-900">{formatCurrency(invoice.baseAmount)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Giảm giá</span>
                  <span className="text-green-600">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-blue-200 pt-2">
                <span className="text-slate-900">Thành tiền</span>
                <span className="text-blue-600">{formatCurrency(invoice.finalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl border border-slate-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
