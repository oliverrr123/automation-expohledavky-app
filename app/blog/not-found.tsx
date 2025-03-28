"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentLocale } from '@/lib/i18n'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BlogNotFound() {
  const [locale, setLocale] = useState<string>('cs')
  
  useEffect(() => {
    setLocale(getCurrentLocale() || 'cs')
  }, [])

  // Localized UI strings
  const uiStrings = {
    title: locale === 'cs' ? 'Článek nenalezen' :
           locale === 'sk' ? 'Článok nenájdený' :
           locale === 'de' ? 'Artikel nicht gefunden' :
           'Article not found',
    message: locale === 'cs' ? 'Požadovaný článek nebyl nalezen nebo není dostupný v aktuálním jazyce.' :
             locale === 'sk' ? 'Požadovaný článok nebol nájdený alebo nie je dostupný v aktuálnom jazyku.' :
             locale === 'de' ? 'Der angeforderte Artikel wurde nicht gefunden oder ist in der aktuellen Sprache nicht verfügbar.' :
             'The requested article was not found or is not available in the current language.',
    suggestion: locale === 'cs' ? 'Zkuste prohlédnout naše ostatní články:' :
                locale === 'sk' ? 'Skúste si prehliadnuť naše ostatné články:' :
                locale === 'de' ? 'Sehen Sie sich unsere anderen Artikel an:' :
                'Try browsing our other articles:',
    backToBlog: locale === 'cs' ? 'Zpět na blogy' :
                locale === 'sk' ? 'Späť na blogy' :
                locale === 'de' ? 'Zurück zum Blog' :
                'Back to blog'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32 pb-16">
      <div className="container max-w-xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">{uiStrings.title}</h1>
          <p className="text-zinc-600 mb-6">{uiStrings.message}</p>
          <p className="text-zinc-700 mb-8">{uiStrings.suggestion}</p>
          
          <Button variant="default" className="w-full" asChild>
            <Link href="/blog" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {uiStrings.backToBlog}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 