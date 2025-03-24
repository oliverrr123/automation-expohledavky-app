"use client"

import { SectionWrapper } from "./section-wrapper"
import { useTranslations } from "@/lib/i18n"
import { Fragment, useState, useEffect } from "react"

// Default partners to use as fallback
const defaultPartners = [
  { name: "Partner 1", logo: "/placeholder.svg" },
  { name: "Partner 2", logo: "/placeholder.svg" }
];

export function Partners() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  // Use client translations
  const t = useTranslations('partners')
  
  // Safely access partners with fallback
  const partners = t?.partners || defaultPartners
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Render the text with the link properly inserted
  const renderRankingText = () => {
    if (!t || !t.rankingText) return "";
    
    const parts = t.rankingText.split('{entuzioLink}')
    return (
      <>
        {parts[0]}
        <a
          href={t.entuzioUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-orange-500 hover:text-orange-600"
        >
          {t.entuzioLinkText || "Entuzio"}
        </a>
        {parts[1] || ""}
      </>
    )
  }
  
  // If translations aren't loaded yet, show minimal UI
  if (!t || !partners || partners.length === 0) {
    return (
      <section className="py-24">
        <div className="container">
          <div className="animate-pulse bg-gray-200 h-4 w-96 mx-auto rounded"></div>
          <div className="animate-pulse bg-gray-200 h-16 w-full max-w-4xl mx-auto mt-16 rounded"></div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-24">
      <div className="container">
        <SectionWrapper animation="fade-up">
          <div className="text-center">
            <p className="text-lg text-gray-600">
              {renderRankingText()}
            </p>
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
            {partners.map((partner: any) => (
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
            {partners.map((partner: any) => (
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

