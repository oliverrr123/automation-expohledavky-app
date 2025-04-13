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
    if (domain.includes('expohledavky.com')) return 'en';
    if (domain.includes('expohledavky.sk')) return 'sk';
    if (domain.includes('expohledavky.de')) return 'de';
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

export const generateMetadata = (): Metadata => {
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
  
  // Get locale-specific metadata only if we have a valid locale
  const meta = getLocaleMetadata(serverLocale);
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
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
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
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