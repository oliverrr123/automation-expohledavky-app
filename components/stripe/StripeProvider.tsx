import React, { useState, useEffect, useRef } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

// Define context for clientSecret
interface StripeContextProps {
  clientSecret: string | null;
}
const StripeContext = React.createContext<StripeContextProps>({ clientSecret: null });
export const useStripeContext = () => React.useContext(StripeContext);

// Load Stripe outside of render to avoid multiple instances
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface StripeProviderProps {
  amount: number;
  email?: string;
  notes?: string;
  language?: string;
  children: React.ReactNode;
}

export function StripeProvider({ amount, email, notes, language, children }: StripeProviderProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notesRef = useRef(notes);
  const emailRef = useRef(email);
  const languageRef = useRef<string>(language || 'cs'); // Default to Czech if not provided
  const t = useTranslations('screeningPage');

  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Detect browser language as fallback if no language is provided
        const detectedLanguage = 
          languageRef.current || 
          (typeof navigator !== 'undefined' 
            ? (navigator.language || navigator.languages?.[0] || 'cs').split('-')[0]
            : 'cs');
            
        // Store values in localStorage as additional backup
        if (typeof window !== 'undefined') {
          if (emailRef.current) {
            localStorage.setItem('payment_email', emailRef.current);
          }
          if (notesRef.current) {
            localStorage.setItem('payment_notes', notesRef.current);
          }
          localStorage.setItem('payment_language', detectedLanguage);
        }
        
        // Log the parameters being sent to the API
        console.log('Creating payment intent with:', { 
          amount, 
          email: emailRef.current,
          notes: notesRef.current,
          language: detectedLanguage
        });
        
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            amount, 
            email: emailRef.current,
            notes: notesRef.current,
            language: detectedLanguage
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('Error from payment intent API:', data);
          throw new Error(data.error || t?.payment?.errorMessage || 'Unknown error creating payment intent');
        }
        
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error('Error creating payment intent:', err);
        setError(err.message || t?.payment?.errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (amount > 0) {
      getPaymentIntent();
    }
  }, [amount, t?.payment?.errorMessage]); // Keep only amount in dependencies

  // Update the refs when values change
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  useEffect(() => {
    emailRef.current = email;
  }, [email]);

  useEffect(() => {
    languageRef.current = language || languageRef.current;
  }, [language]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-zinc-600">{t?.payment?.processing}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-semibold">{t?.payment?.error}</p>
        <p className="text-sm">{error}</p>
        <p className="text-sm mt-2">{t?.payment?.errorMessage}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <StripeContext.Provider value={{ clientSecret }}>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          locale: languageRef.current === 'cs' ? 'cs' : 
                  languageRef.current === 'sk' ? 'sk' : 
                  languageRef.current === 'de' ? 'de' : 'en',
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#f97316',
              colorBackground: '#ffffff',
              colorText: '#1e293b',
              colorDanger: '#ef4444',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              borderRadius: '8px',
            },
          },
        }}
      >
        {children}
      </Elements>
    </StripeContext.Provider>
  );
} 