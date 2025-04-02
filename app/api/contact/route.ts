import { NextRequest, NextResponse } from 'next/server';
import { validateCSRFToken } from '@/lib/csrf';
import { sendEmail } from '@/lib/email';

// Verify reCAPTCHA Enterprise token
async function verifyRecaptchaToken(token: string, action: string) {
  try {
    // Log token for debugging
    console.log(`Verifying reCAPTCHA token for action: ${action}`);
    console.log(`Using site key: ${process.env.RECAPTCHA_SITE_KEY}`);
    console.log(`API Key available: ${!!process.env.RECAPTCHA_API_KEY}`);
  
    // Check if we have the required environment variables
    if (!process.env.RECAPTCHA_SITE_KEY || !process.env.RECAPTCHA_API_KEY) {
      console.error('Missing RECAPTCHA_SITE_KEY or RECAPTCHA_API_KEY environment variables');
      return { valid: false, score: 0, error: 'Missing reCAPTCHA configuration' };
    }

    // Get project ID from environment variable or use default
    const projectId = process.env.RECAPTCHA_PROJECT_ID || 'ex-pohledavky';
    console.log(`Using reCAPTCHA project ID: ${projectId}`);

    // Prepare request for Google reCAPTCHA Enterprise API
    const requestBody = {
      event: {
        token: token,
        expectedAction: action,
        siteKey: process.env.RECAPTCHA_SITE_KEY,
      }
    };

    // Log the request for debugging
    console.log('Sending request to reCAPTCHA API:', 
      `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${process.env.RECAPTCHA_API_KEY.substring(0, 5)}...`);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // Send request to Google's reCAPTCHA Enterprise API
    const response = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`reCAPTCHA API error: ${response.status} ${response.statusText}`);
      console.error('Error details:', errorText);
      
      // Temporarily bypass verification for 403 errors during testing
      if (response.status === 403 && process.env.NODE_ENV === 'development') {
        console.log('DEV MODE: Bypassing 403 error and accepting form submission');
        return { valid: true, score: 0.9, warning: 'API Error 403 bypassed in development' };
      }
      
      return { valid: false, score: 0, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    console.log('reCAPTCHA verification response:', JSON.stringify(data, null, 2));
    
    // Check if token is valid and risk score is acceptable
    if (data.tokenProperties?.valid && data.riskAnalysis?.score >= 0.5) {
      return { valid: true, score: data.riskAnalysis?.score };
    }
    
    return { valid: false, score: data.riskAnalysis?.score || 0 };
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
    const { jmeno, email, telefon, zprava, castka, language } = body;
    
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
      language: language || 'cs' // Default to Czech if no language specified
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