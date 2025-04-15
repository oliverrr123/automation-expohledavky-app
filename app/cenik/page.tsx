"use client"

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useTranslations } from '@/lib/i18n'
import { getCurrentLocale } from "@/lib/i18n"
import { SectionWrapper } from '@/components/section-wrapper'
import { toast } from 'sonner'
import { ContactForm } from '@/components/contact-form'

// Use environment variable for reCAPTCHA site key
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

// Type for form state
type FormStatus = "idle" | "submitting" | "success" | "error"

export default function PricingPage() {
  // Client-side rendering state
  const [isClient, setIsClient] = useState(false)
  
  // Get translations
  const t = useTranslations('pricing-page')
  // Load form translations from the services layout
  const formT = useTranslations('servicesLayout')

  // Set client-side rendering state after mount
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Form state
  const [formData, setFormData] = useState({
    jmeno: "",
    email: "",
    telefon: "",
    castka: "",
    zprava: "",
  })

  const [formStatus, setFormStatus] = useState<FormStatus>("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    try {
      // Get reCAPTCHA Enterprise token
      let recaptchaToken = ""
      
      try {
        // @ts-ignore - window.grecaptcha is added by the script
        if (window.grecaptcha) {
          // @ts-ignore - window.grecaptcha.execute returns a promise
          recaptchaToken = await new Promise((resolve, reject) => {
            try {
              window.grecaptcha.ready(async () => {
                try {
                  // @ts-ignore - window.grecaptcha.execute returns a promise
                  const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'PRICING_FORM'})
                  resolve(token)
                } catch (error) {
                  console.error("reCAPTCHA execution error:", error)
                  reject(error)
                }
              })
            } catch (error) {
              console.error("reCAPTCHA ready error:", error)
              reject(error)
            }
          })
        }
      } catch (error) {
        console.error("reCAPTCHA error:", error)
      }
      
      if (!recaptchaToken) {
        toast.warning(t?.contactForm?.warnings?.recaptchaFailed || "Could not validate your request. Please try again.")
      }

      // Get current locale from URL
      const currentLocale = getCurrentLocale();

      // Send the form data to the API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jmeno: formData.jmeno,
          email: formData.email,
          telefon: formData.telefon,
          zprava: formData.zprava,
          castka: formData.castka,
          recaptchaToken, // Include the token in the request
          formAction: 'PRICING_FORM', // Identify which form this is
          language: currentLocale || 'cs' // Default to Czech if no locale found
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Success
      setFormStatus("success")
      toast.success(t?.contactForm?.success || "Your message has been sent!")
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          jmeno: "",
          email: "",
          telefon: "",
          castka: "",
          zprava: "",
        })
        setFormStatus("idle")
      }, 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormStatus("error")
      toast.error(error instanceof Error ? error.message : t?.contactForm?.error || "Failed to send message")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />

        {/* Animated floating gradients */}
        <div
          className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full animate-float"
          style={{
            background: "radial-gradient(circle at center, rgba(249, 115, 22, 0.03) 0%, rgba(249, 115, 22, 0) 70%)",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full animate-float"
          style={{
            background: "radial-gradient(circle at center, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0) 70%)",
            animationDelay: "-2s",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[800px] h-[800px] rounded-full animate-float"
          style={{
            background: "radial-gradient(circle at center, rgba(249, 115, 22, 0.04) 0%, rgba(249, 115, 22, 0) 70%)",
            animationDelay: "-4s",
          }}
        />

        {/* Gradient mesh */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(249, 115, 22, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(249, 115, 22, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Header />

      <main className="pt-32 pb-24">
        {/* Pricing Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-6">
                    {isClient ? t?.title : ''}
                  </h1>
                </div>

                <div className="mb-8 font-semibold text-lg text-center">
                  {isClient ? t?.subtitle : ''}
                </div>

                {/* Pricing Table */}
                {isClient && (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    {/* Table Header */}
                    <div className="grid grid-cols-2 bg-zinc-900 text-white">
                      <div className="p-4 font-semibold border-r border-zinc-700">
                        {t?.pricingTable?.header?.specification}
                      </div>
                      <div className="p-4 font-semibold text-center">{t?.pricingTable?.header?.rate}</div>
                    </div>

                    {/* Table Rows */}
                    {(t?.pricingTable?.rows || []).map((row: {service: string, price: string}, index: number) => (
                      <div 
                        key={index} 
                        className={`grid grid-cols-2 border-b border-gray-200 ${index % 2 !== 0 ? 'bg-gray-50' : ''}`}
                      >
                        <div className="p-4 border-r border-gray-200">{row?.service}</div>
                        <div className="p-4 text-center font-medium">{row?.price}</div>
                      </div>
                    ))}
                  </div>
                )}

                {isClient && (
                  <div className="text-gray-600 space-y-1 mb-12">
                    {(t?.notes || []).map((note: string, index: number) => (
                      <p key={index}>{note}</p>
                    ))}
                  </div>
                )}
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {isClient && (
              <ContactForm
                badge={t?.contactForm?.badge || formT?.contactForm?.badge || ""}
                title={t?.contactForm?.title || formT?.contactForm?.title || ""}
                description={t?.contactForm?.description || formT?.serviceContactDescriptions?.pricing || formT?.contactForm?.description || ""}
                fields={{
                  name: true,
                  email: true,
                  phone: true,
                  amount: true, // Include amount field for pricing form
                  message: true,
                }}
                formAction="PRICING_FORM"
                showSidebar={true}
                sidebarTitle={t?.contactForm?.sidebarTitle || formT?.contactSidebar?.title || formT?.serviceSidebarTitles?.pricing || ""}
                sidebarReasons={t?.contactForm?.sidebarReasons || formT?.contactSidebar?.reasons || formT?.serviceSidebarReasons?.pricing || []}
                translations={{
                  name: t?.contactForm?.fields?.name,
                  email: t?.contactForm?.fields?.email,
                  phone: t?.contactForm?.fields?.phone,
                  amount: t?.contactForm?.fields?.amount,
                  message: t?.contactForm?.fields?.message,
                  submitButton: t?.contactForm?.submitButton || formT?.contactForm?.form?.submitButton || "Send message",
                  submitting: t?.contactForm?.submitting || formT?.contactForm?.form?.submitting || "Sending...",
                  success: t?.contactForm?.successMessage || formT?.contactForm?.form?.success || "Message sent!",
                  error: t?.contactForm?.error || formT?.contactForm?.form?.error || "Please try again",
                }}
                serviceName=""
              />
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* reCAPTCHA Enterprise Script */}
      <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
    </div>
  )
}

