import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import OrderCard from '../../components/client/OrderCard';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, SHIPPING, COMPLETED, CANCELLED

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Gọi đúng API sếp đã viết
      const res = await api.get('/kaisneaker/orders/history');
      setOrders(res.data);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      try {
        await api.put(`/kaisneaker/orders/${orderId}/cancel`);
        toast.success("Đã hủy đơn hàng thành công!");
        fetchOrders(); // Load lại dữ liệu
      } catch (error) {
        toast.error("Không thể hủy đơn hàng lúc này!");
      }
    }
  };

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <header className="px-10 py-6 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link to="/home" className="text-2xl font-[900] tracking-tighter hover:text-gray-600 transition-colors">KAI SNEAKER</Link>
        <div className="flex gap-4">
          {['ALL', 'PENDING', 'SHIPPING', 'COMPLETED', 'CANCELLED'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${filter === f ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            >
              {f === 'ALL' ? 'Tất cả' : f}
            </button>
          ))}
        </div>
        <Link to="/home" className="text-xs font-bold uppercase tracking-widest hover:text-black">Quay lại</Link>
      </header>

      <main className="max-w-[800px] mx-auto mt-12 px-6">
        <h2 className="text-3xl font-[200] tracking-tight mb-10 uppercase">Quản lý đơn hàng</h2>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} onCancel={handleCancel} />
          ))
        ) : (
          <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <p className="text-gray-400 font-medium">Không tìm thấy đơn hàng nào trong mục này.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;