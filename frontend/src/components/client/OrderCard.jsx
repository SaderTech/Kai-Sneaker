import React from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';

const OrderCard = ({ order, onCancel }) => {
  // Map trạng thái từ Backend sang tiếng Việt và màu sắc
  const statusMap = {
    'PENDING': { label: 'Chờ xác nhận', color: 'text-amber-600 bg-amber-50', icon: <Clock className="w-4 h-4" /> },
    'SHIPPING': { label: 'Đang giao hàng', color: 'text-blue-600 bg-blue-50', icon: <Truck className="w-4 h-4" /> },
    'COMPLETED': { label: 'Đã hoàn thành', color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle className="w-4 h-4" /> },
    'CANCELLED': { label: 'Đã hủy', color: 'text-red-600 bg-red-50', icon: <XCircle className="w-4 h-4" /> },
  };

  const currentStatus = statusMap[order.status] || statusMap['PENDING'];

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-6 transition-all hover:shadow-lg hover:shadow-gray-100 group">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-50 rounded-xl text-black">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mã đơn hàng</p>
            <p className="text-sm font-mono font-bold">#KS-{order.id}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${currentStatus.color}`}>
          {currentStatus.icon} {currentStatus.label}
        </span>
      </div>

      <div className="space-y-4">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-center">
            <img src={item.productImage || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200"} 
                 className="w-16 h-16 object-contain bg-gray-50 rounded-xl p-1" alt="" />
            <div className="flex-grow">
              <h5 className="text-sm font-bold text-gray-900 line-clamp-1">{item.productName}</h5>
              <p className="text-xs text-gray-400">Size: {item.size} | SL: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-black">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-end">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Tổng thanh toán</p>
          <p className="text-xl font-black text-red-600">{order.totalPrice?.toLocaleString('vi-VN')} đ</p>
        </div>
        
        <div className="flex gap-3">
          {order.status === 'PENDING' && (
            <button 
              onClick={() => onCancel(order.id)}
              className="px-5 py-2.5 border border-red-100 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-all"
            >
              HỦY ĐƠN
            </button>
          )}
          <button className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;