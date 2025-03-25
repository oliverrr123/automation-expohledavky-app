"use client"

import { SectionWrapper } from "./section-wrapper"
import { useTranslations } from "@/lib/i18n"
import { Fragment, useState, useEffect } from "react"
import { getServerTranslations } from "@/lib/server-utils"
import csPartners from '@/locales/cs/partners.json'
import enPartners from '@/locales/en/partners.json'
import skPartners from '@/locales/sk/partners.json'
import dePartners from '@/locales/de/partners.json'

// Define types for partner data
interface Partner {
  name: string;
  logo: string;
}

interface PartnersTranslations {
  rankingText: string;
  entuzioLinkText: string;
  entuzioUrl: string;
  partners: Partner[];
}

// Get translations based on domain for server-side rendering
const translationsByLang = {
  cs: csPartners,
  en: enPartners,
  sk: skPartners,
  de: dePartners
};

// Server-side default translations to prevent hydration mismatch
const serverTranslations = getServerTranslations('partners', translationsByLang);

// Default partners to use as fallback
const defaultPartners = [
  { name: "Partner 1", logo: "/placeholder.svg" },
  { name: "Partner 2", logo: "/placeholder.svg" }
];

export function Partners() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  // Track if initial render is complete
  const [initialRenderComplete, setInitialRenderComplete] = useState(false)
  // Always call hooks unconditionally
  const clientTranslations = useTranslations('partners')
  // Use server or client translations based on state
  const t = isClient ? clientTranslations : serverTranslations
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
    // Mark initial render as complete
    setInitialRenderComplete(true)
  }, [])

  // Safely access translations, providing fallbacks
  const rankingText = t?.rankingText || '';
  const entuzioLinkText = t?.entuzioLinkText || 'Entuzio';
  const entuzioUrl = t?.entuzioUrl || '#';
  const partners = t?.partners || defaultPartners;

  // Return minimal structure during server-side rendering to prevent hydration mismatch
  if (!initialRenderComplete) {
    return (
      <section className="py-24">
        <div className="container">
          <div className="text-center">
            <div className="h-6"></div>
          </div>
          <div className="mt-16 h-16"></div>
        </div>
      </section>
    )
  }
  
  // Render the text with the link properly inserted but avoiding nested p tags
  const renderRankingText = () => {
    if (!rankingText) return null;
    
    const parts = rankingText.split('{entuzioLink}')
    
    if (parts.length !== 2) return rankingText;
    
    return (
      <span className="text-lg text-gray-600">
        {parts[0]}
        <a
          href={entuzioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-orange-500 hover:text-orange-600"
        >
          {entuzioLinkText}
        </a>
        {parts[1]}
      </span>
    )
  }
  
  return (
    <section className="py-24">
      <div className="container">
        <SectionWrapper animation="fade-up">
          <div className="text-center">
            {renderRankingText()}
          </div>
        </SectionWrapper>

        <div className="mt-16 relative w-full overflow-hidden">
          <style jsx>{`
            .logos-slide {
              display: flex;
              gap: 2rem;
              animation: slide 30s linear infinite;
              width: max-content;
              will-change: transform;
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }

            @keyframes slide {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-50% - 1rem)); /* Adjust for half of the gap */
              }
            }

            .logos-slide:hover {
              animation-play-state: paused;
            }

            .logo-item {
              min-width: 160px;
              transform: translateZ(0);
              -webkit-transform: translateZ(0);
            }
          `}</style>

          <div className="logos-slide">
            {/* First set of partners */}
            {partners.map((partner: Partner) => (
              <div key={partner.name} className="logo-item flex items-center justify-center">
                <img 
                  src={partner.logo || "/placeholder.svg"} 
                  alt={partner.name} 
                  className="h-16 w-auto object-contain"
                  loading="eager"
                />
              </div>
            ))}
            {/* Second set of partners (duplicate) */}
            {partners.map((partner: Partner) => (
              <div key={`${partner.name}-duplicate`} className="logo-item flex items-center justify-center">
                <img 
                  src={partner.logo || "/placeholder.svg"} 
                  alt={partner.name} 
                  className="h-16 w-auto object-contain"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

