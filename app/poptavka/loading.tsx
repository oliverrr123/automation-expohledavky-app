"use client"

import { useEffect, useState } from 'react'
import { getCurrentLocale } from '@/lib/i18n'

// Server Component
export default function Loading() {
  const [translations, setTranslations] = useState<any>(null)
  const [loadingText, setLoadingText] = useState("Loading form...")
  
  useEffect(() => {
    // Get current locale
    const locale = getCurrentLocale() || 'en'
    
    // Load translations asynchronously
    const fetchTranslations = async () => {
      try {
        let loadingTranslations
        
        if (locale === 'cs') {
          loadingTranslations = (await import('@/locales/cs/loading.json')).default
        } else if (locale === 'sk') {
          loadingTranslations = (await import('@/locales/sk/loading.json')).default
        } else if (locale === 'de') {
          loadingTranslations = (await import('@/locales/de/loading.json')).default
        } else {
          loadingTranslations = (await import('@/locales/en/loading.json')).default
        }
        
        setTranslations(loadingTranslations)
        setLoadingText(loadingTranslations.inquiry.loading)
      } catch (error) {
        console.error('Error loading translations:', error)
      }
    }
    
    fetchTranslations()
  }, [])
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="text-lg font-medium text-zinc-700">{loadingText}</p>
      </div>
    </div>
  )
}

