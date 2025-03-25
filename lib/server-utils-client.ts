"use client";

import { DOMAIN_LANG_MAP } from './domain-mapping';
import Cookies from 'js-cookie';

// Cookie name for storing the locale (keep in sync with middleware.ts)
const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Get locale for the initial render based on environment and hostname
 * This implementation is optimized for client components
 */
export function getInitialLocale(): string {
  // Client-side only implementation
  if (typeof window !== 'undefined') {
    // First priority: Check for global variable set by _document.tsx
    if (window.__LOCALE__ && ['cs', 'sk', 'de', 'en'].includes(window.__LOCALE__)) {
      return window.__LOCALE__;
    }
    
    // Second priority: Check localStorage for saved locale
    try {
      const storedLocale = localStorage.getItem('__LOCALE__');
      if (storedLocale && ['cs', 'sk', 'de', 'en'].includes(storedLocale)) {
        return storedLocale;
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    
    // Third priority: Check for locale from __NEXT_DATA__
    try {
      // @ts-ignore - we know this might exist from _app.tsx
      const nextData = window.__NEXT_DATA__;
      if (nextData?.props?.initialLocale && 
          ['cs', 'sk', 'de', 'en'].includes(nextData.props.initialLocale)) {
        return nextData.props.initialLocale;
      }
    } catch (e) {
      console.error('Error accessing __NEXT_DATA__:', e);
    }
    
    // Fourth priority: Check for cookie set by middleware
    const cookieLocale = Cookies.get(LOCALE_COOKIE);
    if (cookieLocale && ['cs', 'sk', 'de', 'en'].includes(cookieLocale)) {
      return cookieLocale;
    }
    
    // Fifth priority: Detect from hostname - STRICT mapping with no fallbacks
    const hostname = window.location.hostname;
    const domain = hostname.split(':')[0];
    
    // Production domains - STRICT mapping
    if (domain.includes('expohledavky.com')) return 'en';
    if (domain.includes('expohledavky.sk')) return 'sk';
    if (domain.includes('expohledavky.de')) return 'de';
    if (domain.includes('expohledavky.cz')) return 'cs';
    
    // Development environment subdomains - STRICT mapping
    if (domain.startsWith('en.')) return 'en';
    if (domain.startsWith('sk.')) return 'sk';
    if (domain.startsWith('de.')) return 'de';
    if (domain.startsWith('cs.')) return 'cs';
  }
  
  // For unknown domains or server-side default to 'cs' 
  return 'cs';
}

/**
 * Get appropriate translations based on hostname
 * Client-only version
 */
export function getDomainBasedTranslations(
  namespace: string,
  translationsByLang: Record<string, any>
): any {
  const locale = getInitialLocale();
  
  // Return only the translations for the requested locale, NO FALLBACKS
  return locale && translationsByLang[locale] ? translationsByLang[locale] : {};
} 