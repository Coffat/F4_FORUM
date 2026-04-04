'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Tag,
  Pencil,
  Trash2,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { getPromotions, deletePromotion, PromotionResponse, PaginatedResponse } from './promotion-actions';
import CreatePromotionDialog from './components/CreatePromotionDialog';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editPromotion, setEditPromotion] = useState<PromotionResponse | null>(null);
  const [totalElements, setTotalElements] = useState(0);

  const loadPromotions = () => {
    setLoading(true);
    getPromotions(0, 50).then(res => {
      if (res.success && res.data?.content) {
        setPromotions(res.data.content);
        setTotalElements(res.data.totalElements);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
    
    const res = await deletePromotion(id);
    if (res.success) {
      loadPromotions();
    } else {
      alert(res.error || 'Xóa thất bại');
    }
  };

  const handleEdit = (promo: PromotionResponse) => {
    setEditPromotion(promo);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditPromotion(null);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    loadPromotions();
  };

  const filteredPromotions = promotions.filter(promo =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Không có hạn';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (valid: boolean) => {
    return valid ? (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
        Còn hiệu lực
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
        Hết hạn
      </span>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Voucher</h2>
          <p className="text-sm text-slate-500 mt-1">Tạo và quản lý voucher khuyến mãi</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo voucher mới
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm voucher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={loadPromotions}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Mã voucher</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Giảm giá</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Giới hạn</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ngày hết hạn</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
              <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <RefreshCw className="w-6 h-6 text-slate-400 animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredPromotions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <Tag className="w-12 h-12 text-slate-200 mb-3" />
                    <p className="text-sm text-slate-500">Chưa có voucher nào</p>
                    <button
                      onClick={handleCreate}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Tạo voucher đầu tiên
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPromotions.map(promo => (
                <tr key={promo.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Tag className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-900">{promo.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-green-600">
                      {promo.discountType === 'PERCENT' 
                        ? `${promo.discountValue}%` 
                        : `${promo.discountValue?.toLocaleString('vi-VN')} VNĐ`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {promo.maxDiscountAmount ? formatCurrency(promo.maxDiscountAmount) : 'Không giới hạn'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatDate(promo.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(promo.valid)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(promo)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreatePromotionDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditPromotion(null);
        }}
        onSuccess={handleSuccess}
        editPromotion={editPromotion}
      />
    </div>
  );
}
