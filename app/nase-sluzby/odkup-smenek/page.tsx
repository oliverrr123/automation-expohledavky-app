"use client"

import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Repeat, PenTool, ScrollText, Zap, TrendingUp, Microscope, Scale, Shield, LockKeyhole, Check } from "lucide-react"
import { useTranslations } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

// Define type for icon mapping
type IconComponent = typeof FileText;

// Icon mapping for benefit icons
const iconMap: Record<string, IconComponent> = {
  FileText,
  Repeat,
  ScrollText,
  PenTool,
  Zap,
  TrendingUp,
  Microscope,
  Scale,
  Shield,
  LockKeyhole,
  Check
}

export default function OdkupSmenekPage() {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  
  // Use translations with proper namespace
  const t = useTranslations('promissoryNotesPage')
  // Load form translations
  const formTranslations = useTranslations('servicesLayout')
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render content when client-side rendering is complete
  if (!isClient) {
    return <div className="min-h-screen bg-white"></div>; // Loading placeholder
  }

  // Handle the case where German translation has steps instead of paragraphs
  const assignmentParagraphs = t.transferByAssignment?.paragraphs || 
    // Convert steps to paragraphs if available (for German)
    t.transferByAssignment?.steps?.map((step: any) => 
      `${step.title}: ${step.description}`
    );

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1470&auto=format&fit=crop"
            alt="Promissory Notes Purchase"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              {t.hero?.badge && (
                <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                  {t.hero.badge}
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.hero?.title}</h1>
              <p className="text-xl text-zinc-300 mb-8">
                {t.hero?.subtitle}
              </p>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="pt-0 pb-16 -mt-20 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  {t.introduction?.badge && (
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                      {t.introduction.badge}
                    </div>
                  )}
                  {t.introduction?.title && (
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{t.introduction.title}</h2>
                  )}
                  <p className="text-gray-600 mb-8">
                    {t.introduction?.description}
                  </p>

                  {/* Render advantage list if available (for German) */}
                  {t.introduction?.advantages && (
                    <ul className="list-disc pl-5 mb-8 text-gray-600">
                      {t.introduction.advantages.map((advantage: string, idx: number) => (
                        <li key={idx} className="mb-2">{advantage}</li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-8">
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <a href="#contact-form" className="flex items-center">
                        {t.introduction?.button} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer by Endorsement Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <PenTool className="h-8 w-8 text-orange-500" />
                    </div>
                    <div>
                      {t.transferByEndorsement?.badge && (
                        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                          {t.transferByEndorsement.badge}
                        </div>
                      )}
                      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{t.transferByEndorsement?.title}</h2>
                      <p className="text-gray-600 mb-8">
                        {t.transferByEndorsement?.description}
                      </p>
                      
                      {/* Render steps if available (for German) */}
                      {t.transferByEndorsement?.steps && (
                        <div className="space-y-4">
                          {t.transferByEndorsement.steps.map((step: any, idx: number) => (
                            <div key={idx} className="rounded-lg bg-orange-50 p-4 border border-orange-100">
                              <h4 className="font-semibold text-orange-800 mb-1">{step.title}</h4>
                              <p className="text-gray-600">{step.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer by Assignment Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <ScrollText className="h-8 w-8 text-orange-500" />
                    </div>
                    <div>
                      {t.transferByAssignment?.badge && (
                        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                          {t.transferByAssignment.badge}
                        </div>
                      )}
                      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                        {t.transferByAssignment?.title}
                      </h2>
                      
                      {/* Use assignmentParagraphs with fallback to either paragraphs or converted steps */}
                      {assignmentParagraphs?.map((paragraph: string, index: number) => (
                        <p key={index} className="text-gray-600 mb-4">
                          {paragraph}
                        </p>
                      ))}
                      
                      {/* Only show steps UI if steps exist AND paragraphs weren't created from steps */}
                      {t.transferByAssignment?.steps && !assignmentParagraphs && (
                        <div className="space-y-4 mt-4">
                          {t.transferByAssignment.steps.map((step: any, idx: number) => (
                            <div key={idx} className="rounded-lg bg-orange-50 p-4 border border-orange-100">
                              <h4 className="font-semibold text-orange-800 mb-1">{step.title}</h4>
                              <p className="text-gray-600">{step.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              {t.benefits?.badge && (
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {t.benefits.badge}
                </div>
              )}
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                {t.benefits?.title}
              </h2>
              {t.benefits?.description && (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t.benefits.description}
                </p>
              )}
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {t.benefits?.items?.map((benefit: any, index: number) => {
              // Safely get the icon component
              const IconComponent = benefit.icon && iconMap[benefit.icon] 
                ? iconMap[benefit.icon] 
                : Check;
              
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <SectionWrapper animation="fade-up" delay={index * 0.1}>
                    <div className="rounded-full bg-orange-100 w-12 h-12 flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </SectionWrapper>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {t.faq?.items?.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <SectionWrapper animation="fade-up">
              <div className="text-center mb-12">
                {t.faq?.badge && (
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {t.faq.badge}
                  </div>
                )}
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                  {t.faq?.title}
                </h2>
                {t.faq?.description && (
                  <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                    {t.faq.description}
                  </p>
                )}
              </div>
            </SectionWrapper>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {t.faq?.items?.map((item: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-semibold">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          {isClient && (
            <ContactForm
              badge={t?.contactForm?.badge || formTranslations?.contactForm?.badge || "Odkup směnek"}
              title={t?.contactForm?.title || formTranslations?.contactForm?.title || "Kontaktujte nás pro nezávaznou nabídku"}
              description={t?.contactForm?.description || formTranslations?.serviceContactDescriptions?.promissoryNotes || "Vyplňte formulář níže a náš tým vás bude kontaktovat co nejdříve s nabídkou odkupu vašich směnek."}
              fields={{
                name: true,
                email: true,
                phone: true,
                amount: true, // Include amount field for promissory notes purchase
                message: true,
              }}
              formAction="PROMISSORY_NOTES_FORM"
              showSidebar={true}
              translations={{
                form: {
                  name: {
                    label: "Jméno a příjmení",
                    placeholder: "Vaše jméno a příjmení"
                  },
                  email: {
                    label: "E-mail",
                    placeholder: "vas@email.cz"
                  },
                  phone: {
                    label: "Telefonní kontakt",
                    placeholder: "+420 XXX XXX XXX"
                  },
                  amount: {
                    label: "Nominální hodnota směnky",
                    placeholder: "Částka v Kč"
                  },
                  message: {
                    label: "Vaše zpráva",
                    placeholder: "Popište detaily směnky (typ, datum splatnosti, výstavce, směnečný dlužník)..."
                  },
                  submitButton: "Odeslat poptávku",
                  submitting: "Odesílání...",
                  success: "Zpráva odeslána!",
                  error: "Zkuste to prosím znovu",
                  phoneError: "Zadejte platné telefonní číslo",
                  generalError: "Došlo k chybě. Zkuste to prosím znovu."
                }
              }}
              serviceName="Odkup směnek"
              sidebarTitle={t?.contactForm?.sidebarTitle || formTranslations?.serviceSidebarTitles?.promissoryNotes || "Proč prodat směnky nám?"}
              sidebarReasons={t?.contactForm?.sidebarReasons || formTranslations?.serviceSidebarReasons?.promissoryNotes || [
                "Okamžité proplacení schválených směnek",
                "Expertíza v oblasti směnečného práva",
                "Férové ocenění nominální hodnoty",
                "Diskrétní a rychlý proces",
                "Bez nutnosti čekat na splatnost směnky"
              ]}
            />
          )}
        </div>
      </section>
    </>
  )
}

