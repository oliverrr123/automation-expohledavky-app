import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Store notes and email in a server-side session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, notes } = body;
    
    console.log('Storing notes for upcoming payment:');
    console.log(`Email: ${email || 'Not provided'}`);
    console.log(`Notes: ${notes ? 'Provided' : 'Not provided'}`);
    
    // Store in cookies for later retrieval during webhook processing
    const cookieStore = cookies();
    
    // Store email in a cookie (max 1 day expiry)
    if (email) {
      cookieStore.set('payment_email', email, { 
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        httpOnly: true,
        sameSite: 'strict'
      });
    }
    
    // Store notes in a cookie (max 1 day expiry)
    if (notes) {
      cookieStore.set('payment_notes', notes, { 
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        httpOnly: true,
        sameSite: 'strict'
      });
    }

    return NextResponse.json({ 
      success: true,
      stored: {
        email: email ? true : false,
        notes: notes ? true : false
      }
    });
  } catch (error) {
    console.error('Error storing payment notes:', error);
    return NextResponse.json(
      { error: 'Error storing payment notes' },
      { status: 500 }
    );
  }
} 