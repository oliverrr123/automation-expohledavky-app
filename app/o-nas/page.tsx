"use client"

import { Check, X, Award, Users, Clock, Briefcase, Scale, Shield } from "lucide-react"
import { SectionWrapper } from "@/components/section-wrapper"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { getCurrentLocale } from "@/lib/i18n"
import type { FormEvent } from "react"
import Script from "next/script"

// Public site key is designed to be exposed in client-side code
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

// Add phone validation function
const isValidPhone = (phone: string): boolean => {
  // Basic international phone regex
  // Allows for: +XXX XXX XXX XXX format or any reasonable variation
  const phoneRegex = /^(\+|00)?[0-9\s-]{8,20}$/;
  return phoneRegex.test(phone);
};

export default function AboutUsPage() {
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
  const t = useTranslations('aboutPage')
  
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
      errors.telefon = t?.contact?.form?.phoneError || "Please enter a valid phone number";
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
        setErrorMessage(t?.contact?.form?.captchaError || "Please confirm you're not a robot.")
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
        recaptchaToken, // Token is sent to the server for verification with the secret key
        formAction: "CONTACT_FORM" // Specify the form action
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
        setFormData({
          jmeno: "",
          email: "",
          telefon: "",
          castka: "",
          zprava: "",
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || t?.contact?.form?.generalError || "An error occurred while submitting the form. Please try again.");
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage(t?.contact?.form?.generalError || "An error occurred while submitting the form. Please try again.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Feature icons mapping - expanded to include all possible translation variants
  const featureIcons = {
    // Czech variants
    "Osobní kontakt": Users,
    "Bezplatná konzultace": Clock,
    "Diskrétní přístup": Shield,
    "Více řešení": Briefcase,
    // English variants
    "Personal contact": Users,
    "Free consultation": Clock,
    "Discreet approach": Shield,
    "Multiple solutions": Briefcase,
    // Slovak variants
    "Osobný kontakt": Users,
    "Bezplatná konzultácia": Clock,
    "Diskrétny prístup": Shield,
    "Viac riešení": Briefcase,
    // German variants
    "Persönlicher Kontakt": Users,
    "Kostenlose Beratung": Clock,
    "Diskreter Ansatz": Shield,
    "Mehrere Lösungen": Briefcase
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

      {/* Hero Section */}
      <section className="relative pt-72 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop"
            alt="Office background"
            fill
            className="object-cover opacity-80 mix-blend-overlay"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {isClient ? t?.hero?.title : ''}
              </h1>
              <p className="text-xl text-zinc-300 mb-8">
                {isClient ? t?.hero?.subtitle : ''}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button
                  asChild
                  size="lg"
                  className="text-white font-semibold transition-all duration-500 hover:scale-[1.04] relative overflow-hidden group shadow-xl shadow-orange-500/20"
                  style={{
                    background: "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                    backgroundPosition: "bottom",
                    backgroundSize: "150% 100%",
                  }}
                >
                  <a
                    href="#contact-form"
                    className="relative"
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.getElementById("contact-form")
                      if (element) {
                        const headerOffset = 100 // Adjust this value as needed
                        const elementPosition = element.getBoundingClientRect().top
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth",
                        })
                      }
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">{isClient ? t?.hero?.buttons?.contact : ''}</span>
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden border-2 border-white text-white bg-white/5 backdrop-blur-sm font-semibold transition-all duration-500 hover:scale-[1.04] hover:bg-white/20 shadow-xl shadow-black/20"
                >
                  <Link href="/nase-sluzby" className="relative">
                    <div
                      className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">{isClient ? t?.hero?.buttons?.services : ''}</span>
                  </Link>
                </Button>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <SectionWrapper animation="fade-up">
            {isClient && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">{t?.stats?.successRate?.value}</div>
                  <div className="text-sm text-gray-600">{t?.stats?.successRate?.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">{t?.stats?.experience?.value}</div>
                  <div className="text-sm text-gray-600">{t?.stats?.experience?.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">{t?.stats?.clients?.value}</div>
                  <div className="text-sm text-gray-600">{t?.stats?.clients?.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">{t?.stats?.support?.value}</div>
                  <div className="text-sm text-gray-600">{t?.stats?.support?.label}</div>
                </div>
              </div>
            )}
          </SectionWrapper>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <SectionWrapper animation="fade-right">
              <div>
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {isClient ? t?.mainContent?.badge : ''}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                  {isClient ? t?.mainContent?.title : ''}
                </h2>
                {isClient && (t?.mainContent?.paragraphs || []).map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-600 mb-4">
                    {paragraph}
                  </p>
                ))}
                {isClient && (
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg mt-6">
                    <p className="font-semibold text-orange-800">{t?.mainContent?.fee}</p>
                  </div>
                )}
              </div>
            </SectionWrapper>

            <SectionWrapper animation="fade-left" delay={200}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1471&auto=format&fit=crop"
                  alt="Business professionals"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                {isClient && (
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent flex items-end p-6">
                    <p className="text-white text-lg font-medium">
                      {t?.mainContent?.imageCaption}
                    </p>
                  </div>
                )}
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <SectionWrapper animation="fade-up">
            {isClient && (
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t?.features?.title}</h2>
                <p className="text-gray-600">{t?.features?.subtitle}</p>
              </div>
            )}
          </SectionWrapper>

          {isClient && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(t?.features?.items || []).map((feature: any, index: number) => {
                const Icon = featureIcons[feature?.title as keyof typeof featureIcons] || Users; // Fallback to Users icon if not found
                return (
                  <SectionWrapper key={feature?.title || index} animation="zoom" delay={index * 100}>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature?.title}</h3>
                      <p className="text-gray-600">{feature?.description}</p>
                    </div>
                  </SectionWrapper>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Success Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <SectionWrapper animation="fade-right">
              <div className="relative">
                <div className="absolute -left-4 -top-4 w-24 h-24">
                  <Award className="w-full h-full text-orange-500 opacity-10" />
                </div>
                <div className="relative">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">
                    {isClient ? t?.success?.title : ''}
                  </h2>
                  <h5 className="text-xl font-semibold text-zinc-800 mb-4">
                    {isClient ? t?.success?.subtitle : ''}
                  </h5>
                  {isClient && (t?.success?.paragraphs || []).map((paragraph: string, index: number) => (
                    <p key={index} className="text-gray-600 mb-4">
                      {paragraph}
                    </p>
                  ))}
                  {isClient && (
                    <div className="mt-8">
                      <Button asChild className="bg-orange-500 hover:bg-orange-600">
                        <Link href="/poptavka">{t?.success?.buttonText}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SectionWrapper>

            <SectionWrapper animation="fade-left" delay={200}>
              {isClient && (
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold mb-6">{t?.success?.arbitration?.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {t?.success?.arbitration?.description}
                  </p>
                  <div className="space-y-4 mt-6">
                    {(t?.success?.arbitration?.advantages || []).map((advantage: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{advantage?.title}</h4>
                          <p className="text-sm text-gray-500">{advantage?.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <SectionWrapper animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                {isClient ? t?.comparison?.title : ''}
              </h2>
              <p className="text-gray-600">{isClient ? t?.comparison?.subtitle : ''}</p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <SectionWrapper animation="fade-right" delay={100}>
              {isClient && (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold">{t?.comparison?.professional?.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {(t?.comparison?.professional?.advantages || []).map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SectionWrapper>

            <SectionWrapper animation="fade-left" delay={200}>
              {isClient && (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold">{t?.comparison?.diy?.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {(t?.comparison?.diy?.disadvantages || []).map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-3">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* CTA Section with Contact Form */}
      <section className="py-16" id="contact-form">
        <div className="container">
          <SectionWrapper animation="fade-up">
            <div className="bg-zinc-900 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 mix-blend-multiply" />

              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Text Content */}
                <div className="text-center md:text-left">
                  <Scale className="h-16 w-16 mx-auto md:mx-0 text-orange-400 mb-6" />
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {isClient ? t?.contact?.title : ''}
                  </h2>
                  <p className="text-zinc-300 mb-8">
                    {isClient ? t?.contact?.description : ''}
                  </p>
                </div>

                {/* Contact Form */}
                {isClient && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">{t?.contact?.form?.title}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="jmeno" className="block text-sm font-medium text-zinc-300 mb-1">
                            {t?.contact?.form?.fields?.jmeno?.label}
                          </label>
                          <input
                            type="text"
                            id="jmeno"
                            name="jmeno"
                            value={formData.jmeno}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            placeholder={t?.contact?.form?.fields?.jmeno?.placeholder}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                            {t?.contact?.form?.fields?.email?.label}
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            placeholder={t?.contact?.form?.fields?.email?.placeholder}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label htmlFor="telefon" className="block text-sm font-medium text-zinc-300 mb-1">
                            {t?.contact?.form?.fields?.telefon?.label}
                          </label>
                          <input
                            type="tel"
                            id="telefon"
                            name="telefon"
                            value={formData.telefon}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${validationErrors.telefon ? 'border-red-500' : ''}`}
                            placeholder={t?.contact?.form?.fields?.telefon?.placeholder}
                            disabled={isSubmitting}
                          />
                          {validationErrors.telefon && (
                            <div className="text-sm text-red-500 mt-1">{validationErrors.telefon}</div>
                          )}
                        </div>
                        <div>
                          <label htmlFor="castka" className="block text-sm font-medium text-zinc-300 mb-1">
                            {t?.contact?.form?.fields?.castka?.label}
                          </label>
                          <input
                            type="text"
                            id="castka"
                            name="castka"
                            value={formData.castka}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            placeholder={t?.contact?.form?.fields?.castka?.placeholder}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="zprava" className="block text-sm font-medium text-zinc-300 mb-1">
                          {t?.contact?.form?.fields?.zprava?.label}
                        </label>
                        <textarea
                          id="zprava"
                          name="zprava"
                          value={formData.zprava}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          placeholder={t?.contact?.form?.fields?.zprava?.placeholder}
                          disabled={isSubmitting}
                        ></textarea>
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 px-4 text-white font-semibold transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group shadow-xl shadow-orange-500/20 rounded-md"
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
                              {t?.contact?.form?.sending}
                            </span>
                          ) : (
                            <span className="relative z-10">{t?.contact?.form?.submitButton}</span>
                          )}
                        </button>
                      </div>

                      {/* Status messages */}
                      {submitStatus === "success" && (
                        <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4">
                          {t?.contact?.form?.success}
                        </div>
                      )}

                      {submitStatus === "error" && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4">{errorMessage}</div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      <Footer />

      {/* Google reCAPTCHA Enterprise Script */}
      <Script src={`https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
    </div>
  )
}

