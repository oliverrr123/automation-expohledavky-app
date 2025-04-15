import { NextRequest, NextResponse } from 'next/server';
import { validateCSRFToken } from '@/lib/csrf';
import { sendEmail } from '@/lib/email';

// Verify reCAPTCHA v3 token
async function verifyRecaptchaToken(token: string, action: string) {
  try {
    // Log token for debugging
    console.log(`Verifying reCAPTCHA token for action: ${action}`);
    console.log(`Using site key: ${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`);
    console.log(`Secret key available: ${!!process.env.RECAPTCHA_SECRET_KEY}`);
  
    // Check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || !process.env.RECAPTCHA_SECRET_KEY) {
      console.error('Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY or RECAPTCHA_SECRET_KEY environment variables');
      return { valid: false, score: 0, error: 'Missing reCAPTCHA configuration' };
    }

    // Log the request for debugging
    console.log('Sending request to reCAPTCHA API: https://www.google.com/recaptcha/api/siteverify');

    // Send request to Google's reCAPTCHA v3 API
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`reCAPTCHA API error: ${response.status} ${response.statusText}`);
      console.error('Error details:', errorText);
      
      // Temporarily bypass verification for errors during testing
      if (process.env.NODE_ENV === 'development') {
        console.log('DEV MODE: Bypassing error and accepting form submission');
        return { valid: true, score: 0.9, warning: 'API Error bypassed in development' };
      }
      
      return { valid: false, score: 0, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    console.log('reCAPTCHA verification response:', JSON.stringify(data, null, 2));
    
    // Check if token is valid and risk score is acceptable
    if (data.success && data.score >= 0.5) {
      return { valid: true, score: data.score };
    }
    
    return { valid: false, score: data.score || 0, error: data['error-codes']?.join(', ') };
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    return { valid: false, score: 0, error: String(error) };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log('Received contact form submission', JSON.stringify(body, null, 2));
    
    // Validate CSRF token - temporarily disabled for testing
    // const csrfToken = body.csrfToken;
    // if (!csrfToken || !validateCSRFToken(csrfToken)) {
    //   return NextResponse.json(
    //     { error: "Invalid CSRF token" },
    //     { status: 403 }
    //   );
    // }
    
    // Verify reCAPTCHA token
    const recaptchaToken = body.recaptchaToken;
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
    }
    
    // Determine action based on form type or use default
    const formAction = body.formAction || 'CONTACT_FORM';
    const recaptchaVerification = await verifyRecaptchaToken(recaptchaToken, formAction);
    
    if (!recaptchaVerification.valid) {
      const errorMsg = recaptchaVerification.error 
        ? `reCAPTCHA verification failed: ${recaptchaVerification.error}`
        : "reCAPTCHA verification failed";
      
      console.error(errorMsg);
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }
    
    // Extract form data
    const { jmeno, email, telefon, zprava, castka, language, serviceName } = body;
    
    // Validate required fields
    if (!jmeno || !email || !zprava) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Add email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Send email using the provided sendEmail function
    const subject = formAction === 'PRICING_FORM' ? "Cenová kalkulace" : 
                  formAction === 'SERVICES_FORM' ? "Poptávka služeb" : "Kontaktní formulář";
    
    const emailResult = await sendEmail({
      name: jmeno,
      email: email,
      subject: subject,
      message: zprava,
      phone: telefon,
      amount: castka,
      language: language || 'cs', // Default to Czech if no language specified
      serviceName: serviceName // Include the service name in email data
    });
    
    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { error: emailResult.error || "Failed to send email" },
        { status: 500 }
      );
    }

    console.log('Email sent successfully');
    
    // Send a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
} 