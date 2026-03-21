import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Heart, LogOut, ChevronDown, ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import ProductCard from '../../components/client/ProductCard';

// --- COMPONENT: PRODUCT SLIDER (CẬP NHẬT ẢNH FIT, TÊN DÀI, GIÁ ĐỎ VNĐ & FULL NÚT BẤM) ---
const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  // 1. Dùng một State để quản lý danh sách ID đã thích RIÊNG BIỆT
  const [likedIds, setLikedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const maxIndex = Math.max(0, (products?.length || 0) - 4);

  // 2. Đồng bộ hóa một lần duy nhất khi products từ Home đổ xuống
  useEffect(() => {
    if (products && products.length > 0) {
      const initialIds = products
        .filter(p => p.favorite === true) // 👉 Đổi từ isFavorite thành favorite
        .map(p => p.id);
      
      setLikedIds(initialIds);
    }
  }, [products]);

const getImageUrl = (imgData) => {
    const path = Array.isArray(imgData) ? imgData[0] : imgData; // Lấy cái đầu tiên nếu là mảng
    if (!path) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600";
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  const handleToggleWishlist = async (productId) => {
    if (isProcessing) return; // Chống click liên tục gây 2 thông báo
    
    setIsProcessing(true);
    try {
      await api.post(`/kaisneaker/wishlist/${productId}`);
      
      // 3. Cập nhật State cục bộ ngay lập tức
      setLikedIds(prev => {
        const isCurrentlyLiked = prev.includes(productId);
        if (isCurrentlyLiked) {
          toast.success("Đã xóa khỏi yêu thích", { id: 'wishlist-msg' });
          return prev.filter(id => id !== productId);
        } else {
          toast.success("Đã thêm vào yêu thích", { id: 'wishlist-msg' });
          return [...prev, productId];
        }
      });
    } catch (error) {
      toast.error("Vui lòng đăng nhập!");
    } finally {
      setIsProcessing(false);
    }
  };

  const next = () => setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  const prev = () => setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);

  if (!products || products.length === 0) return <p className="text-gray-400 text-sm italic py-4">Chưa có sản phẩm.</p>;

  // ĐẢM BẢO CÓ class group/slider ĐỂ NÚT BẤM HIỆN RA KHI HOVER
  return (
    <div className="relative group/slider overflow-hidden px-2 py-4 -mx-2">
      
      {/* 👉 ĐÃ KHÔI PHỤC: NÚT BẤM TRÁI / PHẢI */}
      {products.length > 4 && (
        <>
          <button onClick={prev} className="absolute left-2 top-[35%] z-30 p-3 bg-white border border-gray-100 shadow-xl rounded-full opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-black hover:text-white hover:scale-110">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-2 top-[35%] z-30 p-3 bg-white border border-gray-100 shadow-xl rounded-full opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-black hover:text-white hover:scale-110">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="flex  transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 25}%)` }}>
        {products.map(shoe => (
          <div key={shoe.id} className="w-1/4 flex-shrink-0 px-4 h-auto">
         <ProductCard 
      key={shoe.id} 
      product={shoe} 
      isLiked={likedIds.includes(shoe.id)} 
      onToggleWishlist={handleToggleWishlist} 
    />
    </div>
        ))}
      </div>
      
      {/* THANH CUỘN (PROGRESS BAR) Ở DƯỚI */}
      {products.length > 4 && (
        <div className="flex justify-center mt-12">
          <div className="w-48 h-[2px] bg-gray-100 overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500 ease-out" 
              style={{ width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- TRANG CHỦ CHÍNH ---
const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  


  // Khởi tạo state rỗng, khớp cấu trúc với HomePageDTO của Backend
  const [homeData, setHomeData] = useState({
    navbarBrands: [],
    navbarCategories: [],
    newArrivals: [],
    featuredProducts: [],
    brandSections: []
  });

  useEffect(() => {

    // GỌI API THẬT
    const fetchHomeData = async () => {
      try {
        const response = await api.get('/kaisneaker/home'); 
        setHomeData(response.data);
      } catch (error) {
        console.error("Lỗi khi tải trang chủ:", error);
        toast.error("Không thể tải dữ liệu từ máy chủ!");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);


  return (
    <div className="min-h-screen bg-white text-black font-sans">
      

      <header className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gray-950">
        <img src="https://sneakercollector.vn/wp-content/uploads/2025/10/Banner-Website-10-1.png" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Banner" />
        <div className="relative text-center text-white mt-20">
          <p className="text-xs font-bold tracking-[0.5em] mb-4">NEW COLLECTION</p>
          <h2 className="text-6xl font-[100] tracking-tight mb-8 italic">Limitless Motion</h2>
        </div>
      </header>

      <main className="pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-32">
            
            {homeData.newArrivals?.length > 0 && (
              <section className="px-10 max-w-[1600px] mx-auto mt-20">
                <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-5">
                  <h3 className="text-2xl font-[200] tracking-tight uppercase">SẢN PHẨM MỚI</h3>
                </div>
                <ProductSlider products={homeData.newArrivals} />
              </section>
            )}

            {homeData.featuredProducts?.length > 0 && (
              <section className="px-10 max-w-[1600px] mx-auto">
                <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-5">
                  <h3 className="text-2xl font-[200] tracking-tight uppercase">SẢN PHẨM NỔI BẬT</h3>
                </div>
                <ProductSlider products={homeData.featuredProducts} />
              </section>
            )}

            {homeData.brandSections?.map((section, index) => (
              <section key={index} className="w-full">
                <div className="w-full h-[50vh] relative">
                  <img 
                    src={section.brand.imageUrl || "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2000"} 
                    className="w-full h-full object-cover" 
                    alt={`${section.brand.name} Cover`} 
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white text-7xl font-[900] tracking-tighter drop-shadow-xl uppercase">
                      {section.brand.name}
                    </h2>
                  </div>
                </div>
                
                <div className="px-10 max-w-[1600px] mx-auto mt-12">
                  <div className="max-w-3xl mx-auto text-center mb-16">
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                      {section.brand.description || `Khám phá những đôi giày biểu tượng đến từ ${section.brand.name}.`}
                    </p>
                  </div>
                  <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-5">
                    <h3 className="text-lg font-bold tracking-widest uppercase">TOP LỰA CHỌN {section.brand.name}</h3>
                    <Link to={`/brand/${section.brand.id}`} className="text-xs font-bold hover:text-gray-500 transition-all uppercase">
                      VIEW ALL {section.brand.name}
                    </Link>
                  </div>
                  
                  <ProductSlider products={section.products} />
                </div>
              </section>
            ))}

            {!homeData.newArrivals?.length && !homeData.featuredProducts?.length && !homeData.brandSections?.length && (
               <div className="text-center text-gray-400 py-20 font-medium tracking-wide">
                 Hệ thống đang cập nhật dữ liệu sản phẩm. Vui lòng quay lại sau!
               </div>
            )}

          </div>
        )}
      </main>

    </div>
  );
};

export default Home;