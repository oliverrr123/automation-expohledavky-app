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
      // Use a dynamic import instead of require for server components
      // We'll need to handle this differently since this function is synchronous
      // and dynamic imports are async
      let hostname = '';
      
      // We'll need to detect the hostname using a different approach
      // This is a simplified approach that works in most Next.js server contexts
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = process.env.VERCEL_URL || 'localhost:3000';
      hostname = host;
      
      // Determine locale from domain - STRICT mapping with no fallbacks
      if (hostname.includes('exreceivables.com')) return 'en';
      if (hostname.includes('expohladavky.sk')) return 'sk';
      if (hostname.includes('exforderungen.de')) return 'de';
      if (hostname.includes('expohledavky.cz')) return 'cs';
      
      // Development environment subdomains - STRICT mapping
      if (hostname.startsWith('en.')) return 'en';
      if (hostname.startsWith('sk.')) return 'sk';
      if (hostname.startsWith('de.')) return 'de';
      if (hostname.startsWith('cs.')) return 'cs';
      
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
    if (domain.includes('exreceivables.com')) return 'en';
    if (domain.includes('expohladavky.sk')) return 'sk';
    if (domain.includes('exforderungen.de')) return 'de';
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
    if (domain.includes('exreceivables.com')) locale = 'en';
    else if (domain.includes('expohladavky.sk')) locale = 'sk';
    else if (domain.includes('exforderungen.de')) locale = 'de';
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
  
  // Return only the translations for the detected locale, provide empty structured object if not found
  if (locale && translationsByLang[locale]) {
    return translationsByLang[locale];
  }
  
  // If we can't find translations or locale, return structured empty object
  return createEmptyTranslationStructure(namespace);
}

/**
 * Create an empty translation structure based on namespace to avoid undefined errors
 */
function createEmptyTranslationStructure(namespace: string): any {
  // Normalize namespace to match our internal naming conventions
  const normalizedNamespace = namespace.replace(/-/g, '').toLowerCase();
  
  // Standard structures for common namespaces
  switch(normalizedNamespace) {
    case 'header':
      return { 
        navigation: [{
          label: '',
          href: '',
          items: []
        }], 
        buttons: {
          contact: '',
          language: ''
        },
        mobileMenu: {
          close: ''
        }
      };
    case 'footer':
      return { 
        sections: [{
          title: '',
          links: [{
            label: '',
            href: ''
          }]
        }],
        copyrightText: '',
        buttons: {
          backToTop: ''
        }
      };
    case 'hero':
      return {
        headline1: '',
        headline2: '',
        description: '',
        quote: '',
        buttons: {
          collect: '',
          sell: ''
        }
      };
    case 'blogpage':
      return {
        pageTitle: '',
        search: {
          placeholder: '',
          button: '',
          noResults: '',
          resultsCount: ''
        },
        featured: '',
        readMore: '',
        allArticles: '',
        categories: '',
        recentPosts: '',
        relatedPosts: ''
      };
    case 'pricingpage':
      return {
        title: '',
        subtitle: '',
        pricingTable: {
          header: {
            specification: '',
            rate: ''
          },
          rows: []
        },
        notes: [],
        contactForm: {
          title: '',
          success: '',
          fields: {
            name: {
              label: '',
              placeholder: ''
            },
            email: {
              label: '',
              placeholder: ''
            },
            phone: {
              label: '',
              placeholder: ''
            },
            amount: {
              label: '',
              placeholder: ''
            },
            message: {
              label: '',
              placeholder: ''
            }
          },
          submit: ''
        }
      };
    case 'servicepage':
    case 'debtcollectionpage':
    case 'corporatereceivablespage':
    case 'receivablespurchasepage':
    case 'companypurchasepage':
    case 'promissorynotespage':
      return {
        hero: {
          badge: '',
          title: '',
          subtitle: ''
        },
        mainSection: {
          badge: '',
          title: '',
          paragraphs: [],
          button: '',
          specialization: {
            title: '',
            items: []
          }
        },
        badge: '',
        title: '',
        subtitle: '',
        description: '',
        features: [],
        cta: {
          title: '',
          description: '',
          button: ''
        },
        steps: [],
        benefits: {
          title: '',
          items: []
        },
        faq: {
          title: '',
          items: []
        }
      };
    case 'serviceslayout':
      return {
        pageTitle: '',
        services: []
      };
    case 'privacypolicypage':
      return {
        title: '',
        introduction: '',
        importantNote: '',
        personalData: {
          title: '',
          content: ''
        },
        dataProcessor: {
          title: '',
          content: ''
        },
        dataProcessed: {
          title: '',
          customerIntro: '',
          customerItems: [],
          visitorIntro: '',
          visitorItems: [],
          partnerIntro: '',
          partnerItems: []
        },
        dataProcessingPurpose: {
          title: '',
          intro: '',
          tableHeaders: {
            subject: '',
            purpose: '',
            legalBasis: ''
          },
          client: {
            subject: '',
            row1: {
              purpose: '',
              legalBasis: ''
            },
            row2: {
              purpose: '',
              legalBasis: ''
            },
            row3: {
              purpose: '',
              legalBasis: ''
            },
            row4: {
              purpose: '',
              legalBasis: ''
            }
          },
          visitor: {
            subject: '',
            row1: {
              purpose: '',
              legalBasis: ''
            },
            row2: {
              purpose: '',
              legalBasis: ''
            }
          }
        },
        dataSources: {
          title: '',
          paragraph1: '',
          paragraph2: ''
        },
        dataProvision: {
          title: '',
          paragraph1: '',
          paragraph2: ''
        },
        dataAccess: {
          title: '',
          paragraph1: '',
          paragraph2: '',
          processorInfo: '',
          paragraph3: '',
          paragraph4: ''
        },
        thirdCountries: {
          title: '',
          content: ''
        },
        dataRetention: {
          title: '',
          intro: '',
          criteria: []
        },
        dataSecurity: {
          title: '',
          paragraph1: '',
          paragraph2: ''
        },
        dataRights: {
          title: '',
          intro: '',
          rights: {
            info: {
              title: '',
              description: ''
            },
            access: {
              title: '',
              description: ''
            },
            correction: {
              title: '',
              description: ''
            },
            deletion: {
              title: '',
              description: ''
            },
            restriction: {
              title: '',
              description: ''
            },
            portability: {
              title: '',
              description: ''
            },
            withdrawal: {
              title: '',
              description: ''
            },
            objection: {
              title: '',
              description: ''
            },
            complaint: {
              title: '',
              description: ''
            }
          }
        },
        contact: {
          title: '',
          paragraph1: '',
          paragraph2: ''
        }
      };
    default:
      // Generic empty structure
      return {};
  }
} 