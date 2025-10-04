// app/api/payment/route.js
import { NextResponse } from 'next/server';

const CHAPA_URL = 'https://api.chapa.co/v1/transaction/initialize';
const CHAPA_SECRET_KEY = process.env.NEXT_CHAPA_SECRET_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('Payment request body:', body);
    console.log('Chapa Secret Key exists:', !!CHAPA_SECRET_KEY);
    console.log('Chapa Secret Key length:', CHAPA_SECRET_KEY?.length);

    // Validate required fields
    if (!body.amount || !body.email || !body.firstName || !body.lastName || !body.phone || !body.tx_ref) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Test if Chapa key is valid (basic check)
    if (!CHAPA_SECRET_KEY || CHAPA_SECRET_KEY === 'your_chapa_secret_key_here') {
      return NextResponse.json(
        { 
          error: 'Invalid Chapa configuration',
          message: 'Please set a valid NEXT_CHAPA_SECRET_KEY in your environment variables'
        },
        { status: 500 }
      );
    }

    const response = await fetch(CHAPA_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: body.amount,
        currency: 'ETB',
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
        phone_number: body.phone,
        tx_ref: body.tx_ref,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-payment`,
        // return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success`,
        customization: {
          title: 'ShopNow',
          description: 'Payment for items'
        }
      }),
    });

    const responseData = await response.json();
    
    console.log('Chapa API response status:', response.status);
    console.log('Chapa API response data:', responseData);

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Chapa API error',
          message: responseData.message || 'Payment failed',
          details: responseData
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message
      },
      { status: 500 }
    );
  }
}