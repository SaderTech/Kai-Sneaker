import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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
import ContactWidget from './components/ContactWidget';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUser from './pages/admin/AdminUser';

function AppContent() {
  const location = useLocation();

  const hideLayoutRoutes = ['/login', '/register', '/forgot-password'];
  

  const shouldHide = hideLayoutRoutes.includes(location.pathname) || location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <ContactWidget />
      {!shouldHide && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
 
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

        <Route path="/admin">
          <Route path="dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="brands" element={<AdminRoute><AdminBrands /></AdminRoute>} />
          <Route path="categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
          <Route path="users" element={<AdminRoute><AdminUser /></AdminRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

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