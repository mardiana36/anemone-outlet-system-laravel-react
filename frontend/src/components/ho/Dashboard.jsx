import React, { useState, useEffect } from 'react';
import { dashboardAPI, orderAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { FaChartBar, FaShoppingCart, FaMoneyBillWave, FaClock, FaCheckCircle, FaTruck, FaSync } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const summaryResponse = await dashboardAPI.getSummary();
      setSummary(summaryResponse.data.data);
      
      const ordersResponse = await orderAPI.getOrders();
      const recent = ordersResponse.data.data.slice(0, 5); 
      setRecentOrders(recent);
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!summary?.status_summary) return [];
    
    return [
      { name: 'Pending', value: summary.status_summary.pending, color: '#f59e0b' },
      { name: 'Paid', value: summary.status_summary.paid, color: '#10b981' },
      { name: 'Shipped', value: summary.status_summary.shipped, color: '#3b82f6' },
    ];
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaChartBar className="mr-3 text-primary-600" />
            Head Office Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Overview of system performance and orders
          </p>
        </div>
        <button
          onClick={fetchData}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FaSync className="mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.total_orders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaMoneyBillWave className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary?.total_sales || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary?.status_summary?.pending || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaTruck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Shipped Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary?.status_summary?.shipped || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary?.status_summary?.pending || 0}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary?.status_summary?.paid || 0}</div>
              <div className="text-sm text-gray-500">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summary?.status_summary?.shipped || 0}</div>
              <div className="text-sm text-gray-500">Shipped</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            <a href="/all-orders" className="text-sm text-primary-600 hover:text-primary-800">
              View all →
            </a>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent orders
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">Order #{order.id}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {order.outlet?.name || 'Unknown Outlet'}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'paid' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {order.items.length} items
                    </div>
                    <div className="font-bold text-primary-600">
                      {formatCurrency(order.total_price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;