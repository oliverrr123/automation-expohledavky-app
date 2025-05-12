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
import { transformPath } from '@/lib/route-mapping'

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
    } else {
      // Check URL parameters for locale
      const urlParams = new URLSearchParams(window.location.search);
      const localeParam = urlParams.get('_locale');
      if (localeParam && ['en', 'cs', 'sk', 'de'].includes(localeParam)) {
        setCurrentLocale(localeParam);
      }
    }
  }, [])
  
  const switchLanguage = (locale: string) => {
    // Get the target domain for this language
    const targetDomain = getDomainForLanguage(locale)
    
    // Get the current path
    const currentPath = window.location.pathname
    
    // Check if we're on a blog post page
    const isBlogPost = currentPath.startsWith('/blog/') && currentPath.split('/').length === 3
    
    // For blog posts, if changing language, redirect to blog homepage
    // to prevent 404 errors when posts don't exist in target language
    const localizedPath = isBlogPost
      ? '/blog'  // Always redirect to blog homepage for language switches on blog posts
      : currentLocale && currentLocale !== locale
        ? transformPath(currentPath, currentLocale, locale)
        : currentPath;
    
    // Build the new URL with the localized path and different domain
    let targetUrl: string
    
    // Handle development environment with different strategies
    if (isDev) {
      // If we're on localhost without subdomain, use URL parameter approach
      if (window.location.hostname === 'localhost' && !window.location.hostname.includes('.')) {
        const protocol = window.location.protocol
        const host = window.location.host
        
        // Create a URL with the locale parameter
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('_locale', locale);
        
        // Build the URL with the updated locale parameter
        targetUrl = `${protocol}//${host}${localizedPath}?${urlParams.toString()}`
      } else {
        // In development with subdomains, use subdomain-based language switching
        const protocol = window.location.protocol
        const port = window.location.port ? `:${window.location.port}` : ''
        targetUrl = `${protocol}//${locale}.localhost${port}${localizedPath}`
      }
    } else {
      // In production, we switch to the appropriate domain
      const protocol = window.location.protocol
      targetUrl = `${protocol}//${targetDomain}${localizedPath}`
    }
    
    // Keep query parameters and hash
    const queryString = window.location.search
    const hash = window.location.hash
    
    // If we're using URL parameters, keep the existing query string
    if (isDev && window.location.hostname === 'localhost' && !window.location.hostname.includes('.')) {
      // URL already includes the query string
    } else {
      targetUrl = `${targetUrl}${queryString}${hash}`
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