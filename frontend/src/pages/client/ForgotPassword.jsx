import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Send, Loader2, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Gửi OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Nhập email sếp ơi!"); return; }
    setLoading(true);
    try {
      await api.post('/kaisneaker/auth/forgot-password', { email });
      toast.success("Mã OTP đã được gửi vào Inbox!");
      setStep(2);
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || "Đã có lỗi xảy ra!";
    
    // Nếu nó vẫn là object (vì lý do nào đó), ta ép nó về String
    toast.error(typeof message === 'object' ? JSON.stringify(message) : message);
    
    console.error("Lỗi chi tiết sếp soi ở đây:", error.response?.data);
    } finally { setLoading(false); }
  };

  // Xác thực và Đổi Pass
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("OTP phải có 6 số!"); return; }
    if (newPassword.length < 6) { toast.error("Mật khẩu mới quá ngắn!"); return; }
    
    setLoading(true);
    try {
      await api.post('/kaisneaker/auth/reset-password', { email, otp, newPassword });
      toast.success("Mật khẩu mới đã được kích hoạt!");
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || "Đã có lỗi xảy ra!";
    
    // Nếu nó vẫn là object (vì lý do nào đó), ta ép nó về String
    toast.error(typeof message === 'object' ? JSON.stringify(message) : message);
    
    console.error("Lỗi chi tiết sếp soi ở đây:", error.response?.data);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-sans text-black">
      <div className="max-w-[420px] w-full bg-white p-10 border border-gray-100 rounded-[40px] shadow-[0_2px_40px_-5px_rgba(0,0,0,0.02)]">
        
        <Link to="/login" className="inline-flex items-center text-[10px] font-black text-gray-400 hover:text-black transition-all mb-8 tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> BACK TO LOGIN
        </Link>

        <div className="text-left mb-10">
          <h1 className="text-3xl font-[900] tracking-tighter mb-2 italic">RESET ACCESS</h1>
          <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
            {step === 1 ? "Nhập email để nhận mã xác thực" : "Xác thực OTP và thiết lập mật khẩu mới"}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input type="email" placeholder="Email Address" required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold text-sm"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-black text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
              GET OTP CODE
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input type="text" placeholder="6-Digit OTP" required maxLength={6}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-black text-center text-xl tracking-[0.5em]"
                value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input type="password" placeholder="New Password" required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold text-sm"
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-black text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              VERIFY & RESET
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;