// app/test-payment/page.js
'use client';
import { useState } from 'react';

export default function TestPayment() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testPayment = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const testData = {
        amount: '100',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '0912345678',
        tx_ref: 'test-' + Date.now()
      };

      console.log('Test data:', testData);

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      
      setResult(JSON.stringify({
        status: response.status,
        ok: response.ok,
        data: data
      }, null, 2));

    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Chapa Payment</h1>
      
      <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h2 className="font-bold mb-2">Environment Check:</h2>
        <p>NEXT_PUBLIC_CHAPA_SECRET_KEY: {process.env.NEXT_PUBLIC_CHAPA_SECRET_KEY ? 'Set' : 'Not Set'}</p>
        <p>NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL}</p>
      </div>

      <button 
        onClick={testPayment} 
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Payment API'}
      </button>
      
      {result && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{result}</pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Troubleshooting Steps:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Check if your Chapa secret key is correct in .env.local</li>
          <li>Make sure you&apos;ve restarted the dev server after changing .env.local</li>
          <li>Verify your Chapa account is active and has test mode enabled</li>
          <li>Check browser console for detailed error messages</li>
        </ol>
      </div>
    </div>
  );
}