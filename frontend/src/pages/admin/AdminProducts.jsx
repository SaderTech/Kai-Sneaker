import React, { useState, useEffect } from 'react';
import {ArrowLeft, LayoutDashboard, Package, Plus, Pencil, Trash2, Search, Loader2, RefreshCw, Image as ImageIcon, X, Layers } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho Modal Sản phẩm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate()
  // State cho Hãng và Danh mục (Để đổ vào Dropdown)
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // State cho Modal Biến thể (Size & Kho)
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [variants, setVariants] = useState([]); 
  const [newVariants, setNewVariants] = useState([]);
  const [updatingStockId, setUpdatingStockId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', price: '', description: '', brandId: '', categoryId: '', images: null
  });

  // 1. LẤY DỮ LIỆU TỪ BACKEND
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/kaisneaker/admin/products');
      const dataList = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setProducts(dataList);
      
      if (currentProduct) {
        const updatedProd = dataList.find(p => p.id === currentProduct.id);
        if (updatedProd) setVariants(updatedProd.variants || []);
      }
    } catch (error) {
      toast.error("Không tải được danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandsAndCategories = async () => {
    try {
      const [brandRes, catRes] = await Promise.all([
        api.get('/kaisneaker/admin/brands'),
        api.get('/kaisneaker/admin/categories')
      ]);
      setBrands(brandRes.data || []);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách Hãng/Danh mục:", error);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchBrandsAndCategories();
  }, []);

  // 2. LOGIC BIẾN THỂ (SIZE & KHO)
  const handleOpenVariantModal = (product) => {
    setCurrentProduct(product);
    setVariants(product.variants || []); 
    setNewVariants([]); 
    setIsVariantModalOpen(true);
  };

  const handleUpdateStock = async (variantId, newQuantity) => {
    if (newQuantity === "" || parseInt(newQuantity) < 0) return;
    setUpdatingStockId(variantId);
    try {
      await api.put(`/kaisneaker/admin/products/variants/${variantId}/inventory`, {
        quantity: parseInt(newQuantity)
      });
      toast.success("Đã cập nhật số lượng!");
      await fetchProducts();
    } catch (error) {
      toast.error("Lỗi cập nhật kho!");
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleAddNewVariantRow = () => {
    const s = document.getElementById('new-size').value;
    const q = document.getElementById('new-qty').value;
    if (!s || !q) return toast.error("Nhập đủ Size và Số lượng sếp ơi!");

    const isExist = variants.some(v => v.size.toString() === s.toString()) || 
                    newVariants.some(nv => nv.size.toString() === s.toString());

    if (isExist) return toast.error(`Size ${s} đã có rồi sếp!`);

    setNewVariants([...newVariants, { size: s, quantity: parseInt(q), color: 'Default' }]);
    document.getElementById('new-size').value = '';
    document.getElementById('new-qty').value = '';
  };

  const handleSaveNewVariants = async () => {
    try {
      await api.post(`/kaisneaker/admin/products/${currentProduct.id}/variants`, newVariants);
      toast.success("Đã nhập thêm biến thể!");
      setNewVariants([]);
      await fetchProducts(); 
    } catch (error) {
      toast.error("Lỗi khi thêm size mới!");
    }
  };

  // 3. LOGIC SẢN PHẨM (CRUD)
  const handleOpenModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setEditId(product.id);
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        brandId: product.brandId || '', 
        categoryId: product.categoryId || '', 
        images: null
      });
    } else {
      setIsEditing(false);
      setEditId(null);
      setFormData({ name: '', price: '', description: '', brandId: '', categoryId: '', images: null });
    }
    setIsModalOpen(true);
  };

  const handleRestore = async (id, name) => {
    try {
      await api.patch(`/kaisneaker/admin/products/${id}/restore`);
      toast.success(`Đã hồi sinh ${name}!`);
      fetchProducts();
    } catch (error) {
      toast.error("Không thể hồi sinh sản phẩm!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('description', formData.description);
    if(formData.brandId) submitData.append('brandId', formData.brandId);
    if(formData.categoryId) submitData.append('categoryId', formData.categoryId);
    
    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        submitData.append('images', formData.images[i]);
      }
    }

    try {
      const url = isEditing ? `/kaisneaker/admin/products/${editId}` : '/kaisneaker/admin/products';
      const method = isEditing ? 'put' : 'post';
      await api[method](url, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(isEditing ? "Đã cập nhật!" : "Đã thêm giày mới!");
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Lỗi thao tác!");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Xóa "${name}" hả sếp?`)) {
      try {
        await api.delete(`/kaisneaker/admin/products/${id}`);
        toast.success("Đã tạm ngưng bán!");
        fetchProducts();
      } catch (error) { toast.error("Không xóa được!"); }
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200";
    const finalUrl = Array.isArray(url) ? url[0] : url;
    return finalUrl.startsWith('http') ? finalUrl : `http://localhost:8080${finalUrl}`;
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  
  
  return (

    
    <div className="p-8 max-w-[1400px] mx-auto font-sans bg-[#f8f9fa] min-h-screen">
      <div className="mb-6">
  <button 
    onClick={() => navigate('/admin/dashboard')} // Sếp check lại route Dashboard của sếp nhé
    className="group flex items-center gap-2 text-gray-400 hover:text-black transition-all"
  >
    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
      <ArrowLeft className="w-4 h-4" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest">Quay lại Dashboard</span>
  </button>
</div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 italic">
            <Package className="w-6 h-6 text-purple-600" /> KAI SNEAKER ADMIN
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Quản lý kho hàng chuyên nghiệp</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-black text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm sản phẩm
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 bg-white p-2 rounded-2xl border border-gray-100 flex items-center shadow-sm">
        <Search className="w-5 h-5 text-gray-400 ml-4" />
        <input 
          type="text" 
          placeholder="Tìm tên giày..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full px-4 py-3 outline-none bg-transparent font-medium text-sm" 
        />
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
        {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-purple-600 w-10 h-10" /></div> : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 tracking-widest">
              <tr>
                <th className="p-6">Hình ảnh</th>
                <th className="p-6">Sản phẩm</th>
                <th className="p-6">Giá niêm yết</th>
                <th className="p-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className={`border-b border-gray-50 transition-all group ${p.isDeleted ? 'bg-gray-50/50 grayscale opacity-70' : 'hover:bg-gray-50/30'}`}>
                  <td className="p-6">
                    <div className="relative w-20 h-20 bg-white rounded-2xl p-2 border border-gray-100 shadow-sm">
                      <img src={getImageUrl(p.imageUrls || p.image)} className="w-full h-full object-contain" />
                      {p.isDeleted && <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[8px] text-white font-black rounded-2xl uppercase">Ngưng bán</span>}
                    </div>
                  </td>
                  <td className="p-6">
                    <p className={`font-black text-sm uppercase ${p.isDeleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{p.name}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[9px] px-2 py-1 rounded-lg bg-blue-50 text-blue-600 font-black uppercase">{p.brandName || 'No Brand'}</span>
                      <span className="text-[9px] px-2 py-1 rounded-lg bg-purple-50 text-purple-600 font-black uppercase">{p.categoryName || 'No Category'}</span>
                    </div>
                  </td>
                  <td className={`p-6 font-black text-sm ${p.isDeleted ? 'text-gray-300' : 'text-red-500'}`}>
                    {p.price?.toLocaleString()} <span className="text-[10px]">VNĐ</span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      {p.isDeleted ? (
                        <button onClick={() => handleRestore(p.id, p.name)} className="p-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Mở bán lại">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleOpenVariantModal(p)} className="p-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Size & Kho"><Layers className="w-4 h-4"/></button>
                          <button onClick={() => handleOpenModal(p)} className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm" title="Sửa"><Pencil className="w-4 h-4"/></button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="p-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Xóa"><Trash2 className="w-4 h-4"/></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL THÊM/SỬA SẢN PHẨM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-xl uppercase tracking-tighter">{isEditing ? 'Cập nhật sản phẩm' : 'Nhập giày mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Tên siêu phẩm *</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-medium focus:bg-white focus:border-purple-300 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Giá bán (VNĐ)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-semibold text-black focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Thương hiệu</label>
                  <select required value={formData.brandId} onChange={e => setFormData({...formData, brandId: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-medium cursor-pointer">
                    <option value="">-- Chọn Hãng --</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Danh mục sản phẩm</label>
                  <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-medium cursor-pointer">
                    <option value="">-- Chọn Loại --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Mô tả sản phẩm</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-medium h-32" />
              </div>
              <div className="space-y-5 pt-4 border-t border-dashed border-gray-100">
  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
    Hình ảnh sản phẩm (Chọn nhiều file)
  </label>
  
  <div className="relative">
    <input 
      type="file" 
      multiple 
      onChange={e => setFormData({...formData, images: e.target.files})}
      className="w-full text-xs font-medium text-gray-400 
        file:mr-6 file:py-3 file:px-6 
        file:rounded-2xl file:border-0 
        file:text-xs file:font-black file:uppercase file:tracking-widest
        file:bg-black file:text-white 
        hover:file:bg-gray-800 file:transition-all
        cursor-pointer bg-gray-50 rounded-2xl p-2 border border-gray-100" 
    />
  </div>
  
  <p className="text-[9px] text-gray-400 italic font-medium">
    * Sếp có thể chọn cùng lúc nhiều ảnh, ảnh đầu tiên sẽ được dùng làm ảnh đại diện.
  </p>
</div>
              <button type="submit" disabled={submitting} className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gray-800 transition-all flex justify-center items-center gap-2">
                {submitting && <Loader2 className="animate-spin w-5 h-5" />}
                {isEditing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BIẾN THỂ (SIZE & KHO) */}
      {isVariantModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-3xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter">Quản lý kho biến thể</h3>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{currentProduct?.name}</p>
              </div>
              <button onClick={() => setIsVariantModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X/></button>
            </div>
            <div className="p-10 max-h-[70vh] overflow-y-auto space-y-10">
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Hàng sẵn có</h4>
                  <span className="text-[9px] font-medium text-blue-500 bg-blue-50 px-3 py-1 rounded-full italic">Sửa số rồi bấm ra ngoài để lưu</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {variants.map((v) => (
                    <div key={v.id} className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${updatingStockId === v.id ? 'border-blue-500 bg-blue-50 animate-pulse' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="flex items-center gap-4">
                        <span className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-xl font-black text-sm">{v.size}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase italic">Default</span>
                      </div>
                      <input 
                        type="number" 
                        defaultValue={v.quantity}
                        onBlur={(e) => handleUpdateStock(v.id, e.target.value)}
                        className="w-20 p-3 text-center bg-white border border-gray-200 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  ))}
                </div>
              </section>
              <section className="pt-10 border-t border-dashed border-gray-200">
                <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-6">Nhập thêm Size mới</h4>
                <div className="flex gap-4 mb-6">
                  <input id="new-size" type="text" placeholder="Size" className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black outline-none focus:bg-white focus:border-purple-300 transition-all shadow-inner"/>
                  <input id="new-qty" type="number" placeholder="Số lượng" className="w-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black outline-none focus:bg-white focus:border-purple-300 transition-all shadow-inner"/>
                  <button onClick={handleAddNewVariantRow} className="px-6 bg-purple-600 text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-purple-200"><Plus className="w-6 h-6"/></button>
                </div>
                <div className="space-y-3">
                  {newVariants.map((nv, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-purple-50 border border-purple-100 rounded-2xl animate-in slide-in-from-left-4">
                      <span className="text-xs font-black text-purple-700 uppercase italic underline decoration-purple-300 underline-offset-4">Size {nv.size} — Số lượng: {nv.quantity}</span>
                      <button onClick={() => setNewVariants(newVariants.filter((_, i) => i !== idx))} className="p-1 hover:bg-purple-200 rounded-full transition-colors"><X className="w-4 h-4 text-purple-400"/></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="p-10 border-t border-gray-100 bg-gray-50/30">
              <button 
                onClick={handleSaveNewVariants}
                disabled={newVariants.length === 0}
                className="w-full py-5 bg-black text-white rounded-[24px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 disabled:opacity-20 transition-all shadow-2xl"
              >
                Xác nhận nhập kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;