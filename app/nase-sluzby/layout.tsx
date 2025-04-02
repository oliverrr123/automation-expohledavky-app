"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { Eye, User, FileText, Gavel, CreditCard, CheckCircle, ArrowRight, Send, Phone, Mail, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"
import { toast } from "sonner"
import { useTranslations } from "@/lib/i18n"
import { getCurrentLocale } from "@/lib/i18n"
import Script from 'next/script'

// Add Google reCAPTCHA site key
const RECAPTCHA_SITE_KEY = "6LfecQArAAAAAHY4AdWeBS3Ubx5lFH6hI342ZmO8"

// Type for form state
type FormStatus = "idle" | "submitting" | "success" | "error"

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = useTranslations('servicesLayout')
  
  // Form state
  const [formData, setFormData] = useState({
    jmeno: "",
    email: "",
    telefon: "",
    castka: "",
    zprava: "",
  })

  const [formStatus, setFormStatus] = useState<FormStatus>("idle")
  const [activeTab, setActiveTab] = useState("kontrola")

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
                  const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {action: 'SERVICES_FORM'})
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
        toast.warning(t?.contactForm?.form?.warnings?.recaptchaFailed || "Could not validate your request. Please try again.")
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
          formAction: 'SERVICES_FORM', // Identify which form this is
          language: currentLocale || 'cs' // Default to Czech if no locale found
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Success
      setFormStatus("success")
      toast.success(t?.contactForm?.form?.success)
      
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
      toast.error(error instanceof Error ? error.message : t?.contactForm?.form?.error)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (text.includes("@")) {
        toast.success(t?.contactSidebar?.toast?.emailCopied)
      } else {
        toast.success(t?.contactSidebar?.toast?.phoneCopied)
      }
    } catch (err) {
      toast.error(t?.contactSidebar?.toast?.copyFailed)
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

      <main className="relative pt-16">
        {children}

        {/* Contact Form Section */}
        <section id="contact-form" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {t?.contactForm?.badge}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t?.contactForm?.title}</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {t?.contactForm?.description}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="grid md:grid-cols-12 gap-0">
                    {/* Left side - form */}
                    <div className="md:col-span-8 p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="jmeno" className="block text-sm font-medium text-gray-700 mb-1">
                              {t?.contactForm?.form?.name?.label}
                            </label>
                            <input
                              required
                              id="jmeno"
                              name="jmeno"
                              type="text"
                              value={formData.jmeno}
                              onChange={handleChange}
                              placeholder={t?.contactForm?.form?.name?.placeholder}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                              disabled={formStatus === "submitting" || formStatus === "success"}
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              {t?.contactForm?.form?.email?.label}
                            </label>
                            <input
                              required
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={t?.contactForm?.form?.email?.placeholder}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                              disabled={formStatus === "submitting" || formStatus === "success"}
                            />
                          </div>
                          <div>
                            <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                              {t?.contactForm?.form?.phone?.label}
                            </label>
                            <input
                              required
                              id="telefon"
                              name="telefon"
                              type="text"
                              value={formData.telefon}
                              onChange={handleChange}
                              placeholder={t?.contactForm?.form?.phone?.placeholder}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                              disabled={formStatus === "submitting" || formStatus === "success"}
                            />
                          </div>
                          <div>
                            <label htmlFor="castka" className="block text-sm font-medium text-gray-700 mb-1">
                              {t?.contactForm?.form?.amount?.label}
                            </label>
                            <input
                              required
                              id="castka"
                              name="castka"
                              type="text"
                              value={formData.castka}
                              onChange={handleChange}
                              placeholder={t?.contactForm?.form?.amount?.placeholder}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                              disabled={formStatus === "submitting" || formStatus === "success"}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="zprava" className="block text-sm font-medium text-gray-700 mb-1">
                            {t?.contactForm?.form?.message?.label}
                          </label>
                          <textarea
                            required
                            id="zprava"
                            name="zprava"
                            rows={5}
                            value={formData.zprava}
                            onChange={handleChange}
                            placeholder={t?.contactForm?.form?.message?.placeholder}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                            disabled={formStatus === "submitting" || formStatus === "success"}
                          ></textarea>
                        </div>
                        <div className="pt-4">
                          <Button
                            type="submit"
                            disabled={formStatus === "submitting" || formStatus === "success"}
                            className={cn(
                              "w-full text-white font-semibold transition-all duration-500 relative overflow-hidden group shadow-xl shadow-orange-500/20 h-14",
                              formStatus === "success" ? "bg-green-600" : "",
                            )}
                            style={
                              formStatus !== "success"
                                ? {
                                    background:
                                      "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                                    backgroundPosition: "bottom",
                                    backgroundSize: "150% 100%",
                                  }
                                : {}
                            }
                          >
                            <div
                              className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                              aria-hidden="true"
                            />

                            {formStatus === "idle" && (
                              <span className="relative z-10 flex items-center justify-center">
                                {t?.contactForm?.form?.submitButton} <Send className="ml-2 h-4 w-4" />
                              </span>
                            )}

                            {formStatus === "submitting" && (
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
                                {t?.contactForm?.form?.submitting}
                              </span>
                            )}

                            {formStatus === "success" && (
                              <span className="relative z-10 flex items-center justify-center">
                                <CheckCircle className="mr-2 h-5 w-5" /> {t?.contactForm?.form?.success}
                              </span>
                            )}

                            {formStatus === "error" && <span className="relative z-10">{t?.contactForm?.form?.error}</span>}
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Right side - contact info */}
                    <div className="md:col-span-4 bg-zinc-900 text-white p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-6">{t?.contactSidebar?.title}</h3>
                        <p className="text-zinc-300 mb-8">
                          {t?.contactSidebar?.description}
                        </p>

                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                              <Phone className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-zinc-400 mb-1">{t?.contactSidebar?.phone?.label}</p>
                              <div
                                className="text-white hover:text-orange-300 transition-colors cursor-pointer"
                                onClick={() => handleCopy(t?.contactSidebar?.phone?.number || "")}
                              >
                                {t?.contactSidebar?.phone?.number}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                              <Mail className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-zinc-400 mb-1">{t?.contactSidebar?.email?.label}</p>
                              <div
                                className="text-white hover:text-orange-300 transition-colors cursor-pointer"
                                onClick={() => handleCopy(t?.contactSidebar?.email?.address || "")}
                              >
                                {t?.contactSidebar?.email?.address}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-zinc-400 mb-1">{t?.contactSidebar?.address?.label}</p>
                              <div className="text-white">{t?.contactSidebar?.address?.line1}</div>
                              <div className="text-white">{t?.contactSidebar?.address?.line2}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <a
                          href="#"
                          className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors group"
                        >
                          {t?.contactSidebar?.viewOnMap}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {t?.process?.badge}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{t?.process?.title}</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  {t?.process?.description}
                </p>
              </div>
            </SectionWrapper>

            <SectionWrapper animation="fade-up" delay={200}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-8">
                  {/* Tab Content */}
                  <div className="min-h-[220px] relative">
                    {/* Process steps */}
                    {(t?.process?.steps || []).map((step: any) => (
                      <div
                        key={step?.key || 'default'}
                        className={`transition-all duration-500 absolute inset-0 ${activeTab === step?.key ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
                      >
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            {step?.key === "kontrola" && <Eye className="h-8 w-8 text-orange-500" />}
                            {step?.key === "zastoupeni" && <User className="h-8 w-8 text-orange-500" />}
                            {step?.key === "vyzva" && <FileText className="h-8 w-8 text-orange-500" />}
                            {step?.key === "zaloba" && <Gavel className="h-8 w-8 text-orange-500" />}
                            {step?.key === "exekuce" && <CreditCard className="h-8 w-8 text-orange-500" />}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-4 text-zinc-900">{step?.title ?? ""}</h3>
                            <p className="text-gray-600 mb-4">{step?.description ?? ""}</p>
                            {step?.additionalText && <p className="text-gray-600">{step.additionalText}</p>}
                            
                            {step?.fee && (
                              <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg mt-4">
                                <p className="font-medium text-orange-800">{step.fee}</p>
                              </div>
                            )}
                            
                            {step?.success && (
                              <div className="p-4 bg-green-50 border border-green-100 rounded-lg mt-4">
                                <p className="font-medium text-green-800">{step.success}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tab Navigation */}
                  <div className="mt-16 border-t pt-8">
                    <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-2">
                      {(t?.process?.steps || []).map((step: any, index: number, array: any[]) => {
                        const isActive = activeTab === step?.key;
                        const isLast = index === array.length - 1;
                        
                        // Map step key to icon
                        let Icon;
                        switch(step?.key) {
                          case "kontrola": Icon = Eye; break;
                          case "zastoupeni": Icon = User; break;
                          case "vyzva": Icon = FileText; break;
                          case "zaloba": Icon = Gavel; break;
                          case "exekuce": Icon = CreditCard; break;
                          default: Icon = Eye;
                        }

                        return (
                          <React.Fragment key={step?.key || index}>
                            <button
                              onClick={() => setActiveTab(step?.key || 'default')}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 shadow-sm hover:shadow w-full lg:w-auto justify-center",
                                isActive
                                  ? "bg-orange-500 text-white shadow-orange-500/25"
                                  : "bg-white hover:bg-white hover:scale-[1.02]",
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              {step?.title ?? ""}
                            </button>

                            {/* Arrow between items */}
                            {!isLast && (
                              <div className="hidden lg:flex items-center justify-center text-orange-300">
                                <ArrowRight className="h-5 w-5" />
                              </div>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>
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

