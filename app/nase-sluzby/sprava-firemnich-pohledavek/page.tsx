import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function SpravaFiremnichPohledavekPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop"
            alt="Správa firemních pohledávek"
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Správa firemních pohledávek</h1>
              <p className="text-xl text-zinc-300 mb-8">Profesionální outsourcing správy pohledávek pro vaši firmu</p>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pt-0 pb-16 -mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-12 gap-8 p-8 md:p-12">
              <SectionWrapper animation="fade-right" className="md:col-span-7">
                <div>
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                    Komplexní řešení
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">Správa firemních pohledávek</h2>
                  <p className="text-gray-600 mb-4 text-lg">
                    Nabízíme outsourcing správy pohledávek, díky kterému bude o Vaše pohledávky řádně postaráno.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Vaše faktury zpracujeme rychle, spolehlivě, diskrétně a s maximální pečlivostí. Díky našemu
                    informačnímu portálu máte neustálý přehled o stavu vašich pohledávek. Naše služby zahrnují v této
                    oblasti:
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

              <SectionWrapper animation="fade-left" delay={200} className="md:col-span-5">
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 shadow-sm border border-orange-100">
                  <h3 className="text-xl font-semibold mb-6 text-zinc-900">Naše služby zahrnují:</h3>
                  <ul className="space-y-4">
                    {[
                      "Náklady účtujeme pouze, pokud je nutné soudní řešení Vaší pohledávky, nebo mimořádné výdaje v případě osobní návštěvy dlužníka naším specialistou",
                      "Zajistíme exekuci vymáhané pohledávky včetně mimosoudního a soudního inkasa tuzemských (zahraničních) pohledávek",
                      "Vyhodnocení rentability pohledávek k vymáhání",
                      "Převzetí jednotlivých pohledávek k vymáhání",
                      "Převzetí balíku pohledávek k vymáhání",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:shadow transition-shadow">
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                        </div>
                        <span className="text-gray-700 group-hover:translate-x-1 transition-transform">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                Výhody spolupráce
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                Proč svěřit správu pohledávek nám?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Outsourcing správy pohledávek vám přináší řadu výhod, které vám pomohou soustředit se na vaše hlavní
                podnikání
              </p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Úspora nákladů",
                description:
                  "Nemusíte zaměstnávat vlastní specialisty na vymáhání pohledávek, platíte pouze za skutečně poskytnuté služby.",
              },
              {
                title: "Profesionální přístup",
                description:
                  "Naši specialisté mají dlouholeté zkušenosti s vymáháním pohledávek a znají všechny potřebné postupy.",
              },
              {
                title: "Přehledný reporting",
                description:
                  "Prostřednictvím našeho informačního systému máte neustálý přehled o stavu vašich pohledávek.",
              },
              {
                title: "Rychlost a efektivita",
                description: "Díky specializaci a zkušenostem dokážeme vaše pohledávky řešit rychleji a efektivněji.",
              },
              {
                title: "Právní zázemí",
                description: "Máme k dispozici tým právníků, kteří jsou připraveni řešit i složité případy.",
              },
              {
                title: "Diskrétnost",
                description: "Ke všem případům přistupujeme s maximální diskrétností a profesionalitou.",
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

