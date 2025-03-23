import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DOMAIN_LANG_MAP } from './lib/domain-mapping';

// Cookie name for storing the locale
const LOCALE_COOKIE = 'NEXT_LOCALE';

// Map of country codes to domains - for informational purposes only, no redirects
const COUNTRY_DOMAIN_MAP: Record<string, string> = {
  // Czech Republic
  CZ: 'expohledavky.cz',
  // Slovakia
  SK: 'expohledavky.sk',
  // Germany, Austria, Switzerland
  DE: 'expohledavky.de',
  AT: 'expohledavky.de',
  CH: 'expohledavky.de',
  // English for all other countries
  DEFAULT: 'expohledavky.com',
}

// Map of country codes to subdomains for development environment
const COUNTRY_SUBDOMAIN_MAP: Record<string, string> = {
  CZ: 'cs.localhost:3000',
  SK: 'sk.localhost:3000',
  DE: 'de.localhost:3000',
  AT: 'de.localhost:3000',
  CH: 'de.localhost:3000',
  DEFAULT: 'en.localhost:3000',
}

export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Get hostname (e.g. expohledavky.com, expohledavky.cz, localhost:3000)
  const hostname = request.headers.get('host') || '';
  
  // Skip processing if it's a static asset or API request
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Current domain without port
  const currentDomain = hostname.split(':')[0];
  
  // Determine the locale based on domain - STRICT mapping
  let locale = '';
  
  if (isDev) {
    // Development environment - determine locale from subdomain
    if (hostname.startsWith('cs.')) locale = 'cs';
    else if (hostname.startsWith('sk.')) locale = 'sk';
    else if (hostname.startsWith('de.')) locale = 'de';
    else if (hostname.startsWith('en.')) locale = 'en';
    // No default for localhost - must use specific subdomain
  } else {
    // Production environment - determine locale from domain
    if (hostname.includes('expohledavky.cz')) locale = 'cs';
    else if (hostname.includes('expohledavky.sk')) locale = 'sk';
    else if (hostname.includes('expohledavky.de')) locale = 'de';
    else if (hostname.includes('expohledavky.com')) locale = 'en';
    // No default for unknown domains
  }
  
  // Only proceed if we could determine a valid locale
  if (!locale) {
    // If on localhost with no subdomain in dev, redirect to en.localhost
    if (isDev && hostname === 'localhost:3000') {
      const redirectUrl = new URL(
        request.nextUrl.pathname,
        `${request.nextUrl.protocol}//en.localhost:3000`
      );
      
      // Preserve query parameters
      request.nextUrl.searchParams.forEach((value, key) => {
        redirectUrl.searchParams.set(key, value);
      });
      
      // Preserve hash
      if (request.nextUrl.hash) {
        redirectUrl.hash = request.nextUrl.hash;
      }
      
      // Use 307 for temporary redirect
      return NextResponse.redirect(redirectUrl, 307);
    }
    
    // For all other unknown domains, just proceed without setting locale
    return NextResponse.next();
  }
  
  // Create response object to set cookies
  let response = NextResponse.next();
  
  // Set locale cookie to ensure server-side rendering uses correct language
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'strict',
  });
  
  // Set X-Locale header for other server components
  response.headers.set('X-Locale', locale);
  
  // NO REDIRECTS between domains - each domain serves its own language
  // Users must explicitly visit the domain for the language they want
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 