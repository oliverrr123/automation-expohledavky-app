"use client"

import React from "react"
import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, BarChart, FileText, Shield, Users, Briefcase, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { getLocalizedPath } from "@/lib/route-mapping"
import csCrisisManagementPage from '@/locales/cs/crisis-management-page.json'
import enCrisisManagementPage from '@/locales/en/crisis-management-page.json'
import skCrisisManagementPage from '@/locales/sk/crisis-management-page.json'
import deCrisisManagementPage from '@/locales/de/crisis-management-page.json'
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

// Icon mapping
const iconMap: Record<string, any> = {
  BarChart,
  FileText,
  Shield,
  Users,
  Briefcase,
  TrendingUp
}

// Default translations to use before client-side hydration
const defaultTranslations = csCrisisManagementPage;

export default function KrizovyManagementPage() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  
  // Always call hooks unconditionally
  const clientTranslations = useTranslations('crisisManagementPage')
  // Load form translations
  const formTranslations = useTranslations('servicesLayout')
  
  // Use client translations or default translations based on client state
  const t = isClient ? clientTranslations : defaultTranslations
  
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
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop"
            alt={t?.hero?.title || "Krizový management"}
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                {t?.hero?.badge || "Naše služby"}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t?.hero?.title || "Krizový management"}</h1>
              <p className="text-xl text-zinc-300 mb-8">
                {t?.hero?.subtitle || "Komplexní řešení pro firmy s problémy a restrukturalizace podniků"}
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
                    {t?.mainSection?.badge || "Komplexní řešení"}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                    {t?.mainSection?.title || "Vraťte své podnikání rychle do zdravého stavu"}
                  </h2>
                  <p className="text-gray-600 mb-4 text-lg">
                    {t?.mainSection?.paragraphs?.[0] || "Krizový management od EX Capital Partners je komplexní integrovaná služba krizového řízení podniku."}
                  </p>
                  <p className="text-gray-600 mb-6">
                    {t?.mainSection?.paragraphs?.[1] || "Jako součást krizového řízení, fundraisingu nebo prodeje podniku vám pomůžeme získat lepší finanční nabídky a maximalizovat hodnotu vaší firmy. Naše služba je zaměřena na řešení firem s problémy a komplexní restrukturalizaci podniků."}
                  </p>

                  <div className="mt-8">
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <a href="#contact-form" className="flex items-center">
                        {t?.mainSection?.button || "Nezávazná poptávka"} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </SectionWrapper>

              <SectionWrapper animation="fade-left" delay={200} className="md:col-span-5">
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 shadow-sm border border-orange-100">
                  <h3 className="text-xl font-semibold mb-6 text-zinc-900">{t?.benefits?.title || "Vše v jednom balíčku"}</h3>
                  <ul className="space-y-4">
                    {(t?.benefits?.items || [
                      "Právní restrukturalizace s cílem minimalizovat rizika a dopady možné platební neschopnosti",
                      'Příprava "Datové místnosti" — kompletní inventarizace a audit firemní dokumentace',
                      "Vymáhání pohledávek ve zkrácené době pro stabilní cash flow",
                      "Inventarizace a snižování nákladů",
                      "Optimalizace závazků pro zdravý cash flow a zdravé dodavatelské vztahy",
                    ]).map((item: any, index: number) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:shadow transition-shadow">
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                        </div>
                        <span className="text-gray-700 group-hover:translate-x-1 transition-transform">
                          {typeof item === 'object' ? item.description : item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t?.services?.badge || "Komplexní služby"}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                {t?.services?.title || "Krizový management pro firmy s problémy"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t?.services?.description || "Naše služba krizového managementu zahrnuje komplexní řešení pro firmy v obtížné situaci a nabízí profesionální restrukturalizaci podniku."}
              </p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(t?.services?.items || [
              {
                icon: "BarChart",
                title: "Široké možnosti financování",
                description:
                  "Nabízíme flexibilní nebankovní financování pro překlenutí krizového období a stabilizaci cash flow."
              },
              {
                icon: "FileText",
                title: "Intenzivní spolupráce s úřady",
                description:
                  "Zajišťujeme profesionální komunikaci s insolvenčními a finančními úřady pro minimalizaci rizik."
              },
              {
                icon: "Users",
                title: "Udržení zaměstnanosti",
                description:
                  "Prioritou je udržení zaměstnanosti a sociálního zabezpečení zaměstnanců i v krizové situaci."
              },
              {
                icon: "Shield",
                title: "Revize a optimalizace daní",
                description:
                  "Komplexní revize daňových povinností a optimalizace daňové zátěže v souladu s legislativou."
              },
              {
                icon: "Briefcase",
                title: "Rozsáhlá právní podpora",
                description: "Poskytujeme komplexní právní podporu při restrukturalizaci a řešení krizových situací."
              },
              {
                icon: "TrendingUp",
                title: "Diskrétnost a soukromí",
                description:
                  "Garantujeme top soukromí a diskrétnost s minimální expozicí na trhu během celého procesu."
              }
            ]).map((feature: any, index: number) => (
              <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    {feature.icon && iconMap[feature.icon] ? 
                      (() => {
                        const IconComponent = iconMap[feature.icon];
                        return <IconComponent className="h-6 w-6 text-orange-600" />;
                      })() : 
                      <BarChart className="h-6 w-6 text-orange-600" />
                    }
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </SectionWrapper>
            ))}
          </div>

          <SectionWrapper animation="fade-up" delay={300}>
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">
                {t?.services?.note || "Tuto službu nabízíme samostatně a také jako součást naší služby"}{" "}
                <Link href={`/${getLocalizedPath(isClient ? clientTranslations._locale : 'cs', 'services/company-purchase')}`} className="text-orange-500 hover:text-orange-600 font-medium">
                  {t?.services?.linkText || "Odkupu firem"}
                </Link>
              </p>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t?.process?.badge || "Jak to funguje"}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t?.process?.title || "Průběh naší spolupráce"}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t?.process?.description || "Obecný harmonogram služby krizového managementu a restrukturalizace"}
              </p>
            </div>
          </SectionWrapper>

          <div className="max-w-4xl mx-auto">
            {(t?.process?.steps || [
              {
                number: "01",
                title: "Stanovení cílů",
                description: "Valná hromada a stanovení cílů Krizového managementu"
              },
              {
                number: "02",
                title: "Předběžné dohodnutí",
                description:
                  "Podepsání Smlouvy o mlčenlivosti (tzv. NDA / Non-Disclosure Agreement) a Předběžné smlouvy o spolupráci"
              },
              {
                number: "03",
                title: "Data Room",
                description: "Příprava Datové místnosti (tzv. Data Room)"
              },
              {
                number: "04",
                title: "Příprava Plánu krizového řízení",
                description: "Analýza Datové místnosti a příprava Plánu krizového řízení"
              },
              {
                number: "05",
                title: "Zahájení",
                description: "Přezkoumání a formální schválení Plánu krizového řízení všemi zúčastněnými stranami"
              },
              {
                number: "06",
                title: "Implementace",
                description: "Implementace Plánu krizového řízení"
              },
              {
                number: "07",
                title: "Monitoring",
                description: "Monitorování a analýza výsledků Plánu krizového řízení"
              },
              {
                number: "08",
                title: "Závěr a převzetí",
                description: "Formální potvrzení výsledků a ukončení činnosti Krizového managementu"
              }
            ]).map((step: any, index: number) => (
              <SectionWrapper key={index} animation="fade-up" delay={index * 100}>
                <div className="flex gap-6 mb-8">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-600">
                    {step.number}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </SectionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 mix-blend-multiply" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t?.cta?.title || "Potřebujete pomoc s restrukturalizací vaší firmy?"}
                </h2>
                <p className="text-lg text-zinc-300 mb-8">
                  {t?.cta?.description || "Kontaktujte nás pro nezávaznou konzultaci. Náš tým odborníků je připraven vám pomoci s krizovým managementem a řešením problémů vaší firmy."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
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
                      <span className="relative z-10">{t?.cta?.primaryButton || "Kontaktovat nás"}</span>
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="relative overflow-hidden border-2 border-white text-white bg-white/5 backdrop-blur-sm font-semibold transition-all duration-500 hover:scale-[1.04] hover:bg-white/20 shadow-xl shadow-black/20"
                  >
                    <Link href={`/${getLocalizedPath(isClient ? clientTranslations._locale : 'cs', 'services')}`} className="relative">
                      <div
                        className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                        aria-hidden="true"
                      />
                      <span className="relative z-10">{t?.cta?.secondaryButton || "Další služby"}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          {isClient && (
            <ContactForm
              badge={t?.contactForm?.badge || formTranslations?.contactForm?.badge || "Krizový management"}
              title={t?.contactForm?.title || formTranslations?.contactForm?.title || "Kontaktujte nás pro nezávaznou konzultaci"}
              description={t?.contactForm?.description || formTranslations?.serviceContactDescriptions?.crisisManagement || "Vyplňte formulář níže a náš tým vás bude kontaktovat co nejdříve s nabídkou řešení krizové situace vaší firmy."}
              fields={{
                name: true,
                email: true,
                phone: true,
                amount: false,
                message: true,
              }}
              formAction="CRISIS_MANAGEMENT_FORM"
              showSidebar={true}
              translations={t?.contactForm?.form || formTranslations?.contactForm?.form}
              serviceName="Krizový management"
              sidebarTitle={t?.contactForm?.sidebarTitle || formTranslations?.serviceSidebarTitles?.crisisManagement || "Proč zvolit náš krizový management?"}
              sidebarReasons={t?.contactForm?.sidebarReasons || formTranslations?.serviceSidebarReasons?.crisisManagement || [
                "Okamžitá analýza vaší situace",
                "Praktická implementace krizových opatření",
                "Optimalizace finančních toků",
                "Vyjednávání s věřiteli a stakeholdery",
                "Dlouhodobý plán revitalizace společnosti"
              ]}
            />
          )}
        </div>
      </section>
    </>
  )
}

