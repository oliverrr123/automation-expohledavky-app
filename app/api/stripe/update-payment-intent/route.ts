import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, notes, paymentIntentId } = body;
    
    console.log(`Received update request:
      - Payment Intent ID: ${paymentIntentId || 'Not provided'}
      - Email: ${email || 'Not provided'}
      - Notes: ${notes ? 'Provided' : 'Not provided'}`);
    
    // Use explicitly provided payment intent ID first, then check cookies
    let intentId = paymentIntentId;
    
    // If no explicit ID provided, get from cookies
    if (!intentId) {
      const cookieStore = cookies();
      intentId = cookieStore.get('paymentIntentId')?.value;
    }
    
    if (!intentId) {
      return NextResponse.json(
        { error: 'Payment intent ID not found' },
        { status: 400 }
      );
    }

    console.log(`Updating payment intent ${intentId} with email: ${email} and notes data`);

    // First get existing metadata
    const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
    
    // Merge existing metadata with new data, giving priority to new data
    const updatedMetadata = {
      ...paymentIntent.metadata,
      email: email || paymentIntent.metadata?.email || '',
      notes: notes || paymentIntent.metadata?.notes || '',
      service: paymentIntent.metadata?.service || 'lustrace',
    };
    
    // Update the payment intent with additional metadata
    const updatedIntent = await stripe.paymentIntents.update(
      intentId,
      {
        metadata: updatedMetadata,
        receipt_email: email || paymentIntent.receipt_email,
        description: notes ? notes.substring(0, 100) : paymentIntent.description || 'Lustrace',
      }
    );

    console.log(`Successfully updated payment intent ${intentId} metadata:`, updatedIntent.metadata);

    return NextResponse.json({ 
      updated: true, 
      paymentIntentId: intentId,
      metadata: updatedIntent.metadata
    });
  } catch (error) {
    console.error('Error updating payment intent:', error);
    return NextResponse.json(
      { error: 'Error updating payment intent' },
      { status: 500 }
    );
  }
} 