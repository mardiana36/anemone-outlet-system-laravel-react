import React, { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import EmptyState from '../common/EmptyState';
import { FaBox, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts();
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message={error} onRetry={fetchProducts} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaBox className="mr-3 text-primary-600" />
            Available Products
          </h1>
          <p className="mt-2 text-gray-600">
            Browse and select products to create orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/create-order"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaShoppingCart className="mr-2" />
            Create New Order
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon="product"
          title="No products available"
          description="There are currently no products in the inventory."
        />
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {products.length} products
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-lg text-primary-600">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Stock:</span>
                      <div className="flex items-center">
                        <span className={`font-medium mr-2 ${
                          product.stock > 10 
                            ? 'text-green-600' 
                            : product.stock > 0 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                        }`}>
                          {product.stock} units
                        </span>
                        {product.stock === 0 && (
                          <FaExclamationTriangle className="text-red-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        {product.stock > 0 ? (
                          <span className="text-green-600">✓ Available for order</span>
                        ) : (
                          <span className="text-red-600">Out of stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4">
                  <Link
                    to="/create-order"
                    state={{ product }}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart className="mr-2" />
                    {product.stock > 0 ? 'Add to Order' : 'Out of Stock'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;