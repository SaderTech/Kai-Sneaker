import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { User, Mail, Lock, Phone, UserPlus, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInput = () => {
    const name = formData.fullName.trim();
    if (!name) { 
      toast.error("Họ tên không được để trống!"); 
      return false; 
    }
    if (name.length < 2 || name.length > 50) { 
      toast.error("Họ tên phải từ 2 đến 50 ký tự!"); 
      return false; 
    }
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    if (!nameRegex.test(name)) { 
      toast.error("Họ tên không hợp lệ (Không được chứa số hoặc ký tự đặc biệt)!"); 
      return false; 
    }

    const email = formData.email.trim();
    if (!email) { 
      toast.error("Email không được để trống!"); 
      return false; 
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) { 
      toast.error("Email không đúng định dạng!"); 
      return false; 
    }

    const phone = formData.phone.trim();
    if (!phone) { 
      toast.error("Số điện thoại không được để trống!"); 
      return false; 
    }
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phone)) { 
      toast.error("Số điện thoại phải là số Việt Nam hợp lệ (VD: 098..., 035...)!"); 
      return false; 
    }

    const password = formData.password;
    if (!password) { 
      toast.error("Mật khẩu không được để trống!"); 
      return false; 
    }
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
    if (!passwordRegex.test(password)) { 
      toast.error("Mật khẩu ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt (@#$%^&+=!)"); 
      return false; 
    }

    if (password !== formData.confirmPassword) { 
      toast.error("Mật khẩu xác nhận không khớp!"); 
      return false; 
    }

    return true; 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      await api.post('/auth/register', payload);
      
      toast.success("Đăng ký thành công! Chào mừng đến với Kai Sneaker.");
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Email đã tồn tại hoặc có lỗi xảy ra!";
      toast.error(typeof errorMsg === 'string' ? errorMsg : "Lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-sans text-black py-10">
      <div className="max-w-[420px] w-full bg-white p-10 border border-gray-100 rounded-3xl shadow-[0_2px_40px_-5px_rgba(0,0,0,0.02)] relative z-10">
        
        <Link to="/login" className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-black transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO LOGIN
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-[900] tracking-tight mb-2">JOIN THE UNIVERSE</h1>
          <p className="text-sm font-medium tracking-wide text-gray-400">CREATE YOUR ACCOUNT</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
            <input type="text" placeholder="Full Name" required
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none placeholder:text-gray-300"
              value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
            <input type="email" placeholder="Email Address" required
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none placeholder:text-gray-300"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          {/* Ô nhập số điện thoại mới thêm */}
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
            <input type="tel" placeholder="Phone Number" required
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none placeholder:text-gray-300"
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
            <input type="password" placeholder="Password (Min 8 chars, 1 uppercase...)" required
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none placeholder:text-gray-300"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
            <input type="password" placeholder="Confirm Password" required
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none placeholder:text-gray-300"
              value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-black hover:bg-black/90 text-white font-[800] py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 mt-2">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {loading ? 'CREATING...' : 'BECOME A MEMBER'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;