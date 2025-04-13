"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Award, Building, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/section-wrapper';
import { ContactForm } from '@/components/contact-form';
import { useTranslations } from '@/lib/i18n';
import { getLocalizedPath } from '@/lib/route-mapping';

// Tell Next.js this is a dynamic route that shouldn't be statically generated
export const dynamic = 'force-dynamic';

// Map of icon names to components
const iconMap: Record<string, React.ReactNode> = {
  'file-text': <FileText className="h-6 w-6 text-orange-600" />,
  'award': <Award className="h-6 w-6 text-orange-600" />,
  'building': <Building className="h-6 w-6 text-orange-600" />,
};

export default function OdkupFiriemPage() {
  const [isClient, setIsClient] = useState(false);
  
  // Get translations
  const t = useTranslations('companyAcquisitionPage');
  const formTranslations = useTranslations('global');
  const clientTranslations = useTranslations('clientDetection');
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1470&auto=format&fit=crop"
            alt="Odkup firiem"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                {t?.hero?.badge || 'Firemné riešenia'}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t?.hero?.title || 'Odkup firiem a obchodných podielov'}</h1>
              <p className="text-xl text-zinc-300 mb-8">
                {t?.hero?.subtitle || 'Profesionálne riešenia pre podnikateľov, ktorí hľadajú elegantný a efektívny odchod z podnikania'}
              </p>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pt-0 pb-12 -mt-20 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {t?.mainSection?.badge || 'Komplexný servis'}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{t?.mainSection?.title || 'Profesionálny odkup firiem a spoločností'}</h2>
                  <p className="text-gray-600 mb-4 text-lg">
                    {t?.mainSection?.paragraphs?.[0] || 'Špecializujeme sa na odkup spoločností v komplikovanej ekonomickej situácii, vrátane zadlžených firiem, firiem s exekúciami a negatívnou úverovou históriou.'}
                  </p>
                  <p className="text-gray-600 mb-8">
                    {t?.mainSection?.paragraphs?.[1] || 'Nami poskytované služby zahŕňajú kompletný právny a administratívny servis, zodpovednosť za všetky záväzky a okamžitú úhradu pre vás ako predávajúceho.'}
                  </p>

                  <div className="mt-8">
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <a href="#contact-form" className="flex items-center">
                        {t?.mainSection?.button || 'Kontaktujte nás'} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50" id="contact-form">
        <div className="container mx-auto px-4 max-w-5xl">
          {isClient && (
            <ContactForm
              badge={t?.contactForm?.badge || formTranslations?.contactForm?.badge}
              title={t?.contactForm?.title || formTranslations?.contactForm?.title}
              description={t?.contactForm?.description || formTranslations?.serviceContactDescriptions?.companyAcquisition}
              fields={{
                name: true,
                email: true,
                phone: true,
                amount: false, // Company acquisition doesn't need amount field
                message: true,
              }}
              formAction="COMPANY_ACQUISITION_FORM"
              showSidebar={true}
              translations={t?.contactForm?.form || formTranslations?.contactForm?.form}
              serviceName="Odkup firiem"
              sidebarTitle={t?.contactForm?.sidebarTitle || formTranslations?.serviceSidebarTitles?.companyAcquisition || "Prečo predať spoločnosť nám?"}
              sidebarReasons={t?.contactForm?.sidebarReasons || formTranslations?.serviceSidebarReasons?.companyAcquisition || [
                "Rýchly a diskrétny proces",
                "Individuálne ocenenie vašej spoločnosti",
                "Prevzatie všetkých záväzkov a pohľadávok",
                "Profesionálne právne zabezpečenie transakcie",
                "Okamžitá úhrada po dokončení transakcie"
              ]}
            />
          )}
        </div>
      </section>
    </>
  );
}