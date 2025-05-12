"use client"

import { CheckCircle } from "lucide-react"
import { SectionWrapper } from "./section-wrapper"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getLanguageFromHostname } from "@/lib/domain-mapping"
import csAboutUs from '@/locales/cs/about-us.json'
import enAboutUs from '@/locales/en/about-us.json'
import skAboutUs from '@/locales/sk/about-us.json'
import deAboutUs from '@/locales/de/about-us.json'

// Define available translations
const translations = {
  cs: csAboutUs,
  en: enAboutUs,
  sk: skAboutUs,
  de: deAboutUs
};

// Default content structure without actual text
const defaultFeatures = [
  "...",
  "...",
  "...",
  "..."
]

export function AboutUs() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  const [currentTranslation, setCurrentTranslation] = useState(csAboutUs)
  
  // Safely access features with fallback to prevent errors
  const features = currentTranslation?.features || defaultFeatures
  
  // Set isClient to true after hydration is complete and update translations
  useEffect(() => {
    setIsClient(true)
    
    // Detect the current language after client-side hydration
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const detectedLocale = getLanguageFromHostname(hostname)
      
      if (detectedLocale && translations[detectedLocale as keyof typeof translations]) {
        setCurrentTranslation(translations[detectedLocale as keyof typeof translations])
      }
    }
  }, [])
  
  // Always return consistent structure for server-side and initial client-side render
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Section-specific background effects */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-orange-50 via-white to-orange-50 opacity-60 animate-gradient-shift"
        style={{ backgroundSize: "200% 200%" }}
      />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="container relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionWrapper animation="fade-right">
            <div className="flex flex-col justify-center">
              <div className="relative">
                <div className="absolute -left-8 -top-6 w-16 h-16 bg-orange-500/10 rounded-full blur-2xl" />
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900">
                  {currentTranslation.title || ''}
                </h2>
                <div className="mt-2 inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20">
                  {currentTranslation.subtitle || ''}
                </div>
              </div>
              <p className="mt-6 text-lg leading-8 text-gray-600 [text-wrap:balance]">
                {currentTranslation.description || ''}
              </p>
            </div>
          </SectionWrapper>

          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              {features.map((feature: string, index: number) => (
                <SectionWrapper key={index} animation="fade-left" delay={index * 100}>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm shadow-orange-500/5 border border-orange-500/10 transition-all duration-300 hover:scale-[1.02] hover:bg-white">
                    <CheckCircle className="h-6 w-6 flex-none text-orange-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                </SectionWrapper>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

