import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaChartBar, 
  FaSignOutAlt,
  FaUser,
  FaPlusCircle
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isHO, isOutlet } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    ...(isOutlet() ? [
      { path: '/products', label: 'Products', icon: <FaBox /> },
      { path: '/orders', label: 'My Orders', icon: <FaShoppingCart /> },
      { path: '/create-order', label: 'New Order', icon: <FaPlusCircle />, highlight: true },
    ] : []),
    ...(isHO() ? [
      { path: '/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
      { path: '/all-orders', label: 'All Orders', icon: <FaShoppingCart /> },
      { path: '/manage-products', label: 'Manage Products', icon: <FaBox /> },
    ] : []),
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo & Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <FaHome size={20} />
              </div>
              <span className="text-xl font-bold text-gray-800 hidden md:inline">
                Anemone Outlet
              </span>
            </Link>
            
            {/* Navigation Items */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${item.highlight ? 'text-white bg-primary-600 hover:bg-primary-700' : ''}`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - User info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="bg-primary-100 text-primary-800 p-2 rounded-full">
                <FaUser size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {isHO() ? 'Head Office' : 'Outlet'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-50 border-t">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;