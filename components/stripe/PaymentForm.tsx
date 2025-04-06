import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PaymentFormProps {
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
  amount: number;
  buttonText?: string;
  onEmailChange?: (email: string) => void;
  onNotesChange?: (notes: string) => void;
}

export function PaymentForm({
  onPaymentSuccess,
  onPaymentError,
  amount,
  buttonText = 'Pay Now',
  onEmailChange,
  onNotesChange,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [notes, setNotes] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
      setEmailError('Zadejte platnou e-mailovou adresu');
      return;
    } else {
      setEmailError(undefined);
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
              name: `Notes: ${notes.substring(0, 40)}...`, // Keep the name to make sure it propagates
            },
          },
          receipt_email: email,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        if (onPaymentError) {
          onPaymentError(error.message || 'Payment failed');
        }
      } else {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred');
      if (onPaymentError) {
        onPaymentError(error.message || 'An unexpected error occurred');
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
            E-mail pro zaslání výsledků
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vase@email.cz"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Detaily k lustraci
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Uveďte koho/co chcete lustrovat (např. ACME s.r.o., IČO: 12345678) a další relevantní informace"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px]"
            rows={4}
          />
          <p className="mt-1 text-xs text-gray-500">
            Tyto informace nám pomohou efektivně provést lustraci dle vašeho požadavku.
          </p>
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
} 