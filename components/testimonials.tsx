"use client"

import { useState, useEffect } from "react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useTranslations } from "@/lib/i18n"
import { getServerTranslations } from "@/lib/server-utils"
import csTestimonials from '@/locales/cs/testimonials.json'
import enTestimonials from '@/locales/en/testimonials.json'
import skTestimonials from '@/locales/sk/testimonials.json'
import deTestimonials from '@/locales/de/testimonials.json'

// Define types for testimonial data
interface Testimonial {
  text: string;
  author: string;
  company?: string;
}

interface TestimonialsTranslations {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
  ariaLabels: {
    previousTestimonial: string;
    nextTestimonial: string;
    goToSlide: string;
  };
}

// Get translations based on domain for server-side rendering
const translationsByLang = {
  cs: csTestimonials,
  en: enTestimonials,
  sk: skTestimonials,
  de: deTestimonials
};

// Server-side default translations to prevent hydration mismatch
const serverTranslations = getServerTranslations('testimonials', translationsByLang);

// Default testimonials to use as fallback
const defaultTestimonials = [
  {
    text: "...",
    author: "...",
    company: "..."
  },
  {
    text: "...",
    author: "...",
    company: "..."
  }
];

export function Testimonials() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  // Track if initial render is complete
  const [initialRenderComplete, setInitialRenderComplete] = useState(false)
  // Always call hooks unconditionally
  const clientTranslations = useTranslations('testimonials')
  // Use server or client translations based on state
  const t = isClient ? clientTranslations : serverTranslations
  
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Safely access translations, providing fallbacks
  const title = t?.title || 'Testimonials';
  const subtitle = t?.subtitle || 'What our clients say about us';
  const testimonials = t?.testimonials || defaultTestimonials;
  const ariaLabels = t?.ariaLabels || {
    previousTestimonial: 'Previous testimonial',
    nextTestimonial: 'Next testimonial',
    goToSlide: 'Go to slide'
  };
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
    // Mark initial render as complete
    setInitialRenderComplete(true)
  }, [])
  
  // Auto-advance testimonial slides - must be defined unconditionally
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    
    const timer = setInterval(() => {
      setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials])

  const goToPrevious = () => {
    if (!testimonials || testimonials.length === 0) return;
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1))
  }

  const goToNext = () => {
    if (!testimonials || testimonials.length === 0) return;
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1))
  }

  // Return minimal structure during server-side rendering to prevent hydration mismatch
  if (!initialRenderComplete) {
    return (
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="container">
          <div className="text-center">
            <div className="h-10"></div>
            <div className="h-6 mt-4"></div>
          </div>
          <div className="relative mt-16">
            <div className="h-[400px]"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="container">
        <SectionWrapper animation="fade-up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
          </div>
        </SectionWrapper>

        <div className="relative mt-16">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 md:left-4 lg:left-24 xl:left-32 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-zinc-700 hover:text-orange-500 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110"
            aria-label={ariaLabels.previousTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-0 md:right-4 lg:right-24 xl:right-32 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-zinc-700 hover:text-orange-500 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110"
            aria-label={ariaLabels.nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="relative h-[400px]">
            {testimonials.map((testimonial: Testimonial, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                  idx === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
              >
                <SectionWrapper animation="zoom" delay={200}>
                  <div className="max-w-2xl">
                    <Quote className="mx-auto h-12 w-12 text-orange-500 mb-6" />
                    <p className="text-lg leading-8 text-gray-600">{testimonial.text}</p>
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold">{testimonial.author}</h3>
                      {testimonial.company && <p className="text-sm text-gray-500 mt-1">{testimonial.company}</p>}
                    </div>
                  </div>
                </SectionWrapper>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            {testimonials.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "h-3 w-3 rounded-full transition-colors",
                  idx === activeIndex ? "bg-orange-500" : "bg-gray-300 hover:bg-gray-400",
                )}
              >
                <span className="sr-only">{ariaLabels.goToSlide} {idx + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

