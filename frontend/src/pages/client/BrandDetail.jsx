import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Loader2, ChevronDown, Filter, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb';
import ProductCard from '../../components/client/ProductCard';


const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [brandInfo, setBrandInfo] = useState(null);
  const [products, setProducts] = useState([]);
  
  const [filters, setFilters] = useState({
    categoryId: '',
    priceRange: '',
    size: '',
    sortBy: 'newest',
    page: 0,
    sizePage: 12
  });

  const [likedIds, setLikedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');


const getImageUrl = (url) => {
  if (!url) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400";
  if (url.startsWith('http')) return url;
  
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `http://localhost:8080${cleanUrl}`; 
};

  useEffect(() => {
    const fetchBrandDetail = async () => {
      setLoading(true);
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value !== '')
        );
const res = await api.get(`/kaisneaker/brands/${id}`, { params: cleanFilters });        

        setBrandInfo(res.data.brand || res.data); 
        const productList = res.data.products?.content || res.data.products || [];
        setProducts(productList);

        setLikedIds(productList.filter(p => p.favorite === true).map(p => p.id));
      } catch (error) {
        console.error("Lỗi tải trang Brand:", error);
        toast.error("Không thể tải thông tin thương hiệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandDetail();
  }, [id, filters]); 

  const handleToggleWishlist = async (productId) => {
    if (!isLoggedIn) {
      toast.error("Sếp vui lòng đăng nhập để thả tim nhé!");
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await api.post(`/kaisneaker/wishlist/${productId}`);
      setLikedIds(prev => {
        const isLiked = prev.includes(productId);
        if (isLiked) {
          toast.success("Đã xóa khỏi yêu thích", { id: 'wishlist-msg' });
          return prev.filter(pId => pId !== productId);
        } else {
          toast.success("Đã thêm vào yêu thích", { id: 'wishlist-msg' });
          return [...prev, productId];
        }
      });
    } catch (error) {
      toast.error("Lỗi cập nhật yêu thích!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 })); 
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="relative h-[40vh] bg-gray-950 flex items-center justify-center overflow-hidden">
        <img 
  src={getImageUrl(brandInfo?.imageUrl)} 
  alt="Brand Cover" 
  className="absolute inset-0 w-full h-full object-cover opacity-40" 
/>
        <div className="absolute top-8 left-10 z-10">
          <Link to="/home" className="flex items-center gap-2 text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:text-gray-300 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-7xl font-[900] tracking-tighter uppercase drop-shadow-xl">{brandInfo?.name || 'BRAND'}</h1>
          <p className="mt-4 text-sm font-medium text-gray-300 max-w-xl mx-auto line-clamp-2">
            {brandInfo?.description || "Khám phá bộ sưu tập mới nhất."}
          </p>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-10 py-16 flex gap-12">

        <aside className="w-64 flex-shrink-0 space-y-10 hidden lg:block">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-lg mb-6 uppercase tracking-widest border-b border-black pb-[26px]" >
              <Filter className="w-5 h-5" /> Bộ Lọc
            </h3>

            {brandInfo?.availableCategories?.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Danh Mục</h4>
                <div className="space-y-3 text-sm text-gray-500 font-medium">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" name="categoryId"
                      checked={filters.categoryId === ''}
                      onChange={() => handleFilterChange('categoryId', '')} 
                      className="accent-black w-4 h-4"
                    />
                    <span className={filters.categoryId === '' ? 'text-black font-bold' : 'group-hover:text-black'}>Tất cả</span>
                  </label>
                  
                  {brandInfo.availableCategories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" name="categoryId"
                        checked={filters.categoryId === cat.id}
                        onChange={() => handleFilterChange('categoryId', cat.id)} 
                        className="accent-black w-4 h-4"
                      />
                      <span className={filters.categoryId === cat.id ? 'text-black font-bold' : 'group-hover:text-black transition-colors'}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {brandInfo?.priceFilters?.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Mức Giá</h4>
                <div className="space-y-3 text-sm text-gray-500 font-medium">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" name="priceRange"
                      checked={filters.priceRange === ''}
                      onChange={() => handleFilterChange('priceRange', '')} 
                      className="accent-black w-4 h-4"
                    />
                    <span className={filters.priceRange === '' ? 'text-black font-bold' : 'group-hover:text-black'}>Tất cả</span>
                  </label>
                  
                  {brandInfo.priceFilters.map((price, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" name="priceRange"
                        checked={filters.priceRange === (price.value || price)}
                        onChange={() => handleFilterChange('priceRange', (price.value || price))} 
                        className="accent-black w-4 h-4"
                      />
                      <span className={filters.priceRange === (price.value || price) ? 'text-black font-bold' : 'group-hover:text-black transition-colors'}>
                        {price.label || price} 
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {brandInfo?.availableSizes?.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {brandInfo.availableSizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-lg text-xs font-bold transition-all ${
                        filters.size === size 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </aside>

        <div className="flex-1">
            <Breadcrumb 
      items={[
        { label: brandInfo?.name || 'Loading...' }
      ]} 
    />
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <p className="text-sm font-medium text-gray-400">
              Hiển thị <span className="text-black font-bold">{products.length}</span> sản phẩm
            </p>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span>SẮP XẾP THEO:</span>
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="p-2 border border-gray-200 rounded-lg outline-none focus:border-black cursor-pointer bg-transparent"
              >
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá: Thấp đến Cao</option>
                <option value="priceDesc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
  {products.map((product) => (
    <div key={product.id} className="h-auto w-full"> 
      <ProductCard 
        product={product} 
        isLiked={likedIds.includes(product.id)}
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  ))}
</div>
          ) : (
             <div className="text-center py-32 text-gray-400 font-medium tracking-wide">
               Không tìm thấy sản phẩm nào phù hợp sếp ơi!
             </div>
          )}

          <div className="flex justify-center mt-16 gap-2">
             <button 
                disabled={filters.page === 0}
                onClick={() => handleFilterChange('page', filters.page - 1)}
                className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase disabled:opacity-50 hover:bg-black hover:text-white transition-all"
              >
               Trang trước
             </button>
             <button 
                onClick={() => handleFilterChange('page', filters.page + 1)}
                className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase hover:bg-black hover:text-white transition-all"
              >
               Trang sau
             </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandDetail;