// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Imports Pages
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import ForgotPassword from './pages/client/ForgotPassword';
import Home from './pages/client/Home';
import Search from './pages/client/Search';
import Profile from './pages/client/Profile';
import Orders from './pages/client/Orders'; 
import History from './pages/client/History';
import Wishlist from './pages/client/Wishlist';
import BrandDetail from './pages/client/BrandDetail';
import CategoryDetail from './pages/client/CategoryDetail';
import NewArrivals from './pages/client/NewArrivals';
import Featured from './pages/client/Featured';
import ProductDetail from './pages/client/ProductDetail';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import Dashboard from './pages/admin/Dashboard';
// Imports Components
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminProducts from './pages/admin/AdminProducts'

// 👉 COMPONENT CHỨA LOGIC HIỂN THỊ
function AppContent() {
  const location = useLocation();

  // 1. Danh sách các đường dẫn muốn ẨN Navbar và Footer
  const hideLayoutRoutes = ['/login', '/register', '/forgot-password'];
  
  // 2. Kiểm tra trang hiện tại:
  // - Có nằm trong mảng trên không?
  // - Hoặc có bắt đầu bằng '/admin' không?
  const shouldHide = hideLayoutRoutes.includes(location.pathname) || location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      
      {/* ✅ Chỉ hiện Navbar nếu không thuộc diện "cấm" */}
      {!shouldHide && <Navbar />}

      <Routes>
        {/* Mặc định vào sẽ đá sang Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Routes Authentication (Không hiện Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Routes Client (Hiện Navbar/Footer) */}
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/orders" element={<Orders />} />
        <Route path="/history" element={<History />} />
        <Route path="/wishlist" element={<Wishlist />}/>
        <Route path="/brand/:id" element={<BrandDetail />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Routes Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />

        {/* Mặc định nếu lạc đường thì về Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      {/* ✅ Chỉ hiện Footer nếu không thuộc diện "cấm" */}
      {!shouldHide && <Footer />}
    </>
  );
}

// 👉 COMPONENT CHÍNH
function App() {
  return (
    <>
      {/* Toast thông báo chung cho toàn app */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#000',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        }} 
      />
      
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;