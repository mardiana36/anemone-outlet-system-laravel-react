import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaLock, FaStore, FaBuilding } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'ho' ? '/dashboard' : '/products');
    }
  }, [user, navigate]);

  const demoAccounts = [
    {
      email: 'ho@anemone.com',
      password: 'password',
      role: 'Head Office',
      description: 'Full access to manage products and view all orders',
      icon: <FaBuilding className="text-blue-600" />,
    },
    {
      email: 'outlet1@anemone.com',
      password: 'password',
      role: 'Outlet Jakarta',
      description: 'Can view products and create orders',
      icon: <FaStore className="text-green-600" />,
    },
    {
      email: 'outlet2@anemone.com',
      password: 'password',
      role: 'Outlet Surabaya',
      description: 'Can view products and create orders',
      icon: <FaStore className="text-purple-600" />,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      setTimeout(() => {
        navigate(result.user.role === 'ho' ? '/dashboard' : '/products');
      }, 100);
    } else {
      setFormError(result.message);
    }
    
    setIsSubmitting(false);
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <FaBuilding className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Anemone Outlet System</h2>
          <p className="mt-2 text-sm text-gray-600">
            Login as Head Office or Outlet
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {formError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {formError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {demoAccounts.map((account, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {account.icon}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{account.role}</h4>
                        <p className="text-xs text-gray-500">{account.email}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">Click to fill</div>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">{account.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Use any demo account above. Password for all accounts: <strong>password</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;