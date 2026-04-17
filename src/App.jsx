import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ManageProducts from './pages/ManageProducts';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Settings from './pages/Settings';

function App() {
  useEffect(() => {
    // URL Parameter Ingestion (Token Transfer)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlRole = params.get('role');

    if (urlToken && urlRole === 'admin') {
      localStorage.setItem('token', urlToken);
      localStorage.setItem('role', urlRole);
      // Clean URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Auto Dashboard Load Check (Prevent blank screens)
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      // Intentionally empty - ProtectedRoute will handle redirect
    }
  }, []);

  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/manage-products" element={<ManageProducts />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* Catch-all to redirect back to dashboard or login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
