"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentLocale } from "@/lib/i18n"
import { transformPath } from "@/lib/route-mapping"

export default function SkRedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Get the current locale
    const locale = getCurrentLocale()
    
    // Redirect to the Czech version which definitely exists
    const czechPath = transformPath('/nase-sluzby/sprava-firemnych-pohladavok', 'sk', 'cs') 
    router.push(czechPath)
  }, [router])
  
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">Presmerovanie...</h1>
      <p>Počkajte prosím, kým budete presmerovaní na správnu stránku.</p>
    </div>
  )
}