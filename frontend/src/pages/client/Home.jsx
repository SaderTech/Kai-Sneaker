import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Heart, LogOut, ChevronDown, ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

// --- COMPONENT: PRODUCT SLIDER (CẬP NHẬT ẢNH FIT, TÊN DÀI, GIÁ ĐỎ VNĐ & FULL NÚT BẤM) ---
const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
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

      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 25}%)` }}>
        {products.map(shoe => (
          // Thêm h-full và flex-col để thẻ cao bằng nhau
          <div key={shoe.id} className="w-1/4 flex-shrink-0 px-4 group cursor-pointer flex flex-col h-full gap-4">
            
            <div className="aspect-square bg-[#f8f8f8] relative overflow-hidden rounded-2xl border border-transparent group-hover:border-gray-200 transition-all p-6 flex items-center justify-center">
              
              {/* NÚT TRÁI TIM: Check theo likedIds */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleWishlist(shoe.id);
                }}
                className="absolute top-4 right-4 z-30 p-2 transition-all hover:scale-125"
              >
                <Heart 
                  className={`w-5 h-5 transition-all duration-300 ${
                    likedIds.includes(shoe.id) // Kiểm tra xem ID có trong mảng Liked không
                      ? "fill-red-500 text-red-500 scale-110" 
                      : "text-gray-300 group-hover:text-gray-400"
                  }`} 
                />
              </button>

              <img 
  src={
    shoe.imageUrls 
      ? (shoe.imageUrls.startsWith('http') ? shoe.imageUrls : `http://localhost:8080${shoe.imageUrls}`) 
      : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"
  } 
  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
  alt={shoe.name} 
/>
              
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <button className="w-full bg-black/90 backdrop-blur-sm text-white py-3.5 text-xs font-bold tracking-widest hover:bg-black shadow-xl rounded-xl">
                  THÊM VÀO GIỎ
                </button>
              </div>
            </div>

            {/* THÔNG TIN SẢN PHẨM */}
            <div className="flex flex-col gap-1 px-1 flex-grow">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{shoe.brandName}</p>
              
              {/* Ép tên thành 2 dòng */}
              <h4 className="text-[14px] font-bold tracking-tight text-gray-900 leading-snug line-clamp-2" title={shoe.name}>
                {shoe.name}
              </h4>
              
              {/* mt-auto đẩy giá tiền dính xuống đáy thẻ */}
              <div className="flex justify-between items-center mt-auto pt-2">
                <p className="text-[16px] font-extrabold text-red-600">
                  {shoe.price?.toLocaleString('vi-VN')} đ
                </p>
              </div>
            </div>

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
  const [keyword, setKeyword] = useState('');

  // 👉 1. THÊM STATE KIỂM TRA ĐĂNG NHẬP
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 👉 2. THÊM HÀM BẮT SỰ KIỆN ẤN ENTER
  const handleSearch = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
      // Khi ấn Enter, chuyển hướng sang trang Search kèm theo từ khóa trên URL
      navigate(`/search?keyword=${keyword.trim()}`);
    }
  };

  // Khởi tạo state rỗng, khớp cấu trúc với HomePageDTO của Backend
  const [homeData, setHomeData] = useState({
    navbarBrands: [],
    navbarCategories: [],
    newArrivals: [],
    featuredProducts: [],
    brandSections: []
  });

  useEffect(() => {
    // 👉 3. KIỂM TRA TOKEN KHI TRANG VỪA LOAD
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Nếu có token thì là true, không có là false

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false); // 👉 Cập nhật lại state sau khi đăng xuất
    toast.success("Đã đăng xuất thành công!");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* NAVBAR STICKY */}
      <div className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <header className="px-10 py-5 flex justify-between items-center border-b border-gray-100">
          <Link to="/home" className="text-2xl font-[900] tracking-tighter">KAI SNEAKER</Link>
          
          <div className="relative w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm... " 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm outline-none focus:ring-1 focus:ring-gray-200" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="flex gap-6 items-center">
            <Link to="/wishlist"><Heart className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors" /></Link>
            <Link to="/cart"><ShoppingBag className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors" /></Link>
            
            <div className="relative group py-2">
              <User className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors" />
              <div className="absolute right-0 top-full w-52 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-[60] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                
                {/* 👉 4. LOGIC TÁCH MENU TÙY THEO TRẠNG THÁI ĐĂNG NHẬP */}
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50"><User className="w-4 h-4"/>Hồ sơ</Link>
                    <Link to="/orders" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50"><ShoppingBag className="w-4 h-4"/>Đơn hàng</Link>
                    <Link to="/history" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50"><ListOrdered className="w-4 h-4"/>Lịch sử mua hàng</Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-sm font-bold text-red-500 rounded-lg hover:bg-red-50"><LogOut className="w-4 h-4"/>Đăng xuất</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50">Đăng nhập</Link>
                    <Link to="/register" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50">Đăng ký</Link>
                  </>
                )}
                {/* KẾT THÚC LOGIC MENU */}

              </div>
            </div>
          </div>
        </header>

        {/* CÁC PHẦN DƯỚI CỦA HEADER VÀ MENU DROPDOWN CŨ GIỮ NGUYÊN 100% */}
        <nav className="px-10 py-0 flex justify-center items-center text-[11px] font-bold tracking-[0.2em] uppercase">
          <div className="flex gap-14">
            <Link to="/new-arrivals" className="hover:text-gray-400 py-5">Sản phẩm mới</Link>
            <Link to="/featured" className="hover:text-gray-400 py-5">Nổi bật</Link>
            
            <div className="relative group">
              <button className="flex items-center gap-2 hover:text-gray-400 uppercase tracking-[0.2em] py-5">
                Brands <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full min-w-[160px] bg-white border border-gray-100 shadow-xl p-2 z-[60] normal-case tracking-normal opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 rounded-b-xl">
                {homeData.navbarBrands?.length > 0 ? (
                  homeData.navbarBrands.map(brand => (
                    <Link key={brand.id} to={`/brand/${brand.id}`} className="block p-3 text-sm rounded-lg hover:bg-gray-50 uppercase whitespace-nowrap">
                      {brand.name}
                    </Link>
                  ))
                ) : (
                  <p className="p-3 text-xs text-gray-400">Đang cập nhật...</p>
                )}
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 hover:text-gray-400 uppercase tracking-[0.2em] py-5">
                Category <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full min-w-[160px] bg-white border border-gray-100 shadow-xl p-2 z-[60] normal-case tracking-normal opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 rounded-b-xl">
                {homeData.navbarCategories?.length > 0 ? (
                  homeData.navbarCategories.map(cat => (
                    <Link key={cat.id} to={`/category/${cat.id}`} className="block p-3 text-sm rounded-lg hover:bg-gray-50 capitalize whitespace-nowrap">
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <p className="p-3 text-xs text-gray-400">Đang cập nhật...</p>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <header className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gray-950">
        <img src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Banner" />
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

      <footer className="border-t border-gray-100 px-10 py-12 flex justify-between items-center text-xs font-medium text-gray-400">
        <p>© 2026 KAI SNEAKER. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6 uppercase tracking-widest">
          <a href="#" className="hover:text-black transition-colors">Instagram</a>
          <a href="#" className="hover:text-black transition-colors">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;