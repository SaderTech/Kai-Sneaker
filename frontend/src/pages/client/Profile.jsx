import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, MapPin, ChevronRight, Save, Loader2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info'); 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false); 

  const [user, setUser] = useState({
    fullName: '', email: '', phone: '', gender: '',
    provinceCity: '', district: '', ward: '', houseNumberStreet: '', avatarUrl: ''
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '', newPassword: '', confirmPassword: ''
  });

  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:8080${url}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/kaisneaker/users/profile');
        setUser(res.data);
      } catch (error) {
        toast.error("Vui lòng đăng nhập lại!");
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/kaisneaker/users/profile', user);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Bạn vui lòng điền đầy đủ thông tin nhé!");
    }

    if (newPassword.length < 8) {
      return toast.error("Mật khẩu mới phải có ít nhất 8 ký tự!");
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return toast.error("Mật khẩu mới phải chứa: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!");
    }

    if (oldPassword === newPassword) {
      return toast.error("Mật khẩu mới không được giống mật khẩu cũ !");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }
    setLoading(true);
    try {
      await api.put('/kaisneaker/users/change-password', passwords);
      toast.success("Đã đổi mật khẩu!");
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi đổi mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingAvatar(true);
    try {
      const res = await api.post('/kaisneaker/users/avatar', formData);
      setUser(prev => ({ ...prev, avatarUrl: res.data }));
      toast.success("Đã thay ảnh đại diện!");
    } catch (error) {
      toast.error("Lỗi tải ảnh!");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans pb-20">
      
      <main className="max-w-[1200px] mx-auto pt-12 px-10 flex gap-10">
        
        <aside className="w-[280px] flex-shrink-0">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-32">
            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
              <div 
                className="relative w-16 h-16 rounded-full group cursor-pointer border border-gray-100 flex-shrink-0 overflow-hidden bg-black text-white"
                onClick={() => document.getElementById('avatarUpload').click()}
              >
                {user.avatarUrl ? (
                  <img src={getImageUrl(user.avatarUrl)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold uppercase">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </div>
                <input type="file" id="avatarUpload" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tài khoản</p>
                <h3 className="font-bold text-base truncate">{user.fullName || 'Thành viên'}</h3>
              </div>
            </div>

            <nav className="space-y-1">
              <button onClick={() => setActiveTab('info')} className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-xs transition-all ${activeTab === 'info' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <span className="flex items-center gap-3"><User className="w-4 h-4" /> THÔNG TIN</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button onClick={() => setActiveTab('password')} className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-xs transition-all ${activeTab === 'password' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <span className="flex items-center gap-3"><Lock className="w-4 h-4" /> BẢO MẬT</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </nav>
          </div>
        </aside>

        {/* NỘI DUNG CHÍNH BÊN PHẢI */}
        <section className="flex-grow">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm min-h-[600px]">
            {activeTab === 'info' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-[900] tracking-tighter uppercase mb-8 border-b border-gray-100 pb-4">Hồ sơ cá nhân</h2>
                <form onSubmit={handleUpdateInfo} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Họ và Tên</label>
                      <input type="text" value={user.fullName} onChange={(e) => setUser({...user, fullName: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                      <input type="text" value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Giới tính</label>
                      <select value={user.gender} onChange={(e) => setUser({...user, gender: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                      <input type="text" value={user.email} disabled className="w-full px-4 py-3.5 bg-gray-100 border border-gray-100 rounded-xl text-gray-400 cursor-not-allowed font-medium" />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4" /> Địa chỉ nhận hàng</h3>
                    <div className="grid grid-cols-3 gap-6">
                      <input type="text" placeholder="Tỉnh/Thành" value={user.provinceCity} onChange={(e) => setUser({...user, provinceCity: e.target.value})} className="px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" />
                      <input type="text" placeholder="Quận/Huyện" value={user.district} onChange={(e) => setUser({...user, district: e.target.value})} className="px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" />
                      <input type="text" placeholder="Phường/Xã" value={user.ward} onChange={(e) => setUser({...user, ward: e.target.value})} className="px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" />
                    </div>
                    <input type="text" placeholder="Số nhà, tên đường cụ thể..." value={user.houseNumberStreet} onChange={(e) => setUser({...user, houseNumberStreet: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" />
                  </div>

                  <button type="submit" disabled={loading} className="px-10 py-4 bg-black text-white font-bold rounded-xl hover:bg-black/90 transition-all flex items-center gap-2 shadow-xl shadow-gray-200 disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} CẬP NHẬT HỒ SƠ
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md">
                <h2 className="text-2xl font-[900] tracking-tighter uppercase mb-8 border-b border-gray-100 pb-4">Đổi mật khẩu</h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
                    <input type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                    <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
                    <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} ĐỔI MẬT KHẨU
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;