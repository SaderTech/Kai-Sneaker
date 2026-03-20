// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


import Login from './pages/client/Login';
import Register from './pages/client/Register';
import ForgotPassword from './pages/client/ForgotPassword';
import Home from './pages/client/Home';
import Search from './pages/client/Search';
import Profile from './pages/client/Profile';

// Các trang tạm thời để test
const AdminDashboard = () => <div className="p-10 text-2xl font-bold text-red-600">🛡️ Trang Quản trị (Admin)</div>;

function App() {
  return (
    <>
 
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '14px',
          }
        }} 
      />
      
      <Router>
        <Routes>
          {/* 1. Mặc định vào web sẽ chuyển thẳng sang trang Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 2. Các Route dành cho Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile/>}/>
          {/* 3. Route dành cho khách hàng đã đăng nhập */}
          <Route path="/home" element={<Home />} />

          {/* 4. Route dành cho Admin (Tạm thời) */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* 5. Nếu gõ sai đường dẫn thì về Login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;