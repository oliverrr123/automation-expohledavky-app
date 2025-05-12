import React, { useState, useEffect, useRef } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface PaymentFormProps {
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
  amount: number;
  buttonText?: string;
  onEmailChange?: (email: string) => void;
  onNotesChange?: (notes: string) => void;
  language?: string;
}

export function PaymentForm({
  onPaymentSuccess,
  onPaymentError,
  amount,
  buttonText = 'Pay Now',
  onEmailChange,
  onNotesChange,
  language,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [notes, setNotes] = useState('');
  const [notesError, setNotesError] = useState<string | undefined>();
  const [companyIdWarningShown, setCompanyIdWarningShown] = useState(false);
  const t = useTranslations('screeningPage');
  
  // Add ref for the notes textarea
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validateCompanyId = (notes: string) => {
    // Use the language prop passed from PaymentModal instead of t?.__lang
    const lang = language;
    
    let validationPattern: RegExp;
    let companyIdFound = false;
    
    if (lang === 'de') {
      // For German: Looking for a pattern like XXX12345 (3 letters followed by 5 digits)
      validationPattern = /[A-Za-z]{3}\d{5}/;
      companyIdFound = validationPattern.test(notes);
    } else {
      // For Czech and Slovak: Looking for 8 digit number (it can be part of longer text)
      validationPattern = /\d{8}/;
      companyIdFound = validationPattern.test(notes);
    }
    
    return companyIdFound;
  };

  // Notify parent components when email or notes change
  useEffect(() => {
    if (onEmailChange) {
      onEmailChange(email);
    }
  }, [email, onEmailChange]);

  useEffect(() => {
    if (onNotesChange) {
      onNotesChange(notes);
    }
  }, [notes, onNotesChange]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate email
    if (!email || !validateEmail(email)) {
      setEmailError(t?.payment?.emailError);
      return;
    } else {
      setEmailError(undefined);
    }
    
    // Validate company identification number in notes - only on first attempt
    if (!validateCompanyId(notes) && !companyIdWarningShown) {
      const lang = language || 'cs';
      setNotesError(t?.payment?.companyIdError);
      
      // Mark that we've shown the warning
      setCompanyIdWarningShown(true);
      
      // Scroll to the notes textarea with smooth behavior
      if (notesRef.current) {
        notesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        notesRef.current.focus();
      }
      
      return;
    } else {
      setNotesError(undefined);
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      // Store in cookies as a fallback
      try {
        await fetch('/api/stripe/update-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email,
            notes
          }),
        });
        
        // Try to directly update the payment intent if possible
        // Get the clientSecret from the payment element
        const element = elements.getElement(PaymentElement);
        if (element) {
          try {
            // Get any data-* attributes from the iframe that might contain the client secret
            const iframe = document.querySelector('iframe[src*="elements"]');
            if (iframe) {
              const src = iframe.getAttribute('src');
              if (src && src.includes('client_secret=')) {
                const clientSecret = new URLSearchParams(src.split('?')[1]).get('client_secret');
                if (clientSecret) {
                  // Get payment intent ID from the client secret
                  const paymentIntentId = clientSecret.split('_secret_')[0];
                  // Update the payment intent
                  await fetch('/api/stripe/update-payment-intent', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      paymentIntentId,
                      notes,
                      email
                    }),
                  });
                  console.log('Successfully updated payment intent with description');
                }
              }
            }
          } catch (e) {
            console.error('Error updating payment intent description:', e);
          }
        }
        
        console.log("Notes stored in cookies for payment");
      } catch (updateError) {
        console.error('Could not store notes data:', updateError);
        // Continue with payment even if metadata update fails
      }

      // Now confirm the payment - pass the notes directly in metadata to the receipt_email field
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/lustrace/payment-success?email=${encodeURIComponent(email)}&notes=${encodeURIComponent(notes)}`,
          payment_method_data: {
            billing_details: {
              email: email,
              name: `Notes: ${notes}`, // Keep the name to make sure it propagates
            },
          },
          receipt_email: email,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        if (onPaymentError) {
          onPaymentError(error.message || t?.payment?.errorMessage);
        }
      } else {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message || t?.payment?.errorMessage);
      if (onPaymentError) {
        onPaymentError(error.message || t?.payment?.errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get cookie value
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t?.payment?.emailLabel}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t?.payment?.emailPlaceholder}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            {t?.payment?.notesLabel}
          </label>
          <textarea
            id="notes"
            ref={notesRef}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              // Clear error when user types
              if (notesError) {
                setNotesError(undefined);
              }
            }}
            placeholder={t?.payment?.notesPlaceholder}
            className={`w-full px-4 py-2.5 border ${notesError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'} min-h-[100px]`}
            rows={4}
          />
          {notesError ? (
            <p className="mt-1 text-sm text-red-600">{notesError}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              {t?.payment?.notesHelp}
            </p>
          )}
        </div>
      </div>
      
      <PaymentElement />
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
      
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105 h-14"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t?.payment?.processing}
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
} 