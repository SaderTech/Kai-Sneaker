import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Breadcrumb from '../../components/Breadcrumb';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Chống click đúp

  const isLoggedIn = !!localStorage.getItem('token');

  // 👉 HÀM LẤY ẢNH CHUẨN
  const getImageUrl = (imgData) => {
    const data = imgData?.imageUrls || imgData?.images || imgData?.imageUrl || imgData?.image || imgData;
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600";
    }
    let path = Array.isArray(data) ? data[0] : data;
    if (typeof path === 'object' && path !== null) {
        path = path.url || path.imageUrl || path.path;
    }
    if (typeof path === 'string' && path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  // 👉 1. HÀM XỬ LÝ DỮ LIỆU & SẮP XẾP (Fix lỗi nhảy vị trí)
  const handleSetCartData = (data) => {
    // Backend trả về CartDTO có list "items"
    const rawItems = data.items || data.cartItems || [];
    
    // ✅ Sắp xếp theo cartItemId tăng dần để đôi giày luôn đứng im một chỗ
    const sorted = [...rawItems].sort((a, b) => a.cartItemId - b.cartItemId);
    
    setCartItems(sorted);
  };

  // 👉 2. FETCH DỮ LIỆU (Fix lỗi xoay chong chóng)
  const fetchCart = async () => {
    if (!isLoggedIn) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      // Dùng đường dẫn tuyệt đối để tránh lỗi 404 mất chữ /kaisneaker
      const res = await api.get('/kaisneaker/carts'); 
      handleSetCartData(res.data);
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      toast.error("Không thể tải giỏ hàng!");
      setCartItems([]);
    } finally {
      setLoading(false); // Bắt buộc dừng xoay
    }
  };

  useEffect(() => {
    fetchCart();
    window.scrollTo(0, 0);
  }, [isLoggedIn]);

  // 👉 3. CẬP NHẬT SỐ LƯỢNG
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1 || isProcessing) return;
    setUpdatingId(cartItemId);
    try {
      const res = await api.put(`/kaisneaker/carts/update/${cartItemId}?quantity=${newQuantity}`);
      handleSetCartData(res.data); // Cập nhật và sắp xếp lại ngay
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật!");
    } finally {
      setUpdatingId(null);
    }
  };

const handleRemoveItem = async (cartItemId) => {
    if (isProcessing) return; // Chặn click đúp
    
    setIsProcessing(true);
    const toastId = toast.loading("Đang xóa sản phẩm...");

    // 1. MUA BẢO HIỂM: Lưu lại toàn bộ giỏ hàng hiện tại trước khi xóa
    const previousCart = [...cartItems];

    // 2. XÓA TẠM THỜI: Lọc bỏ item đó ra khỏi UI ngay lập tức cho mượt
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));

    try {
      // 3. BÁO BACKEND: Gửi lệnh xóa thật
      await api.delete(`/kaisneaker/carts/remove/${cartItemId}`);
      
      // ✅ Thành công: Không cần làm gì thêm vì UI đã xóa mượt rồi
      toast.success("Đã xóa khỏi giỏ hàng!", { id: toastId });
    } catch (error) {
      // 🚨 THẤT BẠI: BACKEND CÓ BIẾN!
      console.error("Xóa thất bại:", error);
      
      // 👉 ROLLBACK: Bê cái giỏ hàng cũ (có chứa đôi giày bị lỗi) đập lại vào UI
      setCartItems(previousCart); 
      
      toast.error("Lỗi hệ thống, không thể xóa! Đã khôi phục lại giỏ hàng.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  // TÍNH TOÁN TỔNG TIỀN
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shippingFee;

  // GIAO DIỆN CHƯA ĐĂNG NHẬP
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center bg-white p-16 rounded-[40px] shadow-sm border border-gray-100">
          <ShoppingBag className="w-20 h-20 text-gray-100 mx-auto mb-6" />
          <h2 className="text-2xl font-black uppercase mb-4">Sếp chưa đăng nhập</h2>
          <p className="text-gray-400 mb-8">Vui lòng đăng nhập để xem giỏ hàng của sếp nhé!</p>
          <Link to="/login" className="bg-black text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest">Đăng nhập ngay</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-24 pt-12 px-6">
      <main className="max-w-[1200px] mx-auto">
        <Breadcrumb items={[{ label: 'Giỏ hàng của tôi' }]} />

        <div className="mb-10 mt-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-[900] tracking-tighter uppercase italic text-gray-900">GIỎ HÀNG CỦA SẾP</h1>
            <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
                Đang có <span className="text-black">{cartItems.length}</span> sản phẩm
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>
        ) : cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* CỘT TRÁI: DANH SÁCH */}
            <div className="w-full lg:w-2/3 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
              {cartItems.map((item) => (
                // ✅ DÙNG cartItemId LÀM KEY ĐỂ REACT KHÔNG BỊ NHẦM
                <div key={item.cartItemId} className="flex gap-6 pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                  
                  <Link to={`/products/${item.productId}`} className="w-32 h-32 bg-[#f8f8f8] rounded-2xl p-2 flex-shrink-0">
                    <img src={getImageUrl(item)} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-bold text-gray-900 line-clamp-2">{item.productName}</h3>
                        
                        {/* NÚT XÓA CHUẨN ID */}
                        <button 
                          onClick={() => handleRemoveItem(item.cartItemId)}
                          disabled={isProcessing}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1 disabled:opacity-30"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">Size: <span className="text-black">{item.size}</span></p>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      {/* CỘT TĂNG GIẢM */}
                      <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          disabled={updatingId === item.cartItemId || item.quantity <= 1 || isProcessing}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-black hover:text-white transition-all disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-sm font-bold">
                          {updatingId === item.cartItemId ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          disabled={updatingId === item.cartItemId || isProcessing}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-black hover:text-white transition-all disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-lg font-black text-red-600">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CỘT PHẢI: TỔNG TIỀN */}
            <div className="w-full lg:w-1/3 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-32">
              <h3 className="text-lg font-[900] uppercase tracking-tight mb-6 border-b border-gray-100 pb-4">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Tạm tính</span>
                  <span className="text-gray-900 font-bold">{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Phí giao hàng</span>
                  <span className="text-gray-900 font-bold">{shippingFee.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest">Tổng thanh toán</span>
                  <span className="text-2xl font-black text-red-600">{total.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                TIẾN HÀNH THANH TOÁN 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link to="/home" className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-all">
                <ArrowLeft className="w-3 h-3" /> TIẾP TỤC MUA SẮM
              </Link>
            </div>

          </div>
        ) : (
          /* TRẠNG THÁI TRỐNG */
          <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="font-black text-gray-900 uppercase text-lg tracking-tight mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-400 text-sm font-medium mb-8">Sếp chưa chọn đôi giày nào vào giỏ cả.</p>
            <Link to="/home" className="inline-block bg-black text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl">ĐI MUA SẮM NGAY</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;