import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Loader2, ArrowLeft, ShieldCheck, 
  User, Lock, Unlock, Mail, Phone, ChevronLeft, ChevronRight, 
  Eye, X, MapPin, Calendar, UserCircle, ShieldAlert, Settings2,
  Fingerprint, Hash, Bookmark, Navigation
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ROLE_LIST = [
  { id: 1, name: 'ADMIN', label: 'Quản trị viên hệ thống', color: 'text-red-600', bg: 'bg-red-50' },
  { id: 2, name: 'USER', label: 'Khách hàng thành viên', color: 'text-blue-600', bg: 'bg-blue-50' }
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(null);
  const [tempRoleIds, setTempRoleIds] = useState([]);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:8080${cleanUrl}`;
  };

  const fetchUsers = async (page = 0, keyword = searchTerm) => {
    setLoading(true);
    try {
      const res = await api.get(`/kaisneaker/admin/users`, {
        params: { keyword: keyword || undefined, page: page, size: 10 }
      });
      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setCurrentPage(res.data.number || 0);
    } catch (error) {
      toast.error("Không thể kết nối với máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(0); }, []);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setIsProcessing(user.id);
    try {
      await api.put(`/kaisneaker/admin/users/${user.id}/status`, { status: newStatus });
      toast.success(`Trạng thái: ${newStatus === 'ACTIVE' ? 'Đã kích hoạt' : 'Đã khóa'}`);
      fetchUsers(currentPage);
      if (selectedUser?.id === user.id) setSelectedUser({ ...selectedUser, status: newStatus });
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái!");
    } finally { setIsProcessing(null); }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    const currentRoleIds = ROLE_LIST.filter(r => user.roles?.includes(r.name)).map(r => r.id);
    setTempRoleIds(currentRoleIds);
    setIsRoleModalOpen(true);
  };

  const handleSaveRoles = async () => {
    if (tempRoleIds.length === 0) return toast.error("Phải chọn ít nhất một quyền!");
    setIsProcessing(selectedUser.id);
    try {
      await api.put(`/kaisneaker/admin/users/${selectedUser.id}/roles`, tempRoleIds);
      toast.success("Nâng cấp quyền lực thành công!");
      setIsRoleModalOpen(false);
      fetchUsers(currentPage);
    } catch (error) {
      toast.error("Lỗi phân quyền hệ thống!");
    } finally { setIsProcessing(null); }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto font-sans bg-[#f8f9fa] min-h-screen text-gray-900">
      
      <div className="mb-8">
        <button onClick={() => navigate('/admin/dashboard')} className="group flex items-center gap-3 text-gray-400 hover:text-black transition-all">
          <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:bg-black group-hover:text-white transition-all shadow-indigo-100">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Quay lại</span>
            <span className="text-[12px] font-bold text-gray-900">Bảng điều khiển</span>
          </div>
        </button>
      </div>

      <div className="flex justify-between items-center mb-10 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4 uppercase italic tracking-tighter">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Users className="w-8 h-8" />
            </div>
            Quản Lý Thành Viên
          </h2>
          <p className="text-[11px] text-gray-400 font-bold mt-2 uppercase tracking-[0.3em] ml-1">Kiểm soát danh tính & đặc quyền hệ thống</p>
        </div>
        <Users className="absolute right-[-20px] top-[-20px] w-64 h-64 text-gray-50 opacity-50 rotate-12" />
      </div>

      <div className="mb-8 flex gap-4">
        <div className="flex-1 bg-white p-2 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-50 rounded-2xl px-5 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo Tên, Email hoặc Số điện thoại..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers(0)}
              className="w-full px-4 py-3 outline-none bg-transparent font-bold text-sm" 
            />
          </div>
          <button 
            onClick={() => fetchUsers(0)} 
            className="bg-black text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
          >
            Truy vấn ngay
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden mb-10">
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-6">
            <Loader2 className="animate-spin text-indigo-600 w-16 h-16 stroke-[3px]" />
            <span className="text-xs font-black uppercase text-gray-300 tracking-[0.4em] animate-pulse">Đang tải dữ liệu khách hàng</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 text-[11px] uppercase font-black text-gray-400 tracking-widest border-b border-gray-100">
                <tr>
                  <th className="p-8">Hồ sơ người dùng</th>
                  <th className="p-8">Liên hệ & ID</th>
                  <th className="p-8">Đặc quyền</th>
                  <th className="p-8 text-center">Trạng thái</th>
                  <th className="p-8 text-center">Thao tác nhanh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-indigo-50/20 transition-all group">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[20px] bg-indigo-600 overflow-hidden flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white">
                          {u.avatarUrl ? (
                            <img src={getImageUrl(u.avatarUrl)} className="w-full h-full object-cover" alt="Avatar" />
                          ) : (
                            u.fullName?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-black text-base text-gray-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{u.fullName}</p>
                          <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5 mt-1">
                            <Mail className="w-3.5 h-3.5" /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-1.5">
                        <p className="text-xs font-black text-gray-700 flex items-center gap-2 italic">
                          <Phone className="w-3.5 h-3.5 text-indigo-400" /> {u.phone || 'Chưa cập nhật'}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
                          <Hash className="w-3 h-3" /> ID: {u.id}
                        </p>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles?.map((role, i) => (
                          <span key={i} className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-50' : 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-50'}`}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${u.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {u.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="p-8 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openRoleModal(u)} title="Phong quyền" className="p-3 bg-white text-indigo-600 border border-indigo-100 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"><Settings2 className="w-5 h-5"/></button>
                        <button onClick={() => {setSelectedUser(u); setIsDetailModalOpen(true);}} title="Soi hồ sơ" className="p-3 bg-white text-gray-600 border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"><Eye className="w-5 h-5"/></button>
                        <button 
                          onClick={() => handleToggleStatus(u)} 
                          disabled={isProcessing === u.id} 
                          title={u.status === 'ACTIVE' ? 'Khóa khách' : 'Mở khóa khách'}
                          className={`p-3 rounded-2xl transition-all shadow-sm active:scale-90 ${u.status === 'ACTIVE' ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white'}`}
                        >
                          {isProcessing === u.id ? <Loader2 className="w-5 h-5 animate-spin"/> : (u.status === 'ACTIVE' ? <Lock className="w-5 h-5"/> : <Unlock className="w-5 h-5"/>)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="p-8 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Hiển thị trang</span>
              <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-black text-indigo-600 shadow-sm">{currentPage + 1}</div>
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">trên tổng số {totalPages}</span>
            </div>
            <div className="flex gap-3">
              <button 
                disabled={currentPage === 0}
                onClick={() => fetchUsers(currentPage - 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-black hover:text-white disabled:opacity-30 transition-all shadow-sm font-black text-[10px] uppercase tracking-widest"
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </button>
              <button 
                disabled={currentPage + 1 === totalPages}
                onClick={() => fetchUsers(currentPage + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-black hover:text-white disabled:opacity-30 transition-all shadow-sm font-black text-[10px] uppercase tracking-widest"
              >
                Tiếp <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[48px] shadow-2xl overflow-hidden p-12 border border-gray-100 relative">
            <div className="absolute top-6 right-6">
              <button onClick={() => setIsRoleModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6"/></button>
            </div>
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-inner">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h3 className="font-black text-2xl uppercase italic tracking-tighter">Phân Quyền</h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">Thiết lập đặc quyền cho <br/><span className="text-indigo-600">{selectedUser.fullName}</span></p>
            </div>

            <div className="space-y-4">
  {ROLE_LIST.map((role) => (
    <label 
      key={role.id} 
      className={`flex items-center gap-5 p-5 rounded-[24px] border-2 cursor-pointer transition-all ${
        tempRoleIds.includes(role.id) 
          ? 'border-indigo-600 bg-indigo-50 shadow-md' 
          : 'border-gray-50 bg-gray-50 hover:border-gray-200'
      }`}
    >
      <div className="relative flex items-center">
        <input 
          type="radio" 
          name="admin-role-selection"
          className="peer h-6 w-6 opacity-0 absolute cursor-pointer"
          checked={tempRoleIds.includes(role.id)}
          onChange={() => setTempRoleIds([role.id])} 
        />
        
        <div className="h-6 w-6 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      <div>
        <p className={`text-sm font-black uppercase tracking-tight ${role.color || 'text-gray-900'}`}>
          {role.name}
        </p>
        <p className="text-[10px] text-gray-400 font-bold">
          {role.label}
        </p>
      </div>
    </label>
  ))}
</div>

            <div className="mt-10 flex flex-col gap-3">
              <button onClick={handleSaveRoles} disabled={isProcessing} className="w-full py-5 bg-black text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex justify-center items-center gap-2">
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận trao quyền"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[50px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-4 border-white">
            
            <div className="px-12 py-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4 text-indigo-600">
                <Fingerprint className="w-8 h-8" />
                <h3 className="font-black text-2xl uppercase italic tracking-tighter text-gray-900">Chi tiết thực thể</h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-3 bg-white hover:bg-red-50 hover:text-red-500 rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-90"><X className="w-6 h-6"/></button>
            </div>

            <div className="p-12 overflow-y-auto space-y-12 custom-scrollbar">
              
              <div className="flex flex-col md:flex-row items-center gap-10 pb-10 border-b border-dashed border-gray-200">
                <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl overflow-hidden border-4 border-white">
                  {selectedUser.avatarUrl ? (
                    <img src={getImageUrl(selectedUser.avatarUrl)} className="w-full h-full object-cover" alt="Full Profile" />
                  ) : (
                    selectedUser.fullName?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                    <h4 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">{selectedUser.fullName}</h4>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 w-fit mx-auto md:mx-0 ${selectedUser.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100"><Mail className="w-4 h-4 text-indigo-500"/> {selectedUser.email}</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100"><Phone className="w-4 h-4 text-indigo-500"/> {selectedUser.phone || 'Chưa có SĐT'}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2"><Info className="w-4 h-4"/> Định danh & Lịch sử</h5>
                  <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100 space-y-5">
                    <div className="flex justify-between items-center border-b border-white pb-3">
                      <span className="text-[10px] font-black text-gray-400 uppercase italic">Giới tính</span>
                      <span className="text-sm font-black text-gray-800 uppercase flex items-center gap-2"><UserCircle className="w-4 h-4 text-indigo-300" /> {selectedUser.gender || 'Chưa xác định'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white pb-3">
                      <span className="text-[10px] font-black text-gray-400 uppercase italic">Ngày gia nhập</span>
                      <span className="text-sm font-black text-gray-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-300" /> {selectedUser.createAt ? new Date(selectedUser.createAt).toLocaleDateString('vi-VN', {day: '2-digit', month: 'long', year: 'numeric'}) : '---'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase italic">Vai trò hệ thống</span>
                      <div className="flex gap-1">
                        {selectedUser.roles?.map((r, i) => <span key={i} className="text-[9px] font-black text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">{r}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h5 className="text-[11px] font-black text-red-600 uppercase tracking-[0.3em] flex items-center gap-2"><Navigation className="w-4 h-4"/> Vị trí giao hàng</h5>
                  <div className="bg-red-50/30 p-8 rounded-[32px] border border-red-100/50 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase italic mb-1">Thành phố</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUser.province_city || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase italic mb-1">Quận / Huyện</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUser.district || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase italic mb-1">Phường / Xã</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUser.ward || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase italic mb-1">Số nhà</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUser.houseNumberStreet || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-red-100 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-500 animate-bounce" />
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter leading-tight italic">Tọa độ nhận hàng chính thức</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900 text-white p-10 rounded-[40px] flex gap-6 items-center shadow-2xl shadow-indigo-200">
                <ShieldAlert className="w-12 h-12 text-indigo-300 flex-shrink-0" />
                <div>
                  <h4 className="font-black text-lg uppercase italic tracking-widest mb-1">Vùng kiểm soát tối cao</h4>
                  <p className="text-xs text-indigo-200 font-medium leading-relaxed opacity-80">
                    Sếp đang xem dữ liệu nhạy cảm của khách hàng. Mọi hành động Thay đổi quyền hoặc Khóa tài khoản sẽ được ghi lại trong nhật ký hệ thống của sếp. Hãy cân nhắc kỹ trước khi thực hiện.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
              <button onClick={() => setIsDetailModalOpen(false)} className="px-12 py-4 bg-black text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95">Thoát hồ sơ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;