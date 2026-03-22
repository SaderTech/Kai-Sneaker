import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Pencil, Trash2, Search, Loader2, ArrowLeft, 
  Layers, X, CheckCircle2 
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ name: '' });

  // 1. LẤY DANH SÁCH DANH MỤC
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/kaisneaker/admin/categories');
      setCategories(res.data || []);
    } catch (error) {
      toast.error("Không tải được danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // 2. MỞ MODAL THÊM/SỬA
  const handleOpenModal = (category = null) => {
    if (category) {
      setIsEditing(true);
      setEditId(category.id);
      setFormData({ name: category.name });
    } else {
      setIsEditing(false);
      setEditId(null);
      setFormData({ name: '' });
    }
    setIsModalOpen(true);
  };

  // 3. XỬ LÝ SUBMIT (JSON thẳng tiến)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing) {
        await api.put(`/kaisneaker/admin/categories/${editId}`, formData);
        toast.success("Đã cập nhật danh mục!");
      } else {
        await api.post('/kaisneaker/admin/categories', formData);
        toast.success("Đã thêm danh mục mới!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data || "Thao tác thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. XÓA DANH MỤC (Dò mìn từ Backend)
  const handleDelete = async (id, name) => {
    if (window.confirm(`Xóa danh mục "${name}" hả sếp?`)) {
      try {
        await api.delete(`/kaisneaker/admin/categories/${id}`);
        toast.success("Đã xóa danh mục!");
        fetchCategories();
      } catch (error) {
        // Hiện lỗi "Cảnh báo: Đang có sản phẩm..." từ backend của sếp
        toast.error(error.response?.data || "Không thể xóa danh mục này!");
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[1000px] mx-auto font-sans bg-[#f8f9fa] min-h-screen">
      
      {/* NÚT BACK */}
      <div className="mb-6">
        <button onClick={() => navigate('/admin/dashboard')} className="group flex items-center gap-2 text-gray-400 hover:text-black transition-all">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Về Dashboard</span>
        </button>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 uppercase italic tracking-tighter">
            <Layers className="w-6 h-6 text-purple-600" /> DANH MỤC (CATEGORIES)
          </h2>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[0.2em]">Phân loại giày theo phong cách</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-black text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm danh mục
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center">
        <Search className="w-5 h-5 text-gray-400 ml-4" />
        <input 
          type="text" 
          placeholder="Tìm tên danh mục (Chạy bộ, Lifestyle...)" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full px-4 py-3 outline-none bg-transparent font-bold text-sm" 
        />
      </div>

      {/* BẢNG DANH MỤC */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-purple-600 w-10 h-10" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 tracking-widest border-b border-gray-100">
              <tr>
                <th className="p-6 w-24 text-center">ID</th>
                <th className="p-6">Tên danh mục</th>
                <th className="p-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCategories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="p-6 text-center">
                    <span className="text-xs font-black text-gray-400">#{c.id}</span>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-sm uppercase text-gray-900 tracking-tight">{c.name}</p>
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-green-500 font-bold uppercase tracking-tighter">
                      <CheckCircle2 className="w-3 h-3"/> Hoạt động
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(c)} className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm">
                        <Pencil className="w-4 h-4"/>
                      </button>
                      <button onClick={() => handleDelete(c.id, c.name)} className="p-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest italic bg-gray-50/10">
                    Không tìm thấy danh mục nào sếp ơi!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL THÊM/SỬA DANH MỤC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-lg uppercase italic tracking-tighter text-gray-900">
                {isEditing ? 'Sửa Danh Mục' : 'Tạo Danh Mục'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên danh mục giày *</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({name: e.target.value})} 
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-bold focus:bg-white focus:border-purple-500 transition-all" 
                  placeholder="VD: Giày Chạy, Basketball..." 
                  autoFocus
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gray-800 disabled:bg-gray-400 transition-all flex justify-center items-center gap-2"
              >
                {submitting && <Loader2 className="animate-spin w-5 h-5" />}
                {isEditing ? 'Cập nhật ngay' : 'Thêm mới ngay'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;