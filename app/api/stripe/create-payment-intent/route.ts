import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Type checking and sanitization
    const amount = typeof body.amount === 'number' ? body.amount : 
                  (typeof body.amount === 'string' ? parseFloat(body.amount) : null);
    
    // Only accept known languages
    const validLanguages = ['cs', 'en', 'sk', 'de'] as const;
    type SupportedLanguage = typeof validLanguages[number];
    
    const language = typeof body.language === 'string' && 
                    validLanguages.includes(body.language as any) 
                    ? body.language as SupportedLanguage : null;
                    
    const email = typeof body.email === 'string' ? body.email.trim() : null;
    const notes = typeof body.notes === 'string' ? body.notes.trim() : null;

    // Debug logging to help identify issues
    console.log('Payment request parameters:', {
      originalAmount: body.amount,
      parsedAmount: amount,
      originalLanguage: body.language,
      parsedLanguage: language,
      email: body.email
    });

    // Validate critical parameters
    if (!amount || isNaN(amount)) {
      console.error(`Invalid amount: ${body.amount}`);
      return NextResponse.json(
        { error: `Valid amount is required, received: ${body.amount}` },
        { status: 400 }
      );
    }

    if (!language) {
      console.error(`Invalid language: ${body.language}`);
      return NextResponse.json(
        { error: `Valid language is required (one of ${validLanguages.join(', ')}), received: ${body.language}` },
        { status: 400 }
      );
    }

    // Define accepted price points for each language
    const validPricePoints: Record<SupportedLanguage, number[]> = {
      'cs': [1199],
      'en': [40],
      'sk': [47],
      'de': [47]
    };

    // Map languages to currencies
    const currencyMap: Record<SupportedLanguage, string> = {
      'cs': 'czk',
      'en': 'gbp',
      'sk': 'eur',
      'de': 'eur'
    };

    // Check if amount is valid for the given language
    if (!validPricePoints[language].includes(amount)) {
      console.error(`Invalid price point combination: language=${language}, amount=${amount}, expected one of: ${validPricePoints[language].join(', ')}`);
      return NextResponse.json(
        { error: `Invalid payment parameters: expected ${validPricePoints[language].join(' or ')} ${currencyMap[language].toUpperCase()} for ${language} language` },
        { status: 400 }
      );
    }

    // At this point we have validated both the language and amount
    const validCurrency = currencyMap[language];
    const validAmount = amount;

    // Create payment intent with validated currency and amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(validAmount * 100), // Convert to cents
      currency: validCurrency,
      automatic_payment_methods: {
        enabled: true,
      },
      description: notes ? notes.substring(0, 100) : 'Lustrace',
      metadata: {
        service: 'lustrace',
        email: email || '', // Store email if provided
        notes: notes || '', // Store notes if provided
        language: language // Store validated language preference
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