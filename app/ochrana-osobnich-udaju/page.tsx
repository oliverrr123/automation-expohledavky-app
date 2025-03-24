"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionWrapper } from "@/components/section-wrapper"
import { useTranslations } from "@/lib/i18n"
import { sanitizeHTML } from "@/lib/utils"
import { useState, useEffect } from "react"
import { getServerTranslations } from "@/lib/server-utils"
import csPrivacyPolicyPage from '@/locales/cs/privacy-policy-page.json'
import enPrivacyPolicyPage from '@/locales/en/privacy-policy-page.json'
import skPrivacyPolicyPage from '@/locales/sk/privacy-policy-page.json'
import dePrivacyPolicyPage from '@/locales/de/privacy-policy-page.json'

// Get translations based on domain for server-side rendering
const translationsByLang = {
  cs: csPrivacyPolicyPage,
  en: enPrivacyPolicyPage,
  sk: skPrivacyPolicyPage,
  de: dePrivacyPolicyPage
};

// Server-side default translations to prevent hydration mismatch
const serverTranslations = getServerTranslations('privacyPolicyPage', translationsByLang);

export default function OchranaOsobnichUdajuPage() {
  const [isClient, setIsClient] = useState(false)
  // Use server translations initially, then switch to client translations after hydration
  const t = isClient ? useTranslations('privacyPolicyPage') : serverTranslations
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    <>
      <Header isLandingPage={false} />
      <main className="mt-16">
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-4xl mx-auto mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6 text-center">
                  {t.title}
                </h1>

                <p className="mb-4">
                  {t.introduction}
                </p>
                <p className="mb-4">
                  {t.importantNote}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.personalData.title}</h2>
                <p className="mb-4">
                  {t.personalData.content}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.dataProcessor.title}</h2>
                <p className="mb-4">
                  {t.dataProcessor.content}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.dataProcessed.title}</h2>
                <p className="mb-4">
                  {t.dataProcessed.customerIntro}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {t.dataProcessed.customerItems.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <p className="mb-4">
                  {t.dataProcessed.visitorIntro}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {t.dataProcessed.visitorItems.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <p className="mb-4">
                  {t.dataProcessed.partnerIntro}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {t.dataProcessed.partnerItems.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.dataProcessingPurpose.title}</h2>
                <p className="mb-4">
                  {t.dataProcessingPurpose.intro}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div className="font-semibold">{t.dataProcessingPurpose.tableHeaders.subject}</div>
                  <div className="font-semibold">{t.dataProcessingPurpose.tableHeaders.purpose}</div>
                  <div className="font-semibold">{t.dataProcessingPurpose.tableHeaders.legalBasis}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div className="font-semibold">{t.dataProcessingPurpose.client.subject}</div>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(t.dataProcessingPurpose.client.row1.purpose) }} />
                  <div>{t.dataProcessingPurpose.client.row1.legalBasis}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div></div>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(t.dataProcessingPurpose.client.row2.purpose) }} />
                  <div>{t.dataProcessingPurpose.client.row2.legalBasis}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div></div>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(t.dataProcessingPurpose.client.row3.purpose) }} />
                  <div>{t.dataProcessingPurpose.client.row3.legalBasis}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div></div>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(t.dataProcessingPurpose.client.row4.purpose) }} />
                  <div>{t.dataProcessingPurpose.client.row4.legalBasis}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div className="font-semibold">{t.dataProcessingPurpose.visitor.subject}</div>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(t.dataProcessingPurpose.visitor.row1.purpose) }} />
                  <div>{t.dataProcessingPurpose.visitor.row1.legalBasis}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div></div>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(t.dataProcessingPurpose.visitor.row2.purpose) }} />
                  <div>{t.dataProcessingPurpose.visitor.row2.legalBasis}</div>
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.dataSources.title}</h2>
                <p className="mb-4">
                  {t.dataSources.paragraph1}
                </p>
                <p className="mb-4">
                  {t.dataSources.paragraph2}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.dataProvision.title}</h2>
                <p className="mb-4">
                  {t.dataProvision.paragraph1}
                </p>
                <p className="mb-4">
                  {t.dataProvision.paragraph2}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.dataAccess.title}</h2>
                <p className="mb-4">
                  {t.dataAccess.paragraph1}
                </p>
                <p className="mb-4">
                  {t.dataAccess.paragraph2}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>{t.dataAccess.processorInfo}</li>
                </ul>

                <p className="mb-4">
                  {t.dataAccess.paragraph3}
                </p>
                <p className="mb-4">
                  {t.dataAccess.paragraph4}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.thirdCountries.title}</h2>
                <p className="mb-4">
                  {t.thirdCountries.content}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.dataRetention.title}</h2>
                <p className="mb-4">
                  {t.dataRetention.intro}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {t.dataRetention.criteria.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.dataSecurity.title}</h2>
                <p className="mb-4">
                  {t.dataSecurity.paragraph1}
                </p>
                <p className="mb-4">
                  {t.dataSecurity.paragraph2}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.dataRights.title}</h2>
                <p className="mb-4">
                  {t.dataRights.intro}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">{t.dataRights.rights.info.title}</div>
                  <div className="md:col-span-2">{t.dataRights.rights.info.description}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">{t.dataRights.rights.access.title}</div>
                  <div className="md:col-span-2">{t.dataRights.rights.access.description}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">{t.dataRights.rights.correction.title}</div>
                  <div className="md:col-span-2">{t.dataRights.rights.correction.description}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">{t.dataRights.rights.deletion.title}</div>
                  <div className="md:col-span-2">{t.dataRights.rights.deletion.description}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">{t.dataRights.rights.restriction.title}</div>
                  <div className="md:col-span-2">{t.dataRights.rights.restriction.description}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">{t.dataRights.rights.portability.title}</div>
                  <div className="md:col-span-2">{t.dataRights.rights.portability.description}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">{t.dataRights.rights.withdrawal.title}</div>
                  <div className="md:col-span-2">{t.dataRights.rights.withdrawal.description}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">{t.dataRights.rights.objection.title}</div>
                  <div className="md:col-span-2" dangerouslySetInnerHTML={{ __html: sanitizeHTML(t.dataRights.rights.objection.description) }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">{t.dataRights.rights.complaint.title}</div>
                  <div className="md:col-span-2">{t.dataRights.rights.complaint.description}</div>
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{t.contact.title}</h2>
                <p className="mb-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(t.contact.paragraph1) }} />
                <p className="mb-4">
                  {t.contact.paragraph2}
                </p>
              </div>
            </SectionWrapper>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

