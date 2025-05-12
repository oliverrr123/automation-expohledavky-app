"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentLocale } from "@/lib/i18n"
import { transformPath } from "@/lib/route-mapping"

export default function EnPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Get the current locale
    const locale = getCurrentLocale()
    
    // For en locale on Czech route, redirect to the en route
    // This should only happen if the middleware rewriting failed
    if (locale === 'en') {
      const enPath = transformPath('/ochrana-osobnich-udaju', 'cs', 'en') // Will be /privacy-policy
      router.replace(enPath)
    }
  }, [router])
  
  // This content shouldn't be visible as the redirect should happen immediately
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
      <p>Please wait while you are redirected to the correct page.</p>
    </div>
  )
}