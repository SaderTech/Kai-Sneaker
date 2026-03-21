import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const ProductCard = ({ product, isLiked, onToggleWishlist }) => {
  const navigate = useNavigate();
  const isOutOfStock = product.totalQuantity <= 0;

  // 👉 HÀM LẤY ẢNH "VÉT MÁNG" TỐI THƯỢNG
  const getImageUrl = (imgData) => {
    // 1. Tìm trong mọi ngóc ngách xem sếp giấu cái link ảnh ở biến nào
    // (Bao luôn cả th sếp truyền cả object product vào)
    const data = imgData?.imageUrls || imgData?.images || imgData?.imageUrl || imgData?.image || imgData;

    // 2. Nếu null, undefined hoặc mảng rỗng -> Dùng ảnh fake
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600";
    }

    // 3. Nếu là mảng thì lấy cái ảnh đầu tiên, nếu là chuỗi thì lấy luôn
    // (Xử lý trường hợp có Object Image bên trong mảng)
    let path = Array.isArray(data) ? data[0] : data;
    
    // Nếu trong mảng lại là Object (ví dụ: [{url: '/abc.jpg'}]) thì lấy đường dẫn
    if (typeof path === 'object' && path !== null) {
        path = path.url || path.imageUrl || path.path;
    }

    // 4. Nối đuôi localhost vào nếu là link tương đối
    if (typeof path === 'string' && path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  return (
    /* 👉 QUAN TRỌNG: h-full giúp thẻ luôn cao bằng thằng cao nhất trong hàng */
    <div 
      onClick={() => !isOutOfStock && navigate(`/products/${product.id}`)}
      className={`group cursor-pointer flex flex-col h-full bg-white p-4 rounded-3xl border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 ${isOutOfStock ? 'opacity-70' : ''}`}
    >
      {/* KHUNG ẢNH: Cố định aspect-square */}
      <div className="aspect-square bg-[#f8f8f8] relative overflow-hidden rounded-2xl border border-transparent group-hover:border-gray-200 transition-all p-6 flex items-center justify-center flex-shrink-0">
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-2xl">
              HẾT HÀNG
            </span>
          </div>
        )}

        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 z-30 p-2 transition-all hover:scale-125"
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-gray-300"}`} />
        </button>

        <img 
  src={getImageUrl(product)} 
  className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-110'}`} 
  alt={product.name} 
/>
        
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <button disabled={isOutOfStock} className={`w-full py-3.5 text-xs font-bold tracking-widest shadow-xl rounded-xl transition-all ${isOutOfStock ? 'bg-gray-200 text-gray-400' : 'bg-black text-white hover:bg-gray-900'}`}>
            {isOutOfStock ? "SOLD OUT" : "THÊM VÀO GIỎ"}
          </button>
        </div>
      </div>

      {/* 👉 KHU VỰC THÔNG TIN: Dùng flex-grow để đẩy giá xuống đáy */}
      <div className="flex flex-col flex-grow gap-1 px-1 mt-4">
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{product.brandName}</p>
        
        {/* 👉 FIX CỨNG CHIỀU CAO TÊN: Dù 1 hay 2 dòng thì vẫn cao 40px */}
        <h4 className={`text-[14px] font-bold tracking-tight leading-snug line-clamp-2 min-h-[40px] mb-2 ${isOutOfStock ? 'text-gray-300' : 'text-gray-900'}`} title={product.name}>
          {product.name}
        </h4>

        {/* 👉 GIÁ TIỀN: Luôn nằm ở đáy thẻ nhờ mt-auto */}
        <div className="mt-auto">
            <p className={`text-[16px] font-extrabold ${isOutOfStock ? 'text-gray-300' : 'text-red-600'}`}>
                {product.price?.toLocaleString('vi-VN')} đ
            </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;