import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Loader2, Package, ChevronRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import OrderItem from './OrderItem'; // Đảm bảo đường dẫn này đúng với file card của bạn
import Breadcrumb from '../../components/Breadcrumb';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Gọi API lấy lịch sử đơn hàng
        const res = await api.get('/kaisneaker/orders/history');
        setOrders(res.data);
      } catch (error) {
        console.error("Lỗi fetch orders:", error);
        toast.error("Không thể tải lịch sử đơn hàng!");
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 font-sans">

      <main className="max-w-[1000px] mx-auto pt-12 px-6">
        
        {/* BREADCRUMB CHO TRANG ĐƠN HÀNG */}
        <Breadcrumb items={[{ label: 'Tài khoản', link: '/profile' }, { label: 'Đơn hàng của tôi' }]} />

        <div className="flex justify-between items-end mb-10 mt-6">
          <div>
            <h2 className="text-4xl font-[900] tracking-tighter uppercase italic text-gray-900">
              LỊCH SỬ ĐƠN HÀNG
            </h2>
            <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
              Bạn đang có <span className="text-black">{orders.length}</span> đơn hàng đã thực hiện
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {orders.map(order => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        ) : (
          /* TRẠNG THÁI TRỐNG */
          <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="font-black text-gray-900 uppercase text-lg tracking-tight mb-2">
              Giỏ hàng đang đợi bạn!
            </h3>
            <p className="text-gray-400 text-sm font-medium mb-8 max-w-xs mx-auto">
              Bạn chưa có đơn hàng nào. Những đôi Sneaker cực phẩm đang chờ bạn rước về đấy!
            </p>
            <Link 
              to="/home" 
              className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
            >
              MUA SẮM NGAY <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;