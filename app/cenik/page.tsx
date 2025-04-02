"use client"

import React, { useState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useTranslations } from '@/lib/i18n'
import { getCurrentLocale } from "@/lib/i18n"
import { SectionWrapper } from '@/components/section-wrapper'
import { toast } from 'sonner'

// Add Google reCAPTCHA site key
const RECAPTCHA_SITE_KEY = "6LfecQArAAAAAHY4AdWeBS3Ubx5lFH6hI342ZmO8"

// Type for form state
type FormStatus = "idle" | "submitting" | "success" | "error"

export default function PricingPage() {
  // Get translations
  const t = useTranslations('pricing-page')

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
        if (window.grecaptcha && window.grecaptcha.enterprise) {
          // @ts-ignore - window.grecaptcha.enterprise.execute returns a promise
          recaptchaToken = await new Promise((resolve, reject) => {
            try {
              window.grecaptcha.enterprise.ready(async () => {
                try {
                  // @ts-ignore - window.grecaptcha.enterprise.execute returns a promise
                  const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {action: 'PRICING_FORM'})
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
                  <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-6">{t?.title}</h1>
                </div>

                <div className="mb-8 font-semibold text-lg text-center">{t?.subtitle}</div>

                {/* Pricing Table */}
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

                <div className="text-gray-600 space-y-1 mb-12">
                  {(t?.notes || []).map((note: string, index: number) => (
                    <p key={index}>{note}</p>
                  ))}
                </div>
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t?.contactForm?.title}</h2>
                </div>

                <div className="bg-white rounded-xl shadow-md p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="jmeno" className="block text-sm font-medium text-gray-700 mb-1">
                          {t?.contactForm?.fields?.name?.label}
                        </label>
                        <input
                          required
                          id="jmeno"
                          name="jmeno"
                          type="text"
                          value={formData.jmeno}
                          onChange={handleChange}
                          placeholder={t?.contactForm?.fields?.name?.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          disabled={formStatus === "submitting" || formStatus === "success"}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          {t?.contactForm?.fields?.email?.label}
                        </label>
                        <input
                          required
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t?.contactForm?.fields?.email?.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          disabled={formStatus === "submitting" || formStatus === "success"}
                        />
                      </div>
                      <div>
                        <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                          {t?.contactForm?.fields?.phone?.label}
                        </label>
                        <input
                          required
                          id="telefon"
                          name="telefon"
                          type="text"
                          value={formData.telefon}
                          onChange={handleChange}
                          placeholder={t?.contactForm?.fields?.phone?.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          disabled={formStatus === "submitting" || formStatus === "success"}
                        />
                      </div>
                      <div>
                        <label htmlFor="castka" className="block text-sm font-medium text-gray-700 mb-1">
                          {t?.contactForm?.fields?.amount?.label}
                        </label>
                        <input
                          required
                          id="castka"
                          name="castka"
                          type="text"
                          value={formData.castka}
                          onChange={handleChange}
                          placeholder={t?.contactForm?.fields?.amount?.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          disabled={formStatus === "submitting" || formStatus === "success"}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="zprava" className="block text-sm font-medium text-gray-700 mb-1">
                        {t?.contactForm?.fields?.message?.label}
                      </label>
                      <textarea
                        required
                        id="zprava"
                        name="zprava"
                        rows={5}
                        value={formData.zprava}
                        onChange={handleChange}
                        placeholder={t?.contactForm?.fields?.message?.placeholder}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        disabled={formStatus === "submitting" || formStatus === "success"}
                      ></textarea>
                    </div>
                    <div>
                      <Button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md transition-colors"
                        disabled={formStatus === "submitting" || formStatus === "success"}
                      >
                        {formStatus === "submitting" ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t?.contactForm?.fields?.submitting}
                          </div>
                        ) : formStatus === "success" ? (
                          <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {t?.contactForm?.fields?.success}
                          </div>
                        ) : (
                          <span className="relative z-10">{t?.contactForm?.fields?.submit || t?.contactForm?.submitButton}</span>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </section>
      </main>

      <Footer />

      {/* reCAPTCHA Enterprise Script */}
      <Script src={`https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
    </div>
  )
}

