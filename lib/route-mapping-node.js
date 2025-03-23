/**
 * Route mapping for Node.js scripts
 * This file exports route mappings in CommonJS format for use in Node scripts
 */

// Route mapping for Czech to English
const CS_TO_EN = {
  'o-nas': 'about-us',
  'nase-sluzby': 'services',
  'nase-sluzby/vymahani-pohledavek': 'services/debt-collection',
  'nase-sluzby/sprava-firemnich-pohledavek': 'services/corporate-receivables',
  'nase-sluzby/odkup-prodej-pohledavek': 'services/receivables-purchase',
  'nase-sluzby/odkup-firem': 'services/company-purchase',
  'nase-sluzby/odkup-smenek': 'services/promissory-notes',
  'cenik': 'pricing',
  'slovnik-a-vzory': 'dictionary-templates',
  'kariera': 'careers',
  'kontakt': 'contact',
  'blog': 'blog',
  'ochrana-osobnich-udaju': 'privacy-policy',
  'klient-prihlaseni': 'client-login'
};

// Route mapping for Czech to German
const CS_TO_DE = {
  'o-nas': 'uber-uns',
  'nase-sluzby': 'unsere-leistungen',
  'nase-sluzby/vymahani-pohledavek': 'unsere-leistungen/inkasso',
  'nase-sluzby/sprava-firemnich-pohledavek': 'unsere-leistungen/firmen-forderungsmanagement',
  'nase-sluzby/odkup-prodej-pohledavek': 'unsere-leistungen/forderungskauf-verkauf',
  'nase-sluzby/odkup-firem': 'unsere-leistungen/unternehmenskauf',
  'nase-sluzby/odkup-smenek': 'unsere-leistungen/wechselkauf',
  'cenik': 'preisliste',
  'slovnik-a-vzory': 'worterbuch-vorlagen',
  'kariera': 'karriere',
  'kontakt': 'kontakt',
  'blog': 'blog',
  'ochrana-osobnich-udaju': 'datenschutz',
  'klient-prihlaseni': 'kunden-login'
};

// Route mapping for Czech to Slovak
const CS_TO_SK = {
  'o-nas': 'o-nas',
  'nase-sluzby': 'nase-sluzby',
  'nase-sluzby/vymahani-pohledavek': 'nase-sluzby/vymahanie-pohladavok',
  'nase-sluzby/sprava-firemnich-pohledavek': 'nase-sluzby/sprava-firemnych-pohladavok',
  'nase-sluzby/odkup-prodej-pohledavek': 'nase-sluzby/odkup-predaj-pohladavok',
  'nase-sluzby/odkup-firem': 'nase-sluzby/odkup-firiem',
  'nase-sluzby/odkup-smenek': 'nase-sluzby/odkup-zmeniek',
  'cenik': 'cennik',
  'slovnik-a-vzory': 'slovnik-a-vzory',
  'kariera': 'kariera',
  'kontakt': 'kontakt',
  'blog': 'blog',
  'ochrana-osobnich-udaju': 'ochrana-osobnych-udajov',
  'klient-prihlaseni': 'klient-prihlasenie'
};

// Combined mapping object for scripts
const ROUTE_MAPPING = {
  'cs-en': CS_TO_EN,
  'cs-de': CS_TO_DE,
  'cs-sk': CS_TO_SK
};

// Export the route mapping for use in scripts
module.exports = {
  ROUTE_MAPPING,
  CS_TO_EN,
  CS_TO_DE,
  CS_TO_SK
}; 