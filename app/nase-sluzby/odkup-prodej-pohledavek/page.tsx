import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, DollarSign, FileText, BarChart } from "lucide-react"

export default function OdkupProdejPohledavekPage() {
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
                Naše služby
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Odkup a prodej pohledávek</h1>
              <p className="text-xl text-zinc-300 mb-8">
                Rychlé a efektivní řešení pro věřitele, kteří chtějí své pohledávky prodat
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
                    Komplexní řešení
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">Odkup a prodej pohledávek</h2>
                  <p className="text-gray-600 mb-4 text-lg">
                    Odkup pohledávky je v současné době populární služba u všech věřitelů. Pokud se již nechcete
                    pohledávkou dále zabývat a nevadí vám, že přijdete o část svých peněz, je tato služba určena právě
                    vám.
                  </p>
                  <p className="text-gray-600 mb-8">
                    Specializujeme se na odkup pohledávek jak od fyzických, tak od právnických osob. Díky vysokému
                    procentu úspěšnosti můžeme nabídnout výhodnou kupní cenu odpovídající současnému stavu pohledávky a
                    vy už nebudete mít se samotným vymáháním nic společného.
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

      {/* Process Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <SectionWrapper animation="fade-up">
                <div className="max-w-3xl mx-auto">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    Proces odkupu
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                    Odkupu pohledávek předchází jejich prověření zahrnující:
                  </h2>

                  <div className="grid md:grid-cols-3 gap-8 mt-8">
                    {[
                      {
                        icon: FileText,
                        title: "Historie vzniku pohledávky",
                        description: "Důkladně analyzujeme okolnosti vzniku pohledávky a její vývoj v čase.",
                      },
                      {
                        icon: CheckCircle,
                        title: "Prostudování souvisejících podkladů",
                        description: "Pečlivě prověříme veškerou dokumentaci spojenou s pohledávkou.",
                      },
                      {
                        icon: DollarSign,
                        title: "Návrh ceny odkupu",
                        description: "Na základě analýzy navrhneme spravedlivou cenu za odkup pohledávky.",
                      },
                    ].map((item, index) => (
                      <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 shadow-sm border border-orange-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                            <item.icon className="h-6 w-6 text-orange-600" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </SectionWrapper>
                    ))}
                  </div>

                  <div className="mt-10 p-6 bg-zinc-900 text-white rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <BarChart className="h-5 w-5 text-orange-400" />
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

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                Výhody prodeje pohledávek
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">Proč prodat své pohledávky?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Prodej pohledávek přináší řadu výhod, které vám pomohou zlepšit cash flow a soustředit se na vaše hlavní
                podnikání
              </p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Okamžitá likvidita",
                description: "Získáte finanční prostředky ihned, bez čekání na úhradu od dlužníka.",
              },
              {
                title: "Žádné další starosti",
                description: "Přenecháte veškeré vymáhání na nás a můžete se soustředit na své podnikání.",
              },
              {
                title: "Jistota příjmu",
                description: "Dostanete garantovanou částku bez ohledu na to, zda se pohledávku podaří vymoci.",
              },
              {
                title: "Úspora nákladů",
                description: "Nemusíte investovat do právních služeb a dalších nákladů spojených s vymáháním.",
              },
            ].map((benefit, index) => (
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

