import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import EmptyState from '../common/EmptyState';
import { FaShoppingCart, FaClock, FaCheckCircle, FaTruck, FaEye } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../utils/format';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/constants';

const OutletOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      setOrders(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'paid': return <FaCheckCircle className="text-green-500" />;
      case 'shipped': return <FaTruck className="text-blue-500" />;
      default: return <FaClock />;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your orders..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message={error} onRetry={fetchOrders} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaShoppingCart className="mr-3 text-primary-600" />
            My Orders
          </h1>
          <p className="mt-2 text-gray-600">
            Track and manage your purchase orders
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="order"
          title="No orders yet"
          description="You haven't placed any orders yet. Start by creating your first order."
          action={
            <a
              href="/create-order"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Create Your First Order
            </a>
          }
        />
      ) : (
        <>
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-sm text-gray-500">Total Orders</div>
                <div className="text-2xl font-bold mt-1">{orders.length}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-sm text-gray-500">Total Spent</div>
                <div className="text-2xl font-bold mt-1 text-primary-600">
                  {formatCurrency(orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-sm text-gray-500">Latest Order</div>
                <div className="text-sm font-medium mt-1">
                  {orders.length > 0 ? formatDate(orders[0].created_at) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Order History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.length} items
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {order.items.map(item => item.product.name).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-primary-600">
                          {formatCurrency(order.total_price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2">{ORDER_STATUS_LABELS[order.status]}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {/* Implement view details */}}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          <FaEye className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OutletOrders;