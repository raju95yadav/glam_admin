import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleUnauthorized = () => {
    localStorage.clear();
    // Redirect to local login
    return <Navigate to="/login" replace />;
  };

  if (!token || role !== 'admin') {
    return handleUnauthorized();
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      return handleUnauthorized();
    }
  } catch (error) {
    return handleUnauthorized();
  }

  return <Outlet />;
};

export default ProtectedRoute;
