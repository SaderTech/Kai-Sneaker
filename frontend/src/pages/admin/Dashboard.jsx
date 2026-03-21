import React, { useState, useEffect } from 'react';
// 👉 Import thêm icon Award (Thương hiệu) và Layers (Danh mục)
import { Users, Package, ShoppingBag, DollarSign, Loader2, TrendingUp, Activity, PackagePlus, ClipboardList, ArrowRight, Award, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios'; 
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/kaisneaker/admin/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu thống kê tổng quan!");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'TỔNG DOANH THU',
      value: `${stats.totalRevenue?.toLocaleString('vi-VN')} đ`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'TỔNG ĐƠN HÀNG',
      value: stats.totalOrders?.toLocaleString('vi-VN'),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      trend: '+5.2%',
      trendUp: true
    },
    {
      title: 'TỔNG SẢN PHẨM',
      value: stats.totalProducts?.toLocaleString('vi-VN'),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      trend: 'Đang hoạt động',
      trendUp: true
    },
    {
      title: 'TỔNG KHÁCH HÀNG',
      value: stats.totalUsers?.toLocaleString('vi-VN'),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
      trend: '+18.1%',
      trendUp: true
    }
  ];

  // 👉 BỘ 5 CÔNG CỤ QUẢN TRỊ QUYỀN LỰC NHẤT CỦA SẾP
  const quickActions = [
    { title: 'Quản lý Đơn hàng', desc: 'Duyệt, giao và hủy đơn', icon: ClipboardList, link: '/admin/orders', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Quản lý Sản phẩm', desc: 'Thêm, sửa, xóa giày', icon: PackagePlus, link: '/admin/products', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Thương hiệu (Brand)', desc: 'Nike, Adidas, Vans...', icon: Award, link: '/admin/brands', color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Danh mục (Category)', desc: 'Sneaker, Chạy bộ...', icon: Layers, link: '/admin/categories', color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Quản lý Tài khoản', desc: 'Phân quyền, khóa user', icon: Users, link: '/admin/users', color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 lg:p-10 font-sans w-full">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-3xl lg:text-4xl font-[900] tracking-tighter uppercase italic text-gray-900 flex items-center gap-4">
              <Activity className="w-10 h-10 text-black" /> TỔNG QUAN HỆ THỐNG
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-3">
              Chào Boss! Theo dõi tình hình kinh doanh của Kai Sneaker hôm nay nhé.
            </p>
          </div>
          <div className="text-xs font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* 4 THẺ THỐNG KÊ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-2xl ${card.bgColor} ${card.color} border ${card.borderColor} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  {card.trend && (
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${card.trendUp ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                      {card.trendUp && <TrendingUp className="w-3 h-3" />}
                      {card.trend}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-2">{card.title}</h3>
                  <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight truncate">
                    {card.value}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* BỘ 5 TÍNH NĂNG QUẢN TRỊ */}
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-6 flex items-center gap-2">
            Điều hành hệ thống
          </h3>
          {/* 👉 Chia 5 cột trên màn hình siêu lớn (xl), chia 3 cột màn vừa (lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Link 
                  key={index} 
                  to={action.link}
                  className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:border-black hover:shadow-md transition-all group flex flex-col justify-between min-h-[160px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:bg-black group-hover:text-white transition-colors`}>
                      <ActionIcon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{action.title}</h4>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;