// Import translations directly
import csMetadata from '@/locales/cs/metadata.json';
import enMetadata from '@/locales/en/metadata.json';
import skMetadata from '@/locales/sk/metadata.json';
import deMetadata from '@/locales/de/metadata.json';

// Server-side metadata by locale
const metadata = {
  cs: csMetadata,
  en: enMetadata,
  sk: skMetadata,
  de: deMetadata
};

/**
 * Get metadata for a specific locale (server-side compatible version)
 */
export function getLocaleMetadata(locale) {
  if (!locale) return { language: 'cs' };
  
  // Return only the metadata for the requested locale, no fallbacks
  if (locale && metadata[locale]) {
    return metadata[locale];
  }
  
  // If metadata isn't available for this locale, return empty object
  return { language: locale };
} 