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

// Add phone validation function
const isValidPhone = (phone: string): boolean => {
  // Basic international phone regex
  // Allows for: +XXX XXX XXX XXX format or any reasonable variation
  const phoneRegex = /^(\+|00)?[0-9\s-]{8,20}$/;
  return phoneRegex.test(phone);
};

export default function PoptavkaPage() {
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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  
  // Get translations
  const t = useTranslations('inquiryPage')
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    let isValid = true;

    // Validate phone
    if (!isValidPhone(formData.telefon)) {
      errors.telefon = t?.form?.phoneError || "Prosím zadejte platné telefonní číslo ve formátu +XXX XXX XXX XXX";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
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
                const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {action: 'CONTACT_FORM'});
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
        setErrorMessage(t?.form?.captchaError || "Prosím potvrďte, že nejste robot.")
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
        formAction: "CONTACT_FORM", // Specify the form action
        language: currentLocale || 'cs' // Default to Czech if no locale found
      }

      // Send the form data to the API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        console.log("Form submitted successfully:", formData)
        setSubmitStatus("success")
        setFormData({
          jmeno: "",
          email: "",
          telefon: "",
          castka: "",
          zprava: "",
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || t?.form?.generalError || "Došlo k chybě při odesílání formuláře. Zkuste to prosím znovu.");
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage(t?.form?.generalError || "Došlo k chybě při odesílání formuláře. Zkuste to prosím znovu.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // If translations aren't loaded yet, show loading UI - this condition could be improved
  if (!isClient || !t) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pt-48 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-16"></div>
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-10 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded w-full md:w-40"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
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

      <main className="flex-1 pt-48 pb-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900">{t.title}</h1>
                <p className="text-orange-500 font-medium">{t.subtitle}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="jmeno" className="text-sm font-medium text-gray-700">
                        {t.form.name.label}
                      </label>
                      <Input
                        required
                        id="jmeno"
                        name="jmeno"
                        value={formData.jmeno}
                        onChange={handleChange}
                        placeholder={t.form.name.placeholder}
                        className="w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        {t.form.email.label}
                      </label>
                      <Input
                        required
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.form.email.placeholder}
                        className="w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="telefon" className="text-sm font-medium text-gray-700">
                        {t.form.phone.label}
                      </label>
                      <Input
                        required
                        id="telefon"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        placeholder={t.form.phone.placeholder}
                        className={`w-full ${validationErrors.telefon ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                      {validationErrors.telefon && (
                        <div className="text-sm text-red-500 mt-1">{validationErrors.telefon}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="castka" className="text-sm font-medium text-gray-700">
                        {t.form.amount.label}
                      </label>
                      <Input
                        required
                        id="castka"
                        name="castka"
                        value={formData.castka}
                        onChange={handleChange}
                        placeholder={t.form.amount.placeholder}
                        className="w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="zprava" className="text-sm font-medium text-gray-700">
                      {t.form.message.label}
                    </label>
                    <Textarea
                      required
                      id="zprava"
                      name="zprava"
                      value={formData.zprava}
                      onChange={handleChange}
                      placeholder={t.form.message.placeholder}
                      className="w-full min-h-[150px]"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="pt-2">
                    {/* reCAPTCHA Enterprise is invisible, no div needed here */}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto text-white font-semibold transition-all duration-500 relative overflow-hidden group shadow-xl shadow-orange-500/20 h-14 px-8"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                        backgroundPosition: "bottom",
                        backgroundSize: "150% 100%",
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                        aria-hidden="true"
                      />

                      {isSubmitting ? (
                        <span className="relative z-10 flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t.form.sending}
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center justify-center">
                          {t.form.submit} <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Status messages */}
                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4">
                      {t.form.success}
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4">{errorMessage}</div>
                  )}
                </form>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </main>

      <Footer />

      {/* Google reCAPTCHA Enterprise Script */}
      <Script src={`https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
    </div>
  )
}

