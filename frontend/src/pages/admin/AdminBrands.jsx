import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Pencil, Trash2, Search, Loader2, ArrowLeft, Award,
  Image as  X, UploadCloud 
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminBrands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get('/kaisneaker/admin/brands');
      setBrands(res.data || []);
    } catch (error) {
      toast.error("Không tải được danh sách thương hiệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setIsEditing(true);
      setEditId(brand.id);
      setFormData({
        name: brand.name,
        description: brand.description || '',
        image: null 
      });
    } else {
      setIsEditing(false);
      setEditId(null);
      setFormData({ name: '', description: '', image: null });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (isEditing) {
        await api.put(`/kaisneaker/admin/brands/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Đã cập nhật thương hiệu!");
      } else {
        await api.post('/kaisneaker/admin/brands', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Đã thêm thương hiệu mới!");
      }
      setIsModalOpen(false);
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data || "Thao tác thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Xóa hãng "${name}" ? Lưu ý: Hãng phải không có sản phẩm nào mới xóa được.`)) {
      try {
        await api.delete(`/kaisneaker/admin/brands/${id}`);
        toast.success("Đã xóa thương hiệu!");
        fetchBrands();
      } catch (error) {
        toast.error(error.response?.data || "Không thể xóa hãng này!");
      }
    }
  };

const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/150?text=No+Logo";

  if (url.startsWith('http')) return url;

  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const finalUrl = `http://localhost:8080${cleanUrl}`;
  
  return finalUrl; 
};

  const filteredBrands = brands.filter(b => b.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-[1200px] mx-auto font-sans bg-[#f8f9fa] min-h-screen">
      
      <div className="mb-6">
        <button onClick={() => navigate('/admin/dashboard')} className="group flex items-center gap-2 text-gray-400 hover:text-black transition-all">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Về Dashboard</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 uppercase italic tracking-tighter">
            <Award className="w-6 h-6 text-rose-600" /> THƯƠNG HIỆU (BRANDS)
          </h2>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[0.2em]">Quản lý danh mục hãng giày hệ thống</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-black text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm hãng mới
        </button>
      </div>

      <div className="mb-6 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center">
        <Search className="w-5 h-5 text-gray-400 ml-4" />
        <input 
          type="text" 
          placeholder="Tìm tên hãng (Nike, Adidas...)" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full px-4 py-3 outline-none bg-transparent font-bold text-sm" 
        />
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 tracking-widest">
              <tr>
                <th className="p-6">Logo</th>
                <th className="p-6">Tên thương hiệu</th>
                <th className="p-6">Mô tả</th>
                <th className="p-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBrands.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="p-6">
                    <div className="w-16 h-16 bg-white rounded-xl p-2 border border-gray-100 shadow-sm overflow-hidden">
                      <img src={getImageUrl(b.imageUrl)} className="w-full h-full object-contain" alt={b.name} />
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-sm uppercase text-gray-900">{b.name}</p>
                    <p className="text-[10px] text-blue-500 underline font-bold italic">ID: #{b.id}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 max-w-xs">
                      {b.description || 'Chưa có mô tả cho hãng này...'}
                    </p>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(b)} className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm">
                        <Pencil className="w-4 h-4"/>
                      </button>
                      <button onClick={() => handleDelete(b.id, b.name)} className="p-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-xl uppercase italic tracking-tighter">
                {isEditing ? 'Cập nhật Hãng' : 'Thêm Hãng mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên hãng *</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-bold focus:bg-white transition-all" placeholder="VD: Nike, Adidas..." />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mô tả hãng</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-medium h-24" placeholder="Viết vài dòng giới thiệu..." />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo thương hiệu</label>
                <div className="relative group cursor-pointer">
                  <input type="file" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center gap-2 group-hover:border-blue-400 transition-all bg-gray-50">
                    <UploadCloud className="w-8 h-8 text-gray-300 group-hover:text-blue-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase italic">
                      {formData.image ? formData.image.name : 'Nhấn để chọn Logo'}
                    </span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gray-800 transition-all flex justify-center items-center gap-2">
                {submitting && <Loader2 className="animate-spin w-5 h-5" />}
                {isEditing ? 'Lưu thay đổi' : 'Tạo thương hiệu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;