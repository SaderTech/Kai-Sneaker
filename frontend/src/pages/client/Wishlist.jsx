import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Loader2, Heart, ArrowLeft, User } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import ProductCard from '../../components/client/ProductCard';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getImageUrl = (product) => {
    const imgPath = product.imageUrls || product.imageUrl || product.image;
    
    if (!imgPath) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400";
    
    if (imgPath.startsWith('http')) return imgPath;
    
    return `http://localhost:8080${imgPath}`; 
  };

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

  const handleToggleWishlist = async (productId) => {
    try {
      await api.post(`/kaisneaker/wishlist/${productId}`);
      
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      
      toast.success("Đã xóa khỏi danh sách yêu thích!");
    } catch (error) {
      toast.error("Lỗi hệ thống, không thể xóa!");
    }
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
  {products.map((product) => (
    <div key={product.id} className="h-auto w-full"> 
      <ProductCard 
        product={product} 
        isLiked={true} 
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  ))}
</div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[60px] border border-dashed border-gray-200">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Trống trơn sếp ơi!</h2>
            <p className="text-gray-400 mb-10 text-sm">Có vẻ bạn chưa "chấm" được đôi giày nào rồi.</p>
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