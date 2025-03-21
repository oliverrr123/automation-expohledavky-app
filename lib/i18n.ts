import csHero from '@/locales/cs/hero.json';
import csAboutUs from '@/locales/cs/about-us.json';
import csProcess from '@/locales/cs/process.json';
import csServices from '@/locales/cs/services.json';
import csTestimonials from '@/locales/cs/testimonials.json';
import csPartners from '@/locales/cs/partners.json';
import csAboutPage from '@/locales/cs/about-page.json';
import csServicesPage from '@/locales/cs/services-page.json';
import csDebtCollectionPage from '@/locales/cs/debt-collection-page.json';
import csCorporateReceivablesPage from '@/locales/cs/corporate-receivables-page.json';
import csReceivablesPurchasePage from '@/locales/cs/receivables-purchase-page.json';
import csCompanyPurchasePage from '@/locales/cs/company-purchase-page.json';
import csPromissoryNotesPage from '@/locales/cs/promissory-notes-page.json';
import csPricingPage from '@/locales/cs/pricing-page.json';
import csDictionaryTemplatesPage from '@/locales/cs/dictionary-templates-page.json';
import csCareerPage from '@/locales/cs/career-page.json';
import csContactPage from '@/locales/cs/contact-page.json';
import csBlogPage from '@/locales/cs/blog-page.json';
import csPrivacyPolicyPage from '@/locales/cs/privacy-policy-page.json';
import csHeader from '@/locales/cs/header.json';
import csFooter from '@/locales/cs/footer.json';
import csMetadata from '@/locales/cs/metadata.json';

// English translations
import enHeader from '@/locales/en/header.json';
import enFooter from '@/locales/en/footer.json';
import enMetadata from '@/locales/en/metadata.json';
import enHero from '@/locales/en/hero.json';
import enAboutUs from '@/locales/en/about-us.json';
import enProcess from '@/locales/en/process.json';
import enServices from '@/locales/en/services.json';
import enTestimonials from '@/locales/en/testimonials.json';
import enPartners from '@/locales/en/partners.json';
import enAboutPage from '@/locales/en/about-page.json';
import enServicesPage from '@/locales/en/services-page.json';
import enDebtCollectionPage from '@/locales/en/debt-collection-page.json';
import enCorporateReceivablesPage from '@/locales/en/corporate-receivables-page.json';
import enReceivablesPurchasePage from '@/locales/en/receivables-purchase-page.json';
import enCompanyPurchasePage from '@/locales/en/company-purchase-page.json';
import enPromissoryNotesPage from '@/locales/en/promissory-notes-page.json';
import enPricingPage from '@/locales/en/pricing-page.json';
import enDictionaryTemplatesPage from '@/locales/en/dictionary-templates-page.json';
import enCareerPage from '@/locales/en/career-page.json';
import enContactPage from '@/locales/en/contact-page.json';
import enBlogPage from '@/locales/en/blog-page.json';
import enPrivacyPolicyPage from '@/locales/en/privacy-policy-page.json';

// German translations
import deHeader from '@/locales/de/header.json';
import deFooter from '@/locales/de/footer.json';
import deMetadata from '@/locales/de/metadata.json';
import deHero from '@/locales/de/hero.json';
import deAboutUs from '@/locales/de/about-us.json';
import deProcess from '@/locales/de/process.json';
import deServices from '@/locales/de/services.json';
import deTestimonials from '@/locales/de/testimonials.json';
import dePartners from '@/locales/de/partners.json';
import deAboutPage from '@/locales/de/about-page.json';
import deServicesPage from '@/locales/de/services-page.json';
import deDebtCollectionPage from '@/locales/de/debt-collection-page.json';
import deCorporateReceivablesPage from '@/locales/de/corporate-receivables-page.json';
import deReceivablesPurchasePage from '@/locales/de/receivables-purchase-page.json';
import deCompanyPurchasePage from '@/locales/de/company-purchase-page.json';
import dePromissoryNotesPage from '@/locales/de/promissory-notes-page.json';
import dePricingPage from '@/locales/de/pricing-page.json';
import deDictionaryTemplatesPage from '@/locales/de/dictionary-templates-page.json';
import deCareerPage from '@/locales/de/career-page.json';
import deContactPage from '@/locales/de/contact-page.json';
import deBlogPage from '@/locales/de/blog-page.json';
import dePrivacyPolicyPage from '@/locales/de/privacy-policy-page.json';

// Slovak translations
import skHeader from '@/locales/sk/header.json';
import skFooter from '@/locales/sk/footer.json';
import skMetadata from '@/locales/sk/metadata.json';
import skHero from '@/locales/sk/hero.json';
import skAboutUs from '@/locales/sk/about-us.json';
import skProcess from '@/locales/sk/process.json';
import skServices from '@/locales/sk/services.json';
import skTestimonials from '@/locales/sk/testimonials.json';
import skPartners from '@/locales/sk/partners.json';
import skAboutPage from '@/locales/sk/about-page.json';
import skServicesPage from '@/locales/sk/services-page.json';
import skDebtCollectionPage from '@/locales/sk/debt-collection-page.json';
import skCorporateReceivablesPage from '@/locales/sk/corporate-receivables-page.json';
import skReceivablesPurchasePage from '@/locales/sk/receivables-purchase-page.json';
import skCompanyPurchasePage from '@/locales/sk/company-purchase-page.json';
import skPromissoryNotesPage from '@/locales/sk/promissory-notes-page.json';
import skPricingPage from '@/locales/sk/pricing-page.json';
import skDictionaryTemplatesPage from '@/locales/sk/dictionary-templates-page.json';
import skCareerPage from '@/locales/sk/career-page.json';
import skContactPage from '@/locales/sk/contact-page.json';
import skBlogPage from '@/locales/sk/blog-page.json';
import skPrivacyPolicyPage from '@/locales/sk/privacy-policy-page.json';

// Default language is Czech
const defaultLocale = 'cs';

// All translations by locale and namespace
const translations: Record<string, Record<string, any>> = {
  cs: {
    hero: csHero,
    aboutUs: csAboutUs,
    process: csProcess,
    services: csServices,
    testimonials: csTestimonials,
    partners: csPartners,
    aboutPage: csAboutPage,
    servicesPage: csServicesPage,
    debtCollectionPage: csDebtCollectionPage,
    corporateReceivablesPage: csCorporateReceivablesPage,
    receivablesPurchasePage: csReceivablesPurchasePage,
    companyPurchasePage: csCompanyPurchasePage,
    promissoryNotesPage: csPromissoryNotesPage,
    pricingPage: csPricingPage,
    dictionaryTemplatesPage: csDictionaryTemplatesPage,
    careerPage: csCareerPage,
    contactPage: csContactPage,
    blogPage: csBlogPage,
    privacyPolicyPage: csPrivacyPolicyPage,
    header: csHeader,
    footer: csFooter,
    metadata: csMetadata
  },
  en: {
    hero: enHero,
    aboutUs: enAboutUs,
    process: enProcess,
    services: enServices,
    testimonials: enTestimonials,
    partners: enPartners,
    aboutPage: enAboutPage,
    servicesPage: enServicesPage,
    debtCollectionPage: enDebtCollectionPage,
    corporateReceivablesPage: enCorporateReceivablesPage,
    receivablesPurchasePage: enReceivablesPurchasePage,
    companyPurchasePage: enCompanyPurchasePage,
    promissoryNotesPage: enPromissoryNotesPage,
    pricingPage: enPricingPage,
    dictionaryTemplatesPage: enDictionaryTemplatesPage,
    careerPage: enCareerPage,
    contactPage: enContactPage,
    blogPage: enBlogPage,
    privacyPolicyPage: enPrivacyPolicyPage,
    header: enHeader,
    footer: enFooter,
    metadata: enMetadata
  },
  de: {
    hero: deHero,
    aboutUs: deAboutUs,
    process: deProcess,
    services: deServices,
    testimonials: deTestimonials,
    partners: dePartners,
    aboutPage: deAboutPage,
    servicesPage: deServicesPage,
    debtCollectionPage: deDebtCollectionPage,
    corporateReceivablesPage: deCorporateReceivablesPage,
    receivablesPurchasePage: deReceivablesPurchasePage,
    companyPurchasePage: deCompanyPurchasePage,
    promissoryNotesPage: dePromissoryNotesPage,
    pricingPage: dePricingPage,
    dictionaryTemplatesPage: deDictionaryTemplatesPage,
    careerPage: deCareerPage,
    contactPage: deContactPage,
    blogPage: deBlogPage,
    privacyPolicyPage: dePrivacyPolicyPage,
    header: deHeader,
    footer: deFooter,
    metadata: deMetadata
  },
  sk: {
    hero: skHero,
    aboutUs: skAboutUs,
    process: skProcess,
    services: skServices,
    testimonials: skTestimonials,
    partners: skPartners,
    aboutPage: skAboutPage,
    servicesPage: skServicesPage,
    debtCollectionPage: skDebtCollectionPage,
    corporateReceivablesPage: skCorporateReceivablesPage,
    receivablesPurchasePage: skReceivablesPurchasePage,
    companyPurchasePage: skCompanyPurchasePage,
    promissoryNotesPage: skPromissoryNotesPage,
    pricingPage: skPricingPage,
    dictionaryTemplatesPage: skDictionaryTemplatesPage,
    careerPage: skCareerPage,
    contactPage: skContactPage,
    blogPage: skBlogPage,
    privacyPolicyPage: skPrivacyPolicyPage,
    header: skHeader,
    footer: skFooter,
    metadata: skMetadata
  }
};

// Function to get translations for a specific namespace
export function useTranslations(namespace: string, locale = defaultLocale) {
  try {
    // If the namespace doesn't exist in the requested locale, fall back to default locale
    const ns = translations[locale]?.[namespace] || translations[defaultLocale]?.[namespace] || {};
    return ns;
  } catch (error) {
    console.error(`Error loading translations for namespace "${namespace}" in locale "${locale}":`, error);
    // Fall back to default locale
    return translations[defaultLocale]?.[namespace] || {};
  }
}

// Utility function to get a translated string with dot notation path
export function t(path: string, locale = defaultLocale) {
  try {
    const [namespace, ...keys] = path.split('.');
    const translations = useTranslations(namespace, locale);
    
    const result = keys.reduce((obj, key) => obj?.[key], translations);
    return result !== undefined ? result : path;
  } catch (error) {
    console.error(`Error translating path "${path}" in locale "${locale}":`, error);
    return path;
  }
}

// Utility function to get metadata for the current locale
export function getMetadata(locale = defaultLocale) {
  try {
    return translations[locale]?.metadata || translations[defaultLocale].metadata;
  } catch (error) {
    console.error(`Error getting metadata for locale "${locale}":`, error);
    return translations[defaultLocale].metadata;
  }
} 