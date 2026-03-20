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
  
  // 👉 ĐÃ KHAI BÁO BIẾN UPLOADING AVATAR
  const [uploadingAvatar, setUploadingAvatar] = useState(false); 

  // STATE CHỨA THÔNG TIN NGƯỜI DÙNG THẬT
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    provinceCity: '',
    district: '',
    ward: '',
    houseNumberStreet: '',
    avatarUrl: ''
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 1. GỌI API LẤY DATA THẬT 100%
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/kaisneaker/users/profile');
        const data = res.data;
        
        // Map dữ liệu thật từ Backend vào state (Không còn hardcode)
        setUser({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || '',
          provinceCity: data.provinceCity || '',
          district: data.district || '',
          ward: data.ward || '',
          houseNumberStreet: data.houseNumberStreet || '',
          avatarUrl: data.avatarUrl || ''
        });
      } catch (error) {
        console.error("Lỗi fetch profile:", error);
        toast.error("Không thể tải thông tin hồ sơ! Vui lòng đăng nhập lại.");
        if (error.response?.status === 401 || error.response?.status === 403) {
           navigate('/login');
        }
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // 2. CẬP NHẬT THÔNG TIN THẬT
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/kaisneaker/users/profile', user);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 3. ĐỔI MẬT KHẨU THẬT
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
    
    if (passwords.newPassword === passwords.oldPassword) {
      return toast.error("Mật khẩu mới phải khác mật khẩu cũ!");
    }
    if (!passwordRegex.test(passwords.newPassword)) {
      return toast.error("Mật khẩu mới ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt (@#$%^&+=!)");
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }

    setLoading(true);
    try {
      await api.put('/kaisneaker/users/change-password', passwords);
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.message || "Mật khẩu cũ không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  // 4. API UPLOAD ẢNH THẬT
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Kích thước ảnh không được vượt quá 2MB!");
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingAvatar(true);
    try {
      const res = await api.post('/kaisneaker/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(prev => ({ ...prev, avatarUrl: res.data }));
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải ảnh lên!");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (fetching) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans pb-20">
      
      <header className="px-10 py-6 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link to="/home" className="text-2xl font-[900] tracking-tighter hover:text-gray-600 transition-colors">
          KAI SNEAKER
        </Link>
        <div className="text-sm font-bold uppercase tracking-widest text-gray-500">
          TÀI KHOẢN CỦA TÔI
        </div>
        <Link to="/home" className="text-sm font-bold uppercase tracking-widest hover:text-black transition-colors">
          QUAY LẠI CỬA HÀNG
        </Link>
      </header>

      <main className="max-w-[1200px] mx-auto mt-12 px-10 flex gap-10">
        
        <aside className="w-[280px] flex-shrink-0">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
              
              {/* KHU VỰC AVATAR HOÀN CHỈNH */}
              <div 
                className="relative w-16 h-16 rounded-full group cursor-pointer border border-gray-100 flex-shrink-0"
                onClick={() => document.getElementById('avatarUpload').click()}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                    {user.fullName ? user.fullName.charAt(0) : 'U'}
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {uploadingAvatar ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </div>

                <input 
                  type="file" 
                  id="avatarUpload" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={handleAvatarChange} 
                />
              </div>

              <div className="overflow-hidden">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Xin chào,</p>
                <h3 className="font-bold text-lg truncate" title={user.fullName}>{user.fullName || 'Thành viên Kai'}</h3>
              </div>
            </div>

            <nav className="space-y-2">
              <button onClick={() => setActiveTab('info')} className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'info' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}>
                <span className="flex items-center gap-3"><User className="w-4 h-4" /> THÔNG TIN CÁ NHÂN</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button onClick={() => setActiveTab('password')} className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'password' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}>
                <span className="flex items-center gap-3"><Lock className="w-4 h-4" /> ĐỔI MẬT KHẨU</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </nav>
          </div>
        </aside>

        <section className="flex-grow">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm min-h-[500px]">
            
            {/* TAB THÔNG TIN */}
            {activeTab === 'info' && (
              <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
                <h2 className="text-2xl font-[200] tracking-tight uppercase mb-8 border-b border-gray-100 pb-4">
                  HỒ SƠ CỦA TÔI
                </h2>
                <form onSubmit={handleUpdateInfo} className="space-y-8 max-w-3xl">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold tracking-widest uppercase text-black flex items-center gap-2">
                      <User className="w-4 h-4" /> Thông tin cơ bản
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Họ và Tên</label>
                        <input type="text" value={user.fullName} onChange={(e) => setUser({...user, fullName: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium" required />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Giới tính</label>
                        <select 
                          value={user.gender} 
                          onChange={(e) => setUser({...user, gender: e.target.value})} 
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium appearance-none" 
                          required
                        >
                          <option value="" disabled>Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Số điện thoại</label>
                        <input type="text" value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Email (Không thể thay đổi)</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input type="email" value={user.email} disabled className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-100 rounded-xl outline-none text-gray-500 font-medium cursor-not-allowed" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold tracking-widest uppercase text-black flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Địa chỉ giao hàng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Tỉnh / Thành phố</label>
                        <input type="text" value={user.provinceCity} onChange={(e) => setUser({...user, provinceCity: e.target.value})} placeholder="VD: Hà Nội" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Quận / Huyện</label>
                        <input type="text" value={user.district} onChange={(e) => setUser({...user, district: e.target.value})} placeholder="VD: Đan Phượng" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Phường / Xã</label>
                        <input type="text" value={user.ward} onChange={(e) => setUser({...user, ward: e.target.value})} placeholder="VD: Tân Hội" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Số nhà, Tên đường cụ thể</label>
                      <input type="text" value={user.houseNumberStreet} onChange={(e) => setUser({...user, houseNumberStreet: e.target.value})} placeholder="VD: Số 10, Ngõ 20, ..." className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium" required />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="px-10 py-4 bg-black text-white font-bold rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    LƯU THÔNG TIN
                  </button>
                </form>
              </div>
            )}

            {/* TAB ĐỔI MẬT KHẨU */}
            {activeTab === 'password' && (
              <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
                <h2 className="text-2xl font-[200] tracking-tight uppercase mb-8 border-b border-gray-100 pb-4">
                  BẢO MẬT TÀI KHOẢN
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Mật khẩu hiện tại</label>
                    <input type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Mật khẩu mới</label>
                    <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium" required />
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">* Ít nhất 8 ký tự, 1 HOA, 1 thường, 1 số, 1 ký tự đặc biệt (@#$%^&+=!)</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest">Xác nhận mật khẩu mới</label>
                    <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium" required />
                  </div>

                  <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                    CẬP NHẬT MẬT KHẨU
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