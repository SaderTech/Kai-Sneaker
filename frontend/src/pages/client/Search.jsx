import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Search as SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

// Bê nguyên cái Card xịn xò từ trang Home sang đây để đồng bộ giao diện
const ProductCard = ({ product }) => (
  <div className="group cursor-pointer flex flex-col h-full bg-white p-4 rounded-3xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1">
    <div className="aspect-square bg-[#f8f8f8] relative overflow-hidden rounded-2xl border border-transparent group-hover:border-gray-200 transition-all p-6 flex items-center justify-center">
      <button className="absolute top-4 right-4 z-20 p-2 text-gray-300 opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 hover:scale-110">
        <Heart className="w-5 h-5" />
      </button>

      <img 
        src={product.imageUrls || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"} 
        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
        alt={product.name} 
      />
      
      <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
        <button className="w-full bg-black/90 backdrop-blur-sm text-white py-3.5 text-xs font-bold tracking-widest hover:bg-black shadow-xl rounded-xl">
          THÊM VÀO GIỎ
        </button>
      </div>
    </div>

    <div className="flex flex-col gap-1 px-1 mt-4">
      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{product.brandName}</p>
      <h4 className="text-[14px] font-bold tracking-tight text-gray-900 leading-snug line-clamp-2 min-h-[40px]" title={product.name}>
        {product.name}
      </h4>
      <p className="text-[16px] font-extrabold text-red-600 mt-1">
        {product.price?.toLocaleString('vi-VN')} đ
      </p>
    </div>
  </div>
);

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || ''; // Lấy chữ người dùng gõ từ URL

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State phục vụ phân trang (Pagination)
  const [page, setPage] = useState(0); // Spring Boot bắt đầu từ trang 0
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // GỌI API KHI KEYWORD HOẶC PAGE THAY ĐỔI
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword.trim()) return;

      setLoading(true);
      try {
        // Gọi API thật của sếp: /kaisneaker/home/search?keyword=...&page=...&size=12
        const response = await api.get(`/kaisneaker/home/search`, {
          params: {
            keyword: keyword,
            page: page,
            size: 12 // Lấy 12 đôi giày 1 trang cho đẹp lưới 4 cột
          }
        });
        
        // Đổ dữ liệu từ Spring Data JPA Page vào State
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        toast.error("Không thể lấy dữ liệu tìm kiếm!");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, page]);

  // Xử lý khi người dùng đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt lên đầu trang
    }
  };

  // Nút Search lại ngay tại trang này
  const handleNewSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(0); // Reset về trang 1
      setSearchParams({ keyword: e.target.value });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      

      <main className="px-10 py-16 max-w-[1600px] mx-auto">
        <div className="mb-12 border-b-2 border-gray-100 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-[200] tracking-tight mb-2">
              KẾT QUẢ TÌM KIẾM CHO: <span className="font-bold italic text-black">"{keyword}"</span>
            </h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
              Tìm thấy <span className="text-black font-bold">{totalElements}</span> sản phẩm
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Lưới sản phẩm */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(shoe => (
                <ProductCard key={shoe.id} product={shoe} />
              ))}
            </div>

            {/* Phân trang (Pagination) */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-20">
                <button 
                  onClick={() => handlePageChange(page - 1)} 
                  disabled={page === 0}
                  className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(idx)}
                      className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${page === idx ? 'bg-black text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(page + 1)} 
                  disabled={page === totalPages - 1}
                  className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Trạng thái trống (Không tìm thấy) */
          <div className="text-center py-32">
            <SearchIcon className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm nào!</h2>
            <p className="text-gray-500 mb-8">Xin lỗi, chúng tôi không thể tìm thấy đôi giày nào khớp với từ khóa "{keyword}".</p>
            <Link to="/home" className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black/90 transition-all">
              KHÁM PHÁ SẢN PHẨM MỚI
            </Link>
          </div>
        )}
      </main>

    </div>
  );
};

export default Search;