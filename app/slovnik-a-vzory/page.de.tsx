"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentLocale } from "@/lib/i18n"
import { transformPath } from "@/lib/route-mapping"

export default function DePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Get the current locale
    const locale = getCurrentLocale()
    
    // For de locale on Czech route, redirect to the de route
    // This should only happen if the middleware rewriting failed
    if (locale === 'de') {
      const dePath = transformPath('/slovnik-a-vzory', 'cs', 'de') // Will be /worterbuch-vorlagen
      router.replace(dePath)
    }
  }, [router])
  
  // This content shouldn't be visible as the redirect should happen immediately
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">Weiterleitung...</h1>
      <p>Bitte warten Sie, während Sie zur richtigen Seite weitergeleitet werden.</p>
    </div>
  )
}