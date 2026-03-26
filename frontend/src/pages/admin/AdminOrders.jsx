import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, ArrowLeft, Loader2, Search,
  ChevronLeft, ChevronRight, CheckCircle2,
  Truck, XCircle, Clock, CreditCard, ArrowUpDown, ArrowUp, ArrowDown, Eye, X, User, MapPin
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'id', direction: 'desc' });

  const fetchOrders = async (page = 0, idSearch = searchTerm, sField = sortConfig.field, sDir = sortConfig.direction) => {
    setLoading(true);
    try {
      let url = `/kaisneaker/admin/orders?page=${page}&size=10&sort=${sField},${sDir}`;

      if (idSearch) {
        url += `&orderId=${idSearch}`;
      }

      const res = await api.get(url);
      setOrders(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setCurrentPage(res.data.number || 0);
    } catch (error) {
      toast.error("Không tìm thấy dữ liệu hoặc lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetail = (order) => {
    console.log("Dữ liệu đơn hàng sếp chọn:", order);
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150?text=KAI+SNEAKER";

    if (url.startsWith('http')) return url;

    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:8080${cleanUrl}`;
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const newConfig = { field, direction };
    setSortConfig(newConfig);
    fetchOrders(0, searchTerm, field, direction);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/kaisneaker/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Đã chuyển trạng thái: ${newStatus}`);
      fetchOrders(currentPage);
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái!");
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/kaisneaker/admin/orders/${orderId}/payment-status`, { status: newStatus });
      toast.success(`Xác nhận thanh toán: ${newStatus}`);
      fetchOrders(currentPage);
    } catch (error) {
      toast.error("Lỗi cập nhật thanh toán!");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'PROCESSING': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'SHIPPED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'DELIVERED': return 'bg-green-50 text-green-600 border-green-100';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-black" /> : <ArrowDown className="w-3 h-3 ml-1 text-black" />;
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto font-sans bg-[#f8f9fa] min-h-screen">

      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="group flex items-center gap-2 text-gray-400 hover:text-black transition-all"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Về Dashboard</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 uppercase italic tracking-tighter">
            <ShoppingBag className="w-6 h-6 text-orange-500" /> KAI ORDER MANAGER
          </h2>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[0.2em]">Kiểm soát đơn hàng và dòng tiền hệ thống</p>
        </div>
      </div>

      <div className="mb-6 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-1">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="number"
            placeholder="Tìm theo mã đơn hàng (Nhấn Enter)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders(0, searchTerm)}
            className="w-full px-4 py-3 outline-none bg-transparent font-bold text-sm"
          />
        </div>
        <button
          onClick={() => fetchOrders(0, searchTerm)}
          className="bg-black text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md"
        >
          Tìm kiếm
        </button>
        {searchTerm && (
          <button onClick={() => { setSearchTerm(''); fetchOrders(0, ''); }} className="text-[10px] font-black text-red-500 uppercase px-4 hover:underline">Xóa lọc</button>
        )}
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4 text-gray-300">
            <Loader2 className="animate-spin w-12 h-12" />
            <span className="text-xs font-black uppercase tracking-widest">Đang tải đơn hàng...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 tracking-widest border-b border-gray-100">
                <tr>
                  <th className="p-6 cursor-pointer hover:bg-gray-100/50 transition-all group" onClick={() => handleSort('id')}>
                    <div className="flex items-center">Mã đơn {renderSortIcon('id')}</div>
                  </th>
                  <th className="p-6">Khách hàng</th>
                  <th className="p-6 text-center">Tổng tiền</th>
                  <th className="p-6 text-center">Phương thức</th>
                  <th className="p-6 text-center">Vận chuyển</th>
                  <th className="p-6 text-center cursor-pointer hover:bg-gray-100/50 transition-all" onClick={() => handleSort('paymentStatus')}>
                    <div className="flex items-center justify-center">Thanh toán {renderSortIcon('paymentStatus')}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/30 transition-all">
                    <td className="p-6 font-black text-sm text-gray-900 italic">#{order.id}</td>

                    <td className="p-6">
                      <p className="text-sm font-bold text-gray-900 uppercase">{order.fullName}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{order.phone}</p>
                    </td>

                    <td className="p-6 font-black text-sm text-red-600 text-center">
                      {order.totalAmount?.toLocaleString()} <span className="text-[10px]">đ</span>
                    </td>

                    <td className="p-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border ${order.paymentMethodName === 'COD'
                        ? 'bg-orange-50 text-orange-600 border-orange-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {order.paymentMethodName}
                      </span>
                    </td>

                    <td className="p-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${getStatusStyle(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <select
                          className="text-[9px] font-black border border-gray-100 rounded-lg p-1 outline-none bg-gray-50 cursor-pointer hover:border-black transition-all"
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        >
                          <option value="PENDING">Chờ duyệt</option>
                          <option value="PROCESSING">Đang gói</option>
                          <option value="SHIPPED">Đang giao</option>
                          <option value="DELIVERED">Đã giao</option>
                          <option value="CANCELLED">Hủy đơn</option>
                        </select>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${order.paymentStatus === 'PAID'
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : 'bg-red-50 text-red-600 border-red-100'
                          }`}>
                          {order.paymentStatus === 'PAID' ? 'ĐÃ TRẢ TIỀN' : 'CHƯA TRẢ'}
                        </span>
                        <select
                          className="text-[9px] font-black border border-gray-100 rounded-lg p-1 outline-none bg-gray-50 cursor-pointer hover:border-black transition-all"
                          value={order.paymentStatus}
                          onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                        >
                          <option value="UNPAID">Chưa trả</option>
                          <option value="PAID">Đã trả</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="p-3 bg-gray-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg group"
                      >
                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="p-24 text-center text-gray-400 font-bold uppercase text-xs tracking-[0.2em] italic bg-gray-50/30">
                      Không tìm thấy mã đơn #{searchTerm} trong kho dữ liệu!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && !searchTerm && (
          <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Trang {currentPage + 1} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => fetchOrders(currentPage - 1)}
                className="p-2 bg-white border border-gray-100 rounded-lg hover:bg-black hover:text-white disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage + 1 === totalPages}
                onClick={() => fetchOrders(currentPage + 1)}
                className="p-2 bg-white border border-gray-100 rounded-lg hover:bg-black hover:text-white disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-black text-xl uppercase italic tracking-tighter">Chi tiết đơn hàng #{selectedOrder.id}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-3 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-10 overflow-y-auto space-y-10 bg-white">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] border-b border-zinc-100 pb-2">
                    Khách hàng
                  </p>
                  <div className="pl-1">
                    <p className="text-base font-bold text-zinc-900 uppercase tracking-tight">{selectedOrder.fullName}</p>
                    <p className="text-sm text-zinc-500 mt-1">{selectedOrder.phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] border-b border-zinc-100 pb-2">
                    Địa chỉ nhận hàng
                  </p>
                  <div className="pl-1">
                    <p className="text-sm font-medium text-zinc-600 leading-relaxed uppercase tracking-wide">
                      {selectedOrder.shippingAddress || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                  Chi tiết kiện hàng
                </p>

                <div className="divide-y divide-zinc-50">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="py-6 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-zinc-50 rounded-lg flex items-center justify-center border border-zinc-100 group-hover:bg-white transition-colors overflow-hidden">
                          {item.thumbnail ? (
                            <img
                              src={getImageUrl(item.thumbnail)}
                              className="w-full h-full object-cover"
                              alt="Puma"
                            />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-zinc-300" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-bold text-zinc-800 uppercase tracking-tight">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase">
                            <span>Size: <span className="text-zinc-600">{item.size}</span></span>
                            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
                            <span>Màu: <span className="text-zinc-600">{item.color}</span></span>
                            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
                            <span>Số lượng: <span className="text-zinc-600">x{item.quantity}</span></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-zinc-900 italic">
                          {(item.price || 0).toLocaleString()} <span className="text-[10px] not-italic">đ</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-zinc-100 flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em]">Thanh toán</p>
                  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase">{selectedOrder.paymentMethodName}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Tổng giá trị đơn hàng</p>
                  <p className="text-4xl font-black text-zinc-900 tracking-tighter italic">
                    {(selectedOrder.totalAmount || 0).toLocaleString()} <span className="text-xs not-italic tracking-normal">VNĐ</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase italic">Ghi chú: {selectedOrder.note || "Không có ghi chú nào."}</p>
              <button onClick={() => setIsDetailModalOpen(false)} className="px-12 py-3 bg-black text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:scale-105 transition-all">Đóng chi tiết</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;