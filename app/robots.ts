import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const host = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://exreceivables.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/debug-routes/'],
    },
    sitemap: [
      'https://expohledavky.cz/sitemap.xml',
      'https://expohladavky.sk/sitemap.xml',
      'https://exforderungen.de/sitemap.xml',
      'https://exreceivables.com/sitemap.xml',
    ],
  }
} 