import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, orderAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

const CreateOrder = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      // Filter hanya produk yang ada stok
      const availableProducts = response.data.data.filter(p => p.stock > 0);
      setProducts(availableProducts);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setError(`Cannot add more. Only ${product.stock} units available.`);
      }
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        maxStock: product.stock
      }]);
      setError(null);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item.product_id === productId);
    if (newQuantity > item.maxStock) {
      setError(`Cannot add more than ${item.maxStock} units.`);
      return;
    }
    
    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
    setError(null);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
    setError(null);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      setError('Please add at least one product to the cart');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const orderItems = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      await orderAPI.createOrder(orderItems);
      
      setSuccess(true);
      setCart([]);
      
      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create order. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <FaCheck className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed and is now pending. You will be redirected to your orders page.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaShoppingCart className="mr-3 text-primary-600" />
            Create New Order
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          {cart.length} items in cart
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Available Products</h2>
              <p className="text-sm text-gray-600 mt-1">
                Select products to add to your order
              </p>
            </div>
            
            <div className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">No products available</div>
                  <p className="text-gray-500 text-sm">All products are currently out of stock.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map(product => {
                    const inCart = cart.find(item => item.product_id === product.id);
                    const availableStock = product.stock - (inCart ? inCart.quantity : 0);
                    
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className="text-sm text-gray-600">
                              Price: {formatCurrency(product.price)}
                            </span>
                            <span className={`text-sm ${
                              availableStock > 5 
                                ? 'text-green-600' 
                                : availableStock > 0 
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                            }`}>
                              Available: {availableStock}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => addToCart(product)}
                          disabled={availableStock === 0}
                          className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div>
          <div className="bg-white rounded-lg shadow border border-gray-200 sticky top-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <FaShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add products from the list
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {cart.map(item => (
                      <div key={item.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3 ml-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                              disabled={item.quantity >= item.maxStock}
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                          
                          <span className="font-medium w-24 text-right">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(calculateTotal())}</span>
                      </div>
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary-600">{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || cart.length === 0}
                      className="mt-6 w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCheck className="mr-2" />
                          Place Order
                        </>
                      )}
                    </button>
                    
                    <div className="mt-4 text-xs text-gray-500 text-center">
                      By placing this order, you agree to our terms and conditions.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;