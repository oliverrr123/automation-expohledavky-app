// Instead of importing from middleware, define the mapping directly here
// This avoids circular dependencies and ensures compatibility with Pages Router
export const DOMAIN_LANG_MAP: Record<string, string> = {
  'expohledavky.com': 'en',
  'expohledavky.cz': 'cs',
  'expohledavky.sk': 'sk',
  'expohledavky.de': 'de',
  'en.localhost:3000': 'en',
  'cs.localhost:3000': 'cs',
  'sk.localhost:3000': 'sk',
  'de.localhost:3000': 'de',
  // Add mappings without port for dev environment
  'en.localhost': 'en',
  'cs.localhost': 'cs',
  'sk.localhost': 'sk',
  'de.localhost': 'de',
}

// Check if we're in development environment
const isDev = typeof window !== 'undefined' ? 
  window.location.hostname === 'localhost' || 
  window.location.hostname.endsWith('.localhost') : 
  process.env.NODE_ENV === 'development';

/**
 * Get language code based on the hostname
 * This is used for client-side hostname detection
 * Each domain STRICTLY serves its own language with NO DEFAULTS
 */
export function getLanguageFromHostname(hostname: string): string {
  // Exact hostname match (including port)
  if (DOMAIN_LANG_MAP[hostname]) {
    return DOMAIN_LANG_MAP[hostname];
  }

  // Production domains without port - STRICT mapping
  const domain = hostname.split(':')[0];
  
  // Check for production domains
  if (domain.includes('expohledavky.com')) return 'en';
  if (domain.includes('expohledavky.sk')) return 'sk';
  if (domain.includes('expohledavky.de')) return 'de';
  if (domain.includes('expohledavky.cz')) return 'cs';
  
  // Development environment - determine language from subdomain
  if (domain.startsWith('en.')) return 'en';
  if (domain.startsWith('sk.')) return 'sk';
  if (domain.startsWith('de.')) return 'de';
  if (domain.startsWith('cs.')) return 'cs';
  
  // Development fallback: Check for locale in URL
  if (isDev) {
    // For localhost without subdomain, check if there's a _locale parameter in the URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const localeParam = urlParams.get('_locale');
      if (localeParam && ['en', 'cs', 'sk', 'de'].includes(localeParam)) {
        return localeParam;
      }
    }
  }
  
  // If domain not recognized, return empty string - NO DEFAULT
  return '';
}

/**
 * Get the appropriate domain for a language
 * Used for language switching
 */
export function getDomainForLanguage(lang: string): string {
  // Special handling for development environment
  if (isDev) {
    // Check if we're already using subdomains in development
    if (typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname.endsWith('.localhost'))) {
      return `${lang}.localhost${typeof window !== 'undefined' ? `:${window.location.port}` : ':3000'}`;
    }
    
    // Alternative development approach: maintain the current URL but change the locale parameter
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'localhost';
    }
  }
  
  // Production environment - direct mapping with no defaults
  switch (lang) {
    case 'en': return 'expohledavky.com';
    case 'cs': return 'expohledavky.cz';
    case 'sk': return 'expohledavky.sk';
    case 'de': return 'expohledavky.de';
    default: return '';
  }
} 