import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, email, notes, language } = body;

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'czk',
      automatic_payment_methods: {
        enabled: true,
      },
      description: notes ? notes.substring(0, 100) : 'Lustrace',
      metadata: {
        service: 'lustrace',
        email: email || '', // Store email if provided
        notes: notes || '', // Store notes if provided
        language: language || 'cs', // Store language preference
      },
      receipt_email: email || undefined, // Send receipt if email provided
    });

    // Set cookie with payment intent ID for later updates
    const cookieStore = cookies();
    cookieStore.set('paymentIntentId', paymentIntent.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 30, // 30 minutes expiry
      path: '/',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
} 