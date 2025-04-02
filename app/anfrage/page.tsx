"use client"

import type React from "react"

import { useState, useEffect, type FormEvent } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import Script from "next/script"
import { useTranslations } from "@/lib/i18n"
import { getCurrentLocale } from "@/lib/i18n"

// Add Google reCAPTCHA site key
const RECAPTCHA_SITE_KEY = "6LfecQArAAAAAHY4AdWeBS3Ubx5lFH6hI342ZmO8";

export default function AnfragePage() {
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    jmeno: "",
    email: "",
    telefon: "",
    castka: "",
    zprava: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  
  // Get translations
  const t = useTranslations('inquiryPage')
  
  // Set isClient to true when component is mounted
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // If on server-side, show minimal content to prevent hydration issues
  if (!isClient) {
    return (
      <div className="min-h-screen text-center">
        <p className="py-20 text-xl">Loading...</p>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Get reCAPTCHA Enterprise token
      let recaptchaToken = "";
      
      // @ts-ignore - window.grecaptcha is added by the script
      if (window.grecaptcha && window.grecaptcha.enterprise) {
        try {
          // @ts-ignore - window.grecaptcha.enterprise.execute returns a promise
          recaptchaToken = await new Promise((resolve, reject) => {
            // @ts-ignore
            window.grecaptcha.enterprise.ready(async () => {
              try {
                // @ts-ignore
                const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {action: 'ANFRAGE_FORM'});
                resolve(token);
              } catch (error) {
                console.error("reCAPTCHA execution error:", error);
                reject(error);
              }
            });
          });
        } catch (error) {
          console.error("reCAPTCHA ready error:", error);
        }
      }

      if (!recaptchaToken) {
        setErrorMessage(t?.form?.captchaError || "Bitte bestätigen Sie, dass Sie kein Roboter sind.")
        setSubmitStatus("error")
        setIsSubmitting(false)
        return
      }

      // Get current locale from URL
      const currentLocale = getCurrentLocale();

      // Create form data to send
      const formDataToSend = {
        ...formData,
        recaptchaToken, // Include the token in the request
        csrfToken: "dummy-token", // Add a dummy CSRF token for testing
        formAction: "ANFRAGE_FORM", // Specify the form action
        language: currentLocale || 'de' // Default to German if no locale found
      }

      // Send the data
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          jmeno: "",
          email: "",
          telefon: "",
          castka: "",
          zprava: "",
        })
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || t?.form?.generalError || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage(t?.form?.generalError || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      
      <main className="min-h-screen bg-gradient-to-b from-zinc-200 to-white">
        <Header />
        
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              {t.title || "Detaillierte Anfrage"}
            </h1>
            <p className="text-sm font-medium tracking-widest text-orange-600 uppercase">
              {t.subtitle || "REICHEN SIE EINE DETAILLIERTE ANFRAGE ZUR BEWERTUNG EIN"}
            </p>
          </div>
          
          <SectionWrapper animation="fade-up">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="jmeno" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.name?.label || "Vollständiger Name"}
                  </label>
                  <Input
                    id="jmeno"
                    name="jmeno"
                    value={formData.jmeno}
                    onChange={handleChange}
                    placeholder={t.form?.name?.placeholder || "Ihr vollständiger Name"}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.email?.label || "Ihre E-Mail"}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.form?.email?.placeholder || "Ihre E-Mail-Adresse"}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.phone?.label || "Telefonkontakt"}
                  </label>
                  <Input
                    id="telefon"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                    placeholder={t.form?.phone?.placeholder || "Ihre Telefonnummer"}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="castka" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.amount?.label || "Forderungsbetrag"}
                  </label>
                  <Input
                    id="castka"
                    name="castka"
                    value={formData.castka}
                    onChange={handleChange}
                    placeholder={t.form?.amount?.placeholder || "Forderungsbetrag"}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="zprava" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.message?.label || "Ihre Nachricht"}
                  </label>
                  <Textarea
                    id="zprava"
                    name="zprava"
                    value={formData.zprava}
                    onChange={handleChange}
                    placeholder={t.form?.message?.placeholder || "Ihre Nachricht... bitte geben Sie alle bekannten Details zu Ihrer Forderung an..."}
                    required
                    className="w-full min-h-32"
                  />
                </div>
                
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {errorMessage}
                  </div>
                )}
                
                {submitStatus === "success" && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                    {t.form?.success || "Ihre Nachricht wurde erfolgreich gesendet. Wir werden Sie so schnell wie möglich kontaktieren."}
                  </div>
                )}
                
                <div className="pt-2">
                  {/* reCAPTCHA Enterprise is invisible, no div needed here */}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  {isSubmitting ? (
                    <span>{t.form?.sending || "Wird gesendet..."}</span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {t.form?.submit || "Nachricht senden"} <Send className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </SectionWrapper>
        </div>
        
        <Footer />
      </main>
    </>
  )
} 