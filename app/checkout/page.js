// app/checkout/page.js
'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import { useCart } from '../../components/CartContext';
import { initializePayment } from '../../lib/chapa';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isProcessing1, setIsProcessing1] = useState(false);
  const [isProcessing2, setIsProcessing2] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Demo payment function that simulates success
  const handleDemoPayment = async (e) => {
    e.preventDefault();
    setIsProcessing1(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tx_ref = `demo-${Date.now()}`;
      
      localStorage.setItem('currentOrder', JSON.stringify({
        cartItems,
        total: getCartTotal(),
        customer: formData,
        tx_ref: tx_ref,
        isDemo: true
      }));

      // Redirect to success page
      window.location.href = '/order-success';
      
    } catch (error) {
      setError('Demo payment failed: ' + error.message);
    } finally {
      setIsProcessing1(false);
    }
  };

  const handleRealPayment = async (e) => {
    e.preventDefault();
    setIsProcessing2(true);
    setError('');

    try {
      const tx_ref = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentData = {
        amount: getCartTotal(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        tx_ref: tx_ref
      };

      const response = await initializePayment(paymentData);
      
      if (response.status === 'success' && response.data.checkout_url) {
        localStorage.setItem('currentOrder', JSON.stringify({
          cartItems,
          total: getCartTotal(),
          customer: formData,
          tx_ref: tx_ref
        }));
        window.location.href = response.data.checkout_url;
      } else {
        setError(response.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. You can try the demo mode below.');
    } finally {
      setIsProcessing2(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-yellow-800">Development Mode</h3>
            <p className="text-yellow-700">
              If real payments aren&apos;t working, try the demo mode to test the checkout flow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-black">Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-black">{item.name}</h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-black">{(item.price * item.quantity).toFixed(2)} ETB</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className='text-black'>Total:</span>
                  <span className='text-black'>{getCartTotal()} ETB</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-yellow-400 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Checkout Information</h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      required 
                      value={formData.firstName} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      required 
                      value={formData.lastName} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address *</label>
                  <textarea 
                    name="address" 
                    required 
                    value={formData.address} 
                    onChange={handleInputChange}
                    rows="3" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleRealPayment}
                    disabled={isProcessing2}
                    className="w-full bg-blue-600 text-black py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing2 ? 'Processing...' : `Real Payment - ${getCartTotal()} ETB`}
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoPayment}
                    disabled={isProcessing1}
                    className="w-full bg-green-600 text-black py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing1 ? 'Processing...' : `Demo Payment - ${getCartTotal()} ETB`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}