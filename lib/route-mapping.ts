// Defines the mapping between localized URL paths across languages
// Used for maintaining consistent routes across domains and redirecting correctly

// Route mapping object type for type safety
export type RouteMap = {
  // Each key is a locale code
  [locale: string]: {
    // Each key is the route path WITHOUT leading slash
    [routePath: string]: string;
  };
};

// Define the route mappings for each locale
// The keys are the route paths in each language, and the values are the English equivalents
// This makes English the "canonical" language for routes
export const ROUTES: RouteMap = {
  // Czech routes (cs)
  cs: {
    "o-nas": "about-us",
    "nase-sluzby": "services",
    "nase-sluzby/vymahani-pohledavek": "services/debt-collection",
    "nase-sluzby/sprava-firemnich-pohledavek": "services/corporate-receivables",
    "nase-sluzby/odkup-prodej-pohledavek": "services/receivables-purchase",
    "nase-sluzby/odkup-firem": "services/company-purchase",
    "nase-sluzby/likvidace-firem": "services/company-liquidation",
    "nase-sluzby/krizovy-management": "services/crisis-management",
    "nase-sluzby/odkup-smenek": "services/promissory-notes",
    "cenik": "pricing",
    "slovnik-a-vzory": "dictionary-templates",
    "lustrace": "background-checks",
    "kontakt": "contact",
    "blog": "blog",
    "ochrana-osobnich-udaju": "privacy-policy",
    "klient-prihlaseni": "client-login",
    "poptavka": "inquiry"
  },
  
  // Slovak routes (sk)
  sk: {
    "o-nas": "about-us",
    "nase-sluzby": "services",
    "nase-sluzby/vymahanie-pohladavok": "services/debt-collection",
    "nase-sluzby/sprava-firemnych-pohladavok": "services/corporate-receivables",
    "nase-sluzby/odkup-predaj-pohladavok": "services/receivables-purchase",
    "nase-sluzby/odkup-firiem": "services/company-purchase",
    "nase-sluzby/likvidacia-firiem": "services/company-liquidation",
    "nase-sluzby/krizovy-manazment": "services/crisis-management",
    "nase-sluzby/odkup-zmeniek": "services/promissory-notes",
    "cennik": "pricing",
    "slovnik-a-vzory": "dictionary-templates",
    "lustracia": "background-checks",
    "kontakt": "contact",
    "blog": "blog",
    "ochrana-osobnych-udajov": "privacy-policy",
    "klient-prihlasenie": "client-login",
    "poziadavka": "inquiry"
  },
  
  // German routes (de)
  de: {
    "uber-uns": "about-us",
    "unsere-leistungen": "services",
    "unsere-leistungen/inkasso": "services/debt-collection",
    "unsere-leistungen/firmen-forderungsmanagement": "services/corporate-receivables",
    "unsere-leistungen/forderungskauf-verkauf": "services/receivables-purchase",
    "unsere-leistungen/unternehmenskauf": "services/company-purchase",
    "unsere-leistungen/unternehmensliquidation": "services/company-liquidation",
    "unsere-leistungen/krisenmanagement": "services/crisis-management",
    "unsere-leistungen/wechselkauf": "services/promissory-notes",
    "preisliste": "pricing",
    "worterbuch-vorlagen": "dictionary-templates",
    "uberprufungen": "background-checks",
    "kontakt": "contact",
    "blog": "blog",
    "datenschutz": "privacy-policy",
    "kunden-login": "client-login",
    "anfrage": "inquiry"
  },
  
  // English routes (en) - canonical routes
  en: {
    "about-us": "about-us",
    "services": "services",
    "services/debt-collection": "services/debt-collection",
    "services/corporate-receivables": "services/corporate-receivables",
    "services/receivables-purchase": "services/receivables-purchase",
    "services/company-purchase": "services/company-purchase",
    "services/company-liquidation": "services/company-liquidation",
    "services/crisis-management": "services/crisis-management",
    "services/promissory-notes": "services/promissory-notes",
    "pricing": "pricing",
    "dictionary-templates": "dictionary-templates",
    "background-checks": "background-checks",
    "contact": "contact",
    "blog": "blog",
    "privacy-policy": "privacy-policy",
    "client-login": "client-login",
    "inquiry": "inquiry"
  }
};

// Generate a reverse mapping for each locale
// This allows us to look up a route by its canonical (English) path
export const CANONICAL_TO_LOCALIZED: {
  [locale: string]: {
    [canonicalPath: string]: string;
  };
} = Object.entries(ROUTES).reduce((result, [locale, routes]) => {
  result[locale] = {};
  
  // For each route in the current locale
  Object.entries(routes).forEach(([localizedPath, canonicalPath]) => {
    // Add mapping from canonical to localized
    result[locale][canonicalPath] = localizedPath;
  });
  
  return result;
}, {} as {
  [locale: string]: {
    [canonicalPath: string]: string;
  };
});

/**
 * Route mapping utility for transforming paths between languages
 */

// Define the common route mappings that will be used everywhere
// These are Czech-to-language mappings since Czech is our default file structure

// Route mapping for Czech to English
export const CS_TO_EN: Record<string, string> = {
  'o-nas': 'about-us',
  'nase-sluzby': 'services',
  'nase-sluzby/vymahani-pohledavek': 'services/debt-collection',
  'nase-sluzby/sprava-firemnich-pohledavek': 'services/corporate-receivables',
  'nase-sluzby/odkup-prodej-pohledavek': 'services/receivables-purchase',
  'nase-sluzby/odkup-firem': 'services/company-purchase',
  'nase-sluzby/likvidace-firem': 'services/company-liquidation',
  'nase-sluzby/krizovy-management': 'services/crisis-management',
  'nase-sluzby/odkup-smenek': 'services/promissory-notes',
  'cenik': 'pricing',
  'slovnik-a-vzory': 'dictionary-templates',
  'lustrace': 'background-checks',
  'kontakt': 'contact',
  'blog': 'blog',
  'ochrana-osobnich-udaju': 'privacy-policy',
  'klient-prihlaseni': 'client-login',
  'poptavka': 'inquiry'
};

// Route mapping for Czech to German
export const CS_TO_DE: Record<string, string> = {
  'o-nas': 'uber-uns',
  'nase-sluzby': 'unsere-leistungen',
  'nase-sluzby/vymahani-pohledavek': 'unsere-leistungen/inkasso',
  'nase-sluzby/sprava-firemnich-pohledavek': 'unsere-leistungen/firmen-forderungsmanagement',
  'nase-sluzby/odkup-prodej-pohledavek': 'unsere-leistungen/forderungskauf-verkauf',
  'nase-sluzby/odkup-firem': 'unsere-leistungen/unternehmenskauf',
  'nase-sluzby/likvidace-firem': 'unsere-leistungen/unternehmensliquidation',
  'nase-sluzby/krizovy-management': 'unsere-leistungen/krisenmanagement',
  'nase-sluzby/odkup-smenek': 'unsere-leistungen/wechselkauf',
  'cenik': 'preisliste',
  'slovnik-a-vzory': 'worterbuch-vorlagen',
  'lustrace': 'uberprufungen',
  'kontakt': 'kontakt',
  'blog': 'blog',
  'ochrana-osobnich-udaju': 'datenschutz',
  'klient-prihlaseni': 'kunden-login',
  'poptavka': 'anfrage'
};

// Route mapping for Czech to Slovak
export const CS_TO_SK: Record<string, string> = {
  'o-nas': 'o-nas',
  'nase-sluzby': 'nase-sluzby',
  'nase-sluzby/vymahani-pohledavek': 'nase-sluzby/vymahanie-pohladavok',
  'nase-sluzby/sprava-firemnich-pohledavek': 'nase-sluzby/sprava-firemnych-pohladavok',
  'nase-sluzby/odkup-prodej-pohledavek': 'nase-sluzby/odkup-predaj-pohladavok',
  'nase-sluzby/odkup-firem': 'nase-sluzby/odkup-firiem',
  'nase-sluzby/likvidace-firem': 'nase-sluzby/likvidacia-firiem',
  'nase-sluzby/krizovy-management': 'nase-sluzby/krizovy-manazment',
  'nase-sluzby/odkup-smenek': 'nase-sluzby/odkup-zmeniek',
  'cenik': 'cennik',
  'slovnik-a-vzory': 'slovnik-a-vzory',
  'lustrace': 'lustracia',
  'kontakt': 'kontakt',
  'blog': 'blog',
  'ochrana-osobnich-udaju': 'ochrana-osobnych-udajov',
  'klient-prihlaseni': 'klient-prihlasenie',
  'poptavka': 'poziadavka'
};

// Create reverse mappings
export const EN_TO_CS = Object.entries(CS_TO_EN).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {} as Record<string, string>
);

export const DE_TO_CS = Object.entries(CS_TO_DE).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {} as Record<string, string>
);

export const SK_TO_CS = Object.entries(CS_TO_SK).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {} as Record<string, string>
);

// Map of language codes to their corresponding mappings
export const PATH_MAPPINGS: Record<string, Record<string, Record<string, string>>> = {
  cs: {
    en: CS_TO_EN,
    de: CS_TO_DE,
    sk: CS_TO_SK
  },
  en: {
    cs: EN_TO_CS,
    de: {} as Record<string, string>, // Can be computed if needed
    sk: {} as Record<string, string>  // Can be computed if needed
  },
  de: {
    cs: DE_TO_CS,
    en: {} as Record<string, string>, // Can be computed if needed
    sk: {} as Record<string, string>  // Can be computed if needed
  },
  sk: {
    cs: SK_TO_CS,
    en: {} as Record<string, string>, // Can be computed if needed
    de: {} as Record<string, string>  // Can be computed if needed
  }
};

// Export a similar structure as the Node.js version for consistency
// This helps with tooling that might reference either format
export const ROUTE_MAPPING: Record<string, Record<string, string>> = {
  'cs-en': CS_TO_EN,
  'cs-de': CS_TO_DE,
  'cs-sk': CS_TO_SK,
  'en-cs': EN_TO_CS,
  'de-cs': DE_TO_CS,
  'sk-cs': SK_TO_CS
};

/**
 * Transform a path from one language to another
 * @param path - Path to transform
 * @param fromLang - Source language code
 * @param toLang - Target language code
 * @returns Transformed path
 */
export function transformPath(path: string, fromLang: string, toLang: string): string {
  // If languages are the same, return the original path
  if (fromLang === toLang) {
    return path;
  }
  
  // Handle root path
  if (path === '/' || !path) {
    return '/';
  }
  
  // Get path without leading slash
  const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;
  
  // Split the path into segments for handling nested routes
  const pathSegments = pathWithoutLeadingSlash.split('/');
  
  // If routing through Czech as intermediary (e.g., en → de)
  // We do this by first converting to Czech, then to the target language
  if (fromLang !== 'cs' && toLang !== 'cs') {
    // Get mapping from fromLang to cs
    const toCsMapping = PATH_MAPPINGS[fromLang]?.['cs'];
    
    if (!toCsMapping) {
      console.warn(`No mapping found from ${fromLang} to cs`);
      return path;
    }
    
    // Find the Czech equivalent of the first segment
    let czechSegments = [...pathSegments];
    
    // Try to match the longest possible prefix
    for (let i = pathSegments.length; i > 0; i--) {
      const pathPrefix = pathSegments.slice(0, i).join('/');
      const czechEquivalent = toCsMapping[pathPrefix];
      
      if (czechEquivalent) {
        // Replace the matched segments with the Czech equivalent
        const czechPrefixSegments = czechEquivalent.split('/');
        czechSegments = [...czechPrefixSegments, ...pathSegments.slice(i)];
        break;
      }
    }
    
    // Now convert from Czech to the target language
    return transformPath('/' + czechSegments.join('/'), 'cs', toLang);
  }
  
  // Direct transformation between languages
  // Get the mapping for the given language pair
  const mapping = PATH_MAPPINGS[fromLang]?.[toLang];
  
  if (!mapping) {
    console.warn(`No mapping found for ${fromLang} to ${toLang}`);
    return path;
  }
  
  // Try to match the longest possible prefix
  for (let i = pathSegments.length; i > 0; i--) {
    const pathPrefix = pathSegments.slice(0, i).join('/');
    const transformedPrefix = mapping[pathPrefix];
    
    if (transformedPrefix) {
      // Replace the matched prefix with the transformed one
      const transformedSegments = transformedPrefix.split('/');
      const result = [...transformedSegments, ...pathSegments.slice(i)].join('/');
      return '/' + result;
    }
  }
  
  // If we didn't find a match for a multi-segment path,
  // try just the first segment as a fallback
  const firstSegment = pathSegments[0];
  const transformedSegment = mapping[firstSegment];
  
  if (transformedSegment) {
    pathSegments[0] = transformedSegment;
    return '/' + pathSegments.join('/');
  }
  
  // No transformation found, return original path
  console.warn(`No mapping found for path "${path}" from ${fromLang} to ${toLang}`);
  return path;
}

/**
 * Get the canonical path (English version) for a localized path
 * @param locale The current locale
 * @param path The current path (without leading slash)
 * @returns The canonical path or the original path if not found
 */
export function getCanonicalPath(locale: string, path: string): string {
  // For English locale, the path is already canonical
  if (locale === 'en') return path;
  
  // Use transform path to convert to English
  const englishPath = transformPath(`/${path}`, locale, 'en');
  
  // Return without leading slash
  return englishPath.startsWith('/') ? englishPath.slice(1) : englishPath;
}

/**
 * Get the localized path for a canonical path
 * @param locale The target locale
 * @param canonicalPath The canonical path (English version)
 * @returns The localized path or the canonical path if not found
 */
export function getLocalizedPath(locale: string, canonicalPath: string): string {
  // For English locale, the canonical path is already localized
  if (locale === 'en') return canonicalPath;
  
  // Use transform path to convert from English
  const localizedPath = transformPath(`/${canonicalPath}`, 'en', locale);
  
  // Return without leading slash
  return localizedPath.startsWith('/') ? localizedPath.slice(1) : localizedPath;
} 