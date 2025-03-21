import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Repeat, PenTool, ScrollText } from "lucide-react"
import { useTranslations } from "@/lib/i18n"

// Icon mapping for benefit icons
const iconMap = {
  FileText,
  Repeat,
  ScrollText,
  PenTool
}

export default function OdkupSmenekPage() {
  const t = useTranslations('promissoryNotesPage')
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1470&auto=format&fit=crop"
            alt="Odkup směnek"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                {t.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.hero.title}</h1>
              <p className="text-xl text-zinc-300 mb-8">
                {t.hero.subtitle}
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
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {t.introduction.badge}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{t.introduction.title}</h2>
                  <p className="text-gray-600 mb-8">
                    {t.introduction.description}
                  </p>

                  <div className="mt-8">
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <a href="#contact-form" className="flex items-center">
                        {t.introduction.button} <ArrowRight className="ml-2 h-4 w-4" />
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
                      <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                        {t.transferByEndorsement.badge}
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{t.transferByEndorsement.title}</h2>
                      <p className="text-gray-600 mb-8">
                        {t.transferByEndorsement.description}
                      </p>
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
                      <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                        {t.transferByAssignment.badge}
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                        {t.transferByAssignment.title}
                      </h2>
                      
                      {t.transferByAssignment.paragraphs.map((paragraph: string, index: number) => (
                        <p key={index} className="text-gray-600 mb-4">
                          {paragraph}
                        </p>
                      ))}
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
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t.benefits.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                {t.benefits.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t.benefits.description}
              </p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.benefits.items.map((benefit: any, index: number) => {
              const Icon = iconMap[benefit.icon as keyof typeof iconMap];
              
              return (
                <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </SectionWrapper>
              );
            })}
          </div>
        </div>
      </section>
    </>
  )
}

