import React from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

const OrderItem = ({ order }) => {
  // Hàm hiển thị Badge trạng thái
  const getStatusBadge = (status) => {
    const styles = {
      'PENDING': { color: 'text-amber-600 bg-amber-50', icon: <Clock className="w-3 h-3" />, text: 'Chờ xác nhận' },
      'SHIPPING': { color: 'text-blue-600 bg-blue-50', icon: <Truck className="w-3 h-3" />, text: 'Đang giao hàng' },
      'COMPLETED': { color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle className="w-3 h-3" />, text: 'Đã hoàn thành' },
      'CANCELLED': { color: 'text-red-600 bg-red-50', icon: <XCircle className="w-3 h-3" />, text: 'Đã hủy' }
    };
    const config = styles[status] || styles['PENDING'];
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-6 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
      <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">Mã đơn hàng</p>
          <h4 className="font-mono font-bold text-sm">#KS-{order.id}</h4>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="space-y-4">
        {order.items?.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-2">
              <img src={item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200"} className="w-full h-full object-contain mix-blend-multiply" alt="" />
            </div>
            <div className="flex-grow">
              <h5 className="font-bold text-sm mb-1">{item.productName}</h5>
              <p className="text-xs text-gray-400">Size: {item.size} | SL: {item.quantity}</p>
              <p className="text-sm font-bold mt-2 text-red-600">{item.price?.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
        <p className="text-xs text-gray-400 font-medium">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng thanh toán</p>
          <p className="text-lg font-black text-black">{order.totalPrice?.toLocaleString('vi-VN')} đ</p>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;