import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, User, Heart, LogOut, 
  ChevronDown, ListOrdered, LayoutDashboard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState(""); 
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  
  const [role, setRole] = useState(localStorage.getItem('role')); 
  const [navData, setNavData] = useState({ brands: [], categories: [] });

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const [brandRes, catRes] = await Promise.all([
          api.get('/kaisneaker/brands/all'),
          api.get('/kaisneaker/categories/all')
        ]);
        setNavData({ brands: brandRes.data, categories: catRes.data });
      } catch (error) {
        console.error("Lỗi tải menu:", error);
      }
    };
    fetchNavData();
    
    setIsLoggedIn(!!localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchKeyword.trim() !== '') {
      navigate(`/search?keyword=${searchKeyword}`);
      setSearchKeyword("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null); 
    toast.success("Đã đăng xuất thành công!");
    navigate('/login');
  };

  return (
    <div className="sticky top-0 w-full z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100 font-sans">
      <header className="px-10 py-5 flex justify-between items-center border-b border-gray-100">
        <Link to="/home" className="text-2xl font-[900] tracking-tighter hover:italic transition-all">KAI SNEAKER</Link>
        
        <div className="relative w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm... " 
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm outline-none focus:ring-1 focus:ring-gray-200" 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)} 
            onKeyDown={handleSearch}
          />
        </div>

        <div className="flex gap-6 items-center">
          <Link to="/wishlist"><Heart className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors" /></Link>
          <Link to="/cart"><ShoppingBag className="w-5 h-5 cursor-pointer hover:text-black transition-colors" /></Link>
          
          <div className="relative group py-2">
            <User className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
            <div className="absolute right-0 top-full w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-[60] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tài khoản</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 p-3 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"><User className="w-4 h-4 text-gray-400"/>Hồ sơ</Link>
                  <Link to="/orders" className="flex items-center gap-3 p-3 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"><ShoppingBag className="w-4 h-4 text-gray-400"/>Đơn hàng</Link>
                  <Link to="/history" className="flex items-center gap-3 p-3 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"><ListOrdered className="w-4 h-4 text-gray-400"/>Lịch sử mua hàng</Link>
                  
                  {role === 'ADMIN' && (
                    <div className="mt-1 pt-1 border-t border-gray-50">
                      <Link 
                        to="/admin/dashboard" 
                        className="flex items-center gap-3 p-3 text-sm font-black text-indigo-600 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-all group/admin"
                      >
                        <LayoutDashboard className="w-4 h-4 group-hover/admin:rotate-12 transition-transform"/>
                        QUẢN TRỊ (ADMIN)
                      </Link>
                    </div>
                  )}

                  <button 
                    onClick={handleLogout} 
                    className="w-full mt-1 flex items-center gap-3 p-3 text-sm font-black text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4"/>Đăng xuất
                  </button>
                </>
              ) : (
                <div className="p-2 space-y-1">
                  <Link to="/login" className="block text-center p-3 text-sm font-black uppercase tracking-widest bg-black text-white rounded-xl hover:bg-gray-800 transition-all">Đăng nhập</Link>
                  <Link to="/register" className="block text-center p-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-all">Đăng ký</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="px-10 py-0 flex justify-center items-center text-[11px] font-black tracking-[0.2em] uppercase">
        <div className="flex gap-14">
          <Link to="/new-arrivals" className="hover:text-black py-5 transition-colors border-b-2 border-transparent hover:border-black">Sản phẩm mới</Link>
          <Link to="/featured" className="hover:text-black py-5 transition-colors border-b-2 border-transparent hover:border-black">Nổi bật</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-2 hover:text-black uppercase tracking-[0.2em] py-5">
              Brands <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full min-w-[200px] bg-white border border-gray-100 shadow-2xl p-2 z-[60] normal-case tracking-normal opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 rounded-b-2xl">
              {navData.brands.map(brand => (
                <Link key={brand.id} to={`/brand/${brand.id}`} className="block p-3 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 hover:text-black transition-all uppercase">{brand.name}</Link>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 hover:text-black uppercase tracking-[0.2em] py-5">
              Category <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full min-w-[200px] bg-white border border-gray-100 shadow-2xl p-2 z-[60] normal-case tracking-normal opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 rounded-b-2xl">
              {navData.categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.id}`} className="block p-3 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 hover:text-black transition-all capitalize">{cat.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;