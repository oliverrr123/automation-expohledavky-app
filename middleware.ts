import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DOMAIN_LANG_MAP } from './lib/domain-mapping';
import { getCanonicalPath, CANONICAL_TO_LOCALIZED } from './lib/route-mapping';

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
    
    // Alternative development approach: check for _locale URL parameter
    if (!locale && hostname === 'localhost:3000') {
      const localeParam = request.nextUrl.searchParams.get('_locale');
      if (localeParam && ['cs', 'sk', 'de', 'en'].includes(localeParam)) {
        locale = localeParam;
      }
    }
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
      // If no locale parameter is present, redirect to add one
      if (!request.nextUrl.searchParams.has('_locale')) {
        const redirectUrl = new URL(request.nextUrl);
        redirectUrl.searchParams.set('_locale', 'en');
        return NextResponse.redirect(redirectUrl, 307);
      }
    }
    
    // For all other unknown domains, just proceed without setting locale
    return NextResponse.next();
  }
  
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;
  
  // Early return for root path
  if (pathname === '/') {
    // Create response object to set cookies for root path
    let response = NextResponse.next();
    
    // Set locale cookie
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'strict',
    });
    
    // Set X-Locale header
    response.headers.set('X-Locale', locale);
    
    return response;
  }
  
  // Handle routes that need to be rewritten internally
  // The goal is to preserve the user-visible URL in the browser
  // while internally routing to the correct file in the app directory
  
  // Step 1: For non-Czech locales, we need to map the route to the Czech structure
  // since our app directory uses Czech paths
  if (locale !== 'cs') {
    // Get the clean path without leading slash
    const pathWithoutLeadingSlash = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    
    // Create a rewrite URL that will be modified if a mapping is found
    const url = request.nextUrl.clone();
    let shouldRewrite = false;
    
    // Case 1: For English (canonical) routes
    if (locale === 'en') {
      // The pathname is in English/canonical form, find the Czech equivalent
      const canonicalPath = pathWithoutLeadingSlash;
      const czechPath = CANONICAL_TO_LOCALIZED['cs'][canonicalPath];
      
      if (czechPath) {
        url.pathname = `/${czechPath}`;
        shouldRewrite = true;
      }
    } 
    // Case 2: For German routes
    else if (locale === 'de') {
      // Convert German path to canonical (English), then to Czech
      const canonicalPath = getCanonicalPath('de', pathWithoutLeadingSlash);
      
      if (canonicalPath) {
        const czechPath = CANONICAL_TO_LOCALIZED['cs'][canonicalPath];
        
        if (czechPath) {
          url.pathname = `/${czechPath}`;
          shouldRewrite = true;
        }
      }
      
      // Direct conversion for common paths
      // This is a fallback for paths not in route mapping
      if (!shouldRewrite) {
        // Try some common direct conversions
        if (pathWithoutLeadingSlash === 'uber-uns') {
          url.pathname = '/o-nas';
          shouldRewrite = true;
        } else if (pathWithoutLeadingSlash === 'unsere-leistungen') {
          url.pathname = '/nase-sluzby';
          shouldRewrite = true;
        }
      }
    }
    // Case 3: For Slovak routes
    else if (locale === 'sk') {
      // Convert Slovak path to canonical (English), then to Czech
      const canonicalPath = getCanonicalPath('sk', pathWithoutLeadingSlash);
      
      if (canonicalPath) {
        const czechPath = CANONICAL_TO_LOCALIZED['cs'][canonicalPath];
        
        if (czechPath) {
          url.pathname = `/${czechPath}`;
          shouldRewrite = true;
        }
      }
      
      // Direct mapping for common Slovak paths
      // As Slovak is similar to Czech, we might be able to use the path directly
      if (!shouldRewrite) {
        // Try using the same path, as many Slovak paths match Czech ones
        if (pathWithoutLeadingSlash === 'o-nas' || 
            pathWithoutLeadingSlash === 'nase-sluzby' ||
            pathWithoutLeadingSlash === 'blog' ||
            pathWithoutLeadingSlash === 'kontakt') {
          // Same path can be used directly
          shouldRewrite = false; // No rewrite needed, existing files should work
        }
      }
    }
    
    // Apply rewrite if a mapping was found
    if (shouldRewrite) {
      // Create a response for setting cookies
      const response = NextResponse.rewrite(url);
      
      // Set locale cookie
      response.cookies.set(LOCALE_COOKIE, locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'strict',
      });
      
      // Set X-Locale header
      response.headers.set('X-Locale', locale);
      
      return response;
    }
  }
  
  // Aby se zajistilo správné fungování stránky pro vyhledávání, přidám ošetření cesty /blog/search
  if (pathname.startsWith('/blog/search')) {
    // Parse the existing search parameters
    const url = request.nextUrl.clone();
    const searchParams = url.searchParams;
    
    // If locale is not present in the URL, add it from our detected locale
    if (!searchParams.has('locale') && locale) {
      searchParams.set('locale', locale);
      url.search = searchParams.toString();
      return NextResponse.redirect(url);
    }
    
    // If not redirecting, still set the locale cookie and header
    let response = NextResponse.next();
    
    // Set locale cookie
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'strict',
    });
    
    // Set X-Locale header
    response.headers.set('X-Locale', locale);
    
    return response;
  }
  
  // Create response object to set cookies for Czech or unmapped paths
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