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

// Add Google reCAPTCHA site key
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

export default function PoziadavkaPage() {
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
      if (window.grecaptcha) {
        try {
          // @ts-ignore - window.grecaptcha.execute returns a promise
          recaptchaToken = await new Promise((resolve, reject) => {
            // @ts-ignore
            window.grecaptcha.ready(async () => {
              try {
                // @ts-ignore
                const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'POZIADAVKA_FORM'});
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
        setErrorMessage(t?.form?.captchaError || "Potvrďte, že nie ste robot.")
        setSubmitStatus("error")
        setIsSubmitting(false)
        return
      }

      // Create form data to send
      const formDataToSend = {
        ...formData,
        recaptchaToken, // Include the token in the request
        csrfToken: "dummy-token", // Add a dummy CSRF token for testing
        formAction: "POZIADAVKA_FORM" // Specify the form action
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
        setErrorMessage(errorData.error || t?.form?.generalError || "Vyskytla sa chyba. Skúste to znova.")
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage(t?.form?.generalError || "Vyskytla sa chyba. Skúste to znova.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      
      <main className="min-h-screen bg-gradient-to-b from-zinc-200 to-white">
        <Header />
        
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              {t.title || "Detailná požiadavka"}
            </h1>
            <p className="text-sm font-medium tracking-widest text-orange-600 uppercase">
              {t.subtitle || "ODOŠLITE DETAILNÚ POŽIADAVKU NA POSÚDENIE"}
            </p>
          </div>
          
          <SectionWrapper animation="fade-up">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="jmeno" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.name?.label || "Celé meno"}
                  </label>
                  <Input
                    id="jmeno"
                    name="jmeno"
                    value={formData.jmeno}
                    onChange={handleChange}
                    placeholder={t.form?.name?.placeholder || "Vaše celé meno"}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.email?.label || "Váš email"}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.form?.email?.placeholder || "Vaša emailová adresa"}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.phone?.label || "Telefónny kontakt"}
                  </label>
                  <Input
                    id="telefon"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                    placeholder={t.form?.phone?.placeholder || "Vaše telefónne číslo"}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="castka" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.amount?.label || "Výška pohľadávky"}
                  </label>
                  <Input
                    id="castka"
                    name="castka"
                    value={formData.castka}
                    onChange={handleChange}
                    placeholder={t.form?.amount?.placeholder || "Výška pohľadávky"}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="zprava" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form?.message?.label || "Vaša správa"}
                  </label>
                  <Textarea
                    id="zprava"
                    name="zprava"
                    value={formData.zprava}
                    onChange={handleChange}
                    placeholder={t.form?.message?.placeholder || "Vaša správa... prosím uveďte všetky známe podrobnosti o vašej pohľadávke..."}
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
                    {t.form?.success || "Vaša správa bola úspešne odoslaná. Budeme vás kontaktovať čo najskôr."}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  {isSubmitting ? (
                    <span>{t.form?.sending || "Odosielanie..."}</span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {t.form?.submit || "Odoslať správu"} <Send className="ml-2 h-4 w-4" />
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