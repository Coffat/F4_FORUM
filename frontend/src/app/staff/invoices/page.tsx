'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  FileText,
  Eye,
  RefreshCw
} from 'lucide-react';
import { getInvoices, InvoiceResponse } from './invoice-actions';
import CreateInvoiceDialog from './components/CreateInvoiceDialog';
import InvoiceDetailDialog from './components/InvoiceDetailDialog';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const mockInvoices: InvoiceResponse[] = [
    {
      id: 1,
      invoiceCode: 'INV-000001',
      student: { id: 21, fullName: 'Học viên Demo A', email: 'student.a@f4forum.com', phone: '0901000001' },
      baseAmount: 3800000,
      finalAmount: 3420000,
      status: 'PENDING',
      dueDate: '2026-04-15',
      details: [],
      promotions: [],
      createdAt: '2026-03-28T10:00:00',
      updatedAt: '2026-03-28T10:00:00'
    }
  ];

  const loadInvoices = () => {
    setLoading(true);
    getInvoices(0, 20).then(res => {
      if (res.success && res.data?.content) {
        setInvoices(res.data.content);
      } else {
        setInvoices(mockInvoices);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      PENDING: { bg: 'bg-amber-100', text: 'text-amber-700' },
      PAID: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      OVERDUE: { bg: 'bg-red-100', text: 'text-red-700' },
      CANCELLED: { bg: 'bg-slate-100', text: 'text-slate-600' }
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Hóa đơn</h2>
          <p className="text-sm text-slate-500 mt-1">Tạo và quản lý hóa đơn cho học viên</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadInvoices}
            className="p-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-colors"
            title="Làm mới"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Tạo hóa đơn mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hóa đơn, tên học viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Mã hóa đơn</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Học viên</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Ngày đến hạn</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Số tiền</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-bold text-slate-500">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Chưa có hóa đơn nào</p>
                    <button 
                      onClick={() => setIsDialogOpen(true)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                      Tạo hóa đơn đầu tiên
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{invoice.invoiceCode}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{invoice.student.fullName}</p>
                      <p className="text-xs text-slate-500">{invoice.student.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">
                      {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('vi-VN') : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('vi-VN') : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(invoice.finalAmount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setIsDetailOpen(true);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors" 
                      title="Xem chi tiết hóa đơn"
                    >
                      <Eye className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Dialog */}
      <CreateInvoiceDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadInvoices}
      />

      {/* Invoice Detail Dialog */}
      <InvoiceDetailDialog 
        invoice={selectedInvoice}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedInvoice(null);
        }}
      />
    </div>
  );
}