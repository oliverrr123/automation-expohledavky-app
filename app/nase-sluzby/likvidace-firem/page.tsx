"use client"

import React from "react"
import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, FileText, Scale, Clock, Briefcase, ShieldCheck, FileCheck } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "@/lib/i18n"
import { useState, useEffect } from "react"
import csCompanyLiquidationPage from '@/locales/cs/company-liquidation-page.json'
import enCompanyLiquidationPage from '@/locales/en/company-liquidation-page.json'
import skCompanyLiquidationPage from '@/locales/sk/company-liquidation-page.json'
import deCompanyLiquidationPage from '@/locales/de/company-liquidation-page.json'
import { usePathname } from 'next/navigation'
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

// Icon mapping
const iconMap: Record<string, any> = {
  Briefcase,
  Clock,
  Scale,
  FileText,
  ShieldCheck,
  FileCheck
}

// Helper function to determine default language from URL
function getDefaultLanguageFromPath(path: string) {
  if (path.startsWith('/en/')) return 'en';
  if (path.startsWith('/sk/')) return 'sk';
  if (path.startsWith('/de/')) return 'de';
  return 'cs';
}

// Get default translations by language
function getDefaultTranslations(lang: string) {
  switch (lang) {
    case 'en': return enCompanyLiquidationPage;
    case 'sk': return skCompanyLiquidationPage;
    case 'de': return deCompanyLiquidationPage;
    default: return csCompanyLiquidationPage;
  }
}

export default function LikvidaceFiremPage() {
  const pathname = usePathname();
  const defaultLang = getDefaultLanguageFromPath(pathname || '');
  
  // Default translations based on URL path
  const defaultTranslations = getDefaultTranslations(defaultLang);
  
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  
  // Always call hooks unconditionally
  const clientTranslations = useTranslations('companyLiquidationPage')
  // Load form translations
  const formTranslations = useTranslations('servicesLayout')
  
  // Use client translations or default translations based on client state
  const t = isClient ? clientTranslations : defaultTranslations
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
    console.log("Company liquidation form translations:", t?.contactForm?.form);
    console.log("Services layout form translations:", formTranslations?.contactForm?.form);
  }, [])
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1471&auto=format&fit=crop"
            alt={t?.hero?.title || "Likvidace firem"}
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t?.hero?.title || "Likvidace firem"}</h1>
              <p className="text-xl text-zinc-300 mb-8">
                {t?.hero?.subtitle || "Profesionální a bezproblémové ukončení podnikatelské činnosti"}
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
                    {t?.mainSection?.title || "Profesionální likvidace společností"}
                  </h2>
                  <p className="text-gray-600 mb-4 text-lg">
                    {t?.mainSection?.paragraphs?.[0] || "Nabízíme komplexní služby v oblasti likvidace obchodních společností, které zahrnují veškeré právní, účetní a daňové aspekty procesu likvidace."}
                  </p>
                  <p className="text-gray-600 mb-6">
                    {t?.mainSection?.paragraphs?.[1] || "Likvidace společnosti je složitý právní proces, který vyžaduje odborné znalosti a zkušenosti. Naši specialisté vám pomohou s bezproblémovým ukončením podnikatelské činnosti, vypořádáním majetku, závazků a pohledávek společnosti v souladu s platnou legislativou."}
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
                  <h3 className="text-xl font-semibold mb-6 text-zinc-900">{t?.benefits?.title || "Proč zvolit naše služby"}</h3>
                  <ul className="space-y-4">
                    {(t?.benefits?.items || [
                      "Komplexní právní a účetní servis během celého procesu likvidace",
                      "Profesionální likvidátor s bohatými zkušenostmi",
                      "Řešení pohledávek a závazků společnosti",
                      "Minimalizace rizik pro jednatele a společníky",
                      "Transparentní cenová politika bez skrytých poplatků",
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

      {/* When to Choose Liquidation Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t?.reasons?.badge || "Kdy zvolit likvidaci"}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                {t?.reasons?.title || "V jakých situacích je vhodné likvidovat společnost"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t?.reasons?.description || "Likvidace společnosti může být vhodným řešením v různých situacích. Zde jsou nejčastější důvody, proč se společnosti rozhodnou pro likvidaci:"}
              </p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(t?.reasons?.items || [
              {
                icon: "Briefcase",
                title: "Ukončení podnikatelské činnosti",
                description: "Společníci se rozhodli ukončit podnikatelskou činnost a nechtějí v ní dále pokračovat."
              },
              {
                icon: "Clock",
                title: "Dosažení účelu společnosti",
                description: "Společnost byla založena za určitým účelem, který byl již naplněn (např. realizace konkrétního projektu)."
              },
              {
                icon: "Scale",
                title: "Ekonomické důvody",
                description: "Společnost je dlouhodobě nerentabilní, ale stále je schopna dostát svým závazkům (není v úpadku)."
              },
              {
                icon: "FileText",
                title: "Administrativní zjednodušení",
                description: "Zjednodušení firemní struktury, např. při fúzích nebo akvizicích, kdy je potřeba eliminovat nadbytečné entity."
              },
              {
                icon: "ShieldCheck",
                title: "Právní důvody",
                description: "Rozhodnutí soudu o zrušení společnosti nebo uplynutí doby, na kterou byla společnost založena."
              },
              {
                icon: "FileCheck",
                title: "Preventivní opatření",
                description: "Předcházení budoucím problémům u neaktivních společností, které by mohly vést k nucené likvidaci."
              }
            ]).map((reason: any, index: number) => (
              <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    {(() => {
                      // Simpler approach using switch statement
                      switch(reason.icon) {
                        case "Briefcase": return <Briefcase className="h-6 w-6 text-orange-600" />;
                        case "Clock": return <Clock className="h-6 w-6 text-orange-600" />;
                        case "Scale": return <Scale className="h-6 w-6 text-orange-600" />;
                        case "FileText": return <FileText className="h-6 w-6 text-orange-600" />;
                        case "ShieldCheck": return <ShieldCheck className="h-6 w-6 text-orange-600" />;
                        case "FileCheck": return <FileCheck className="h-6 w-6 text-orange-600" />;
                        default: return <Briefcase className="h-6 w-6 text-orange-600" />;
                      }
                    })()}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                  <p className="text-gray-600">{reason.description}</p>
                </div>
              </SectionWrapper>
            ))}
          </div>
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
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                {t?.process?.title || "Průběh likvidace společnosti"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t?.process?.description || "Proces likvidace společnosti zahrnuje několik klíčových kroků, které je nutné provést v souladu s platnou legislativou. Naši odborníci vás provedou celým procesem."}
              </p>
            </div>
          </SectionWrapper>

          <div className="max-w-4xl mx-auto">
            {(t?.process?.steps || [
              {
                number: "01",
                title: "Rozhodnutí o vstupu do likvidace",
                description: "Valná hromada nebo jediný společník rozhodne o zrušení společnosti s likvidací a jmenuje likvidátora."
              },
              {
                number: "02",
                title: "Zápis do obchodního rejstříku",
                description: 'Zápis vstupu společnosti do likvidace a likvidátora do obchodního rejstříku, včetně změny názvu společnosti (doplnění "v likvidaci").'
              },
              {
                number: "03",
                title: "Oznámení vstupu do likvidace",
                description: "Informování všech známých věřitelů a zveřejnění vstupu do likvidace v Obchodním věstníku."
              },
              {
                number: "04",
                title: "Sestavení zahajovací rozvahy",
                description: "Sestavení zahajovací rozvahy ke dni vstupu do likvidace a soupis jmění společnosti."
              },
              {
                number: "05",
                title: "Vypořádání pohledávek a závazků",
                description: "Vymáhání pohledávek společnosti a uspokojení závazků vůči věřitelům."
              },
              {
                number: "06",
                title: "Zpracování účetní závěrky",
                description: "Zpracování mimořádné účetní závěrky ke dni předcházejícímu dni vstupu do likvidace."
              },
              {
                number: "07",
                title: "Rozdělení likvidačního zůstatku",
                description: "Rozdělení likvidačního zůstatku mezi společníky podle jejich podílů."
              },
              {
                number: "08",
                title: "Ukončení likvidace",
                description: "Zpracování konečné zprávy o průběhu likvidace a návrh na rozdělení likvidačního zůstatku."
              },
              {
                number: "09",
                title: "Výmaz z obchodního rejstříku",
                description: "Podání návrhu na výmaz společnosti z obchodního rejstříku, čímž společnost právně zaniká."
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

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t?.advantages?.badge || "Výhody naší služby"}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                {t?.advantages?.title || "Proč svěřit likvidaci společnosti odborníkům"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t?.advantages?.description || "Likvidace společnosti je komplexní proces, který vyžaduje odborné znalosti a zkušenosti. Svěřením likvidace do rukou našich odborníků získáte řadu výhod:"}
              </p>
            </div>
          </SectionWrapper>

          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {(t?.advantages?.items || [
                "Úspora času a energie, kterou byste jinak museli věnovat složitému procesu likvidace",
                "Minimalizace rizik spojených s nesprávným postupem při likvidaci",
                "Profesionální řešení případných sporů s věřiteli nebo dlužníky",
                "Odborné účetní a daňové poradenství během celého procesu",
                "Zajištění všech právních náležitostí v souladu s aktuální legislativou",
                "Ochrana osobních zájmů jednatelů a společníků",
                "Transparentní komunikace a pravidelné informování o průběhu likvidace",
                "Rychlejší průběh celého procesu díky zkušenostem našich odborníků"
              ]).map((benefit: any, index: number) => (
                <SectionWrapper key={index} animation="fade-up" delay={index * 50}>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className="text-gray-700">{typeof benefit === 'object' ? benefit.description : benefit}</span>
                  </div>
                </SectionWrapper>
              ))}
            </div>
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
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t?.cta?.title || "Potřebujete profesionálně zlikvidovat společnost?"}
                </h2>
                <p className="text-lg text-zinc-300 mb-8">
                  {t?.cta?.description || "Kontaktujte nás pro nezávaznou konzultaci. Náš tým odborníků je připraven vám pomoci s bezproblémovou likvidací vaší společnosti v souladu s platnou legislativou."}
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
                    <Link href="/nase-sluzby" className="relative">
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
        <div className="container mx-auto px-4">
          {isClient && (
            <ContactForm
              badge={t?.contactForm?.badge || formTranslations?.contactForm?.badge || "Máte zájem o likvidaci společnosti?"}
              title={t?.contactForm?.title || formTranslations?.contactForm?.title || "Kontaktujte nás pro nezávaznou konzultaci"}
              description={t?.contactForm?.description || formTranslations?.serviceContactDescriptions?.companyLiquidation || "Vyplňte formulář níže a náš tým vás bude kontaktovat co nejdříve s nabídkou řešení na míru vaší situaci."}
              fields={{
                name: true,
                email: true,
                phone: true,
                amount: false,
                message: true,
              }}
              formAction="COMPANY_LIQUIDATION_FORM"
              showSidebar={true}
              translations={t?.contactForm?.form || formTranslations?.contactForm?.form}
              serviceName="Likvidace firem"
              sidebarTitle={t?.contactForm?.sidebarTitle || formTranslations?.serviceSidebarTitles?.companyLiquidation || "Proč svěřit likvidaci nám?"}
              sidebarReasons={t?.contactForm?.sidebarReasons || formTranslations?.serviceSidebarReasons?.companyLiquidation || [
                "Kompletní zajištění procesu likvidace",
                "Minimalizace rizik pro jednatele",
                "Rychlé a profesionální řešení",
                "Pomoc s vymáháním pohledávek společnosti",
                "Zajištění všech právních náležitostí"
              ]}
            />
          )}
        </div>
      </section>
    </>
  )
}

