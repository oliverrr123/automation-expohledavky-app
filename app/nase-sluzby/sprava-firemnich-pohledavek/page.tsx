"use client"

import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useTranslations } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

export default function SpravaFiremnichPohledavekPage() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  // Use client translations
  const t = useTranslations('corporateReceivablesPage')
  // Load form translations
  const formTranslations = useTranslations('servicesLayout')
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop"
            alt="Správa firemních pohledávek"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                {isClient ? t?.hero?.badge : ''}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {isClient ? t?.hero?.title : ''}
              </h1>
              <p className="text-xl text-zinc-300 mb-8">
                {isClient ? t?.hero?.subtitle : ''}
              </p>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pt-0 pb-16 -mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-12 gap-8 p-8 md:p-12">
              <SectionWrapper animation="fade-right" className="md:col-span-7">
                <div>
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {isClient ? t?.mainSection?.badge : ''}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                    {isClient ? t?.mainSection?.title : ''}
                  </h2>
                  
                  {isClient && (t?.mainSection?.paragraphs || []).map((paragraph: string, index: number) => (
                    <p key={index} className={`text-gray-600 ${index === 0 ? 'mb-4 text-lg' : 'mb-6'}`}>
                      {paragraph}
                    </p>
                  ))}

                  {isClient && (
                    <div className="mt-8">
                      <Button
                        asChild
                        className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                      >
                        <a href="#contact-form" className="flex items-center">
                          {t?.mainSection?.button} <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </SectionWrapper>

              <SectionWrapper animation="fade-left" delay={200} className="md:col-span-5">
                {isClient && (
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 shadow-sm border border-orange-100">
                    <h3 className="text-xl font-semibold mb-6 text-zinc-900">{t?.mainSection?.services?.title}</h3>
                    <ul className="space-y-4">
                      {(t?.mainSection?.services?.items || []).map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 group">
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:shadow transition-shadow">
                            <CheckCircle className="h-4 w-4 text-orange-500" />
                          </div>
                          <span className="text-gray-700 group-hover:translate-x-1 transition-transform">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {isClient ? t?.benefits?.badge : ''}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                {isClient ? t?.benefits?.title : ''}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {isClient ? t?.benefits?.description : ''}
              </p>
            </div>
          </SectionWrapper>

          {isClient && (
            <div className="grid md:grid-cols-3 gap-8">
              {(t?.benefits?.items || []).map((benefit: any, index: number) => (
                <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit?.title}</h3>
                    <p className="text-gray-600">{benefit?.description}</p>
                  </div>
                </SectionWrapper>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          {isClient && (
            <ContactForm
              badge={t?.contactForm?.badge || formTranslations?.contactForm?.badge || "Správa firemních pohledávek"}
              title={t?.contactForm?.title || formTranslations?.contactForm?.title || "Kontaktujte nás pro nezávaznou konzultaci"}
              description={t?.contactForm?.description || formTranslations?.serviceContactDescriptions?.corporateReceivables || "Vyplňte formulář níže a náš tým vás bude kontaktovat co nejdříve s nabídkou komplexního řešení správy pohledávek pro vaši firmu."}
              fields={{
                name: true,
                email: true,
                phone: true,
                amount: false,
                message: true,
              }}
              formAction="CORPORATE_RECEIVABLES_FORM"
              showSidebar={true}
              translations={t?.contactForm?.form || formTranslations?.contactForm?.form}
              serviceName="Správa firemních pohledávek"
              sidebarTitle={t?.contactForm?.sidebarTitle || formTranslations?.serviceSidebarTitles?.corporateReceivables || "Proč zvolit naši správu pohledávek?"}
              sidebarReasons={t?.contactForm?.sidebarReasons || formTranslations?.serviceSidebarReasons?.corporateReceivables || [
                "Komplexní správa všech pohledávek",
                "Optimalizace cash-flow vaší společnosti",
                "Minimalizace nákladů na vymáhání",
                "Pravidelný reporting a přehled",
                "Prevence vzniku nedobytných pohledávek"
              ]}
            />
          )}
        </div>
      </section>
    </>
  )
}

