import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Email templates for different languages
const emailTemplates = {
  cs: {
    subject: '[TEST] Potvrzení platby za lustraci',
    greeting: "Dobrý den,",
    body: "Toto je testovací email simulující úspěšnou platbu.",
    details: "Toto je automatický test platebního procesu.",
    requestDetails: "Testovací údaje:",
    amount: "Částka:",
    closing: "S pozdravem,",
    signature: "Tým EX Pohledávky",
    contactUs: "V případě jakýchkoli dotazů nás neváhejte kontaktovat."
  }
};

// Email configuration
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
  // Get parameters from request
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const amount = searchParams.get('amount');
  const language = searchParams.get('language') || 'cs';
  const createCustomer = searchParams.get('createCustomer') === 'true';

  // Check if email parameter exists
  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  try {
    // Simulate order creation
    console.log('Creating order for:', email);
    console.log('Amount:', amount || 'Not specified (using default)');
    console.log('Language:', language);

    // Simulate payment gateway response
    console.log('Simulating payment gateway response...');
    
    // Mock payment data
    const paymentId = `pi_debug_${Math.random().toString(36).substring(2, 10)}`;
    const customerId = createCustomer 
      ? `cus_debug_${Math.random().toString(36).substring(2, 10)}`
      : null;
    
    // Simulation of successful payment
    console.log(`✅ Payment success! ID: ${paymentId}`);
    if (customerId) {
      console.log(`👤 Customer created! ID: ${customerId}`);
    }
    
    // Get payment template
    const templateName = language === 'en' ? 'payment-success-en' :
                         language === 'de' ? 'payment-success-de' :
                         language === 'sk' ? 'payment-success-sk' : 
                         'payment-success-cs';
    
    const template = await getEmailTemplate(templateName);
    
    if (!template) {
      throw new Error(`Email template ${templateName} not found`);
    }
    
    // Replace template variables
    const htmlContent = template.html
      .replace(/\{customerEmail\}/g, email)
      .replace(/\{paymentAmount\}/g, amount || '100 CZK')
      .replace(/\{paymentId\}/g, paymentId)
      .replace(/\{paymentDate\}/g, new Date().toISOString().split('T')[0]);
    
    // Send confirmation email
    try {
      // Choose the correct email config based on language
      const emailConfig = emailConfigs[language as keyof typeof emailConfigs] || emailConfigs.cs;
      
      console.log('📧 Creating transporter with:', {
        host: emailConfig.host,
        auth: {
          user: emailConfig.auth.user ? '✅ Set' : '❌ Missing',
          pass: emailConfig.auth.pass ? '✅ Set' : '❌ Missing'
        }
      });
      
      const transporter = nodemailer.createTransport(emailConfig);
      
      // Verify connection
      await transporter.verify();
      console.log('✅ SMTP connection verified');
      
      const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>DEBUG: Test Payment Confirmation</h2>
          <p>This is a test email for ${email}</p>
          <hr>
          ${htmlContent}
          <hr>
          <p><strong>Debug Info:</strong></p>
          <p>Payment ID: ${paymentId}</p>
          <p>Language: ${language}</p>
          ${customerId ? `<p>Customer ID: ${customerId}</p>` : ''}
          <p>Time: ${new Date().toISOString()}</p>
        </div>
      `;
      
      // 3. Send email to customer
      console.log('📧 Sending email to:', email);
      const info = await transporter.sendMail({
        from: emailConfig.auth.user,
        to: email,
        subject: '[DEBUG FLOW] ' + template.subject,
        html: htmlTemplate,
      });
      
      console.log('✅ Email sent:', info.messageId);
      
      // 4. Also send a copy to yourself (admin)
      await transporter.sendMail({
        from: emailConfig.auth.user,
        to: emailConfig.auth.user,
        subject: '[DEBUG ADMIN] Test payment for ' + email,
        html: htmlTemplate,
      });
      
      console.log('✅ Admin copy sent');
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Error in debug payment flow:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to complete debug payment flow',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 