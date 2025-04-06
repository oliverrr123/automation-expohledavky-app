import { NextResponse } from 'next/server';

// Map to store payment success information by payment intent ID
const paymentSuccessInfo = new Map<string, { 
  timestamp: number, // When the info was stored
  email?: string, 
  notes?: string,
  language?: string
}>();

// Clean up entries older than 1 hour
function cleanupOldEntries() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  
  for (const [key, value] of paymentSuccessInfo.entries()) {
    if (now - value.timestamp > oneHour) {
      paymentSuccessInfo.delete(key);
    }
  }
}

// Store information from payment success page
export async function POST(request: Request) {
  try {
    // Clean up old entries first
    cleanupOldEntries();
    
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent');
    const email = searchParams.get('email');
    const notes = searchParams.get('notes');
    const language = searchParams.get('language') || 'cs';
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }
    
    // Store the information
    paymentSuccessInfo.set(paymentIntentId, {
      timestamp: Date.now(),
      email: email || undefined,
      notes: notes || undefined,
      language: language
    });
    
    console.log(`Stored payment success info for payment intent ${paymentIntentId}:
      - Email: ${email || 'Not provided'}
      - Notes: ${notes ? 'Provided' : 'Not provided'}
      - Language: ${language}
    `);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing payment success info:', error);
    return NextResponse.json(
      { error: 'Error storing payment success info' },
      { status: 500 }
    );
  }
}

// Retrieve information for a payment intent
export async function GET(request: Request) {
  try {
    // Clean up old entries first
    cleanupOldEntries();
    
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent');
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }
    
    // Get stored information
    const info = paymentSuccessInfo.get(paymentIntentId);
    
    if (!info) {
      return NextResponse.json(
        { error: 'No information found for this payment intent' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      email: info.email,
      notes: info.notes,
      language: info.language
    });
  } catch (error) {
    console.error('Error retrieving payment success info:', error);
    return NextResponse.json(
      { error: 'Error retrieving payment success info' },
      { status: 500 }
    );
  }
} 