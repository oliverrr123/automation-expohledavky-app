import { DOMAIN_LANG_MAP } from './domain-mapping';
import Cookies from 'js-cookie';

// Cookie name for storing the locale (keep in sync with middleware.ts)
const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Get locale for the initial render based on environment and hostname
 * This implementation is optimized for client components and early domain detection
 */
export function getInitialLocale(): string {
  // Server-side rendering case
  if (typeof window === 'undefined') {
    try {
      // Try to access the headers for server components at request time
      const { headers } = require('next/headers');
      const headersList = headers();
      const hostname = headersList.get('host') || '';
      const domain = hostname.split(':')[0];
      
      // Determine locale from domain - STRICT mapping with no fallbacks
      if (domain.includes('expohledavky.com')) return 'en';
      if (domain.includes('expohledavky.sk')) return 'sk';
      if (domain.includes('expohledavky.de')) return 'de';
      if (domain.includes('expohledavky.cz')) return 'cs';
      
      // Development environment subdomains - STRICT mapping
      if (domain.startsWith('en.')) return 'en';
      if (domain.startsWith('sk.')) return 'sk';
      if (domain.startsWith('de.')) return 'de';
      if (domain.startsWith('cs.')) return 'cs';
      
      // For unknown domains, we don't want to make assumptions
      // Each specific domain has its own language, no defaults
      // Return empty string to indicate unknown
      return '';
    } catch (e) {
      // Headers not available, can't determine domain
      return '';
    }
  }
  
  // Client-side: check for domain detection
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
    
    // For unknown domains, we don't want to make assumptions
    // Each specific domain has its own language, no defaults
    return '';
  }
  
  // If we can't determine the locale, return empty string
  // No default language assumption
  return '';
}

/**
 * Get appropriate translations based on hostname for server components
 * This selects translations based on the current hostname to optimize SEO
 */
export function getDomainBasedTranslations(
  namespace: string,
  translationsByLang: Record<string, any>,
  hostname?: string
): any {
  let locale = '';
  
  // If hostname is provided (can be passed from middleware or other server contexts)
  if (hostname) {
    const domain = hostname.split(':')[0];
    
    // Determine locale from domain - STRICT mapping with no fallbacks
    if (domain.includes('expohledavky.com')) locale = 'en';
    else if (domain.includes('expohledavky.sk')) locale = 'sk';
    else if (domain.includes('expohledavky.de')) locale = 'de';
    else if (domain.includes('expohledavky.cz')) locale = 'cs';
    
    // Development environment - determine locale from subdomain - STRICT mapping
    else if (domain.startsWith('en.')) locale = 'en';
    else if (domain.startsWith('sk.')) locale = 'sk';
    else if (domain.startsWith('de.')) locale = 'de';
    else if (domain.startsWith('cs.')) locale = 'cs';
  } else {
    // No hostname provided, use client-side detection
    locale = getInitialLocale();
  }
  
  // Return only the translations for the requested locale, NO FALLBACKS
  return locale && translationsByLang[locale] ? translationsByLang[locale] : {};
}

/**
 * Get appropriate translations for initial rendering
 * This helps prevent hydration mismatches while optimizing for SEO
 */
export function getServerTranslations(
  namespace: string, 
  translationsByLang: Record<string, any>
): any {
  // Use hostname-based locale detection
  const locale = getInitialLocale();
  
  // Return only the translations for the detected locale, NO FALLBACKS
  return locale && translationsByLang[locale] ? translationsByLang[locale] : {};
} 