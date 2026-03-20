import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2, ArrowLeft, Filter } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Featured = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 1. Thêm State Filters
  const [filters, setFilters] = useState({
    categoryId: '',
    brandId: '',
    priceRange: '',
    size: ''
  });

  const [likedIds, setLikedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  // Hàm cập nhật filter
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); 
  };

  const getImageUrl = (product) => {
    const imgPath = product.imageUrls || product.imageUrl || product.image;
    if (!imgPath) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400";
    if (imgPath.startsWith('http')) return imgPath;
    return `http://localhost:8080${imgPath}`; 
  };

   useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/kaisneaker/categories/all'), 
          api.get('/kaisneaker/brands/all')
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (error) {
        console.error("Lỗi tải danh mục/hãng");
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        );

        const res = await api.get('/kaisneaker/products/featured', {
          params: { ...cleanFilters, page: page, sizePage: 12 }
        });
        
        const productList = res.data.content || res.data || [];
        setProducts(productList);
        setTotalPages(res.data.totalPages || 0);
        setLikedIds(productList.filter(p => p.favorite === true).map(p => p.id));
      } catch (error) {
        toast.error("Không thể tải sản phẩm nổi bật!");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [page, filters]); // Chạy lại khi chuyển trang hoặc đổi lọc

  const handleToggleWishlist = async (productId) => {
    if (!isLoggedIn) {
      toast.error("Sếp vui lòng đăng nhập để thả tim nhé!");
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await api.post(`/kaisneaker/wishlist/${productId}`);
      setLikedIds(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
      toast.success("Đã cập nhật yêu thích");
    } catch (error) {
      toast.error("Lỗi cập nhật yêu thích!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="relative h-[40vh] bg-gray-950 flex items-center justify-center overflow-hidden">
        <div className="absolute top-8 left-10 z-10">
          <Link to="/home" className="flex items-center gap-2 text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:text-gray-300">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
        <div className="relative text-center text-white z-10">
          <p className="text-xs font-bold tracking-[0.5em] mb-4 text-gray-400">BEST SELLERS</p>
          <h1 className="text-7xl font-[900] tracking-tighter uppercase drop-shadow-xl italic">FEATURED PRODUCTS</h1>
        </div>
      </header>

      {/* THÊM FLEX GAP-12 ĐỂ CHỨA SIDEBAR */}
      <main className="max-w-[1600px] mx-auto px-10 py-16 flex gap-12">
        
        {/* SIDEBAR BÊN TRÁI */}
        <aside className="w-64 flex-shrink-0 space-y-10 hidden lg:block">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-lg mb-8 uppercase tracking-widest border-b border-black pb-4">
              <Filter className="w-5 h-5" /> Bộ Lọc
            </h3>
            
             {/* 👉 LỌC THEO HÃNG (BRAND) */}
          <div className="mb-8">
            <h4 className="font-bold mb-4 uppercase tracking-widest text-black">Thương Hiệu</h4>
            <div className="space-y-3 text-gray-500 font-medium max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" checked={filters.brandId === ''} onChange={() => handleFilterChange('brandId', '')} className="accent-black w-4 h-4" />
                <span className={filters.brandId === '' ? 'text-black font-bold' : 'group-hover:text-black'}>Tất cả</span>
              </label>
              {brands.map(brand => (
                <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" checked={filters.brandId === brand.id} onChange={() => handleFilterChange('brandId', brand.id)} className="accent-black w-4 h-4" />
                  <span className={filters.brandId === brand.id ? 'text-black font-bold' : 'group-hover:text-black'}>{brand.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 👉 LỌC THEO DANH MỤC (CATEGORY) */}
          <div className="mb-8">
            <h4 className="font-bold mb-4 uppercase tracking-widest text-black">Loại Giày</h4>
            <div className="space-y-3 text-gray-500 font-medium">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" checked={filters.categoryId === ''} onChange={() => handleFilterChange('categoryId', '')} className="accent-black w-4 h-4" />
                <span className={filters.categoryId === '' ? 'text-black font-bold' : 'group-hover:text-black'}>Tất cả</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" checked={filters.categoryId === cat.id} onChange={() => handleFilterChange('categoryId', cat.id)} className="accent-black w-4 h-4" />
                  <span className={filters.categoryId === cat.id ? 'text-black font-bold' : 'group-hover:text-black'}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

            {/* Lọc Giá */}
            <div className="mb-8">
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Mức Giá</h4>
              <div className="space-y-3 text-sm text-gray-500 font-medium">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="priceRange" checked={filters.priceRange === ''} onChange={() => handleFilterChange('priceRange', '')} className="accent-black w-4 h-4" />
                  <span className={filters.priceRange === '' ? 'text-black font-bold' : 'group-hover:text-black'}>Tất cả</span>
                </label>
                {['Dưới 1 triệu', '1 - 3 triệu', 'Trên 3 triệu'].map((range) => (
                  <label key={range} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="priceRange" checked={filters.priceRange === range} onChange={() => handleFilterChange('priceRange', range)} className="accent-black w-4 h-4" />
                    <span className={filters.priceRange === range ? 'text-black font-bold' : 'group-hover:text-black'}>{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lọc Size */}
            <div className="mb-8">
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Size</h4>
              <div className="flex flex-wrap gap-2">
                {['36', '37', '38', '39', '40', '41', '42', '43'].map((size) => (
                  <button key={size} onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                    className={`w-10 h-10 flex items-center justify-center border rounded-lg text-xs font-bold transition-all ${
                      filters.size === size ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black'
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* NỘI DUNG SẢN PHẨM BÊN PHẢI */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <p className="text-sm font-medium text-gray-400">Khám phá những mẫu giày nổi bật nhất hiện nay.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="group flex flex-col h-full cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    <div className="relative aspect-square bg-[#f9f9f9] rounded-[32px] overflow-hidden mb-5 p-6 border border-transparent group-hover:border-gray-100 transition-all">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleWishlist(product.id); }} className="absolute top-4 right-4 z-30 p-2">
                        <Heart className={`w-5 h-5 ${likedIds.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
                      </button>
                      <img src={getImageUrl(product)} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-all duration-700" alt={product.name} />
                      <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                        <button className="w-full bg-black/90 text-white py-3.5 text-xs font-bold rounded-xl">THÊM VÀO GIỎ</button>
                      </div>
                    </div>
                    <div className="px-2">
                      <p className="text-[11px] text-gray-400 font-bold uppercase mb-1">{product.brandName || 'SNEAKER'}</p>
                      <h3 className="font-bold text-gray-900 text-[14px] line-clamp-2">{product.name}</h3>
                      <p className="text-[16px] font-extrabold text-red-600 mt-2">{product.price?.toLocaleString('vi-VN')} đ</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-16 gap-2">
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase hover:bg-black hover:text-white transition-all">Trang trước</button>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase hover:bg-black hover:text-white transition-all">Trang sau</button>
                </div>
              )}
            </>
          ) : (
             <div className="text-center py-32 text-gray-400 font-medium">Hiện chưa có sản phẩm nổi bật nào!</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Featured;