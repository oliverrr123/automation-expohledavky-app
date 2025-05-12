import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email templates - simplified for testing
const emailTemplates = {
  cs: {
    subject: '[TEST] Potvrzení platby za lustraci',
    greeting: "Dobrý den,",
    body: "Toto je testovací email.",
    details: "Toto je pouze test, nikoliv skutečná platba.",
    requestDetails: "Testovací údaje:",
    amount: "Částka:",
    closing: "S pozdravem,",
    signature: "Tým EX Pohledávky",
    contactUs: "V případě jakýchkoli dotazů nás neváhejte kontaktovat."
  }
};

// Email configurations
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

export async function GET(request: Request) {
  console.log('🐞 Debug payment email endpoint called');
  const url = new URL(request.url);
  
  // Get parameters from query string
  const email = url.searchParams.get('email') || process.env.EMAIL_USER_CS || '';
  const amount = parseFloat(url.searchParams.get('amount') || '1000');
  const notes = url.searchParams.get('notes') || 'Toto je testovací požadavek na lustraci.';
  const language = url.searchParams.get('lang') || 'cs';
  
  console.log(`Debug parameters:
    - Email: ${email}
    - Amount: ${amount}
    - Language: ${language}
    - Notes: ${notes}
  `);
  
  try {
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
    const template = emailTemplates.cs; // Using only Czech for simplicity in test
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
    
    // The HTML email template for customer - simplified for test
    const htmlTemplate = `<!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>[DEBUG] ${template.subject}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px; }
          .amount-box { background-color: #fff7ed; border-left: 4px solid #f97316; padding: 12px 15px; margin: 20px 0; border-radius: 4px; }
          .notes-box { background-color: #f9fafb; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h2>[DEBUG TEST] ${template.subject}</h2>
          <p>${template.greeting}</p>
          <p>${template.body}</p>
          <p>${template.details}</p>
          <div class="amount-box"><strong>${template.amount}</strong> ${amountFormatted}</div>
          <h3>${template.requestDetails}</h3>
          <div class="notes-box">${notes}</div>
          <p>Test timestamp: ${new Date().toISOString()}</p>
          <p>${template.closing}</p>
          <p>${template.signature}</p>
        </div>
      </body>
      </html>`;

    // 1. Send test email
    console.log('🚀 Sending test payment email to:', email);
    const info = await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: '[DEBUG] ' + template.subject,
      html: htmlTemplate,
    });
    
    console.log('✅ Test payment email sent successfully:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Test payment email sent successfully',
      emailInfo: info.messageId,
      config: {
        host: emailConfig.host,
        port: emailConfig.port,
        credentials: emailConfig.auth.user ? 'Set' : 'Missing',
        email: email
      }
    });
  } catch (error) {
    console.error('❌ Error sending test payment email:', error);
    
    // Provide detailed diagnostics
    const diagnostics = {
      environmentVars: {
        EMAIL_USER_CS: process.env.EMAIL_USER_CS ? '✅ Set' : '❌ Missing',
        EMAIL_PASSWORD_CS: process.env.EMAIL_PASSWORD_CS ? '✅ Set' : '❌ Missing',
        EMAIL_USER_SK: process.env.EMAIL_USER_SK ? '✅ Set' : '❌ Missing',
        EMAIL_PASSWORD_SK: process.env.EMAIL_PASSWORD_SK ? '✅ Set' : '❌ Missing',
        EMAIL_USER_EN: process.env.EMAIL_USER_EN ? '✅ Set' : '❌ Missing',
        EMAIL_PASSWORD_EN: process.env.EMAIL_PASSWORD_EN ? '✅ Set' : '❌ Missing',
        EMAIL_USER_DE: process.env.EMAIL_USER_DE ? '✅ Set' : '❌ Missing',
        EMAIL_PASSWORD_DE: process.env.EMAIL_PASSWORD_DE ? '✅ Set' : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV || 'Not set'
      },
      requestDetails: {
        email: email,
        amount: amount,
        language: language
      },
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : String(error)
    };
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send test payment email',
        diagnostics: diagnostics
      },
      { status: 500 }
    );
  }
} 