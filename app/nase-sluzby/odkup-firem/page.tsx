"use client"

import React from "react"
import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, FileText, Building, ClipboardCheck, Search, Calculator, Scale, MessageCircle, FileCheck, Award, Target, Shield, Clock } from "lucide-react"
import { useTranslations } from "@/lib/i18n"

export default function OdkupFiremPage() {
  const translations = useTranslations("companyAcquisitionPage")

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    Search: <Search className="h-6 w-6 text-orange-600" />,
    Calculator: <Calculator className="h-6 w-6 text-orange-600" />,
    Scale: <Scale className="h-6 w-6 text-orange-600" />,
    MessageCircle: <MessageCircle className="h-6 w-6 text-orange-600" />,
    FileCheck: <FileCheck className="h-6 w-6 text-orange-600" />,
    Award: <Award className="h-6 w-6 text-orange-600" />,
    Target: <Target className="h-6 w-6 text-orange-600" />,
    Shield: <Shield className="h-6 w-6 text-orange-600" />,
    Clock: <Clock className="h-6 w-6 text-orange-600" />,
    FileText: <FileText className="h-6 w-6 text-orange-600" />,
    ClipboardCheck: <ClipboardCheck className="h-6 w-6 text-orange-600" />,
    Building: <Building className="h-6 w-6 text-orange-600" />
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1470&auto=format&fit=crop"
            alt="Odkup firem"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                {translations.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{translations.hero.title}</h1>
              <p className="text-xl text-zinc-300 mb-8">
                {translations.hero.subtitle}
              </p>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pt-0 pb-12 -mt-20 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {translations.mainSection.badge}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{translations.mainSection.title}</h2>
                  <p className="text-gray-600 mb-4 text-lg">
                    {translations.mainSection.paragraphs[0]}
                  </p>
                  <p className="text-gray-600 mb-8">
                    {translations.mainSection.paragraphs[1]}
                  </p>

                  <div className="mt-8">
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <a href="#contact-form" className="flex items-center">
                        {translations.mainSection.button} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {translations.services.badge}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{translations.services.title}</h2>

                  <div className="grid md:grid-cols-1 gap-6 mt-8">
                    {translations.services.items.map((item: { icon: string; title: string; description: string }, index: number) => (
                      <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 shadow-sm border border-orange-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                              {iconMap[item.icon] || <FileText className="h-6 w-6 text-orange-600" />}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                              <p className="text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </SectionWrapper>
                    ))}
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {translations.process.badge}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{translations.process.title}</h2>

                  <div className="grid md:grid-cols-1 gap-6 mt-8">
                    {translations.process.steps.map((step: { number: string; title: string; description: string }, index: number) => (
                      <div key={index} className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 shadow-sm border border-orange-100 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-orange-600">{step.number}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {translations.benefits.badge}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{translations.benefits.title}</h2>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {translations.benefits.items.map((item: { icon: string; title: string; description: string }, index: number) => (
                      <div key={index} className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 shadow-sm border border-orange-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            {iconMap[item.icon] || <Award className="h-5 w-5 text-orange-600" />}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 p-6 bg-zinc-900 text-white rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Building className="h-5 w-5 text-orange-400" />
                      </div>
                      <p className="text-lg">
                        {translations.benefits.note}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{translations.cta.title}</h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    {translations.cta.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <a href="#contact-form" className="flex items-center">
                        {translations.cta.primaryButton} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50 transition-all duration-300"
                    >
                      <a href="/nase-sluzby" className="flex items-center">
                        {translations.cta.secondaryButton}
                      </a>
                    </Button>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

