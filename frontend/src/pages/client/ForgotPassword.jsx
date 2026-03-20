import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Vui lòng nhập Email!"); return; }
    
    setLoading(true);
    try {
      // Giả lập gọi API gửi email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSent(true);
      toast.success("Recovery link has been sent to your email!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-sans text-black">
      <div className="max-w-[420px] w-full bg-white p-10 border border-gray-100 rounded-3xl shadow-[0_2px_40px_-5px_rgba(0,0,0,0.02)] relative z-10">
        
        <Link to="/login" className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-black transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO LOGIN
        </Link>

        <div className="text-left mb-10">
          <h1 className="text-3xl font-[900] tracking-tight mb-2">RESET ACCESS</h1>
          <p className="text-sm font-medium tracking-wide text-gray-400">
            {isSent ? "Check your inbox for the recovery link." : "Enter your email to receive a recovery link."}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleReset} className="space-y-6" noValidate>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input type="email" placeholder="Email Address" required
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none placeholder:text-gray-300"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-black hover:bg-black/90 text-white font-[800] py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
              {loading ? 'SENDING...' : 'SEND RECOVERY LINK'}
            </button>
          </form>
        ) : (
          <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl text-center">
            <p className="text-sm font-medium text-gray-600">
              We've sent an email to <br/><span className="text-black font-bold">{email}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;