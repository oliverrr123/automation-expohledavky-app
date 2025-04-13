"use client"

import React, { useEffect, useState } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from "@/lib/i18n"
import { Suspense } from 'react'

// This tells Next.js this page should not be statically generated
export const dynamic = 'force-dynamic';

// Create a component that uses the params - this will be wrapped in Suspense
function PaymentSuccessContent() {
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent')
  const paymentStatus = searchParams.get('redirect_status')
  const email = searchParams.get('email')
  const notes = searchParams.get('notes')
  
  // Get translations
  const t = useTranslations('screeningPage')
  
  // Log the params for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedNotes = localStorage.getItem('payment_notes');
      const finalNotes = notes || storedNotes;
      
      console.log('Payment success params:', {
        paymentIntentId,
        paymentStatus,
        email,
        notes: finalNotes,
        storedNotes
      });
      
      // Make an API call to update the payment intent directly when we have the ID
      if (paymentIntentId) {
        try {
          // First, try to update the payment intent directly to set the description
          fetch('/api/stripe/update-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntentId,
              email: email || localStorage.getItem('payment_email'),
              notes: finalNotes,
            })
          })
          .then(response => response.json())
          .then(data => {
            console.log('Successfully updated payment intent with notes:', data);
            
            // After updating the payment intent, explicitly update the description
            // This is a secondary request to make absolutely sure the description gets set
            return fetch('/api/stripe/update-description', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paymentIntentId: paymentIntentId,
                description: finalNotes ? finalNotes.substring(0, 100) : 'Lustrace',
              })
            });
          })
          .then(response => response.json())
          .then(data => {
            console.log('Successfully updated payment intent description:', data);
          })
          .catch(error => {
            console.error('Error updating payment intent with notes:', error);
          });
        } catch (err) {
          console.error('Could not update payment intent:', err);
        }
      }
    }
  }, [paymentIntentId, email, notes]);
  
  useEffect(() => {
    // Set loading to false after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <main className="flex-grow">
      <div className="max-w-3xl mx-auto mt-48 mb-36 px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t?.success?.title || 'Payment Successful!'}
          </h1>
          <p className="text-gray-600 text-lg">
            {t?.success?.message || 'Thank you for your payment. Your order has been processed successfully.'}
          </p>
        </div>
        
        {paymentIntentId && (
          <div className="border border-gray-100 rounded-md bg-gray-50 p-4 text-center mb-8">
            <p className="text-gray-500 text-sm">Payment Reference: {paymentIntentId}</p>
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t?.success?.nextStepsTitle || 'What happens next?'}
          </h2>
          <ol className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-orange-600 text-sm font-medium">1</span>
              </div>
              <p className="text-gray-700">
                {t?.success?.step1 || 'Our team will process your request and begin the screening process.'}
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-orange-600 text-sm font-medium">2</span>
              </div>
              <p className="text-gray-700">
                {t?.success?.step2 || 'You will receive an email confirmation with details about your order.'}
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-orange-600 text-sm font-medium">3</span>
              </div>
              <p className="text-gray-700">
                {t?.success?.step3 || 'Results will be delivered to you according to the service timeline.'}
              </p>
            </li>
          </ol>
        </div>
        
        <div className="text-center">
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
          >
            <Link href="/">
              {t?.success?.homeButton || 'Return to Homepage'} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

// Main page component with Suspense boundary
export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading payment information...</div>
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
      <Footer />
    </div>
  )
} 