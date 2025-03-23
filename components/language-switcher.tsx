"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { locales } from '@/lib/i18n'
import { getDomainForLanguage } from '@/lib/domain-mapping'

// Language display names
const languageNames: Record<string, string> = {
  cs: 'Česky',
  sk: 'Slovensky',
  de: 'Deutsch',
  en: 'English',
}

// Language flags (emoji)
const languageFlags: Record<string, string> = {
  cs: '🇨🇿',
  sk: '🇸🇰',
  de: '🇩🇪',
  en: '🇬🇧',
}

// Check if we're in development
const isDev = typeof window !== 'undefined' ? 
  window.location.hostname === 'localhost' || 
  window.location.hostname.endsWith('.localhost') : 
  process.env.NODE_ENV === 'development';

export function LanguageSwitcher() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  // Always start with Czech to match server-side render
  const [currentLocale, setCurrentLocale] = useState<string>('cs')
  // Track if we're client-side rendered
  const [isClient, setIsClient] = useState(false)
  
  // Update locale and set client flag after hydration
  useEffect(() => {
    setIsClient(true)
    
    // Get current locale from hostname
    const detectLocale = (): string => {
      const hostname = window.location.hostname
      
      if (hostname.includes('expohledavky.cz')) return 'cs'
      if (hostname.includes('expohledavky.sk')) return 'sk'
      if (hostname.includes('expohledavky.de')) return 'de'
      if (hostname.includes('expohledavky.com')) return 'en'
      
      // Localhost development
      if (hostname.includes('cs.localhost')) return 'cs'
      if (hostname.includes('sk.localhost')) return 'sk'
      if (hostname.includes('de.localhost')) return 'de'
      if (hostname.includes('en.localhost')) return 'en'
      
      return 'cs' // Default fallback
    }
    
    setCurrentLocale(detectLocale())
  }, [])
  
  const switchLanguage = (locale: string) => {
    // Get the target domain for this language
    const targetDomain = getDomainForLanguage(locale)
    
    // Current path (everything after the domain)
    const path = window.location.pathname
    
    // Build the new URL with the same path but different domain
    let targetUrl: string
    
    // Handle development environment
    if (isDev) {
      // In development, we use subdomain-based language switching
      const protocol = window.location.protocol
      const port = window.location.port ? `:${window.location.port}` : ''
      targetUrl = `${protocol}//${locale}.localhost${port}${path}`
    } else {
      // In production, we switch to the appropriate domain
      const protocol = window.location.protocol
      targetUrl = `${protocol}//${targetDomain}${path}`
    }
    
    // Navigate to the new URL
    window.location.href = targetUrl
  }
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <Globe className="h-4 w-4 mr-1" />
          <span className="mr-1">{languageFlags[currentLocale]}</span>
          <span className="sr-only sm:not-sr-only sm:inline-block">
            {languageNames[currentLocale]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      {isClient && (
        <DropdownMenuContent align="end">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              className={locale === currentLocale ? "bg-orange-50" : ""}
              onClick={() => {
                setIsOpen(false)
                if (locale !== currentLocale) {
                  switchLanguage(locale)
                }
              }}
            >
              <span className="mr-2">{languageFlags[locale]}</span>
              {languageNames[locale]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
} 