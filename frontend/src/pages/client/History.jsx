import React, { useState, useEffect } from 'react';
import OrderItem from '../../components/client/OrderItem';
import api from '../../api/axios';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/kaisneaker/user/orders/history');
        setOrders(res.data);
      } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header tối giản tương tự Profile */}
      <header className="px-10 py-6 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link to="/home" className="text-2xl font-[900] tracking-tighter hover:text-gray-600 transition-colors">KAI SNEAKER</Link>
        <div className="text-sm font-bold uppercase tracking-widest text-gray-500">LỊCH SỬ ĐƠN HÀNG</div>
        <Link to="/home" className="text-sm font-bold uppercase tracking-widest hover:text-black">TRANG CHỦ</Link>
      </header>

      <main className="max-w-[800px] mx-auto mt-12 px-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : orders.length > 0 ? (
          orders.map(order => <OrderItem key={order.id} order={order} />)
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Chưa có đơn hàng nào!</h2>
            <p className="text-gray-400 mb-8">Hãy chọn cho mình những đôi giày ưng ý nhất nhé.</p>
            <Link to="/home" className="px-8 py-3 bg-black text-white text-xs font-bold rounded-xl">MUA SẮM NGAY</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;