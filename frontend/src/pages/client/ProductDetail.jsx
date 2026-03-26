import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus, Ruler, X, Loader2, MessageSquare, Info, Tag } from 'lucide-react';
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
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) setShowSizeGuide(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (window.location.hash === '#reviews') {
      setTimeout(() => {
        const element = document.getElementById('reviews');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [product]);

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
    if (!selectedSize) return toast.error("Vui lòng chọn size!");

    const selectedVariant = product.variants.find(v => v.size === selectedSize);
    if (!selectedVariant) return;

    setIsAdding(true);
    try {
      await api.post('/kaisneaker/carts/add', {
        variantId: selectedVariant.id,
        quantity: quantity
      });
      toast.success(" Đã thêm vào giỏ thành công!");
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
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || "Lỗi rồi sếp!";
      toast.error(msg);
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

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-black" /></div>;

  return (
    <div className="min-h-screen bg-white pb-24 font-sans">
      <main className="max-w-[1300px] mx-auto px-6 lg:px-10 pt-10">
        <Breadcrumb items={[{ label: product.name }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-8">

          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-square bg-[#f8f8f8] rounded-[40px] overflow-hidden p-12 group flex items-center justify-center border border-gray-100">
              <img src={getImageUrl(product.imageUrls[activeImage])} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" alt={product.name} />
            </div>
            <div className="grid grid-cols-5 gap-4">
              {product.imageUrls.map((img, idx) => (
                <div key={idx} onClick={() => setActiveImage(idx)} className={`aspect-square bg-[#f8f8f8] rounded-2xl p-2 cursor-pointer border-2 transition-all hover:border-gray-300 ${activeImage === idx ? 'border-black' : 'border-transparent opacity-60'}`}>
                  <img src={getImageUrl(img)} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-10">

            <div className="space-y-4">
              <p className="text-gray-400 font-bold tracking-[0.2em] text-[10px] uppercase">{product.brandName}</p>
              <h1 className="text-4xl font-[900] tracking-tight text-gray-900 leading-tight uppercase">{product.name}</h1>
              <div className="flex items-center gap-6 pt-2">
                <span className="text-3xl font-black text-red-600">{product.price?.toLocaleString('vi-VN')} đ</span>
                <div className="flex items-center gap-1.5 bg-gray-50 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-100">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.averageRating} <span className="text-gray-400 font-medium text-xs ml-1">({product.reviews?.length || 0})</span></span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-bold uppercase tracking-widest text-xs text-gray-900">Chọn Kích Cỡ</h4>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-all"
                >
                  <Ruler className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span className="border-b border-gray-300 group-hover:border-black transition-colors pb-0.5">Bảng Size</span>
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id} disabled={v.quantity === 0}
                    onClick={() => setSelectedSize(v.size)}
                    className={`py-3.5 rounded-xl text-sm font-bold transition-all border-2 ${selectedSize === v.size ? 'bg-black text-white border-black shadow-md scale-[1.02]' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-black'} ${v.quantity === 0 ? 'opacity-40 cursor-not-allowed bg-gray-100 grayscale' : ''}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between border-2 border-gray-100 rounded-2xl px-2 py-1 bg-white sm:w-32">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-400 hover:text-black transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center font-black text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-400 hover:text-black transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-black text-white py-5 rounded-2xl font-bold tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 uppercase disabled:opacity-70"
              >
                {isAdding ? <Loader2 className="animate-spin" /> : <ShoppingCart className="w-5 h-5" />} THÊM VÀO GIỎ
              </button>
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-8">
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-400" /> Thông số sản phẩm
                </h4>
                <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100 shadow-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-3">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Thương hiệu</span>
                    <span className="text-black text-[10px] font-black uppercase tracking-widest">{product.brandName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-3">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Dòng (Category)</span>
                    <span className="text-black text-[10px] font-black uppercase tracking-widest">{product.categoryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Màu sắc</span>
                    <span className="text-black text-[10px] font-black uppercase tracking-widest">{getUniqueColors()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" /> Mô tả chi tiết
                </h4>
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                    {product.description || "Đôi giày tuyệt vời dành cho bạn. Nhanh tay chốt đơn ngay hôm nay!"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <section id="reviews" className="mt-24 border-t border-gray-100 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
                <MessageSquare className="w-7 h-7" /> ĐÁNH GIÁ THỰC TẾ
              </h3>
              <p className="text-gray-400 text-sm font-medium">Cảm nhận từ những người đã sở hữu siêu phẩm này.</p>
            </div>
            <div className="text-left md:text-right bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100">
              <div className="text-4xl font-black italic text-gray-900">{product.averageRating} <span className="text-lg text-gray-400">/ 5</span></div>
              <div className="flex gap-1 justify-start md:justify-end text-yellow-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'fill-current' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>
          </div>

          {product.canReview ? (
            <div className="bg-white rounded-[32px] p-8 mb-12 border border-gray-100 shadow-xl shadow-gray-100/50">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                <Star className="w-4 h-4 fill-black text-black" /> VIẾT ĐÁNH GIÁ CỦA Bạn
              </h4>
              <div className="space-y-6">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => setNewRating(num)} type="button" className="hover:scale-110 transition-transform">
                      <Star className={`w-7 h-7 ${num <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                  <span className="ml-3 mt-1 text-sm font-bold text-gray-400">{newRating}/5 sao</span>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Chia sẻ cảm nhận thực tế của bạn về chất liệu, độ êm, form dáng..."
                  className="w-full h-32 p-6 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-1 focus:ring-black transition-all text-sm font-medium resize-none custom-scrollbar"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="bg-black text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50"
                >
                  {submitting ? "ĐANG GỬI..." : "GỬI ĐÁNH GIÁ"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/50 border border-blue-100 rounded-[32px] p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-blue-500 p-4 rounded-2xl text-white shadow-lg shadow-blue-200"><ShoppingCart className="w-6 h-6" /></div>
                <div>
                  <h5 className="font-black text-blue-900 uppercase text-sm tracking-tight mb-1">Bạn chưa sở hữu siêu phẩm này?</h5>
                  <p className="text-blue-700/70 text-xs font-bold">Chốt đơn ngay để được để lại đánh giá thực tế bạn nhé!</p>
                </div>
              </div>
              <button onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md">
                MUA NGAY
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews?.length > 0 ? product.reviews.map((rev) => (
              <div key={rev.id} className="bg-gray-50 p-8 rounded-[32px] border border-transparent hover:border-gray-200 hover:bg-white transition-all shadow-sm">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">{rev.reviewerName}</h5>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="flex gap-0.5 bg-white px-2 py-1 rounded-full border border-gray-100">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">"{rev.comment}"</p>
              </div>
            )) : (
              <div className="col-span-1 md:col-span-2 text-center py-16 bg-gray-50 rounded-[40px] text-gray-400 text-sm font-medium border border-dashed border-gray-200">
                Sản phẩm này chưa có đánh giá. Trở thành người đầu tiên sở hữu nhé!
              </div>
            )}
          </div>
        </section>

        <section className="mt-24 border-t border-gray-100 pt-16">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-10 border-l-4 border-black pl-4">CÓ THỂ BẠN CŨNG THÍCH</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {product.relatedProducts?.map((item) => (
              <div key={item.id} onClick={() => navigate(`/products/${item.id}`)} className="group cursor-pointer">
                <div className="aspect-square bg-[#f8f8f8] rounded-[32px] p-6 lg:p-8 mb-4 overflow-hidden border border-transparent group-hover:border-gray-200 group-hover:bg-white transition-all shadow-sm">
                  <img src={getImageUrl(item.imageUrls)} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-all duration-500" alt={item.name} />
                </div>
                <h4 className="font-bold text-xs lg:text-sm line-clamp-1 uppercase tracking-tight text-gray-900">{item.name}</h4>
                <p className="text-red-600 font-black mt-1.5 text-sm">{item.price?.toLocaleString('vi-VN')} đ</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {showSizeGuide && (
        <div
          className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="relative bg-white p-2 rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300 overflow-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-gray-500 hover:text-black hover:scale-110 transition-all z-10 shadow-lg border border-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-4 flex flex-col items-center">
              <div className="text-center mb-8 mt-6">
                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">BẢNG QUY ĐỔI KÍCH CỠ</h4>
                <p className="text-gray-500 text-sm mt-1">Đo chiều dài chân để chọn size chuẩn nhất nhé bạn!</p>
              </div>
              <img
                src="https://sneakerdaily.vn/wp-content/uploads/2024/01/bang-size-giay-va-cach-quy-doi.jpg"
                alt="Bảng size"
                className="w-full h-auto object-contain rounded-xl shadow-inner border border-gray-100"
              />
              <p className="text-xs text-gray-400 mt-6 text-center italic max-w-md mx-auto">
                *Lưu ý: Nếu chân bè hoặc mu bàn chân cao, sếp nên tăng 0.5 - 1 size để đi thoải mái hơn.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;