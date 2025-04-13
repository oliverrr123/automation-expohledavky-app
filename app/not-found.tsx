"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentLocale } from '@/lib/i18n'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const [locale, setLocale] = useState<string>('cs')
  
  useEffect(() => {
    setLocale(getCurrentLocale() || 'cs')
  }, [])

  // Localized UI strings
  const uiStrings = {
    title: locale === 'cs' ? 'Stránka nenalezena' :
           locale === 'sk' ? 'Stránka nenájdená' :
           locale === 'de' ? 'Seite nicht gefunden' :
           'Page not found',
    message: locale === 'cs' ? 'Požadovaná stránka nebyla nalezena nebo není dostupná v aktuálním jazyce.' :
             locale === 'sk' ? 'Požadovaná stránka nebola nájdená alebo nie je dostupná v aktuálnom jazyku.' :
             locale === 'de' ? 'Die angeforderte Seite wurde nicht gefunden oder ist in der aktuellen Sprache nicht verfügbar.' :
             'The requested page was not found or is not available in the current language.',
    suggestion: locale === 'cs' ? 'Zkuste přejít na hlavní stránku a najít, co hledáte:' :
                locale === 'sk' ? 'Skúste prejsť na hlavnú stránku a nájsť, čo hľadáte:' :
                locale === 'de' ? 'Versuchen Sie, zur Hauptseite zu gehen und zu finden, was Sie suchen:' :
                'Try going to the homepage to find what you\'re looking for:',
    backToHome: locale === 'cs' ? 'Zpět na hlavní stránku' :
                locale === 'sk' ? 'Späť na hlavnú stránku' :
                locale === 'de' ? 'Zurück zur Hauptseite' :
                'Back to homepage',
    checkBlog: locale === 'cs' ? 'Prohlédnout blogy' :
               locale === 'sk' ? 'Prehliadnuť blogy' :
               locale === 'de' ? 'Blogs durchsuchen' :
               'Browse blog articles'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32 pb-16">
      <div className="container max-w-xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">{uiStrings.title}</h1>
          <p className="text-zinc-600 mb-6">{uiStrings.message}</p>
          <p className="text-zinc-700 mb-8">{uiStrings.suggestion}</p>
          
          <div className="flex flex-col space-y-4">
            <Button variant="default" className="w-full" asChild>
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                {uiStrings.backToHome}
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/blog" className="flex items-center justify-center gap-2">
                {uiStrings.checkBlog}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 