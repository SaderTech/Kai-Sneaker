import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'ADMIN') {
    toast.error("Bạn không có quyền truy cập khu vực này.", { id: 'auth-denied' });
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;