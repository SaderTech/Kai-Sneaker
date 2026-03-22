import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Search as SearchIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import ProductCard from '../../components/client/ProductCard';


const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedIds, setLikedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword.trim()) return;
      setLoading(true);
      try {
        const response = await api.get(`/kaisneaker/home/search`, {
          params: { keyword, page, size: 12 }
        });
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);

        const initialLiked = response.data.content
          .filter(p => p.favorite === true)
          .map(p => p.id);
        setLikedIds(initialLiked);

      } catch (error) {
        toast.error("Không thể lấy dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [keyword, page]);

  const handleToggleWishlist = async (productId) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await api.post(`/kaisneaker/wishlist/${productId}`);
      setLikedIds(prev => {
        const isCurrentlyLiked = prev.includes(productId);
        if (isCurrentlyLiked) {
          toast.success("Đã xóa khỏi yêu thích", { id: 'wish-msg' });
          return prev.filter(id => id !== productId);
        } else {
          toast.success("Đã thêm vào yêu thích", { id: 'wish-msg' });
          return [...prev, productId];
        }
      });
    } catch (error) {
      toast.error("Vui lòng đăng nhập!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      <main className="px-10 py-16 max-w-[1600px] mx-auto">
        <div className="mb-12 border-b-2 border-gray-100 pb-6">
          <h1 className="text-3xl font-[200] tracking-tight mb-2">
            KẾT QUẢ CHO: <span className="font-bold italic">"{keyword}"</span>
          </h1>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            Tìm thấy <span className="text-black font-bold">{totalElements}</span> sản phẩm
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
  {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isLiked={likedIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-20">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0} className="p-3 border rounded-full hover:bg-black hover:text-white disabled:opacity-20"><ChevronLeft className="w-5 h-5" /></button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button key={idx} onClick={() => handlePageChange(idx)} className={`w-10 h-10 rounded-full text-sm font-bold ${page === idx ? 'bg-black text-white' : 'bg-gray-50 text-gray-500'}`}>{idx + 1}</button>
                  ))}
                </div>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} className="p-3 border rounded-full hover:bg-black hover:text-white disabled:opacity-20"><ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32">
            <SearchIcon className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm!</h2>
            <Link to="/home" className="text-xs font-bold uppercase underline">Quay lại trang chủ</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;