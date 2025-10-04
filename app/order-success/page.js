'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { useCart } from '../../components/CartContext';

export default function OrderSuccess() {
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    clearCart();
    const storedOrder = localStorage.getItem('currentOrder');
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
      localStorage.removeItem('currentOrder');
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Successful!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been successfully processed.</p>
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <p><strong>Order Total:</strong> ${orderDetails.total}</p>
                  <p><strong>Items:</strong> {orderDetails.cartItems.length}</p>
                  <p><strong>Customer:</strong> {orderDetails.customer.firstName} {orderDetails.customer.lastName}</p>
                  <p><strong>Email:</strong> {orderDetails.customer.email}</p>
                </div>
              </div>
            )}
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}