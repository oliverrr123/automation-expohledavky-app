"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentLocale } from "@/lib/i18n"
import { transformPath } from "@/lib/route-mapping"

export default function DeRedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Get the current locale
    const locale = getCurrentLocale()
    
    // Redirect to the Czech version which definitely exists
    const czechPath = transformPath('/unsere-leistungen/inkasso', 'de', 'cs') 
    router.push(czechPath)
  }, [router])
  
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">Weiterleitung...</h1>
      <p>Bitte warten Sie, während Sie zur richtigen Seite weitergeleitet werden.</p>
    </div>
  )
}