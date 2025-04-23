import React, { useState, useEffect, useRef } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { useStripeContext } from './StripeProvider'; // Import context hook

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
  const { clientSecret } = useStripeContext(); // Use context to get clientSecret
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // New state for update API call
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

    if (!stripe || !elements || !clientSecret) {
      console.error('Stripe.js, Elements, or clientSecret not loaded.');
      setErrorMessage(t?.payment?.setupError || 'Payment setup error. Please refresh.');
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
      setCompanyIdWarningShown(true);
      if (notesRef.current) {
        notesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        notesRef.current.focus();
      }
      return;
    } else {
      setNotesError(undefined);
    }

    setIsLoading(true);
    setIsUpdating(true); // Start update indicator
    setErrorMessage(undefined);

    try {
      // --- Step 1: Update Payment Intent Metadata ---
      const paymentIntentId = clientSecret.split('_secret_')[0];
      if (!paymentIntentId) {
        throw new Error('Could not extract Payment Intent ID from client secret.');
      }

      console.log(`Attempting to update metadata for Payment Intent: ${paymentIntentId}`);
      const updateResponse = await fetch('/api/stripe/update-payment-intent', {
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

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        console.error('Error updating payment intent:', updateData);
        throw new Error(updateData.error || 'Failed to save details before payment.');
      }
      console.log('Successfully updated payment intent metadata.');
      setIsUpdating(false); // Finish update indicator

      // --- Step 2: Confirm Payment --- 
      console.log('Proceeding to confirm payment.');
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Pass email for Stripe receipt and fraud detection
          receipt_email: email,
          // Redirect URL after successful payment
          return_url: `${window.location.origin}/${language}/lustrace/payment-success?email=${encodeURIComponent(email)}&notes=${encodeURIComponent(notes)}`, 
        },
        // We handle the redirect manually or via the return_url, 
        // so we set redirect to 'if_required'
        redirect: 'if_required',
      });

      if (confirmError) {
        // This will point to an element in the Payment Element hierarchy
        console.error('Stripe confirmPayment error:', confirmError);
        setErrorMessage(confirmError.message || 'An unexpected error occurred during payment.');
        if (onPaymentError) {
          onPaymentError(confirmError.message || t?.payment?.errorMessage);
        }
      } else {
        // Payment succeeded or requires further action (like 3DS)
        // If redirect: 'if_required', Stripe.js handles the redirect.
        // If no redirect happens, it means success without further action.
        console.log('Payment confirmation successful (or requires further action handled by Stripe).');
        if (onPaymentSuccess) {
          // Note: onPaymentSuccess might redirect away before this logs completely
          onPaymentSuccess();
        }
      }
    } catch (error: any) {
      console.error('Error during payment process:', error);
      setErrorMessage(error.message || t?.payment?.errorMessage);
      if (onPaymentError) {
        onPaymentError(error.message || t?.payment?.errorMessage);
      }
    } finally {
      setIsLoading(false);
      setIsUpdating(false); // Ensure update indicator is off on error/finally
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
      
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || isLoading} 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105 h-14"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        {isUpdating ? t?.payment?.savingDetails || 'Saving Details...' : 
         isLoading ? t?.payment?.processing || 'Processing...' : 
         buttonText}
      </Button>
    </form>
  );
} 