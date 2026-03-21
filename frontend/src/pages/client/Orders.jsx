import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2, Filter, PackageCheck, Truck, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import OrderCard from '../../components/client/OrderCard';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // 👉 HÀM LẤY DANH SÁCH ĐƠN HÀNG
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/kaisneaker/orders/history');
      setOrders(res.data);
    } catch (error) {
      toast.error("Không thể tải đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    window.scrollTo(0, 0);
  }, []);

  const handleCancel = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      try {
        await api.put(`/kaisneaker/orders/${orderId}/cancel`);
        toast.success("Đã hủy đơn hàng thành công!");
        fetchOrders();
      } catch (error) {
        toast.error("Không thể hủy đơn hàng lúc này!");
      }
    }
  };

  // 👉 CHỈNH LẠI: Lọc theo 'orderStatus' để khớp với Entity Backend
  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(o => o.orderStatus === filter);

  // Danh sách filter hiển thị tiếng Việt cho "sang"
  const filterOptions = [
    { key: 'ALL', label: 'Tất cả', icon: <PackageCheck className="w-3 h-3" /> },
    { key: 'PENDING', label: 'Chờ xử lý', icon: <Clock className="w-3 h-3" /> },
    { key: 'SHIPPING', label: 'Đang giao', icon: <Truck className="w-3 h-3" /> },
    { key: 'COMPLETED', label: 'Đã giao', icon: <PackageCheck className="w-3 h-3" /> },
    { key: 'CANCELLED', label: 'Đã hủy', icon: <XCircle className="w-3 h-3" /> },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 font-sans">
      
      {/* ❌ ĐÃ TRẢM: Navbar thừa ở đây. Navbar chung ở App.jsx sẽ tự hiện */}

      <main className="max-w-[1000px] mx-auto pt-12 px-6">
        
        {/* THANH LỌC TRẠNG THÁI (UI MỚI CỰC MƯỢT) */}
        <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 mb-12 flex flex-wrap gap-2 sticky top-28 z-40 backdrop-blur-sm bg-white/80">
          {filterOptions.map(f => (
            <button 
              key={f.key} 
              onClick={() => setFilter(f.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${
                filter === f.key ? 'bg-black text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-4xl font-[900] tracking-tighter uppercase italic">Đơn hàng của tôi</h2>
                <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">Bạn đang có {filteredOrders.length} đơn hàng {filter !== 'ALL' && `trạng thái ${filter}`}</p>
            </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="font-black text-gray-900 uppercase text-lg tracking-tight mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-400 text-sm font-medium mb-8">Có vẻ như bạn chưa chốt đơn nào ở mục này rồi.</p>
            <Link to="/home" className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl">Tiếp tục mua sắm</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;