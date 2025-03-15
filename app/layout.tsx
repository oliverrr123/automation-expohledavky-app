import type React from "react"
import "@/styles/globals.css"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "EX Pohledávky - komplexní řešení vašich pohledávek",
  description: "Jsme experti na řešení pohledávek. Pohledávky řešíme mimosoudně, soudně a exekučně.",
  keywords: "faktura, směnka, pohledávka, dluhy, odkup firem, dluží mi, exekuce",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs" className={`scroll-smooth ${montserrat.variable}`}>
      <body className={montserrat.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}



import './globals.css'