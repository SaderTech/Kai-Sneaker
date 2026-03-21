import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Heart, LogOut, ChevronDown, ListOrdered } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
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
  }, []);

const [searchKeyword, setSearchKeyword] = useState(""); 

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
    toast.success("Đã đăng xuất thành công!");
    navigate('/login');
  };

  return (
    <div className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 font-sans">
      <header className="px-10 py-5 flex justify-between items-center border-b border-gray-100">
        <Link to="/home" className="text-2xl font-[900] tracking-tighter">KAI SNEAKER</Link>
        
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
          <Link to="/wishlist"><Heart className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors" /></Link>
          <Link to="/cart"><ShoppingBag className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors" /></Link>
          
          <div className="relative group py-2">
            <User className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors" />
            <div className="absolute right-0 top-full w-52 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-[60] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50"><User className="w-4 h-4"/>Hồ sơ</Link>
                  <Link to="/orders" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50"><ShoppingBag className="w-4 h-4"/>Đơn hàng</Link>
                  <Link to="/history" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50"><ListOrdered className="w-4 h-4"/>Lịch sử mua hàng</Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-sm font-bold text-red-500 rounded-lg hover:bg-red-50"><LogOut className="w-4 h-4"/>Đăng xuất</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50">Đăng nhập</Link>
                  <Link to="/register" className="flex items-center gap-3 p-3 text-sm font-medium rounded-lg hover:bg-gray-50">Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="px-10 py-0 flex justify-center items-center text-[11px] font-bold tracking-[0.2em] uppercase">
        <div className="flex gap-14">
          <Link to="/new-arrivals" className="hover:text-gray-400 py-5">Sản phẩm mới</Link>
          <Link to="/featured" className="hover:text-gray-400 py-5">Nổi bật</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-2 hover:text-gray-400 uppercase tracking-[0.2em] py-5">
              Brands <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full min-w-[160px] bg-white border border-gray-100 shadow-xl p-2 z-[60] normal-case tracking-normal opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 rounded-b-xl">
              {navData.brands.map(brand => (
                <Link key={brand.id} to={`/brand/${brand.id}`} className="block p-3 text-sm rounded-lg hover:bg-gray-50 uppercase whitespace-nowrap">{brand.name}</Link>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 hover:text-gray-400 uppercase tracking-[0.2em] py-5">
              Category <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full min-w-[160px] bg-white border border-gray-100 shadow-xl p-2 z-[60] normal-case tracking-normal opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 rounded-b-xl">
              {navData.categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.id}`} className="block p-3 text-sm rounded-lg hover:bg-gray-50 capitalize whitespace-nowrap">{cat.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;