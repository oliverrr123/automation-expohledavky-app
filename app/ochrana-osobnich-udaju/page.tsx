"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionWrapper } from "@/components/section-wrapper"
import { sanitizeHTML } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { getCurrentLocale } from "@/lib/i18n"
import csPrivacyPolicyPage from '@/locales/cs/privacy-policy-page.json'
import enPrivacyPolicyPage from '@/locales/en/privacy-policy-page.json'
import skPrivacyPolicyPage from '@/locales/sk/privacy-policy-page.json'
import dePrivacyPolicyPage from '@/locales/de/privacy-policy-page.json'

// Define the type for our translations
type TranslationType = any;

// Map locale to translations
const translationsByLocale: Record<string, TranslationType> = {
  cs: csPrivacyPolicyPage,
  en: enPrivacyPolicyPage,
  sk: skPrivacyPolicyPage,
  de: dePrivacyPolicyPage
};

export default function OchranaOsobnichUdajuPage() {
  const [isClient, setIsClient] = useState(false)
  const [currentTranslations, setCurrentTranslations] = useState<TranslationType>(csPrivacyPolicyPage)
  const hasRedirected = useRef(false)
  
  // Check if we need to redirect based on the current locale
  useEffect(() => {
    setIsClient(true)
    
    const locale = getCurrentLocale();
    
    // Update translations based on locale
    if (locale && translationsByLocale[locale]) {
      setCurrentTranslations(translationsByLocale[locale]);
    }
    
    // After client-side hydration, redirect to the proper locale page if needed
    // But only do this once to prevent infinite loops
    if (typeof window !== 'undefined' && !hasRedirected.current) {
      const hostname = window.location.hostname;
      const redirectNeeded = 
        (hostname.startsWith('en.') && window.location.pathname === '/ochrana-osobnich-udaju') ||
        (hostname.startsWith('de.') && window.location.pathname === '/ochrana-osobnich-udaju') ||
        (hostname.startsWith('sk.') && window.location.pathname === '/ochrana-osobnich-udaju');
      
      if (redirectNeeded) {
        hasRedirected.current = true;
        
        // Delay redirect slightly to avoid immediate reload
        setTimeout(() => {
          if (hostname.startsWith('en.')) {
            window.location.href = '/privacy-policy';
          } else if (hostname.startsWith('de.')) {
            window.location.href = '/datenschutz';
          } else if (hostname.startsWith('sk.')) {
            window.location.href = '/ochrana-osobnych-udajov';
          }
        }, 100);
      }
    }
  }, [])
  
  // Helper function to safely access nested translation properties with proper typing
  const getTranslation = (path: string, fallback: any = '') => {
    try {
      if (!currentTranslations) return fallback;
      
      // Split the path into an array of keys
      const keys = path.split('.');
      
      // Handle sections.* paths specially
      if (path.startsWith('sections.') && currentTranslations.sections) {
        const sectionPath = path.substring(9); // Remove "sections."
        const sectionKeys = sectionPath.split('.');
        let sectionResult: any = currentTranslations.sections;
        
        for (const key of sectionKeys) {
          if (sectionResult && sectionResult[key as keyof typeof sectionResult] !== undefined) {
            sectionResult = sectionResult[key as keyof typeof sectionResult];
          } else {
            return fallback;
          }
        }
        
        return sectionResult || fallback;
      }
      
      // Handle direct paths (title, introduction, etc.)
      if (keys.length === 1) {
        const key = keys[0];
        return (currentTranslations as any)[key] || fallback;
      }
      
      // For other nested paths, use a recursive approach with type safety
      return fallback;
    } catch (e) {
      console.error('Error accessing translation:', e);
      return fallback;
    }
  };
  
  return (
    <>
      <Header isLandingPage={false} />
      <main className="mt-16">
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-4xl mx-auto mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6 text-center">
                  {getTranslation('title')}
                </h1>

                <p className="mb-4">
                  {getTranslation('introduction')}
                </p>
                <p className="mb-4">
                  {getTranslation('importantNote')}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.whatIsPersonalData.title', getTranslation('personalData.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.whatIsPersonalData.content', getTranslation('personalData.content'))}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.whoProcessesData.title', getTranslation('dataProcessor.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.whoProcessesData.content', getTranslation('dataProcessor.content'))}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.whatDataWeProcess.title', getTranslation('dataProcessed.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.whatDataWeProcess.introCustomer', getTranslation('dataProcessed.customerIntro'))}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {(getTranslation('sections.whatDataWeProcess.customerDataList', getTranslation('dataProcessed.customerItems', [])) || []).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <p className="mb-4">
                  {getTranslation('sections.whatDataWeProcess.introVisitor', getTranslation('dataProcessed.visitorIntro'))}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {(getTranslation('sections.whatDataWeProcess.visitorDataList', getTranslation('dataProcessed.visitorItems', [])) || []).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <p className="mb-4">
                  {getTranslation('sections.whatDataWeProcess.introPartner', getTranslation('dataProcessed.partnerIntro'))}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {(getTranslation('sections.whatDataWeProcess.partnerDataList', getTranslation('dataProcessed.partnerItems', [])) || []).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.whyWeProcess.title', getTranslation('dataProcessingPurpose.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.whyWeProcess.content', getTranslation('dataProcessingPurpose.intro'))}
                </p>

                {getTranslation('dataProcessingPurpose.tableHeaders') && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                      <div className="font-semibold">{getTranslation('dataProcessingPurpose.tableHeaders.subject')}</div>
                      <div className="font-semibold">{getTranslation('dataProcessingPurpose.tableHeaders.purpose')}</div>
                      <div className="font-semibold">{getTranslation('dataProcessingPurpose.tableHeaders.legalBasis')}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                      <div className="font-semibold">{getTranslation('dataProcessingPurpose.client.subject')}</div>
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(getTranslation('dataProcessingPurpose.client.row1.purpose')) }} />
                      <div>{getTranslation('dataProcessingPurpose.client.row1.legalBasis')}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                      <div></div>
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(getTranslation('dataProcessingPurpose.client.row2.purpose')) }} />
                      <div>{getTranslation('dataProcessingPurpose.client.row2.legalBasis')}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                      <div></div>
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(getTranslation('dataProcessingPurpose.client.row3.purpose')) }} />
                      <div>{getTranslation('dataProcessingPurpose.client.row3.legalBasis')}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                      <div></div>
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(getTranslation('dataProcessingPurpose.client.row4.purpose')) }} />
                      <div>{getTranslation('dataProcessingPurpose.client.row4.legalBasis')}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                      <div className="font-semibold">{getTranslation('dataProcessingPurpose.visitor.subject')}</div>
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(getTranslation('dataProcessingPurpose.visitor.row1.purpose')) }} />
                      <div>{getTranslation('dataProcessingPurpose.visitor.row1.legalBasis')}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                      <div></div>
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(getTranslation('dataProcessingPurpose.visitor.row2.purpose')) }} />
                      <div>{getTranslation('dataProcessingPurpose.visitor.row2.legalBasis')}</div>
                    </div>
                  </>
                )}

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.dataSources.title', getTranslation('dataSources.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.dataSources.content1', getTranslation('dataSources.paragraph1'))}
                </p>
                <p className="mb-4">
                  {getTranslation('sections.dataSources.content2', getTranslation('dataSources.paragraph2'))}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.dataProvision.title', getTranslation('dataProvision.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.dataProvision.content1', getTranslation('dataProvision.paragraph1'))}
                </p>
                <p className="mb-4">
                  {getTranslation('sections.dataProvision.content2', getTranslation('dataProvision.paragraph2'))}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.dataAccess.title', getTranslation('dataAccess.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.dataAccess.content1', getTranslation('dataAccess.paragraph1'))}
                </p>
                <p className="mb-4">
                  {getTranslation('sections.dataAccess.content2', getTranslation('dataAccess.paragraph2'))}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>{getTranslation('sections.dataAccess.list.0', getTranslation('dataAccess.processorInfo'))}</li>
                </ul>

                <p className="mb-4">
                  {getTranslation('sections.dataAccess.content3', getTranslation('dataAccess.paragraph3'))}
                </p>
                <p className="mb-4">
                  {getTranslation('sections.dataAccess.content4', getTranslation('dataAccess.paragraph4'))}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.thirdCountries.title', getTranslation('thirdCountries.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.thirdCountries.content', getTranslation('thirdCountries.content'))}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.dataRetention.title', getTranslation('dataRetention.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.dataRetention.content', getTranslation('dataRetention.intro'))}
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {(getTranslation('sections.dataRetention.list', getTranslation('dataRetention.criteria', [])) || []).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.dataSecurity.title', getTranslation('dataSecurity.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.dataSecurity.content1', getTranslation('dataSecurity.paragraph1'))}
                </p>
                <p className="mb-4">
                  {getTranslation('sections.dataSecurity.content2', getTranslation('dataSecurity.paragraph2'))}
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.yourRights.title', getTranslation('dataRights.title'))}
                </h2>
                <p className="mb-4">
                  {getTranslation('sections.yourRights.introText', getTranslation('dataRights.intro'))}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">
                    {getTranslation('sections.yourRights.rights.information.title', getTranslation('dataRights.rights.info.title'))}
                  </div>
                  <div className="md:col-span-2">
                    {getTranslation('sections.yourRights.rights.information.content', getTranslation('dataRights.rights.info.description'))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">
                    {getTranslation('sections.yourRights.rights.access.title', getTranslation('dataRights.rights.access.title'))}
                  </div>
                  <div className="md:col-span-2">
                    {getTranslation('sections.yourRights.rights.access.content', getTranslation('dataRights.rights.access.description'))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">
                    {getTranslation('sections.yourRights.rights.correction.title', getTranslation('dataRights.rights.correction.title'))}
                  </div>
                  <div className="md:col-span-2">
                    {getTranslation('sections.yourRights.rights.correction.content', getTranslation('dataRights.rights.correction.description'))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">
                    {getTranslation('sections.yourRights.rights.deletion.title', getTranslation('dataRights.rights.deletion.title'))}
                  </div>
                  <div className="md:col-span-2">
                    {getTranslation('sections.yourRights.rights.deletion.content', getTranslation('dataRights.rights.deletion.description'))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">
                    {getTranslation('sections.yourRights.rights.restriction.title', getTranslation('dataRights.rights.restriction.title'))}
                  </div>
                  <div className="md:col-span-2">
                    {getTranslation('sections.yourRights.rights.restriction.content', getTranslation('dataRights.rights.restriction.description'))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">
                    {getTranslation('sections.yourRights.rights.portability.title', getTranslation('dataRights.rights.portability.title'))}
                  </div>
                  <div className="md:col-span-2">
                    {getTranslation('sections.yourRights.rights.portability.content', getTranslation('dataRights.rights.portability.description'))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">
                    {getTranslation('sections.yourRights.rights.withdrawConsent.title', getTranslation('dataRights.rights.withdrawal.title'))}
                  </div>
                  <div className="md:col-span-2">
                    {getTranslation('sections.yourRights.rights.withdrawConsent.content', getTranslation('dataRights.rights.withdrawal.description'))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">
                    {getTranslation('sections.yourRights.rights.objection.title', getTranslation('dataRights.rights.objection.title'))}
                  </div>
                  <div className="md:col-span-2" dangerouslySetInnerHTML={{ 
                    __html: sanitizeHTML(
                      getTranslation('sections.yourRights.rights.objection.content', getTranslation('dataRights.rights.objection.description'))
                    ) 
                  }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">
                    {getTranslation('sections.yourRights.rights.complaint.title', getTranslation('dataRights.rights.complaint.title'))}
                  </div>
                  <div className="md:col-span-2">
                    {getTranslation('sections.yourRights.rights.complaint.content', getTranslation('dataRights.rights.complaint.description'))}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  {getTranslation('sections.contact.title', getTranslation('contact.title'))}
                </h2>
                <p className="mb-4" dangerouslySetInnerHTML={{ 
                  __html: sanitizeHTML(
                    getTranslation('sections.contact.content1', getTranslation('contact.paragraph1'))
                  ) 
                }} />
                <p className="mb-4">
                  {getTranslation('sections.contact.content2', getTranslation('contact.paragraph2'))}
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

