import type React from "react"
import "@/styles/globals.css"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { Toaster } from "sonner"
import { getMetadata } from "@/lib/i18n"

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

export const generateMetadata = (): Metadata => {
  const meta = getMetadata();
  
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
  const meta = getMetadata();
  
  return (
    <html lang={meta.language} className={`scroll-smooth ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={montserrat.className}>
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}

import './globals.css'