import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInput = () => {
    if (!email.trim()) {
      toast.error("Vui lòng nhập Email!");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Email không hợp lệ!");
      return false;
    }

    if (!password) {
      toast.error("Vui lòng nhập mật khẩu!");
      return false;
    }


    if (password.length < 8) {
      toast.error("Mật khẩu quá ngắn! Phải có ít nhất 8 ký tự.");
      return false;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      toast.error("Mật khẩu phải chứa ít nhất: 1 chữ hoa, 1 thường, 1 số và 1 ký tự đặc biệt!");
      return false;
    }


    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    setLoading(true);
    try {
      const response = await api.post('/kaisneaker/auth/login', { email, password });

      const { token, role } = response.data;

      if (!token) {
        toast.error("Lỗi: Backend không trả về Token!");
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', role || 'USER');


      if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
        toast.success("Chào Bạn đã trở lại! ");
        navigate('/admin/dashboard');
      } else {
        toast.success("Chào mừng đến với Kai Sneaker!");
        navigate('/home');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Sai thông tin đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-sans text-black">
      <div className="max-w-[420px] w-full bg-white p-10 border border-gray-100 rounded-3xl shadow-[0_2px_40px_-5px_rgba(0,0,0,0.02)] relative z-10">

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-1 mb-3">
            <h1 className="text-5xl font-[900] tracking-tight">KAI</h1>
            <h1 className="text-5xl font-[100] tracking-wider text-black">
              SNEAKER
              <span className="text-xs font-mono align-super text-gray-400">©</span>
            </h1>
          </div>
          <p className="text-sm font-medium tracking-wide text-gray-400">UNIVERSE ACCESS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800 ml-1">EMAIL</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input
                type="email"
                autoComplete="username"
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-gray-800">PASSWORD</label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input
                type="password"
                autoComplete="current-password"
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300 font-bold"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-black/90 text-white font-[800] py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            {loading ? 'ACCESSING...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-500 font-medium">
          Not a member? <Link to="/register" className="text-black font-bold hover:underline">Create Account</Link>
        </div>
      </div >
    </div >
  );
};

export default Login;