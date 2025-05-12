"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Montserrat } from "next/font/google"
import Image from "next/image"
import { getLocalizedPath } from "@/lib/route-mapping"
import { getLanguageFromHostname } from "@/lib/domain-mapping"
import csHero from '@/locales/cs/hero.json'
import enHero from '@/locales/en/hero.json'
import skHero from '@/locales/sk/hero.json'
import deHero from '@/locales/de/hero.json'

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["900"],
})

// Define available translations
const translations = {
  cs: csHero,
  en: enHero,
  sk: skHero,
  de: deHero
}

export function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [locale, setLocale] = useState('cs')
  const [t, setTranslations] = useState(csHero) // Always start with CS to avoid hydration mismatch
  
  // Get the localized inquiry path based on current locale
  const inquiryPath = isClient ? getLocalizedPath(locale, 'inquiry') : 'poptavka'
  
  useEffect(() => {
    setIsClient(true)
    
    // Detect the current language
    const hostname = window.location.hostname
    const detectedLocale = getLanguageFromHostname(hostname)
    let newLocale = 'cs'
    
    if (detectedLocale) {
      newLocale = detectedLocale
      setLocale(detectedLocale)
    } else {
      // Check URL parameters for locale
      const urlParams = new URLSearchParams(window.location.search)
      const localeParam = urlParams.get('_locale')
      if (localeParam && ['en', 'cs', 'sk', 'de'].includes(localeParam)) {
        newLocale = localeParam
        setLocale(localeParam)
      }
    }
    
    // Update translations based on detected locale
    if (newLocale && translations[newLocale as keyof typeof translations]) {
      setTranslations(translations[newLocale as keyof typeof translations])
    }
    
    const script = document.createElement("script")
    script.src = "https://player.vimeo.com/api/player.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (iframeRef.current) {
        // @ts-ignore - Vimeo types not available
        const player = new window.Vimeo.Player(iframeRef.current)
        player.on("play", () => {
          setIsVideoLoaded(true)
        })
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="relative isolate pt-12">
      {/* Enhanced gradient background */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-500 to-orange-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="relative h-[calc(100vh-3.5rem)]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced overlay with gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"
            aria-hidden="true"
          />

          <div className="absolute inset-0">
            <Image
              src={`https://i.ibb.co/0jjhHq8h/expohledavky-thumb.jpg`}
              alt="Background"
              fill
              className="object-cover object-center animate-zoom-out"
              priority
            />
          </div>

          <div
            className={`absolute inset-0 transition-opacity duration-700 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 [&>iframe]:w-[177.77777778vh] [&>iframe]:h-[56.25vw] [&>iframe]:min-w-full [&>iframe]:min-h-full [&>iframe]:absolute [&>iframe]:top-1/2 [&>iframe]:left-1/2 [&>iframe]:-translate-x-1/2 [&>iframe]:-translate-y-1/2">
              <iframe
                ref={iframeRef}
                src="https://player.vimeo.com/video/1066379583?h=2d12ab0104&badge=0&autopause=0&player_id=0&app_id=58479&background=1&muted=1&loop=1&autoplay=1"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                title="expohledavky"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center [filter:drop-shadow(0_8px_24px_rgb(0_0_0/0.25))]">
              <h1
                className={`${montserrat.className} text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 opacity-0 animate-fade-in-up`}
                style={{ animationDelay: "200ms" }}
              >
                <span className="relative inline-block">
                  {/* Desktop-only gradient */}
                  <span className="hidden sm:inline" 
                    style={{
                      background: "-webkit-linear-gradient(#fff, #ddd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <span className="absolute -inset-1.5 bg-orange-500/10 blur-xl" aria-hidden="true" />
                    {t.headline1 || ''}
                  </span>
                  {/* Mobile plain white text */}
                  <span className="sm:hidden">
                    {t.headline1 || ''}
                  </span>
                </span>
                <br />
                <span className="relative inline-block">
                  {/* Desktop-only gradient */}
                  <span className="hidden sm:inline" 
                    style={{
                      background: "-webkit-linear-gradient(#fff, #aaa)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <span className="absolute -inset-1.5 bg-orange-500/10 blur-xl" aria-hidden="true" />
                    {t.headline2 || ''}
                  </span>
                  {/* Mobile plain white text */}
                  <span className="sm:hidden">
                    {t.headline2 || ''}
                  </span>
                </span>
              </h1>
              <p
                className="text-lg leading-8 text-zinc-100 opacity-0 animate-fade-in-up relative"
                style={{ animationDelay: "400ms" }}
              >
                <span className="relative z-10">
                  {t.description || ''}
                </span>
              </p>
              <p
                className="mt-4 text-lg font-medium italic text-orange-400 opacity-0 animate-fade-in-up relative"
                style={{ animationDelay: "600ms" }}
              >
                <span className="relative z-10">{t.quote || ''}</span>
              </p>
              <div
                className="mt-10 flex flex-col gap-4 sm:flex-row justify-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: "800ms" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-orange-500 text-white font-semibold transition-all duration-500 hover:scale-[1.04] relative overflow-hidden group shadow-xl shadow-orange-500/20"
                  style={{
                    background: "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                    backgroundPosition: "bottom",
                    backgroundSize: "150% 100%",
                  }}
                >
                  <Link href={`/${inquiryPath}`} className="relative">
                    <div
                      className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                      aria-hidden="true"
                    />
                    <span className="flex items-center">
                      {(t.buttons && t.buttons.collect) || ''}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="ml-2 h-5 w-5 stroke-[3] transition-transform duration-500 group-hover:translate-x-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-white border-white/30 hover:border-white/60 bg-white/5 backdrop-blur-sm font-semibold transition-all duration-500 hover:scale-[1.04] group"
                >
                  <Link href={`/${inquiryPath}`} className="flex items-center">
                    {(t.buttons && t.buttons.sell) || ''}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="ml-2 h-4 w-4 stroke-[3] transition-transform duration-500 group-hover:translate-x-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced bottom gradient */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-orange-500 to-orange-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] animate-pulse"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  )
}

