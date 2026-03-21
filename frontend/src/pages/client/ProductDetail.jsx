import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus, Loader2, MessageSquare, Info, Tag } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/kaisneaker/products/${id}`);
        setProduct(res.data);
        const firstAvailable = res.data.variants.find(v => v.quantity > 0);
        if (firstAvailable) setSelectedSize(firstAvailable.size);
      } catch (error) {
        toast.error("Không tìm thấy sản phẩm!");
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

const handleAddToCart = async () => {
  if (!localStorage.getItem('token')) {
    toast.error("Vui lòng đăng nhập!");
    navigate('/login');
    return;
  }
  if (!selectedSize) {
    toast.error("Vui lòng chọn size!");
    return;
  }

  // ✅ Tìm variant thực tế từ size sếp chọn
const selectedVariant = product.variants.find(v => v.size === selectedSize);
  if (!selectedVariant) return;

setIsAdding(true);
  try {
    await api.post('/kaisneaker/carts/add', {
      variantId: selectedVariant.id, 
      quantity: quantity
    });
    toast.success("🛒 Đã ném vào giỏ thành công!");
  } catch (error) {
    toast.error(error.response?.data?.message || "Lỗi hệ thống!");
  } finally {
    setIsAdding(false);
  }
};

  const handleSubmitReview = async () => {
    if (!newComment.trim()) return toast.error("Bạn chưa nhập bình luận kìa!");
    setSubmitting(true);
    try {
      await api.post(`/kaisneaker/reviews`, {
        productId: id,
        rating: newRating,
        comment: newComment
      });
      toast.success("Đã đăng bình luận thành công!");
      setNewComment("");
      setNewRating(5);
      // Tùy chọn: Gọi lại API fetchProduct để cập nhật danh sách review
    } catch (error) {
      toast.error("Vui lòng đăng nhập để bình luận bạn ơi!");
    } finally {
      setSubmitting(false);
    }
  };

  const getUniqueColors = () => {
    if (!product?.variants) return "Tiêu chuẩn";
    const colors = [...new Set(product.variants.map(v => v.color))].filter(Boolean);
    return colors.length > 0 ? colors.join(", ") : "Tiêu chuẩn";
  };

  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000";
    const finalUrl = Array.isArray(url) ? url[0] : url;
    return finalUrl.startsWith('http') ? finalUrl : `http://localhost:8080${finalUrl}`;
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10">
        <Breadcrumb items={[{ label: product.name }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-8">
          {/* GALLERY ẢNH */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square bg-[#f6f6f6] rounded-[40px] overflow-hidden p-12 group flex items-center justify-center">
              <img src={getImageUrl(product.imageUrls[activeImage])} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" alt={product.name} />
            </div>
            <div className="grid grid-cols-5 gap-4">
              {product.imageUrls.map((img, idx) => (
                <div key={idx} onClick={() => setActiveImage(idx)} className={`aspect-square bg-[#f6f6f6] rounded-2xl p-2 cursor-pointer border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent opacity-60'}`}>
                  <img src={getImageUrl(img)} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              ))}
            </div>
          </div>

          {/* MUA HÀNG & THÔNG TIN */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <p className="text-gray-400 font-bold tracking-[0.2em] text-[10px] uppercase">{product.brandName}</p>
              <h1 className="text-4xl font-[900] tracking-tight text-gray-900 leading-tight uppercase">{product.name}</h1>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-3xl font-black text-red-600">{product.price?.toLocaleString('vi-VN')} đ</span>
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm font-bold">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {product.averageRating}
                </div>
              </div>
            </div>

            {/* CHỌN SIZE */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-4">Chọn Size</h4>
              <div className="grid grid-cols-4 gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id} disabled={v.quantity === 0}
                    onClick={() => setSelectedSize(v.size)}
                    className={`py-4 rounded-xl text-sm font-bold transition-all border-2 ${selectedSize === v.size ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'} ${v.quantity === 0 ? 'opacity-30 cursor-not-allowed bg-gray-50 grayscale' : ''}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center border-2 border-gray-100 rounded-xl px-2 bg-white">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:text-red-600"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-2 hover:text-green-600"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAddToCart} disabled={isAdding} className="flex-1 bg-black text-white py-5 rounded-2xl font-bold tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl uppercase">
                {isAdding ? <Loader2 className="animate-spin" /> : <ShoppingCart className="w-5 h-5" />} THÊM VÀO GIỎ
              </button>
            </div>

            {/* THÔNG SỐ CHI TIẾT & MÔ TẢ */}
            <div className="pt-8 border-t border-gray-100 space-y-8">
               <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Thông số sản phẩm
                  </h4>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                     <div className="flex justify-between border-b border-gray-200 pb-3">
                        <span className="text-gray-400 text-[10px] font-bold uppercase">Thương hiệu</span>
                        <span className="text-black text-[10px] font-black uppercase">{product.brandName}</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-3">
                        <span className="text-gray-400 text-[10px] font-bold uppercase">Dòng (Category)</span>
                        <span className="text-black text-[10px] font-black uppercase">{product.categoryName}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400 text-[10px] font-bold uppercase">Màu sắc</span>
                        <span className="text-black text-[10px] font-black uppercase">{getUniqueColors()}</span>
                     </div>
                  </div>
               </div>

               <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Mô tả chi tiết
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                    {product.description || "Đôi giày tuyệt vời dành cho bạn."}
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* PHẦN ĐÁNH GIÁ (REVIEWS) */}
        <section className="mt-32 border-t border-gray-100 pt-20">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
                <MessageSquare className="w-8 h-8" /> ĐÁNH GIÁ THỰC TẾ
              </h3>
              <p className="text-gray-400 text-sm italic">Cảm nhận từ những người đã sở hữu siêu phẩm này.</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black italic">{product.averageRating}</div>
              <div className="flex gap-1 justify-end text-yellow-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'fill-current' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* FORM GỬI ĐÁNH GIÁ */}
          {product.canReview ? (
            <div className="bg-gray-50 rounded-[32px] p-8 mb-12 border border-gray-100 shadow-sm">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                <Star className="w-4 h-4 fill-black" /> VIẾT ĐÁNH GIÁ CỦA Bạn
              </h4>
              <div className="space-y-6">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => setNewRating(num)} type="button">
                      <Star className={`w-6 h-6 ${num <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-gray-400">{newRating}/5 sao</span>
                </div>
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Chia sẻ cảm nhận thực tế của bạn..."
                  className="w-full h-32 p-6 rounded-2xl border border-gray-200 outline-none focus:ring-1 focus:ring-black transition-all text-sm"
                />
                <button 
                  onClick={handleSubmitReview} 
                  disabled={submitting}
                  className="bg-black text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Đang gửi..." : "GỬI ĐÁNH GIÁ"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/30 border border-blue-100 rounded-[32px] p-8 mb-12 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-2xl text-white shadow-lg shadow-blue-200"><ShoppingCart className="w-5 h-5" /></div>
                <div>
                  <h5 className="font-black text-blue-900 uppercase text-xs tracking-tight">Bạn chưa sở hữu đôi giày này?</h5>
                  <p className="text-blue-700/60 text-[10px] font-bold">Mua hàng để được để lại đánh giá thực tế bạn nhé!</p>
                </div>
              </div>
              <button onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all">MUA NGAY</button>
            </div>
          )}

          {/* DANH SÁCH REVIEWS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews?.length > 0 ? product.reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-8 rounded-[32px] border border-gray-50 hover:border-gray-200 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">{rev.reviewerName}</h5>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed italic">"{rev.comment}"</p>
              </div>
            )) : (
              <div className="col-span-2 text-center py-12 bg-gray-50 rounded-[40px] text-gray-400 text-sm italic">Sản phẩm này chưa có đánh giá. Trở thành người đầu tiên nhé!</div>
            )}
          </div>
        </section>

        {/* SẢN PHẨM LIÊN QUAN */}
        <section className="mt-32">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-10 border-l-4 border-black pl-4">CÓ THỂ Bạn CŨNG THÍCH</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {product.relatedProducts?.map((item) => (
              <div key={item.id} onClick={() => navigate(`/products/${item.id}`)} className="group cursor-pointer">
                 <div className="aspect-square bg-[#f9f9f9] rounded-[32px] p-8 mb-4 overflow-hidden border border-transparent group-hover:border-gray-100 transition-all">
                    <img src={getImageUrl(item.imageUrls)} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-all duration-500" alt={item.name} />
                 </div>
                 <h4 className="font-bold text-xs line-clamp-1 uppercase tracking-tight">{item.name}</h4>
                 <p className="text-red-600 font-black mt-1 text-sm">{item.price?.toLocaleString('vi-VN')} đ</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;