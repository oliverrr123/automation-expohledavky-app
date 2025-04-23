import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Email templates for different languages
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

// Custom function to send only customer email, not owner copy
async function sendCustomerEmail(email: string, amount: number, notes: string, language: string = 'cs', paymentData?: any) {
  try {
    console.log('🔍 Starting email sending process...');
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
      console.error('❌ Email credentials are missing! Check your environment variables.');
      return { success: false, error: 'Email credentials are missing' };
    }

    console.log('🔌 Creating nodemailer transporter...');
    const transporter = nodemailer.createTransport(emailConfig);

    console.log('✅ Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('👍 SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP verification failed:', verifyError);
      return { success: false, error: 'SMTP verification failed', details: verifyError };
    }
    
    // The HTML email template for customer
    const customerHtmlTemplate = `<!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          .email-header { background-color: #f97316; color: white; padding: 20px 30px; text-align: center; }
          .email-header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .email-body { padding: 30px; color: #4b5563; }
          .email-body p { margin: 0 0 15px; }
          .amount-box { background-color: #fff7ed; border-left: 4px solid #f97316; padding: 12px 15px; margin: 20px 0; border-radius: 4px; }
          .amount-value { font-size: 22px; font-weight: 600; color: #f97316; }
          .notes-box { background-color: #f9fafb; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb; margin-top: 20px; white-space: pre-line; }
          .notes-box h3 { margin-top: 0; color: #374151; font-size: 16px; font-weight: 600; }
          .email-footer { padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
          .email-footer p { margin: 0; line-height: 1.5; }
          .email-footer .website { margin-top: 5px; }
          .signature { margin-top: 20px; font-weight: 600; color: #4b5563; }
          .signature p { margin: 0; line-height: 1.5; }
          .signature p:first-child { font-weight: normal; margin-bottom: 5px; }
          .contact-us { margin-top: 15px; font-style: italic; }
          .contact-signature { margin-top: 30px; padding-top: 15px; border-top: 1px dashed #e5e7eb; }
          @media screen and (max-width: 600px) { .email-container { width: 100%; border-radius: 0; } .email-header, .email-body, .email-footer { padding: 15px; } }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header"><h1>${template.subject}</h1></div>
          <div class="email-body">
            <p>${template.greeting}</p>
            <p>${template.body}</p>
            <p>${template.details}</p>
            <div class="amount-box"><strong>${template.amount}</strong><div class="amount-value">${amountFormatted}</div></div>
            <h3>${template.requestDetails}</h3>
            <div class="notes-box">${notes.replace(/\n/g, "<br>")}</div>
            <div class="contact-signature">
              <p class="contact-us">${template.contactUs}</p>
              <div class="signature">
                <p>${template.closing}</p>
                <p>${template.signature}</p>
              </div>
            </div>
          </div>
          <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} EX Pohledávky</p>
            <p class="website"><a href="https://www.expohledavky.cz" style="color: #f97316; text-decoration: none;">www.expohledavky.cz</a></p>
          </div>
        </div>
      </body>
      </html>`;

    // Determine localized texts for admin email
    let adminSubject: string;
    let adminCallToAction: string;

    switch(language) {
      case 'sk':
        adminSubject = `Nová požiadavka na lustráciu pre ${email}`;
        adminCallToAction = 'Prosím, zahajte spracovanie tejto požiadavky.';
        break;
      case 'de':
        adminSubject = `Neue Anfrage zur Hintergrundprüfung für ${email}`;
        adminCallToAction = 'Bitte beginnen Sie mit der Bearbeitung dieser Anfrage.';
        break;
      case 'en':
        adminSubject = `New Background Check Request for ${email}`;
        adminCallToAction = 'Please begin processing this request.';
        break;
      case 'cs':
      default:
        adminSubject = `Nový požadavek na lustraci pro ${email}`;
        adminCallToAction = 'Prosím, zahajte zpracování tohoto požadavku.';
        break;
    }

    // The HTML email template for admin - includes additional payment details AND call to action
    const adminHtmlTemplate = `<!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nová lustrace k vyřízení / New Background Check Request</title> 
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          .email-header { background-color: #143466; color: white; padding: 20px 30px; text-align: center; }
          .email-header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .email-body { padding: 30px; color: #4b5563; }
          .email-body p { margin: 0 0 15px; }
          .amount-box { background-color: #f2f7ff; border-left: 4px solid #3b82f6; padding: 12px 15px; margin: 20px 0; border-radius: 4px; }
          .amount-value { font-size: 22px; font-weight: 600; color: #3b82f6; }
          .payment-details { background-color: #f9fafb; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb; margin-top: 20px; }
          .payment-details h3 { margin-top: 0; color: #374151; font-size: 16px; font-weight: 600; }
          .payment-details table { width: 100%; border-collapse: collapse; }
          .payment-details table td { padding: 6px 4px; }
          .payment-details table tr:not(:last-child) td { border-bottom: 1px solid #edf2f7; }
          .payment-details table td:first-child { font-weight: 500; color: #3d85c6; width: 30%; }
          .notes-box { background-color: #f9fafb; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb; margin-top: 20px; white-space: pre-line; }
          .email-footer { padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
          .call-to-action { padding: 15px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 4px; margin-top: 20px; text-align: center; font-weight: bold; color: #92400e; }
          @media screen and (max-width: 600px) { .email-container { width: 100%; border-radius: 0; } .email-header, .email-body, .email-footer { padding: 15px; } }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header"><h1>${
            language === 'cs' ? 'Nový požadavek na lustraci' :
            language === 'sk' ? 'Nová požiadavka na lustráciu' :
            language === 'de' ? 'Neue Anfrage zur Hintergrundprüfung' :
            'New Background Check Request'
          }</h1></div>
          <div class="email-body">
            <p>${
              language === 'cs' ? 'Byl přijat nový požadavek na lustraci.' :
              language === 'sk' ? 'Bola prijatá nová požiadavka na lustráciu.' :
              language === 'de' ? 'Eine neue Anfrage zur Hintergrundprüfung wurde erhalten.' :
              'A new background check request has been received.'
            }</p>
            
            <div class="call-to-action">${adminCallToAction}</div>
            
            <div class="payment-details">
              <h3>${
                language === 'cs' ? 'Detaily platby a požadavku' :
                language === 'sk' ? 'Detaily platby a požiadavky' :
                language === 'de' ? 'Zahlungs- und Anfragedetails' :
                'Payment and Request Details'
              }</h3>
              <table>
                <tr>
                  <td>${
                    language === 'cs' ? 'Email zákazníka:' :
                    language === 'sk' ? 'Email zákazníka:' :
                    language === 'de' ? 'Kunden-Email:' :
                    'Customer Email:'
                  }</td>
                  <td>${email}</td>
                </tr>
                <tr>
                  <td>Payment ID:</td>
                  <td>${paymentData?.id || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Customer ID:</td>
                  <td>${paymentData?.customer || 'N/A'}</td>
                </tr>
                <tr>
                  <td>${
                    language === 'cs' ? 'Datum:' :
                    language === 'sk' ? 'Dátum:' :
                    language === 'de' ? 'Datum:' :
                    'Date:'
                  }</td>
                  <td>${new Date().toLocaleString(
                    language === 'cs' ? 'cs-CZ' :
                    language === 'sk' ? 'sk-SK' :
                    language === 'de' ? 'de-DE' :
                    'en-GB'
                  )}</td>
                </tr>
              </table>
            </div>

            <h3>${
              language === 'cs' ? 'Požadavky zákazníka' :
              language === 'sk' ? 'Požiadavky zákazníka' :
              language === 'de' ? 'Kundenanforderungen' :
              'Customer Requirements'
            }</h3>
            <div class="notes-box">${notes.replace(/\n/g, "<br>")}</div>
          </div>
          <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} ${
              language === 'cs' ? 'EX Pohledávky' :
              language === 'sk' ? 'EX Pohľadávky' :
              language === 'de' ? 'EX Forderungen' :
              'EX Receivables'
            } - ${
              language === 'cs' ? 'Administrativní oznámení' :
              language === 'sk' ? 'Administratívne oznámenie' :
              language === 'de' ? 'Administrationsbenachrichtigung' :
              'Admin Notification'
            }</p>
          </div>
        </div>
      </body>
      </html>`;

    // 1. Send email to customer
    console.log('🚀 Attempting to send customer email to:', email);
    try {
      const customerInfo = await transporter.sendMail({
        from: emailConfig.auth.user,
        to: email,
        subject: template.subject,
        html: customerHtmlTemplate,
      });
      console.log('✅ Customer email sent successfully:', customerInfo.messageId);
    } catch (customerEmailError) {
      console.error('❌ Failed to send customer email:', customerEmailError);
      return { success: false, error: 'Failed to send customer email', details: customerEmailError };
    }
    
    // 2. Send a separate email to the site owner
    const ownerEmail = emailConfig.auth.user;
    console.log('🚀 Attempting to send site owner email to:', ownerEmail);
    try {
      const ownerInfo = await transporter.sendMail({
        from: emailConfig.auth.user,
        to: ownerEmail,
        subject: adminSubject,
        html: adminHtmlTemplate,
      });
      console.log('✅ Site owner email sent successfully:', ownerInfo.messageId);
    } catch (ownerEmailError) {
      console.error('❌ Failed to send site owner email:', ownerEmailError);
      // Continue even if owner email fails
    }
    
    console.log('🎉 All emails sent successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error in sendCustomerEmail function:', error);
    return { success: false, error: 'Failed to send confirmation email', details: error };
  }
}

export async function POST(request: Request) {
  console.log('⚡ Webhook received!');
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      console.error('❌ Webhook secret is not configured in environment variables!');
      return NextResponse.json(
        { error: 'Webhook secret is not configured' },
        { status: 500 }
      );
    }

    console.log('🔍 Verifying Stripe signature...');
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('✅ Signature verified, event type:', event.type);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('💰 Payment succeeded event received, processing...');
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const amount = paymentIntent.amount / 100; // Convert cents to whole currency
        
        // Check if there are pending notes in cookies
        const cookieStore = cookies();
        const storedEmail = cookieStore.get('payment_email')?.value;
        const storedNotes = cookieStore.get('payment_notes')?.value;
        
        // Try to get URL parameters from payment success page redirection
        let urlParams: { email?: string, notes?: string } = {};
        try {
          // Look at the payment intent ID in the URL parameters directly
          if (paymentIntent.id) {
            // Since receipt_email works, let's focus on extracting notes
            try {
              // Extract notes from billing details if available
              if (paymentIntent.payment_method) {
                const paymentMethod = await stripe.paymentMethods.retrieve(
                  paymentIntent.payment_method as string
                );
                
                if (paymentMethod.billing_details?.name) {
                  // Check if the name field has our notes
                  const billingName = paymentMethod.billing_details.name;
                  if (billingName.startsWith('Notes:')) {
                    urlParams.notes = billingName.substring(7).trim();  // Remove "Notes: " prefix
                    console.log('Found notes in payment method billing name:', urlParams.notes);
                  }
                }
              }
              
              // Extract notes from description if available
              if (paymentIntent.description) {
                const descriptionNotes = paymentIntent.description.substring(9).trim();
                if (descriptionNotes) {
                  urlParams.notes = descriptionNotes;
                  console.log('Found notes in payment description:', urlParams.notes);
                }
              }
            } catch (err) {
              console.log('Could not retrieve payment method details:', err);
            }
          }
        } catch (err) {
          console.log('Could not retrieve URL parameters:', err);
        }
        
        // Log all possible sources for email and notes
        console.log(`Debugging email and notes sources:
          - receipt_email: ${paymentIntent.receipt_email || 'Not provided'}
          - metadata.email: ${paymentIntent.metadata?.email || 'Not provided'}
          - stored cookie email: ${storedEmail || 'Not provided'}
          - URL param email: ${urlParams.email || 'Not provided'}
          - description field: ${paymentIntent.description || 'Not provided'}
          ------
          - metadata.notes: ${paymentIntent.metadata?.notes || 'Not provided'}
          - stored cookie notes: ${storedNotes || 'Not provided'}
          - URL param notes: ${urlParams.notes || 'Not provided'}
        `);
        
        // Use cookies, then metadata, then URL params, then fallback
        const email = 
          paymentIntent.receipt_email || 
          paymentIntent.metadata?.email || 
          storedEmail ||
          urlParams.email ||
          'Not provided';
          
        const notes = 
          paymentIntent.metadata?.notes || 
          storedNotes ||
          urlParams.notes ||
          'Nebyla zadána žádná specifická data pro lustraci.';
          
        const customerId = paymentIntent.customer as string;
        const language = paymentIntent.metadata?.language || 'cs'; // Get language if available, default to Czech
        
        // If notes are found but description doesn't have them, update the description
        if (notes && notes !== 'Nebyla zadána žádná specifická data pro lustraci.' && 
            (!paymentIntent.description || !paymentIntent.description.includes(notes.substring(0, 10)))) {
          try {
            console.log('Updating payment intent description with notes...');
            await stripe.paymentIntents.update(
              paymentIntent.id,
              {
                description: notes.substring(0, 100)
              }
            );
            console.log('Successfully updated payment intent description');
          } catch (e) {
            console.error('Error updating payment intent description:', e);
          }
        }
        
        console.log(`
          Payment successful:
          - Amount: ${amount} ${language === 'en' ? 'GBP' : (language === 'sk' || language === 'de') ? 'EUR' : 'CZK'}
          - Email: ${email}
          - Payment ID: ${paymentIntent.id}
          - Customer ID: ${customerId || 'Not available'}
          - Service: ${paymentIntent.metadata?.service || 'lustrace'}
          - Details: ${notes}
          - Language: ${language}
          - All metadata: ${JSON.stringify(paymentIntent.metadata || {})}
        `);
        
        // Send the confirmation emails
        if (email && email !== 'Not provided') {
          console.log('📧 Triggering email sending process...');
          const emailResult = await sendCustomerEmail(email, amount, notes, language, paymentIntent);
          console.log('✅ Email sending process finished. Result:', emailResult);
          // Clear cookies after successful processing
          cookieStore.delete('payment_email');
          cookieStore.delete('payment_notes');
          console.log('🍪 Cleared payment cookies.');
        } else {
          console.error('❌ Cannot send email, email address not found!');
        }
        
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        const failedEmail = failedPaymentIntent.receipt_email || failedPaymentIntent.metadata?.email || 'Not provided';
        const failedNotes = failedPaymentIntent.metadata?.notes || 'Nebyla zadána žádná specifická data pro lustraci.';
        
        console.log(`
          Payment failed:
          - Email: ${failedEmail}
          - Error: ${failedPaymentIntent.last_payment_error?.message}
          - Payment ID: ${failedPaymentIntent.id}
          - Details: ${failedNotes}
          - All metadata: ${JSON.stringify(failedPaymentIntent.metadata || {})}
        `);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}