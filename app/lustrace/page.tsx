"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import {
  Search,
  Shield,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Home,
  User,
  CreditCard,
  ArrowRight,
  Star,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "@/lib/i18n"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { PaymentModal } from "@/components/stripe/PaymentModal"

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  Search,
  Shield,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Home,
  User,
  CreditCard,
  ArrowRight
}

// Default translation namespace - we'll use screeningPage
const namespace = 'screeningPage'

interface BenefitItem {
  icon: keyof typeof iconMap;
  title: string;
  description: string;
}

interface IncludedItem {
  title: string;
  description: string;
}

export default function LustracePage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  
  // Get translations
  const t = useTranslations(namespace)
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
    // Add a small delay to ensure translations are loaded
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    setIsPaymentModalOpen(false)
    // You could redirect to the success page or show a success message
    window.location.href = '/lustrace/payment-success'
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
    // The error is displayed in the PaymentForm component
    // You could also do additional error handling here
  }

  // If still loading, show a minimal loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
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

      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1473&auto=format&fit=crop"
            alt={t?.hero?.title}
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                {t?.hero?.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t?.hero?.title}</h1>
              <p className="text-xl text-zinc-300 mb-8">
                {t?.hero?.subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button
                  size="lg"
                  className="bg-orange-500 text-white font-semibold transition-all duration-500 hover:scale-[1.04] relative overflow-hidden group shadow-xl shadow-orange-500/20"
                  style={{
                    background: "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                    backgroundPosition: "bottom",
                    backgroundSize: "150% 100%",
                  }}
                  onClick={() =>
                    window.scrollTo({
                      top: (document.getElementById("buy-section")?.offsetTop ?? 0) - 100,
                      behavior: "smooth",
                    })
                  }
                >
                  <div
                    className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center">
                    {t?.hero?.primaryButton} <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
                <Button
                  size="lg"
                  className="relative overflow-hidden border-2 border-white text-white bg-white/5 backdrop-blur-sm font-semibold transition-all duration-500 hover:scale-[1.04] hover:bg-white/20 shadow-xl shadow-black/20"
                  onClick={() =>
                    window.scrollTo({
                      top: (document.getElementById("benefits-section")?.offsetTop ?? 0) - 100,
                      behavior: "smooth",
                    })
                  }
                >
                  <div
                    className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{t?.hero?.secondaryButton}</span>
                </Button>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* What is Lustrace Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {t?.intro?.badge}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                  {t?.intro?.title}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t?.intro?.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-4">{t?.intro?.subtitle}</h3>
                  <p className="text-gray-600 mb-6">
                    {t?.intro?.paragraph1}
                  </p>
                  <p className="text-gray-600">
                    {t?.intro?.paragraph2}
                  </p>
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-xl h-[300px]">
                  <Image
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1472&auto=format&fit=crop"
                    alt={t?.intro?.imageAlt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <p className="text-white text-lg font-medium">{t?.intro?.imageCaption}</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t?.benefits?.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t?.benefits?.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t?.benefits?.description}
              </p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t?.benefits?.items?.map((item: BenefitItem, index: number) => {
              const IconComponent = iconMap[item.icon];
              return (
                <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </SectionWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {t?.included?.badge}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t?.included?.title}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t?.included?.description}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="grid md:grid-cols-2 gap-6">
                  {t?.included?.items?.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-orange-500" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-orange-800 mb-2">{t?.included?.disclaimerTitle}</h4>
                      <p className="text-orange-700">
                        {t?.included?.disclaimerText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Buy Section */}
      <section id="buy-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {t?.pricing?.badge}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                  {t?.pricing?.title}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t?.pricing?.description}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-4">{t?.pricing?.packageTitle}</h3>
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-orange-600">{t?.pricing?.price}</span>
                      <span className="text-gray-500 ml-2">{t?.pricing?.taxNote}</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      {t?.pricing?.packageDescription}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {t?.pricing?.benefits?.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-orange-500" />
                          </div>
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105 h-14"
                      onClick={() => setIsPaymentModalOpen(true)}
                    >
                      <CreditCard className="mr-2 h-5 w-5" /> {t?.pricing?.orderButton}
                    </Button>
                  </div>
                  <div className="bg-zinc-900 p-8 md:p-12 text-white">
                    <h3 className="text-2xl font-bold mb-6">{t?.process?.title}</h3>
                    <ol className="space-y-6">
                      {t?.process?.steps?.map((step: { number: string; title: string; description: string }, index: number) => (
                        <li key={index} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-400 font-bold">{step.number}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{step.title}</h4>
                            <p className="text-zinc-300 text-sm">
                              {step.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t?.testimonials?.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t?.testimonials?.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t?.testimonials?.description}
              </p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t?.testimonials?.items?.map((testimonial: { text: string; author: string; position: string }, index: number) => (
              <SectionWrapper key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <svg className="h-8 w-8 text-orange-500" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-6 flex-grow">{testimonial.text}</p>
                    <div className="mt-auto">
                      <p className="font-semibold text-zinc-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </SectionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t?.faq?.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t?.faq?.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t?.faq?.description}
              </p>
            </div>
          </SectionWrapper>

          <div className="max-w-3xl mx-auto">
            {t?.faq?.items?.map((faq: { question: string; answer: string }, index: number) => (
              <SectionWrapper key={index} animation="fade-up" delay={index * 50}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-3 text-zinc-900">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </SectionWrapper>
            ))}
          </div>

          <SectionWrapper animation="fade-up" delay={400}>
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">{t?.faq?.contactText}</p>
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
              >
                <Link href="/kontakt" className="flex items-center">
                  {t?.faq?.contactButton} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 mix-blend-multiply" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-6">{t?.cta?.title}</h2>
                <p className="text-lg text-zinc-300 mb-8">
                  {t?.cta?.description}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    className="text-white font-semibold transition-all duration-500 hover:scale-[1.04] relative overflow-hidden group shadow-xl shadow-orange-500/20"
                    style={{
                      background: "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                      backgroundPosition: "bottom",
                      backgroundSize: "150% 100%",
                    }}
                    onClick={() => (window.location.href = "https://lustrace.expohledavky.cz/")}
                  >
                    <div
                      className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                      aria-hidden="true"
                    />
                    <span className="relative z-10 flex items-center">
                      {t?.cta?.button} <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      <Footer />

      {isClient && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={1199}
          serviceName={t?.pricing?.packageTitle}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          buttonText={t?.pricing?.orderButton}
          language={t?.__lang || 'cs'}
        />
      )}
    </div>
  )
}

