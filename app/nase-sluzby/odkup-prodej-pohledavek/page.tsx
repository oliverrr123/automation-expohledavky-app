import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, DollarSign, FileText, BarChart } from "lucide-react"
import { useTranslations } from "@/lib/i18n"

// Icon mapping for process steps icons
const iconMap = {
  FileText,
  CheckCircle,
  DollarSign,
  BarChart
}

export default function OdkupProdejPohledavekPage() {
  const t = useTranslations('receivablesPurchasePage')
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop"
            alt="Odkup a prodej pohledávek"
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

      {/* Main Content Section */}
      <section className="pt-0 pb-16 -mt-20 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {t.mainSection.badge}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">{t.mainSection.title}</h2>
                  
                  {t.mainSection.paragraphs.map((paragraph: string, index: number) => (
                    <p key={index} className={`text-gray-600 ${index === 0 ? 'mb-4 text-lg' : 'mb-8'}`}>
                      {paragraph}
                    </p>
                  ))}

                  <div className="mt-8">
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <a href="#contact-form" className="flex items-center">
                        {t.mainSection.button} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    {t.process.badge}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                    {t.process.title}
                  </h2>

                  <div className="grid md:grid-cols-3 gap-8 mt-8">
                    {t.process.steps.map((step: any, index: number) => {
                      const Icon = iconMap[step.icon as keyof typeof iconMap];
                      
                      return (
                        <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                          <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 shadow-sm border border-orange-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                              <Icon className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </SectionWrapper>
                      );
                    })}
                  </div>

                  <div className="mt-10 p-6 bg-zinc-900 text-white rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <BarChart className="h-5 w-5 text-orange-400" />
                      </div>
                      <p className="text-lg">
                        {t.process.note}
                      </p>
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
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t.benefits.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t.benefits.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t.benefits.description}
              </p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.benefits.items.map((benefit: any, index: number) => (
              <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </SectionWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

