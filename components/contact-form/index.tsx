"use client"

import React, { useState, useEffect } from "react"
import { SectionWrapper } from "@/components/section-wrapper"
import { getCurrentLocale } from "@/lib/i18n"
import type { FormEvent } from "react"
import { toast } from "sonner"
import Script from "next/script"
import { Send } from "lucide-react"

// Public site key is designed to be exposed in client-side code
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

// Add type declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      enterprise?: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

// Add phone validation function
const isValidPhone = (phone: string): boolean => {
  // Basic international phone regex
  // Allows for: +XXX XXX XXX XXX format or any reasonable variation
  const phoneRegex = /^(\+|00)?[0-9\s-]{8,20}$/;
  return phoneRegex.test(phone);
};

export type FormFields = {
  name: boolean;
  email: boolean;
  phone: boolean;
  amount: boolean;
  message: boolean;
  // Add other optional fields as needed
}

type ContactFormProps = {
  title?: string;
  badge?: string;
  description?: string;
  fields?: FormFields;
  formAction?: string;
  showSidebar?: boolean;
  sidebarTitle?: string;
  sidebarReasons?: string[];
  translations: any; // Translations object
  serviceName?: string; // Added service name parameter
}

const defaultFields: FormFields = {
  name: true,
  email: true,
  phone: true,
  amount: false,
  message: true,
}

export function ContactForm({
  title,
  badge,
  description,
  fields = defaultFields,
  formAction = "CONTACT_FORM",
  showSidebar = true,
  sidebarTitle,
  sidebarReasons,
  translations,
  serviceName,
}: ContactFormProps) {
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

    // Validate phone if it's required
    if (fields.phone && !isValidPhone(formData.telefon)) {
      errors.telefon = translations?.phoneError || "Please enter a valid phone number";
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
      
      if (window.grecaptcha) {
        try {
          recaptchaToken = await new Promise((resolve, reject) => {
            window.grecaptcha.ready(async () => {
              try {
                const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: formAction});
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
        setErrorMessage(translations?.captchaError || "Please confirm you're not a robot.")
        setSubmitStatus("error")
        setIsSubmitting(false)
        return
      }

      // Get current locale from URL
      const currentLocale = getCurrentLocale();

      // Create form data to send
      const formDataToSend = {
        jmeno: formData.jmeno,
        email: formData.email,
        telefon: formData.telefon,
        castka: formData.castka,
        zprava: formData.zprava,
        language: currentLocale || 'cs', // Default to Czech if no locale found
        recaptchaToken,
        formAction,
        serviceName, // Added service name to send to API
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
        setSubmitStatus("success")
        toast.success(translations?.success || "Message sent!")
        
        // Reset form after success
        setFormData({
          jmeno: "",
          email: "",
          telefon: "",
          castka: "",
          zprava: "",
        });
        
        // Reset form status after a delay
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 3000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || translations?.generalError || "An error occurred while submitting the form. Please try again.");
        setSubmitStatus("error");
        toast.error(errorData.error || translations?.generalError || "An error occurred while submitting the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage(translations?.generalError || "An error occurred while submitting the form. Please try again.")
      setSubmitStatus("error")
      toast.error(translations?.generalError || "An error occurred while submitting the form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact-form" className="py-16 scroll-mt-24">
      <div className="container mx-auto px-4">
        <SectionWrapper animation="fade-up">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              {badge && (
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {badge}
                </div>
              )}
              {title && (
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>

            {isClient && (
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <div className={`grid ${showSidebar ? 'md:grid-cols-12' : ''} gap-0`}>
                  {/* Left side - form */}
                  <div className={showSidebar ? "md:col-span-8 p-8" : "p-8"}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {fields.name && (
                          <div>
                            <label htmlFor="jmeno" className="block text-sm font-medium text-gray-700 mb-1">
                              {translations?.name?.label || ""}
                            </label>
                            <input
                              required
                              id="jmeno"
                              name="jmeno"
                              type="text"
                              value={formData.jmeno}
                              onChange={handleChange}
                              placeholder={translations?.name?.placeholder || ""}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                              disabled={isSubmitting || submitStatus === "success"}
                            />
                          </div>
                        )}
                        {fields.email && (
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              {translations?.email?.label || ""}
                            </label>
                            <input
                              required
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={translations?.email?.placeholder || ""}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                              disabled={isSubmitting || submitStatus === "success"}
                            />
                          </div>
                        )}
                        {fields.phone && (
                          <div>
                            <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                              {translations?.phone?.label || ""}
                            </label>
                            <input
                              required
                              id="telefon"
                              name="telefon"
                              type="text"
                              value={formData.telefon}
                              onChange={handleChange}
                              placeholder={translations?.phone?.placeholder || ""}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all ${validationErrors.telefon ? 'border-red-500' : ''}`}
                              disabled={isSubmitting || submitStatus === "success"}
                            />
                            {validationErrors.telefon && (
                              <div className="text-sm text-red-500 mt-1">{validationErrors.telefon}</div>
                            )}
                          </div>
                        )}
                        {fields.amount && (
                          <div>
                            <label htmlFor="castka" className="block text-sm font-medium text-gray-700 mb-1">
                              {translations?.amount?.label || ""}
                            </label>
                            <input
                              id="castka"
                              name="castka"
                              type="text"
                              value={formData.castka}
                              onChange={handleChange}
                              placeholder={translations?.amount?.placeholder || ""}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                              disabled={isSubmitting || submitStatus === "success"}
                            />
                          </div>
                        )}
                      </div>

                      {fields.message && (
                        <div>
                          <label htmlFor="zprava" className="block text-sm font-medium text-gray-700 mb-1">
                            {translations?.message?.label || ""}
                          </label>
                          <textarea
                            required
                            id="zprava"
                            name="zprava"
                            rows={6}
                            value={formData.zprava}
                            onChange={handleChange}
                            placeholder={translations?.message?.placeholder || ""}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            disabled={isSubmitting || submitStatus === "success"}
                          ></textarea>
                        </div>
                      )}

                      <div>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 px-4 py-2 w-full text-white font-semibold transition-all duration-500 relative overflow-hidden group shadow-xl shadow-orange-500/20 h-14"
                          style={{
                            background: "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                            backgroundPosition: "bottom",
                            backgroundSize: "150% 100%",
                          }}
                          disabled={isSubmitting || submitStatus === "success"}
                        >
                          <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10" aria-hidden="true"></div>
                          
                          {isSubmitting ? (
                            <span className="relative z-10 flex items-center justify-center">
                              <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {translations?.submitting || ""}
                            </span>
                          ) : submitStatus === "success" ? (
                            <span className="relative z-10 flex items-center justify-center">
                              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              {translations?.success || ""}
                            </span>
                          ) : (
                            <span className="relative z-10 flex items-center justify-center">
                              {translations?.submitButton || ""} 
                              <Send className="ml-2 h-4 w-4" />
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Error message */}
                      {submitStatus === "error" && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4">
                          {errorMessage || translations?.error || ""}
                        </div>
                      )}
                    </form>
                  </div>

                  {/* Right side - sidebar */}
                  {showSidebar && sidebarReasons && sidebarReasons.length > 0 && (
                    <div className="md:col-span-4 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-8">
                      <h3 className="text-xl font-semibold mb-6">{sidebarTitle || "Proč nás kontaktovat?"}</h3>
                      <ul className="space-y-4">
                        {sidebarReasons.map((reason: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-4 w-4 text-orange-400">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11 3 3L22 4"></path>
                              </svg>
                            </div>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>
      </div>

      {/* reCAPTCHA v3 Script */}
      <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
    </section>
  )
} 