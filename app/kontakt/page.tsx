"use client"

import React, { useState, useEffect, FormEvent } from "react"
import { SectionWrapper } from "@/components/section-wrapper"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ArrowRight, HelpCircle, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useTranslations } from "@/lib/i18n"
import csContactPage from '@/locales/cs/contact-page.json'
import enContactPage from '@/locales/en/contact-page.json'
import skContactPage from '@/locales/sk/contact-page.json'
import deContactPage from '@/locales/de/contact-page.json'
import { generateCSRFToken } from "@/lib/csrf"
import { headers } from 'next/headers'
import { useParams } from "next/navigation"

// Get translations based on domain for server-side rendering
const translationsByLang: Record<string, typeof csContactPage> = {
  cs: csContactPage,
  en: enContactPage,
  sk: skContactPage,
  de: deContactPage
};

// Function to detect locale from hostname (for client-side use)
const getLocaleFromHostname = (hostname: string) => {
  const domain = hostname.split(':')[0];
  
  // Determine locale from domain
  let locale = '';
  
  // Production domains
  if (domain.includes('expohledavky.com')) locale = 'en';
  else if (domain.includes('expohledavky.sk')) locale = 'sk';
  else if (domain.includes('expohledavky.de')) locale = 'de';
  else if (domain.includes('expohledavky.cz')) locale = 'cs';
  
  // Development environment subdomains
  else if (domain.startsWith('en.')) locale = 'en';
  else if (domain.startsWith('sk.')) locale = 'sk';
  else if (domain.startsWith('de.')) locale = 'de';
  else if (domain.startsWith('cs.')) locale = 'cs';
  
  // If still no locale is set, we must be on an unknown domain
  // We'll use the hostname to make a best guess
  if (!locale) {
    if (domain.includes('en') || domain.includes('com')) locale = 'en';
    else if (domain.includes('sk')) locale = 'sk';
    else if (domain.includes('de')) locale = 'de';
    else if (domain.includes('cz') || domain.includes('cs')) locale = 'cs';
    else locale = 'en'; // Last resort - English for international users
  }
  
  return locale;
};

export default function ContactPage() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  const [serverLocale, setServerLocale] = useState('en') // Default to EN
  
  // Use server translations initially, then switch to client translations after hydration
  const t = isClient ? useTranslations('contactPage') : translationsByLang[serverLocale] || translationsByLang['en']
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
    // Generate CSRF token when component mounts
    setCsrfToken(generateCSRFToken())
    
    // Detect locale from hostname on client-side
    const hostname = window.location.hostname;
    const detectedLocale = getLocaleFromHostname(hostname);
    setServerLocale(detectedLocale);
  }, [])
  
  const [formData, setFormData] = useState({
    jmeno: "",
    email: "",
    telefon: "",
    zprava: "",
    csrfToken: ""
  })
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [activeInfoBox, setActiveInfoBox] = useState<number | null>(null)
  const [copyStatus, setCopyStatus] = useState<{ [key: number]: boolean }>({})

  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {
    // Generate a CSRF token on the client side
    const fetchCSRFToken = async () => {
      try {
        // Note: In a real implementation, you might want to fetch this from a dedicated API endpoint
        // for even stronger security. For simplicity, we're generating it client-side here.
        const token = generateCSRFToken();
        setFormData(prev => ({ ...prev, csrfToken: token }));
      } catch (error) {
        console.error("Error generating CSRF token:", error);
      }
    };
    
    fetchCSRFToken();
  }, []);

  // Debug information - can be removed in production
  useEffect(() => {
    if (isClient) {
      console.log("Detected locale on client:", serverLocale);
    }
  }, [isClient, serverLocale]);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus({ ...copyStatus, [index]: true })
      
      // Determine the type of content being copied
      if (text.startsWith("+420")) {
        toast.success(t.contactInfo?.copySuccess?.phone)
      } else if (text.includes("@")) {
        toast.success(t.contactInfo?.copySuccess?.email)
      } else if (text.includes("Praha")) {
        toast.success(t.contactInfo?.copySuccess?.address)
      } else {
        toast.success(t.contactInfo?.copySuccess?.generic)
      }
      
      // Reset the copy status after 2 seconds
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [index]: false }))
      }, 2000)
    } catch (err) {
      toast.error(t.contactInfo?.copyError)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // CSRF token is already included in formData
    setFormStatus("submitting")

    try {
      // Send the form data to the API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success
      setFormStatus("success");
      toast.success(t.contactForm?.form?.success);

      // Generate a new CSRF token
      const newToken = generateCSRFToken();
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          jmeno: "",
          email: "",
          telefon: "",
          zprava: "",
          csrfToken: newToken
        });
        setFormStatus("idle");
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus("error");
      toast.error(error instanceof Error ? error.message : t.contactForm?.form?.error);
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

      {/* Hero Section */}
      <section className="relative pt-72 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1474&auto=format&fit=crop"
            alt="Contact background"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                {t.hero?.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.hero?.title}</h1>
              <p className="text-xl text-zinc-300 mb-8">
                {t.hero?.subtitle}
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
                  <a href="#contact-form" className="relative">
                    <div
                      className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                      aria-hidden="true"
                    />
                    <span className="relative z-10 flex items-center">
                      {t.hero?.buttons?.writeMessage} <MessageSquare className="ml-2 h-4 w-4" />
                    </span>
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden border-2 border-white text-white bg-white/5 backdrop-blur-sm font-semibold transition-all duration-500 hover:scale-[1.04] hover:bg-white/20 shadow-xl shadow-black/20"
                >
                  <a href="tel:+420735500003" className="relative">
                    <div
                      className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                      aria-hidden="true"
                    />
                    <span className="relative z-10 flex items-center">
                      <Phone className="mr-2 h-4 w-4" /> {t.hero?.buttons?.callNow}
                    </span>
                  </a>
                </Button>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      <main className="mt-16">
        {/* Contact Info Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <SectionWrapper animation="fade-up">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{t.contactInfo?.title}</h2>
                <p className="text-lg text-gray-600">
                  {t.contactInfo?.subtitle}
                </p>
              </div>
            </SectionWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Phone,
                  title: t.contactInfo?.items?.[0]?.title,
                  content: (
                    <div className="space-y-2">
                      <p>
                        <a 
                          href={`tel:${t.contactInfo?.items?.[0]?.content?.[0]}`}
                          className="text-white hover:text-orange-300 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault()
                            handleCopy(t.contactInfo?.items?.[0]?.content?.[0], 0)
                          }}
                        >
                          {t.contactInfo?.items?.[0]?.content?.[0]}
                        </a>
                      </p>
                    </div>
                  ),
                  dark: true,
                  copyText: t.contactInfo?.items?.[0]?.content?.[0],
                },
                {
                  icon: Mail,
                  title: t.contactInfo?.items?.[1]?.title,
                  content: (
                    <p>
                      <a
                        href={`mailto:${t.contactInfo?.items?.[1]?.content?.[0]}`}
                        className="text-white hover:text-zinc-200 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          handleCopy(t.contactInfo?.items?.[1]?.content?.[0], 1)
                        }}
                      >
                        {t.contactInfo?.items?.[1]?.content?.[0]}
                      </a>
                    </p>
                  ),
                  dark: false,
                  copyText: t.contactInfo?.items?.[1]?.content?.[0],
                },
                {
                  icon: MapPin,
                  title: t.contactInfo?.items?.[2]?.title,
                  content: (
                    <p>
                      <span 
                        className="cursor-pointer"
                        onClick={() => handleCopy(t.contactInfo?.items?.[2]?.content?.[0], 2)}
                      >
                        {t.contactInfo?.items?.[2]?.content?.[0]
                          ? t.contactInfo.items[2].content[0].replace(", ", ", \n")
                          : ''}
                      </span>
                    </p>
                  ),
                  dark: true,
                  copyText: t.contactInfo?.items?.[2]?.content?.[0],
                },
                {
                  icon: Clock,
                  title: t.contactInfo?.items?.[3]?.title,
                  content: (
                    <p>
                      {t.contactInfo?.items?.[3]?.content?.[0]}
                    </p>
                  ),
                }
              ].map((item, index) => (
                <SectionWrapper key={index} animation="fade-up" delay={100 * (index + 1)}>
                  <div
                    className={cn(
                      "h-full flex flex-col items-center text-center p-8 rounded-xl transition-all duration-500 group cursor-pointer",
                      item.dark ? "bg-zinc-900 text-white" : "bg-orange-600 text-white",
                      activeInfoBox === index
                        ? "transform scale-105 z-10 shadow-xl"
                        : "hover:transform hover:scale-[1.03] hover:z-10 hover:shadow-lg",
                      copyStatus[index] && "ring-2 ring-green-400",
                    )}
                    onClick={() => handleCopy(item.copyText, index)}
                    onMouseEnter={() => setActiveInfoBox(index)}
                    onMouseLeave={() => setActiveInfoBox(null)}
                  >
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
                        item.dark ? "bg-white/10 group-hover:bg-white/20" : "bg-white/10 group-hover:bg-white/20",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-8 w-8 transition-all duration-500",
                          item.dark
                            ? "text-orange-500 group-hover:text-orange-400"
                            : "text-white group-hover:scale-110",
                        )}
                      />
                    </div>
                    <h3 className="text-xl font-semibold uppercase mb-4">{item.title}</h3>
                    {item.content}

                    {/* Decorative elements */}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <item.icon className="w-full h-full" />
                    </div>
                  </div>
                </SectionWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t.process?.title}</h2>
                <p className="text-lg text-gray-600">{t.process?.subtitle}</p>
              </div>
            </SectionWrapper>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {(t.process?.steps || []).map((item: {
                step: string;
                title: string;
                description: string;
              }, index: number) => (
                <SectionWrapper key={index} animation="fade-up" delay={200 * (index + 1)}>
                  <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 h-full relative overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="absolute -right-2 -top-6 text-8xl font-bold text-gray-100 opacity-80 group-hover:text-orange-100 transition-colors duration-500 text-right">
                      {item.step}
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors duration-500">
                        {index === 0 ? (
                          <MessageSquare className="h-6 w-6 text-orange-600" />
                        ) : index === 1 ? (
                          <HelpCircle className="h-6 w-6 text-orange-600" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-orange-600" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </SectionWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {t.contactForm?.badge}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t.contactForm?.title}</h2>
                <p className="text-gray-600">{t.contactForm?.subtitle}</p>
              </div>
            </SectionWrapper>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <SectionWrapper animation="fade-left">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl"></div>

                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <input type="hidden" name="csrfToken" value={formData.csrfToken} />
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          required
                          id="jmeno"
                          name="jmeno"
                          type="text"
                          value={formData.jmeno}
                          onChange={handleChange}
                          placeholder={t.contactForm?.form?.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                          disabled={formStatus === "submitting" || formStatus === "success"}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-0 peer-focus:opacity-100 transition-opacity duration-300">
                          <span className="text-gray-500">👤</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          required
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t.contactForm?.form?.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                          disabled={formStatus === "submitting" || formStatus === "success"}
                        />
                      </div>
                      <div className="relative">
                        <input
                          required
                          id="telefon"
                          name="telefon"
                          type="text"
                          value={formData.telefon}
                          onChange={handleChange}
                          placeholder={t.contactForm?.form?.phone}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                          disabled={formStatus === "submitting" || formStatus === "success"}
                        />
                      </div>
                      <div className="relative">
                        <textarea
                          required
                          id="zprava"
                          name="zprava"
                          rows={5}
                          value={formData.zprava}
                          onChange={handleChange}
                          placeholder={t.contactForm?.form?.message}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 resize-none"
                          disabled={formStatus === "submitting" || formStatus === "success"}
                        ></textarea>
                      </div>
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
                            {t.contactForm?.form?.submit} <Send className="ml-2 h-4 w-4" />
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
                            {t.contactForm?.form?.sending}
                          </span>
                        )}

                        {formStatus === "success" && (
                          <span className="relative z-10 flex items-center justify-center">
                            <CheckCircle className="mr-2 h-5 w-5" /> {t.contactForm?.form?.success}
                          </span>
                        )}

                        {formStatus === "error" && <span className="relative z-10">{t.contactForm?.form?.error}</span>}
                      </Button>
                    </div>
                  </form>
                </div>
              </SectionWrapper>

              <div className="space-y-8">
                <SectionWrapper animation="fade-right" delay={200}>
                  <div className="bg-zinc-900 text-white p-8 rounded-xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>

                    <h3 className="text-2xl font-semibold mb-4">{t.contactForm?.quickResponse?.title}</h3>
                    <p className="text-zinc-300 mb-6">
                      {t.contactForm?.quickResponse?.description}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-orange-500" />
                      </div>
                      <a 
                        href="tel:+420735500003" 
                        className="text-white hover:text-orange-300 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          handleCopy("+420735500003", 10)
                        }}
                      >
                        +420 735 500 003
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-orange-500" />
                      </div>
                      <a
                        href="mailto:info@expohledavky.cz"
                        className="text-white hover:text-orange-300 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          handleCopy("info@expohledavky.cz", 11)
                        }}
                      >
                        info@expohledavky.cz
                      </a>
                    </div>
                  </div>
                </SectionWrapper>

                <SectionWrapper animation="fade-right" delay={300}>
                  <div className="h-[300px] rounded-xl overflow-hidden shadow-md relative group transition-all duration-300 hover:shadow-xl">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1785.5514604373323!2d14.440829114698493!3d50.05107500142287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b9475831cbea9%3A0xc1bda36768f28d19!2sCity%20Empiria%2C%20Na%20Pankr%C3%A1ci%2C%20140%2000%20Praha%204-Nusle!5e0!3m2!1scs!2scz!4v1633944667937!5m2!1scs!2scz"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    ></iframe>

                    {/* Map overlay with hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent flex items-end transition-opacity duration-300 hover:opacity-0">
                      <div className="p-4 text-white w-full">
                        <p className="font-medium">{t.contactForm?.map?.title}</p>
                        <div className="flex items-center text-sm mt-1">
                          <MapPin className="h-4 w-4 mr-1" /> {t.contactForm?.map?.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionWrapper>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t.faq?.title}</h2>
                <p className="text-gray-600">{t.faq?.subtitle}</p>
              </div>
            </SectionWrapper>

            <div className="max-w-3xl mx-auto">
              {(t.faq?.questions || []).map((item: { question: string; answer: string }, index: number) => (
                <SectionWrapper key={index} animation="fade-up" delay={100 * (index + 1)}>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </SectionWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 mix-blend-multiply" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-bold text-white mb-6">{t.cta?.title}</h2>
                  <p className="text-lg text-zinc-300 mb-8">
                    {t.cta?.description}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="text-white font-semibold transition-all duration-500 hover:scale-[1.04] relative overflow-hidden group shadow-xl shadow-orange-500/20"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                        backgroundPosition: "bottom",
                        backgroundSize: "150% 100%",
                      }}
                    >
                      <a href="#contact-form" className="relative">
                        <div
                          className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                          aria-hidden="true"
                        />
                        <span className="relative z-10">{t.cta?.buttons?.contactUs}</span>
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
                        <span className="relative z-10">{t.cta?.buttons?.ourServices}</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

