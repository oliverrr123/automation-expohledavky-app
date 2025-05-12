import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentIntentId, description } = body;
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    console.log(`Directly updating payment intent ${paymentIntentId} description to: ${description}`);

    // Update the payment intent with the description
    const updatedIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      {
        description: description || 'Lustrace',
      }
    );

    console.log(`Successfully updated payment intent ${paymentIntentId} description:`, updatedIntent.description);

    return NextResponse.json({ 
      updated: true, 
      paymentIntentId: paymentIntentId,
      description: updatedIntent.description
    });
  } catch (error) {
    console.error('Error updating payment intent description:', error);
    return NextResponse.json(
      { error: 'Error updating payment intent description' },
      { status: 500 }
    );
  }
} 