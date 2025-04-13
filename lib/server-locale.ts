// Server-side utilities for locale detection
// This file must NOT have "use client" directive

import { cookies, headers } from 'next/headers';

// Cookie name for storing the locale
const LOCALE_COOKIE = 'NEXT_LOCALE';

// Available locales - duplicated here for server components
export const locales = ['cs', 'sk', 'de', 'en'];

/**
 * Get current locale from server-side context
 * This is safe to use in Server Components
 */
export function getCurrentLocale(): string {
  // Try to get the locale from cookies first
  const cookieStore = cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE);
  
  if (localeCookie?.value && ['cs', 'sk', 'de', 'en'].includes(localeCookie.value)) {
    return localeCookie.value;
  }
  
  // Try to get locale from the X-Locale header (set by middleware)
  const headersList = headers();
  const xLocale = headersList.get('X-Locale');
  
  if (xLocale && ['cs', 'sk', 'de', 'en'].includes(xLocale)) {
    return xLocale;
  }
  
  // Determine locale from hostname
  const hostname = headersList.get('host') || '';
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
  
  // Default fallback for server - Czech
  return 'cs';
} 