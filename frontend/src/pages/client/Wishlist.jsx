import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Loader2, Heart, ArrowLeft, User } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getImageUrl = (product) => {
    // Tự động tìm xem Backend trả về biến tên gì
    const imgPath = product.imageUrls || product.imageUrl || product.image;
    
    // Nếu không có ảnh, trả về ảnh mặc định
    if (!imgPath) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400";
    
    // Nếu ảnh là link mạng (http) thì dùng luôn
    if (imgPath.startsWith('http')) return imgPath;
    
    // Nếu là ảnh từ Backend (bắt đầu bằng /uploads), nối thẳng với localhost:8080
    return `http://localhost:8080${imgPath}`; 
  };

  // 👉 1. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP TỪ LOCAL STORAGE
  const isLoggedIn = !!localStorage.getItem('token');

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/kaisneaker/wishlist'); 
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi Wishlist:", error);
      toast.error("Không thể tải danh sách yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // 👉 2. NẾU CHƯA ĐĂNG NHẬP THÌ KHÔNG GỌI API NỮA, TẮT LOADING LUÔN
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    fetchWishlist(); 
  }, [isLoggedIn]);

  const handleToggle = async (productId) => {
    try {
      await api.post(`/kaisneaker/wishlist/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      toast.error("Lỗi khi cập nhật!");
    }
  };

  // 👉 3. NẾU CHƯA ĐĂNG NHẬP: HIỆN GIAO DIỆN BÁO LỖI SIÊU ĐẸP
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white">
        <header className="px-10 py-8 flex justify-between items-center border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-md z-50">
          <Link to="/home" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-gray-400 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <h1 className="text-2xl font-[900] tracking-tighter italic">KAI WISHLIST</h1>
          <div className="w-20"></div>
        </header>

        <main className="max-w-[1200px] mx-auto mt-16 px-6 pb-20">
          <div className="text-center py-32 bg-gray-50 rounded-[60px] border border-dashed border-gray-200">
            <User className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập!</h2>
            <p className="text-gray-400 mb-10 text-sm">Bạn cần đăng nhập để xem danh sách các đôi giày đã "chấm".</p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="px-10 py-4 bg-black text-white text-[10px] font-bold tracking-[0.2em] rounded-2xl hover:bg-gray-800 transition-all">
                ĐĂNG NHẬP
              </Link>
              <Link to="/home" className="px-10 py-4 bg-white text-black border border-gray-200 text-[10px] font-bold tracking-[0.2em] rounded-2xl hover:bg-gray-50 transition-all">
                VỀ TRANG CHỦ
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 👉 4. NẾU ĐÃ ĐĂNG NHẬP: GIỮ NGUYÊN GIAO DIỆN CŨ CỦA SẾP (KHÔNG HỎNG 1 DÒNG CODE)
  return (
    <div className="min-h-screen bg-white">
      <header className="px-10 py-8 flex justify-between items-center border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link to="/home" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-gray-400 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
        <h1 className="text-2xl font-[900] tracking-tighter italic">KAI WISHLIST</h1>
        <div className="w-20"></div>
      </header>

      <main className="max-w-[1200px] mx-auto mt-16 px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col h-full">
      
      <div className="relative aspect-[3/4] bg-[#f9f9f9] rounded-[40px] overflow-hidden mb-5 p-8">
        <img 
          src={getImageUrl(product)} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
          alt={product.name} 
        />
        <button 
          onClick={() => handleToggle(product.id)}
          className="absolute top-6 right-6 p-3 bg-white text-red-500 rounded-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-sm hover:bg-red-500 hover:text-white"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* 👉 2. Thêm flex flex-col flex-grow để khối thông tin này chiếm hết khoảng trống còn lại */}
      <div className="px-2 flex flex-col flex-grow">
        
        {/* 👉 3. Thêm line-clamp-2 để tên dài quá tự có dấu ... */}
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2" title={product.name}>
          {product.name}
        </h3>
        
        <p className="text-sm font-medium text-gray-400 mb-4">{product.categoryName || 'Sneaker'}</p>
        
        {/* 👉 4. Thêm mt-auto để ép khối Giá & Giỏ hàng luôn dính xuống đáy */}
        <div className="flex justify-between items-center mt-auto pb-2">
          <span className="font-black text-black">{product.price?.toLocaleString('vi-VN')} đ</span>
          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all">
            <ShoppingCart className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        
      </div>
    </div>
  ))}
</div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[60px] border border-dashed border-gray-200">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Trống trơn sếp ơi!</h2>
            <p className="text-gray-400 mb-10 text-sm">Có vẻ sếp chưa "chấm" được đôi giày nào rồi.</p>
            <Link to="/home" className="px-10 py-4 bg-black text-white text-[10px] font-bold tracking-[0.2em] rounded-2xl hover:bg-gray-800 transition-all">
              GO SHOPPING
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;