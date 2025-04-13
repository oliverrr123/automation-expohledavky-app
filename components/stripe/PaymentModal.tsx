import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StripeProvider } from './StripeProvider';
import { PaymentForm } from './PaymentForm';
import { useTranslations } from '@/lib/i18n';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  serviceName?: string;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
  buttonText?: string;
  language?: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  serviceName = 'Lustrace Service',
  onPaymentSuccess,
  onPaymentError,
  buttonText,
  language,
}: PaymentModalProps) {
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [detectedLanguage, setDetectedLanguage] = useState<string>(language || 'cs');
  const t = useTranslations('screeningPage');

  // Detect browser language on mount
  useEffect(() => {
    if (!language && typeof navigator !== 'undefined') {
      const browserLang = (navigator.language || navigator.languages?.[0] || 'cs').split('-')[0];
      // Only accept our supported languages
      const supportedLang = ['cs', 'sk', 'en', 'de'].includes(browserLang) ? browserLang : 'cs';
      setDetectedLanguage(supportedLang);
    }
  }, [language]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right text-gray-500 hover:text-gray-700 focus:outline-none z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t?.payment?.title}
            </h3>
            <p className="text-gray-600">
              {t?.payment?.subtitle} {serviceName}
            </p>
            <div className="mt-2 text-2xl font-bold text-orange-600">
              {amount.toLocaleString(detectedLanguage === 'cs' ? 'cs-CZ' : detectedLanguage === 'sk' ? 'sk-SK' : detectedLanguage === 'de' ? 'de-DE' : 'en-GB', {
                style: 'currency',
                currency: detectedLanguage === 'cs' ? 'CZK' : detectedLanguage === 'sk' ? 'EUR' : detectedLanguage === 'de' ? 'EUR' : 'GBP',
              })}
            </div>
          </div>

          <StripeProvider 
            amount={amount} 
            email={email} 
            notes={notes}
            language={detectedLanguage}
          >
            <PaymentForm
              amount={amount}
              onPaymentSuccess={onPaymentSuccess}
              onPaymentError={onPaymentError}
              buttonText={buttonText}
              onEmailChange={setEmail}
              onNotesChange={setNotes}
              language={detectedLanguage}
            />
          </StripeProvider>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              {t?.payment?.terms}{' '}
              <a href="/terms" className="text-orange-600 hover:underline">
                {t?.payment?.termsLink}
              </a>{' '}
              {t?.payment?.and}{' '}
              <a href="/privacy-policy" className="text-orange-600 hover:underline">
                {t?.payment?.privacyLink}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 