import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Truck, User, Phone, CheckCircle2, Loader2, StickyNote, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Breadcrumb from '../../components/Breadcrumb';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Form thông tin giao hàng
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethodId: 1
  });

  const isLoggedIn = !!localStorage.getItem('token');

  // Lấy URL ảnh chuẩn
  const getImageUrl = (imgData) => {
    const data = imgData?.imageUrls || imgData?.images || imgData?.imageUrl || imgData?.image || imgData;
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600";
    }
    let path = Array.isArray(data) ? data[0] : data;
    if (typeof path === 'object' && path !== null) path = path.url || path.imageUrl || path.path;
    if (typeof path === 'string' && path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      navigate('/login');
      return;
    }
    fetchCheckoutData();
    window.scrollTo(0, 0);
  }, [isLoggedIn, navigate]);

  // Lấy dữ liệu
  const fetchCheckoutData = async () => {
    setLoading(true);
    try {
      const [cartRes, pmRes, userRes] = await Promise.all([
        api.get('/kaisneaker/carts'),
        api.get('/kaisneaker/payment-methods').catch(() => ({ data: [] })), 
        api.get('/kaisneaker/users/profile').catch(() => ({ data: {} })) 
      ]);

      // 1. Set Giỏ hàng
      const items = cartRes.data.items || cartRes.data.cartItems || [];
      if (items.length === 0) {
        toast.error("Giỏ hàng trống! Hãy mua sắm thêm nhé.");
        navigate('/cart');
        return;
      }
      setCartItems([...items].sort((a, b) => a.cartItemId - b.cartItemId));

      // 2. Set Phương thức thanh toán
      if (pmRes.data.length > 0) {
        setPaymentMethods(pmRes.data);
      } else {
        setPaymentMethods([
          { id: 1, name: 'COD', description: 'Thanh toán khi nhận hàng' },
          { id: 2, name: 'Bank Transfer', description: 'Chuyển khoản ngân hàng: 80369335908 - TPBank' }
        ]);
      }

      // 3. AUTO-FILL THÔNG TIN USER
      const user = userRes.data;
      const fullAddress = [
        user.houseNumberStreet, 
        user.ward, 
        user.district, 
        user.provinceCity
      ].filter(Boolean).join(', ');

      setShippingInfo(prev => ({
        ...prev,
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: fullAddress || '', 
        paymentMethodId: pmRes.data.length > 0 ? pmRes.data[0].id : 1
      }));
      
    } catch (error) {
      toast.error("Không thể tải dữ liệu thanh toán!");
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  // 👉 HÀM XÓA TỪNG TRƯỜNG CỤ THỂ
  const handleClearField = (fieldName) => {
    setShippingInfo(prev => ({ ...prev, [fieldName]: '' }));
  };

  const validateForm = () => {
    // 1. Validate Họ và tên (Không được để trống)
    if (!shippingInfo.fullName.trim()) {
      toast.error("Sếp ơi, chưa nhập họ tên kìa!");
      return false;
    }

    const phoneRegex = /^(0[35789])[0-9]{8}$/;
    if (!shippingInfo.phone.trim()) {
      toast.error("Bạn quên nhập số điện thoại rồi!");
      return false;
    } else if (!phoneRegex.test(shippingInfo.phone)) {
      toast.error("Số điện thoại không đúng định dạng!");
      return false;
    }

    if (!shippingInfo.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng!");
      return false;
    }

    if (!shippingInfo.paymentMethodId) {
      toast.error("Vui lòng chọn 1 phương thức thanh toán nhé!");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm() || isPlacingOrder) return;

    setIsPlacingOrder(true);
    const toastId = toast.loading("Đang xử lý đơn hàng...");

    try {
      await api.post('/kaisneaker/orders/checkout', {
        fullName: shippingInfo.fullName,
        phone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        note: shippingInfo.note,
        paymentMethodId: shippingInfo.paymentMethodId
      });

      toast.success(" Đặt hàng thành công!", { id: toastId });
      navigate('/history');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi đặt hàng! Vui lòng thử lại.", { id: toastId });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>;

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-24 pt-12 px-6">
      <main className="max-w-[1200px] mx-auto">
        <Breadcrumb items={[{ label: 'Giỏ hàng', link: '/cart' }, { label: 'Thanh toán' }]} />

        <div className="mb-10 mt-6">
          <h1 className="text-4xl font-[900] tracking-tighter uppercase italic text-gray-900">THANH TOÁN</h1>
          <p className="text-gray-400 text-sm font-medium mt-2">Hoàn tất thông tin để nhận siêu phẩm của sếp.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* CỘT TRÁI */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Form Địa chỉ */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative">
              
              <h3 className="text-lg font-[900] uppercase tracking-tight mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Thông tin nhận hàng
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Họ và tên */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="fullName" 
                      value={shippingInfo.fullName} 
                      onChange={handleInputChange} 
                      placeholder="Nguyễn Văn A" 
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-1 focus:ring-black outline-none transition-all text-sm font-medium" 
                    />
                    {shippingInfo.fullName && (
                      <button type="button" onClick={() => handleClearField('fullName')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel" 
                      name="phone" 
                      value={shippingInfo.phone} 
                      onChange={handleInputChange} 
                      placeholder="0987654321" 
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-1 focus:ring-black outline-none transition-all text-sm font-medium" 
                    />
                    {shippingInfo.phone && (
                      <button type="button" onClick={() => handleClearField('phone')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Địa chỉ giao hàng */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Địa chỉ giao hàng</label>
                  <div className="relative">
                    <Truck className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                    <textarea 
                      name="address" 
                      value={shippingInfo.address} 
                      onChange={handleInputChange} 
                      placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP" 
                      rows="3" 
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-1 focus:ring-black outline-none transition-all text-sm font-medium resize-none"
                    ></textarea>
                    {shippingInfo.address && (
                      <button type="button" onClick={() => handleClearField('address')} className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ghi chú (Tùy chọn)</label>
                  <div className="relative">
                    <StickyNote className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                    <textarea 
                      name="note" 
                      value={shippingInfo.note} 
                      onChange={handleInputChange} 
                      placeholder="Giao hàng trong giờ hành chính..." 
                      rows="2" 
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-1 focus:ring-black outline-none transition-all text-sm font-medium resize-none"
                    ></textarea>
                    {shippingInfo.note && (
                      <button type="button" onClick={() => handleClearField('note')} className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-[900] uppercase tracking-tight mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Phương thức thanh toán
              </h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label key={method.id} className={`flex items-start p-5 rounded-2xl border-2 cursor-pointer transition-all ${shippingInfo.paymentMethodId === method.id ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={shippingInfo.paymentMethodId === method.id} 
                      onChange={() => setShippingInfo(prev => ({ ...prev, paymentMethodId: method.id }))}
                      className="mt-1 w-4 h-4 text-black focus:ring-black accent-black" 
                    />
                    <div className="ml-4">
                      <span className="block font-bold text-sm text-gray-900 uppercase tracking-tight">{method.name}</span>
                      <span className="block text-xs text-gray-500 mt-1 font-medium">{method.description}</span>
                    </div>
                    {shippingInfo.paymentMethodId === method.id && <CheckCircle2 className="w-5 h-5 text-black ml-auto" />}
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* CỘT PHẢI */}
          <div className="w-full lg:w-1/3 space-y-8 sticky top-32">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-[900] uppercase tracking-tight mb-6 border-b border-gray-100 pb-4">Đơn hàng của sếp</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#f8f8f8] rounded-xl p-1 flex-shrink-0 border border-gray-100">
                      <img src={getImageUrl(item)} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.productName}</h4>
                      <p className="text-[10px] text-gray-500 uppercase mt-1">Size: {item.size} <span className="mx-1">|</span> SL: {item.quantity}</p>
                      <p className="text-sm font-black text-red-600 mt-1">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Tạm tính ({cartItems.length} sản phẩm)</span>
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
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-black text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isPlacingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {isPlacingOrder ? 'ĐANG CHỐT ĐƠN...' : 'ĐẶT HÀNG NGAY'}
              </button>

              <Link to="/cart" className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-all">
                <ArrowLeft className="w-3 h-3" /> QUAY LẠI GIỎ HÀNG
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Checkout;