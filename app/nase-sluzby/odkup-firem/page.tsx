import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, FileText, Building, ClipboardCheck } from "lucide-react"

export default function OdkupFiremPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1470&auto=format&fit=crop"
            alt="Odkup firem"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                Naše služby
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Odkup firem</h1>
              <p className="text-xl text-zinc-300 mb-8">
                Profesionální řešení pro majitele, kteří chtějí prodat svou společnost
              </p>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pt-0 pb-12 -mt-20 relative z-10">
        {" "}
        {/* Updated section class */}
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {" "}
            {/* Added border */}
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    Komplexní řešení
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">Odkup firem</h2>
                  <p className="text-gray-600 mb-4 text-lg">
                    Vlastníte firmu, kterou již nepotřebujete a rádi byste ji prodali?
                  </p>
                  <p className="text-gray-600 mb-8">
                    Pak neváhejte a kontaktuje nás, připravíme vám nabídku šitou na míru na odkup společnosti. Nabízíme
                    odkoupení firem za nejlepší cenu. Cenové podmínky, případně převzetí společnosti za úplatu jsou
                    individuální. Každému vyhotovíme analýzu, na jejímž základě předložíme individuální nabídku.
                  </p>

                  <div className="mt-8">
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <a href="#contact-form" className="flex items-center">
                        Nezávazná poptávka <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Companies We're Interested In Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    Naše požadavky
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">Máme zájem o firmy, které:</h2>

                  <ul className="space-y-4 mb-8">
                    {[
                      "byly založeny, ale nedošlo k uskutečnění podnikatelského záměru, případně společnost dříve podnikala, ale už ji nechcete dále provozovat a spravovat",
                      "mají jasnou a bezproblémovou historii a k dispozici je účetnictví společnosti",
                      "firmy jsou bez závazků",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm group-hover:shadow transition-shadow">
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 p-6 bg-zinc-900 text-white rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Building className="h-5 w-5 text-orange-400" />
                      </div>
                      <p className="text-lg">
                        Spolupracujeme rovněž se soukromými exekutory po celé ČR, tudíž jsme schopni realizovat vymáhání
                        ve zkrácené době.
                      </p>
                    </div>
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    Potřebné dokumenty
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                    V případě odkupu budeme vyžadovat tyto podklady:
                  </h2>

                  <div className="grid md:grid-cols-1 gap-6 mt-8">
                    {[
                      {
                        icon: FileText,
                        title: "Potvrzení o bezdlužnosti",
                        description:
                          "Potvrzení o bezdlužnosti ze strany finančního úřadu, zdravotní pojišťovny, správy sociálního zabezpečení a celního úřadu",
                      },
                      {
                        icon: ClipboardCheck,
                        title: "Prohlášení o bezdlužnosti",
                        description:
                          "Prohlášení o bezdlužnosti od stávajícího majitele a jednatele (dle zákona ručí svým majetkem za případné nesrovnalosti mezi aktuálním stavem společnosti a stavem uvedeným v prohlášení)",
                      },
                      {
                        icon: Building,
                        title: "Kompletní účetnictví",
                        description: "Kompletní účetnictví společnosti",
                      },
                    ].map((item, index) => (
                      <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 shadow-sm border border-orange-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <item.icon className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                              <p className="text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </SectionWrapper>
                    ))}
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

