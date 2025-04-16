'use client';

// Client-side utilities for locale detection

// Available locales
export const locales = ['cs', 'sk', 'de', 'en'];

/**
 * Get current locale from client-side context
 */
export function getCurrentLocale(): string {
  // V produkčním prostředí
  if (typeof window !== 'undefined') {
    // 1. Zkusíme získat locale z URL
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && locales.includes(segments[0])) {
      return segments[0];
    }

    // 2. Zkusíme získat locale z domény
    const hostname = window.location.hostname;
    
    // Produkční domény
    if (hostname.includes('exreceivables.com')) return 'en';
    if (hostname.includes('expohladavky.sk')) return 'sk';
    if (hostname.includes('exforderungen.de')) return 'de';
    if (hostname.includes('expohledavky.cz')) return 'cs';
    
    // Vývojové subdomény
    if (hostname.startsWith('en.')) return 'en';
    if (hostname.startsWith('sk.')) return 'sk';
    if (hostname.startsWith('de.')) return 'de';
    if (hostname.startsWith('cs.')) return 'cs';
  }
  
  // Výchozí hodnota pro klienta - čeština
  return 'cs';
}

/**
 * Get default locale for use in static components
 */
export function getDefaultLocale(): string {
  return 'cs';
} 