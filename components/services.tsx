"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { SectionWrapper } from "./section-wrapper"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronRight, ArrowRight } from "lucide-react"
import { useTranslations } from "@/lib/i18n"
import { getServerTranslations } from "@/lib/server-utils"
import csServices from '@/locales/cs/services.json'
import enServices from '@/locales/en/services.json'
import skServices from '@/locales/sk/services.json'
import deServices from '@/locales/de/services.json'

// Define types for the service data based on the actual JSON structure
interface Service {
  title: string;
  description: string;
  href: string;
}

interface ServicesTranslations {
  badge: string;
  title: string;
  subtitle: string;
  linkText: string;
  services: Service[];
}

// Get translations based on domain for server-side rendering
const translationsByLang: Record<string, ServicesTranslations> = {
  cs: csServices as ServicesTranslations,
  en: enServices as ServicesTranslations,
  sk: skServices as ServicesTranslations,
  de: deServices as ServicesTranslations
};

// Server-side default translations to prevent hydration mismatch
const serverTranslations = getServerTranslations('services', translationsByLang) as ServicesTranslations;

// Icons as JSX elements to avoid hydration mismatch when using dynamic imports
const IconCollection = () => (
  <svg className="h-12 w-12 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

const IconPurchase = () => (
  <svg className="h-12 w-12 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const IconManagement = () => (
  <svg className="h-12 w-12 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M8 21h8"></path>
    <path d="M12 17v4"></path>
    <path d="M2 7h20"></path>
  </svg>
);

export function Services() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  // Track if initial render is complete
  const [initialRenderComplete, setInitialRenderComplete] = useState(false)
  // Use server translations initially, then switch to client translations after hydration
  const t = isClient ? useTranslations('services') as ServicesTranslations : serverTranslations
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
    // Mark initial render as complete
    setInitialRenderComplete(true)
  }, [])

  // Return minimal structure during server-side rendering to prevent hydration mismatch
  if (!initialRenderComplete) {
    return (
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto">
            <div className="h-6"></div>
            <h2 className="h-10"></h2>
            <p className="h-6 mt-4"></p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Empty placeholders */}
          </div>
        </div>
      </section>
    )
  }
  
  // Safely access translations, providing fallbacks
  const badge = t?.badge || '';
  const title = t?.title || '';
  const subtitle = t?.subtitle || '';
  const linkText = t?.linkText || '';
  const services = t?.services || [];
  
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Section-specific background effects */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(249,115,22,0.1),transparent_50%),radial-gradient(circle_at_0%_0%,rgba(249,115,22,0.05),transparent_50%)] animate-gradient-shift"
        style={{ backgroundSize: "200% 200%" }}
      />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="container relative">
        <SectionWrapper animation="fade-up">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
              {badge}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500">
              {title}
            </h2>
            <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
          </div>
        </SectionWrapper>
        
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service, index: number) => (
            <SectionWrapper key={service.title} animation="zoom" delay={index * 100}>
              <Link href={service.href} className="block h-full">
                <div className="group relative rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-sm shadow-orange-500/5 border border-orange-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 hover:bg-white/95 h-full flex flex-col">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 opacity-0 blur transition duration-300 group-hover:opacity-5" />
                  <div className="relative flex-1">
                    <h3 className="text-xl font-semibold text-zinc-900">{service.title}</h3>
                    <p className="mt-4 text-gray-600">{service.description}</p>
                    <div className="mt-6 flex items-center gap-2">
                      <span className="text-orange-500">{linkText}</span>
                      <ArrowRight className="h-4 w-4 text-orange-500 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

