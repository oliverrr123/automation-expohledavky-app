"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isTriggering, setIsTriggering] = useState(false);
  
  // Extract the payment intent ID
  const paymentIntentId = searchParams.get('payment_intent');
  
  useEffect(() => {
    // If we have a payment intent ID, try to trigger the email before redirecting
    if (paymentIntentId && !isTriggering) {
      setIsTriggering(true);
      
      // Trigger email sending first
      console.log('Triggering email for payment intent:', paymentIntentId);
      fetch(`/api/stripe/trigger-email?payment_intent_id=${paymentIntentId}`)
        .then(response => response.json())
        .then(data => {
          console.log('Email trigger response:', data);
        })
        .catch(error => {
          console.error('Error triggering confirmation email:', error);
        })
        .finally(() => {
          // Proceed with redirection after email is triggered (or failed)
          redirectToCzechVersion();
        });
    } else {
      // No payment intent ID, just redirect
      redirectToCzechVersion();
    }
  }, [router, searchParams, paymentIntentId, isTriggering]);
  
  const redirectToCzechVersion = () => {
    // Preserve all query parameters
    const queryString = Array.from(searchParams.entries())
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
      
    // Redirect to Czech version with same params
    const redirectPath = `/lustrace/payment-success${queryString ? `?${queryString}` : ''}`;
    router.replace(redirectPath);
  };
  
  // Display loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  );
} 