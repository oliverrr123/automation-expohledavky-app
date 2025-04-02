import { getLocalizedPath } from './route-mapping';
import { getCurrentLocale } from './i18n';

/**
 * Get a localized URL path for a route
 * @param routeName Key name of the route (canonical English version without slashes)
 * @param locale Override locale (default is current detected locale)
 * @returns The localized path with leading slash
 */
export function getLocalizedRoute(routeName: string, locale?: string): string {
  const currentLocale = locale || getCurrentLocale() || 'en';
  return '/' + getLocalizedPath(currentLocale, routeName);
}

/**
 * Common routes for all locales
 * This makes it easy to reference routes by name instead of hardcoding paths
 */
export const Routes = {
  home: () => '/',
  aboutUs: (locale?: string) => getLocalizedRoute('about-us', locale),
  services: (locale?: string) => getLocalizedRoute('services', locale),
  debtCollection: (locale?: string) => getLocalizedRoute('services/debt-collection', locale),
  corporateReceivables: (locale?: string) => getLocalizedRoute('services/corporate-receivables', locale),
  receivablesPurchase: (locale?: string) => getLocalizedRoute('services/receivables-purchase', locale),
  companyPurchase: (locale?: string) => getLocalizedRoute('services/company-purchase', locale),
  promissoryNotes: (locale?: string) => getLocalizedRoute('services/promissory-notes', locale),
  pricing: (locale?: string) => getLocalizedRoute('pricing', locale),
  dictionaryTemplates: (locale?: string) => getLocalizedRoute('dictionary-templates', locale),
  contact: (locale?: string) => getLocalizedRoute('contact', locale),
  blog: (locale?: string) => getLocalizedRoute('blog', locale),
  privacyPolicy: (locale?: string) => getLocalizedRoute('privacy-policy', locale),
  clientLogin: (locale?: string) => getLocalizedRoute('client-login', locale),
}; 