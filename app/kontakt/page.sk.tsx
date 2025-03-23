"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentLocale } from "@/lib/i18n"
import { transformPath } from "@/lib/route-mapping"

export default function SkPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Get the current locale
    const locale = getCurrentLocale()
    
    // For sk locale on Czech route, redirect to the sk route
    // This should only happen if the middleware rewriting failed
    if (locale === 'sk') {
      const skPath = transformPath('/kontakt', 'cs', 'sk') // Will be /kontakt
      router.replace(skPath)
    }
  }, [router])
  
  // This content shouldn't be visible as the redirect should happen immediately
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">Presmerovanie...</h1>
      <p>Počkajte prosím, kým budete presmerovaní na správnu stránku.</p>
    </div>
  )
}