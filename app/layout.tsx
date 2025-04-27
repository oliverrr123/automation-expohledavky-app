import "@/app/globals.css"
import type React from "react"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { Toaster } from "sonner"
import { headers } from "next/headers"
import { getLocaleMetadata } from "@/lib/server-metadata"
import Script from "next/script"
import ElevenLabsCloseButton from '@/components/ElevenLabsCloseButton'

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// Determine locale based on hostname during server rendering
function getServerLocale(): string {
  try {
    const headersList = headers();
    const hostname = headersList.get('host') || '';
    const domain = hostname.split(':')[0];
    
    // Production domains - STRICT mapping with no fallbacks
    if (domain.includes('exreceivables.com')) return 'en';
    if (domain.includes('expohladavky.sk')) return 'sk';
    if (domain.includes('exforderungen.de')) return 'de';
    if (domain.includes('expohledavky.cz')) return 'cs';
    
    // Development environment subdomains - STRICT mapping
    if (domain.startsWith('en.')) return 'en';
    if (domain.startsWith('sk.')) return 'sk';
    if (domain.startsWith('de.')) return 'de';
    if (domain.startsWith('cs.')) return 'cs';
    
    // If we couldn't determine the locale, return empty string
    // No defaults - each domain has its own language
    return '';
  } catch (error) {
    // If headers() fails or we're in a build environment, return empty string
    return '';
  }
}

export const generateMetadata = ({ params }: { params: { pathname?: string } }): Metadata => {
  // Get domain-specific server locale
  const serverLocale = getServerLocale();
  
  // Only get metadata if we could determine the locale
  if (!serverLocale) {
    // Return minimal metadata if locale is unknown - only essential branding
    return {
      title: 'ExPohledavky',
      generator: 'v0.dev',
      icons: {
        icon: [
          { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
          { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        shortcut: '/favicon/favicon.ico',
        apple: '/favicon/apple-touch-icon.png',
        other: [
          {
            rel: 'apple-touch-icon',
            url: '/favicon/apple-touch-icon.png',
          },
          {
            rel: 'manifest',
            url: '/favicon/site.webmanifest',
          }
        ],
      },
    };
  }
  
  // Get locale-specific metadata
  const meta = getLocaleMetadata(serverLocale);
  
  // Get the current pathname and determine the page type
  const pathname = params?.pathname || '';
  let pageType = 'home';
  
  if (pathname.includes('/o-nas') || pathname.includes('/about-us') || pathname.includes('/uber-uns')) {
    pageType = 'about';
  } else if (pathname.includes('/nase-sluzby') || pathname.includes('/our-services') || pathname.includes('/unsere-leistungen')) {
    pageType = 'services';
  } else if (pathname.includes('/vymahani-pohledavek') || pathname.includes('/debt-collection') || pathname.includes('/inkasso')) {
    pageType = 'debt-collection';
  } else if (pathname.includes('/likvidace-firem') || pathname.includes('/company-liquidation') || pathname.includes('/firmenliquidation')) {
    pageType = 'company-liquidation';
  } else if (pathname.includes('/krizovy-management') || pathname.includes('/crisis-management') || pathname.includes('/krisenmanagement')) {
    pageType = 'crisis-management';
  } else if (pathname.includes('/lustrace') || pathname.includes('/screening')) {
    pageType = 'screening';
  } else if (pathname.includes('/blog')) {
    pageType = 'blog';
  } else if (pathname.includes('/kontakt') || pathname.includes('/contact') || pathname.includes('/kontakt')) {
    pageType = 'contact';
  }
  
  // Get page-specific metadata if available
  const pageMeta = meta.pages?.[pageType] || {};
  
  return {
    title: pageMeta.title || meta.title,
    description: pageMeta.description || meta.description,
    keywords: pageMeta.keywords || meta.keywords,
    generator: 'v0.dev',
    icons: {
      icon: [
        { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon/favicon.ico',
      apple: '/favicon/apple-touch-icon.png',
      other: [
        {
          rel: 'apple-touch-icon',
          url: '/favicon/apple-touch-icon.png',
        },
        {
          rel: 'manifest',
          url: '/favicon/site.webmanifest',
        }
      ],
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get domain-specific server locale
  const serverLocale = getServerLocale();
  
  // Only proceed with locale-specific metadata if we could determine the locale
  const meta = serverLocale ? getLocaleMetadata(serverLocale) : { language: '' };
  
  return (
    <html lang={meta.language || ''} className={`scroll-smooth ${montserrat.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Recommended meta tags for SEO */}
        <meta httpEquiv="Content-Language" content={serverLocale} />
        <meta property="og:locale" content={`${serverLocale}_${serverLocale.toUpperCase()}`} />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        {/* Přímé vložení CSS pro ElevenLabs ConvAI zavírací tlačítko */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* ElevenLabs ConvAI overlay style */
            elevenlabs-convai::before {
              content: "×";
              position: absolute;
              top: 50%;
              left: -40px;
              transform: translateY(-50%);
              width: 32px;
              height: 32px;
              background-color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 999999999 !important;
              font-size: 24px;
              font-weight: bold;
              color: black;
              pointer-events: auto;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
          `
        }} />
        {/* Only set locale if it was explicitly detected from the domain */}
        {serverLocale && (
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.__LOCALE__ = "${serverLocale}";
                try {
                  localStorage.setItem('__LOCALE__', "${serverLocale}");
                } catch (e) {}
                console.log("Layout script set locale to: ${serverLocale}");
              })();
            `
          }} />
        )}
      </head>
      <body className={montserrat.className}>
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster richColors position="top-center" />
        <ElevenLabsCloseButton />
        
        {/* ElevenLabs ConvAI Agent - conditionally display based on locale */}
        {serverLocale === 'cs' && (
          <div dangerouslySetInnerHTML={{
            __html: '<elevenlabs-convai agent-id="KmqPHyQe8UJy0qsV53VS"></elevenlabs-convai>'
          }} />
        )}
        {serverLocale === 'sk' && (
          <div dangerouslySetInnerHTML={{
            __html: '<elevenlabs-convai agent-id="AvRJAyMh1pypZka2fJ7E"></elevenlabs-convai>'
          }} />
        )}
        {serverLocale === 'de' && (
          <div dangerouslySetInnerHTML={{
            __html: '<elevenlabs-convai agent-id="NSMq1NSKlTgUkMy3zxlE"></elevenlabs-convai>'
          }} />
        )}
        {serverLocale === 'en' && (
          <div dangerouslySetInnerHTML={{
            __html: '<elevenlabs-convai agent-id="pt4EuPNePmhmHAQL8D0b"></elevenlabs-convai>'
          }} />
        )}
        
        {/* ElevenLabs ConvAI Widget Script - loaded once for all locales */}
        <Script 
          src="https://elevenlabs.io/convai-widget/index.js" 
          strategy="afterInteractive"
          async
          type="text/javascript"
        />
      </body>
    </html>
  )
}