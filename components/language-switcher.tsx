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
import { getDomainForLanguage, getLanguageFromHostname } from '@/lib/domain-mapping'

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
  // Don't set any default language
  const [currentLocale, setCurrentLocale] = useState<string>('')
  // Track if we're client-side rendered
  const [isClient, setIsClient] = useState(false)
  // Track initial render completion to prevent flash
  const [initialRenderComplete, setInitialRenderComplete] = useState(false)
  
  // Mark first render complete
  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);
  
  // Update locale and set client flag after hydration
  useEffect(() => {
    setIsClient(true)
    
    // Get current locale from hostname
    const hostname = window.location.hostname
    const detectedLocale = getLanguageFromHostname(hostname)
    
    // Only set locale if one was detected
    if (detectedLocale) {
      setCurrentLocale(detectedLocale)
    }
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
  
  // Only render the language name if we have detected a valid locale
  const displayName = currentLocale ? languageNames[currentLocale] : ''
  const displayFlag = currentLocale ? languageFlags[currentLocale] : ''
  
  // Return minimal structure during first render to prevent flash
  if (!initialRenderComplete) {
    return <div className="w-8 h-8"></div>;
  }
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <Globe className="h-4 w-4 mr-1" />
          {displayFlag && <span className="mr-1">{displayFlag}</span>}
          <span className="sr-only sm:not-sr-only sm:inline-block">
            {displayName}
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