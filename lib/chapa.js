// lib/chapa.js
export const initializePayment = async (paymentData) => {
    try {
      console.log('Sending payment request to our API...');
      
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
  
      const data = await response.json();
      
      console.log('API Response:', data);
  
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
  
      if (data.error) {
        throw new Error(data.message || data.error);
      }
  
      return data;
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  };