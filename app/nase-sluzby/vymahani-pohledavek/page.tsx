"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "@/lib/i18n"
import { getServerTranslations } from "@/lib/server-utils"
import csDebtCollectionPage from '@/locales/cs/debt-collection-page.json'
import enDebtCollectionPage from '@/locales/en/debt-collection-page.json'
import skDebtCollectionPage from '@/locales/sk/debt-collection-page.json'
import deDebtCollectionPage from '@/locales/de/debt-collection-page.json'

// Get translations based on domain for server-side rendering
const translationsByLang = {
  cs: csDebtCollectionPage,
  en: enDebtCollectionPage,
  sk: skDebtCollectionPage,
  de: deDebtCollectionPage
};

// Server-side default translations to prevent hydration mismatch
const serverTranslations = getServerTranslations('debtCollectionPage', translationsByLang);

export default function VymahaniPohledavekPage() {
  const [isClient, setIsClient] = useState(false)
  // Always call hooks unconditionally
  const clientTranslations = useTranslations('debtCollectionPage')
  
  // Use client translations or server translations based on client state  
  const t = isClient ? clientTranslations : serverTranslations
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const [formData, setFormData] = useState({
    jmeno: "",
    email: "",
    telefon: "",
    castka: "",
    zprava: "",
  })
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [activeTab, setActiveTab] = useState("kontrola")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setFormStatus("success")

      // Reset form after submission
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
    }, 1500)
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
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1470&auto=format&fit=crop"
            alt="Vymáhání pohledávek"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                {t.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.hero.title}</h1>
              <p className="text-xl text-zinc-300 mb-8">
                {t.hero.subtitle}
              </p>
            </SectionWrapper>
          </div>
        </div>
      </section>

      <main className="relative -mt-20">
        {/* First Section */}
        <section className="pt-0 pb-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid md:grid-cols-12 gap-8 p-8 md:p-12">
                <SectionWrapper animation="fade-right" className="md:col-span-7">
                  <div>
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                      {t.mainSection.badge}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{t.mainSection.title}</h2>
                    
                    {t.mainSection.paragraphs.map((paragraph: string, index: number) => (
                      <p key={index} className={`text-gray-600 ${index === 0 ? 'mb-4 text-lg' : 'mb-6'}`}>
                        {paragraph}
                      </p>
                    ))}

                    <div className="mt-8">
                      <Button
                        asChild
                        className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                      >
                        <a href="#contact-form" className="flex items-center">
                          {t.mainSection.button} <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </SectionWrapper>

                <SectionWrapper animation="fade-left" delay={200} className="md:col-span-5">
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 shadow-sm border border-orange-100">
                    <h3 className="text-xl font-semibold mb-6 text-zinc-900">{t.mainSection.specialization.title}</h3>
                    <ul className="space-y-4">
                      {t.mainSection.specialization.items.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 group">
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:shadow transition-shadow">
                            <CheckCircle className="h-4 w-4 text-orange-500" />
                          </div>
                          <span className="text-gray-700 group-hover:translate-x-1 transition-transform">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SectionWrapper>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

