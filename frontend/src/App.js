import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/layout/PrivateRoute';
import Navbar from './components/layout/Navbar';

import Login from './components/auth/Login';

import ProductList from './components/outlet/ProductList';
import CreateOrder from './components/outlet/CreateOrder';
import OutletOrders from './components/outlet/OutletOrders';

import Dashboard from './components/ho/Dashboard';
import AllOrders from './components/ho/AllOrders';
import ManageProducts from './components/ho/HOProducts';

import './App.css';

const Home = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return user.role === 'ho' 
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/products" replace />;
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <div className={user ? '' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Outlet Routes */}
          <Route path="/products" element={
            <PrivateRoute allowedRoles={['outlet']}>
              <ProductList />
            </PrivateRoute>
          } />
          
          <Route path="/create-order" element={
            <PrivateRoute allowedRoles={['outlet']}>
              <CreateOrder />
            </PrivateRoute>
          } />
          
          <Route path="/orders" element={
            <PrivateRoute allowedRoles={['outlet']}>
              <OutletOrders />
            </PrivateRoute>
          } />
          
          {/* HO Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['ho']}>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/all-orders" element={
            <PrivateRoute allowedRoles={['ho']}>
              <AllOrders />
            </PrivateRoute>
          } />
          <Route path="/manage-products" element={
            <PrivateRoute allowedRoles={['ho']}>
              <ManageProducts />
            </PrivateRoute>
          } />
          
          {/* Home Route */}
          <Route path="/" element={<Home />} />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;