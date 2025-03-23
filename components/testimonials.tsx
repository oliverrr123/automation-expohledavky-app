"use client"

import { useState, useEffect } from "react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useTranslations } from "@/lib/i18n"

export function Testimonials() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  // Use client translations
  const t = useTranslations('testimonials')
  const [activeIndex, setActiveIndex] = useState(0)

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current === t.testimonials.length - 1 ? 0 : current + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [t.testimonials.length])

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? t.testimonials.length - 1 : current - 1))
  }

  const goToNext = () => {
    setActiveIndex((current) => (current === t.testimonials.length - 1 ? 0 : current + 1))
  }

  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="container">
        <SectionWrapper animation="fade-up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h2>
            <p className="mt-4 text-lg text-gray-600">{t.subtitle}</p>
          </div>
        </SectionWrapper>

        <div className="relative mt-16">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 md:left-4 lg:left-24 xl:left-32 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-zinc-700 hover:text-orange-500 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110"
            aria-label={t.ariaLabels.previousTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-0 md:right-4 lg:right-24 xl:right-32 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-zinc-700 hover:text-orange-500 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110"
            aria-label={t.ariaLabels.nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="relative h-[400px]">
            {t.testimonials.map((testimonial: any, idx: number) => (
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
            {t.testimonials.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "h-3 w-3 rounded-full transition-colors",
                  idx === activeIndex ? "bg-orange-500" : "bg-gray-300 hover:bg-gray-400",
                )}
              >
                <span className="sr-only">{t.ariaLabels.goToSlide} {idx + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

