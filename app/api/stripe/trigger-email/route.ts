import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Email templates for different languages (copied from webhook route)
const emailTemplates = {
  cs: {
    subject: 'Potvrzení platby za lustraci',
    greeting: "Dobrý den,",
    body: "Děkujeme za Vaši objednávku lustrace.",
    details: "Vaše lustrace bude zpracována v nejbližším možném termínu.",
    requestDetails: "Detaily Vašeho požadavku:",
    amount: "Částka:",
    closing: "S pozdravem,",
    signature: "Tým EX Pohledávky",
    contactUs: "V případě jakýchkoli dotazů nás neváhejte kontaktovat."
  },
  sk: {
    subject: 'Potvrdenie platby za lustráciu',
    greeting: "Dobrý deň,",
    body: "Ďakujeme za Vašu objednávku lustrácie.",
    details: "Vaša lustrácia bude spracovaná v najbližšom možnom termíne.",
    requestDetails: "Detaily Vašej požiadavky:",
    amount: "Suma:",
    closing: "S pozdravom,",
    signature: "Tím EX Pohľadávky",
    contactUs: "V prípade akýchkoľvek otázok nás neváhajte kontaktovať."
  },
  en: {
    subject: 'Payment Confirmation for Background Check',
    greeting: "Hello,",
    body: "Thank you for your background check order.",
    details: "Your background check will be processed as soon as possible.",
    requestDetails: "Details of your request:",
    amount: "Amount:",
    closing: "Best regards,",
    signature: "EX Receivables Team",
    contactUs: "If you have any questions, please don't hesitate to contact us."
  },
  de: {
    subject: 'Zahlungsbestätigung für Hintergrundprüfung',
    greeting: "Guten Tag,",
    body: "Vielen Dank für Ihre Bestellung der Hintergrundprüfung.",
    details: "Ihre Hintergrundprüfung wird schnellstmöglich bearbeitet.",
    requestDetails: "Details Ihrer Anfrage:",
    amount: "Betrag:",
    closing: "Mit freundlichen Grüßen,",
    signature: "EX Forderungen Team",
    contactUs: "Bei Fragen zögern Sie bitte nicht, uns zu kontaktieren."
  }
};

// Email configurations for different languages
const emailConfigs = {
  cs: {
    host: "smtp.seznam.cz",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER_CS,
      pass: process.env.EMAIL_PASSWORD_CS,
    },
  },
  sk: {
    host: "smtp.seznam.cz",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER_SK,
      pass: process.env.EMAIL_PASSWORD_SK,
    },
  },
  en: {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER_EN,
      pass: process.env.EMAIL_PASSWORD_EN,
    },
  },
  de: {
    host: "smtp.seznam.cz",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER_DE,
      pass: process.env.EMAIL_PASSWORD_DE,
    },
  }
};

// Function to send email (simplified version from webhook route)
async function sendCustomerEmail(email: string, amount: number, notes: string, language: string = 'cs', paymentIntent: any) {
  try {
    console.log('🔍 Starting email sending process in trigger-email route...');
    
    // Format amount based on language
    let amountFormatted;
    
    switch(language) {
      case 'en':
        amountFormatted = '£' + amount.toLocaleString('en-GB');
        break;
      case 'sk':
        amountFormatted = amount.toLocaleString('sk-SK') + ' €';
        break;
      case 'de':
        amountFormatted = amount.toLocaleString('de-DE') + ' €';
        break;
      case 'cs':
      default:
        amountFormatted = amount.toLocaleString('cs-CZ') + ' Kč';
        break;
    }
    
    // Get template based on language or default to Czech
    const template = emailTemplates[language as keyof typeof emailTemplates] || emailTemplates.cs;
    const emailConfig = emailConfigs[language as keyof typeof emailConfigs] || emailConfigs.cs;
    
    console.log('📧 Email configuration:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user ? `${emailConfig.auth.user.substring(0, 3)}...` : '❌ Missing',
        pass: emailConfig.auth.pass ? '✅ Password set (hidden)' : '❌ Missing',
      }
    });

    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      throw new Error('Email credentials are missing! Check your environment variables.');
    }

    console.log('🔌 Creating nodemailer transporter...');
    const transporter = nodemailer.createTransport(emailConfig);

    console.log('✅ Verifying SMTP connection...');
    await transporter.verify();
    console.log('👍 SMTP connection verified successfully');

    // Simplified HTML template
    const htmlTemplate = `<!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>[MANUAL TRIGGER] ${template.subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
          .header { background: #f97316; color: white; padding: 10px; text-align: center; }
          .box { background: #fff; padding: 15px; margin: 15px 0; border-left: 4px solid #f97316; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>[MANUALLY TRIGGERED] ${template.subject}</h2>
          </div>
          <p>${template.greeting}</p>
          <p>${template.body}</p>
          <p>${template.details}</p>
          <div class="box">
            <strong>${template.amount}</strong> ${amountFormatted}
          </div>
          <h3>${template.requestDetails}</h3>
          <div class="box">
            ${notes}
          </div>
          <p>Payment ID: ${paymentIntent.id}</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <p>This email was triggered manually to debug webhook issues.</p>
          <p>${template.closing}</p>
          <p>${template.signature}</p>
        </div>
      </body>
      </html>`;

    // Send the emails
    console.log('🚀 Sending email to customer:', email);
    const customerInfo = await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: '[MANUAL] ' + template.subject,
      html: htmlTemplate,
    });
    
    console.log('🚀 Sending admin notification to:', emailConfig.auth.user);
    const adminInfo = await transporter.sendMail({
      from: emailConfig.auth.user,
      to: emailConfig.auth.user,
      subject: `[MANUAL ADMIN] Payment for ${email}`,
      html: htmlTemplate,
    });
    
    console.log('✅ Both emails sent successfully!');
    return { success: true, customerEmail: customerInfo.messageId, adminEmail: adminInfo.messageId };
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    return { success: false, error: String(error) };
  }
}

export async function GET(request: Request) {
  console.log('🔔 Manual trigger-email endpoint called');
  
  try {
    const url = new URL(request.url);
    const paymentIntentId = url.searchParams.get('payment_intent_id');
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing payment_intent_id parameter' },
        { status: 400 }
      );
    }
    
    console.log('🔍 Retrieving payment intent details for:', paymentIntentId);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 404 }
      );
    }
    
    console.log('💰 Payment intent found:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      email: paymentIntent.receipt_email || paymentIntent.metadata?.email,
      notes: paymentIntent.metadata?.notes || 'No notes provided',
      metadata: paymentIntent.metadata
    });
    
    // Extract necessary data
    const email = paymentIntent.receipt_email || paymentIntent.metadata?.email || '';
    if (!email) {
      return NextResponse.json(
        { error: 'No email found in payment intent' },
        { status: 400 }
      );
    }
    
    const amount = paymentIntent.amount / 100; // Convert cents to whole currency
    const notes = paymentIntent.metadata?.notes || 'No specific data for background check provided.';
    const language = paymentIntent.metadata?.language || 'cs';
    
    // Send the emails
    console.log('📧 Triggering email sending process...');
    const emailResult = await sendCustomerEmail(email, amount, notes, language, paymentIntent);
    
    return NextResponse.json({
      success: true,
      message: 'Manual email trigger completed',
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: amount,
        currency: paymentIntent.currency
      },
      email: {
        sent: emailResult.success,
        to: email,
        details: emailResult
      }
    });
  } catch (error) {
    console.error('❌ Error in manual email trigger:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to trigger emails',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 