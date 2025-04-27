import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const domains = {
  cs: 'https://expohledavky.cz',
  sk: 'https://expohladavky.sk',
  de: 'https://exforderungen.de',
  en: 'https://exreceivables.com',
}

// Service routes for each language
const serviceRoutes = {
  cs: [
    '/nase-sluzby/vymahani-pohledavek',
    '/nase-sluzby/odkup-smenek',
    '/nase-sluzby/sprava-firemnich-pohledavek',
    '/nase-sluzby/odkup-prodej-pohledavek',
    '/nase-sluzby/likvidace-firem',
    '/nase-sluzby/odkup-firem',
    '/nase-sluzby/krizovy-management',
  ],
  sk: [
    '/nase-sluzby/vymahanie-pohladavok',
    '/nase-sluzby/odkup-zmeniek',
    '/nase-sluzby/sprava-firemnych-pohladavok',
    '/nase-sluzby/odkup-predaj-pohladavok',
    '/nase-sluzby/likvidacia-firiem',
    '/nase-sluzby/odkup-firiem',
    '/nase-sluzby/krizovy-manazment',
  ],
  de: [
    '/unsere-leistungen/inkasso',
    '/unsere-leistungen/wechselkauf',
    '/unsere-leistungen/firmen-forderungsmanagement',
    '/unsere-leistungen/forderungskauf-verkauf',
    '/unsere-leistungen/unternehmensliquidation',
    '/unsere-leistungen/unternehmenskauf',
    '/unsere-leistungen/krisenmanagement',
  ],
  en: [
    '/services/debt-collection',
    '/services/promissory-notes',
    '/services/corporate-receivables',
    '/services/receivables-purchase',
    '/services/company-liquidation',
    '/services/company-purchase',
    '/services/crisis-management',
  ],
}

const routes = {
  cs: [
    '',
    '/o-nas',
    '/kontakt',
    '/cenik',
    '/poptavka',
    '/nase-sluzby',
    '/lustrace',
    '/slovnik-a-vzory',
    '/blog',
    '/ochrana-osobnich-udaju',
  ],
  sk: [
    '',
    '/o-nas',
    '/kontakt',
    '/cennik',
    '/poziadavka',
    '/nase-sluzby',
    '/lustracia',
    '/slovnik-a-vzory',
    '/blog',
    '/ochrana-osobnych-udajov',
  ],
  de: [
    '',
    '/uber-uns',
    '/kontakt',
    '/preisliste',
    '/anfrage',
    '/unsere-leistungen',
    '/uberprufungen',
    '/worterbuch-vorlagen',
    '/blog',
    '/datenschutz',
  ],
  en: [
    '',
    '/about-us',
    '/contact',
    '/pricing',
    '/inquiry',
    '/services',
    '/background-checks',
    '/dictionary-templates',
    '/blog',
    '/privacy-policy',
  ],
}

function getBlogPosts(lang: string): string[] {
  const postsDir = path.join(process.cwd(), 'content', `posts-${lang}`)
  if (!fs.existsSync(postsDir)) return []
  
  const files = fs.readdirSync(postsDir)
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      // Remove date prefix and .mdx extension
      const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '')
      return `/blog/${slug}`
    })
}

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()
  
  const sitemapEntries = Object.entries(domains).flatMap(([lang, domain]) => {
    // Get static routes
    const staticRoutes = routes[lang as keyof typeof routes].map((route) => ({
      url: `${domain}${route}`,
      lastModified: currentDate,
      changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
      priority: route === '' ? 1 : route === '/blog' ? 0.9 : 0.8,
    }))

    // Get service routes
    const services = serviceRoutes[lang as keyof typeof serviceRoutes].map(route => ({
      url: `${domain}${route}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Get blog posts
    const blogPosts = getBlogPosts(lang).map(postRoute => ({
      url: `${domain}${postRoute}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...services, ...blogPosts]
  })

  return sitemapEntries
} 