'use client';
import Link from 'next/link';
import Header from '../../components/Header';

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-6">Your payment could not be processed. Please try again.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cart" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">Back to Cart</Link>
              <Link href="/" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}