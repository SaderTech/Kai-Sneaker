import React from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle, CreditCard, ShoppingBag, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderCard = ({ order, onCancel }) => {
  if (!order) return null;

  const orderItems = order.items || order.orderItems || []; 
  const totalAmount = order.totalAmount || 0;
  const status = order.orderStatus || order.status || 'PENDING';
const subtotal = orderItems.reduce((sum, item) => sum + ((item.unitPrice || item.price || 0) * (item.quantity || 1)), 0);
  const shippingFee = totalAmount - subtotal;
  const getImageUrl = (item) => {
    const data = item?.thumbnail || item?.imageUrl || item?.image; 
  if (!data || typeof data !== 'string') return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600";
  if (data.startsWith('http')) return data;
  return `http://localhost:8080${data}`;
};

  const getStatusConfig = (sts) => {
    switch (sts) {
      case 'PENDING': return { color: 'text-amber-500 bg-amber-50', border: 'border-amber-200', text: 'Chờ xử lý', icon: <Clock className="w-4 h-4" /> };
      case 'CONFIRMED': return { color: 'text-blue-500 bg-blue-50', border: 'border-blue-200', text: 'Đã xác nhận', icon: <CheckCircle className="w-4 h-4" /> };
      case 'SHIPPING': return { color: 'text-purple-500 bg-purple-50', border: 'border-purple-200', text: 'Đang giao', icon: <Truck className="w-4 h-4" /> };
      case 'DELIVERED': 
      case 'COMPLETED': return { color: 'text-green-600 bg-green-50', border: 'border-green-200', text: 'Đã giao thành công', icon: <Package className="w-4 h-4" /> };
      case 'CANCELLED': return { color: 'text-red-500 bg-red-50', border: 'border-red-200', text: 'Đã hủy', icon: <XCircle className="w-4 h-4" /> };
      default: return { color: 'text-gray-500 bg-gray-50', border: 'border-gray-200', text: sts, icon: <Package className="w-4 h-4" /> };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 lg:p-8 hover:shadow-lg transition-all duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
        <div>
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
            MÃ ĐƠN HÀNG: #{order.id} 
          </h3>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
            Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}          </p>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${config.border} ${config.color} whitespace-nowrap`}>
          {config.icon}
          <span className="text-xs font-black uppercase tracking-widest">{config.text}</span>
        </div>
      </div>

      <div className="space-y-4">
        {orderItems.map((item, index) => (
          <div key={index} className="flex gap-4 items-center">
            
            <div className="w-20 h-20 bg-[#f8f8f8] rounded-xl p-2 border border-gray-50 flex-shrink-0">
              <img src={getImageUrl(item)} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            
            
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.productName || item.name || "Giày Kai Sneaker"}</h4>
              <p className="text-xs text-gray-500 uppercase font-medium mt-1">
                Size: {item.size} <span className="mx-2">|</span> Số lượng: x{item.quantity}
              </p>
            </div>
            
            
            <div className="text-right">
              <p className="text-sm font-black text-red-600">
                {(item.unitPrice || item.price || 0).toLocaleString('vi-VN')} đ
              </p>
              {(status === 'DELIVERED' || status === 'COMPLETED') && (
                <Link 
                  to={`/products/${item.productId}#reviews`} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-tighter rounded-lg hover:bg-gray-800 transition-all shadow-md shadow-gray-200"
                >
                  <MessageSquare className="w-3 h-3" /> REVIEW
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6 pt-6 mt-6 border-t border-gray-100 bg-gray-50/30 -mx-6 -mb-6 p-6 sm:-mx-8 sm:-mb-8 sm:p-8 rounded-b-[24px]">
        
        <div className="flex flex-col items-start justify-end gap-7 order-2 md:order-1 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 md:border-0">
          
          <div className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span>Thanh toán: <span className="font-bold text-gray-900 uppercase tracking-wide">{order.paymentMethod || 'COD'}</span></span>
          </div>

          {status === 'PENDING' && onCancel && (
            <button 
              onClick={() => onCancel(order.id)}
              className="w-full sm:w-auto px-5 py-3 bg-white text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-gray-200 shadow-sm transition-all flex items-center justify-center sm:justify-start gap-2"
            >
              <XCircle className="w-4 h-4" />
              HỦY ĐƠN HÀNG
            </button>
          )}
        </div>

        <div className="w-full md:w-[320px] flex flex-col gap-2.5 order-1 md:order-2">
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Tổng tiền hàng:</span>
            <span className="font-medium text-gray-900">{subtotal.toLocaleString('vi-VN')} đ</span>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500 pb-4 border-b border-gray-200 border-dashed">
            <span>Phí vận chuyển:</span>
            <span className="font-medium text-gray-900">
              {shippingFee > 0 ? `${shippingFee.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
            </span>
          </div>
          
          <div className="flex justify-between items-end pt-2">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Thành tiền:</span>
            <span className="text-2xl font-black text-red-600 whitespace-nowrap drop-shadow-sm">
              {totalAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default OrderCard;