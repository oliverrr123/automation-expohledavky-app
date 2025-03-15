import Image from "next/image"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Repeat, PenTool, ScrollText } from "lucide-react"

export default function OdkupSmenekPage() {
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
                Naše služby
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Odkup směnek</h1>
              <p className="text-xl text-zinc-300 mb-8">
                Profesionální řešení pro majitele směnek, kteří chtějí získat finanční prostředky
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
                    Komplexní řešení
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">Odkup směnek</h2>
                  <p className="text-gray-600 mb-8">
                    Služba odkup směnek funguje tak, že společnosti Expohledávky s.r.o., prostřednictvím emailu, zašlete
                    Vaši poptávku této služby a společnost Vás bude obratem kontaktovat a informovat o podmínkách odkupu
                    směnky. Směnka se převádí rubopisem nebo postoupením.
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
                        Způsob A
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">Převod směnky rubopisem</h2>
                      <p className="text-gray-600 mb-8">
                        Směnka je cenný papír a základním typem jejího převodu je rubopis, indosament, který umožňuje
                        rychlý a jednoduchý převod práv vyplývajících ze směnky. Indosamentem lze převádět všechny
                        směnky, kromě rekta směnek, tedy směnek s doložkou „nikoli na řad". Podstata převodu rubopisem
                        spočívá v tom, že dosavadní majitel směnky (remitent), vyznačí na rubu směnky nebo na jejím
                        přívěsku indosační doložku a předá směnku novému majiteli (indosantovi), na něhož tím přejdou
                        všechna práva ze směnky, která jsou obsahem převáděné směnky.
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
                        Způsob B
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                        Převod směnky postoupením (odkup)
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Je-li směnka na jméno opatřena doložkou „nikoli na řad", může být převedena pouze cesí, tedy
                        postoupením pohledávky smlouvou podle § 1879 a násl. zák. č. 89/2012 Sb., občanský zákoník, ve
                        znění pozdějších předpisů. Postupník (ten kdo nabývá směnku) vstupuje na základě smlouvy o
                        postoupení pohledávky do všech práv postupitele (toho kdo směnku postupuje) spojených s
                        pohledávkou, tj. nedochází pouze k převodu práv ze směnky jako v případě rubopisu. Odkoupení
                        směnky je tedy realizováno na základě smlouvy o postoupení pohledávky.
                      </p>
                      <p className="text-gray-600 mb-4">
                        Cena (úplata, smluvní odměna) se pohybuje v rozmezí od 50 do 80 procent nominální hodnoty
                        předmětu odkupu a závisí na nominální výši pohledávky nebo směnky a jejich kvalitě. Určuje se
                        individuálně a s konečnou platností je stanovena v návrhu smlouvy. Bylo-li sjednáno postoupení
                        směnky za úplatu, odpovídá postupitel postupníkovi až do výše přijaté úplaty s úroky za to, že
                        pohledávka v době postoupení trvala, a podle dohody s postupníkem, může ručit i za její
                        dobytnost.
                      </p>
                      <p className="text-gray-600 mb-4">
                        V případě dohody o úhradě hotových výdajů postupníka, účelně vynaložených v souvislosti se
                        zajištěním právních služeb, zejména na soudní a jiné poplatky, cestovní výdaje, poštovné,
                        telekomunikační poplatky, znalecké posudky a odborná vyjádření, překlady, opisy a fotokopie,
                        spojených s vymáháním pohledávky mimosoudní i soudní cestou, je zohledňována zejména složitost a
                        skutková a právní náročnost věci, časové požadavky a nároky postupitele na vyřízení věci, jakož
                        i bonita dlužníka.
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
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionWrapper animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                Výhody odkupu směnek
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
                Proč využít službu odkupu směnek?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nabídka služby odkupu směnky vás může zbavit starostí s upomínáním dlužníků a výdajů na úhradu právních
                služeb
              </p>
            </div>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Okamžitá likvidita",
                description: "Získáte finanční prostředky ihned, bez čekání na splatnost směnky.",
              },
              {
                icon: Repeat,
                title: "Přenos rizika",
                description: "Riziko nezaplacení směnky přechází na naši společnost.",
              },
              {
                icon: ScrollText,
                title: "Právní jistota",
                description: "Celý proces je zajištěn právně závaznou smlouvou o postoupení pohledávky.",
              },
            ].map((benefit, index) => (
              <SectionWrapper key={index} animation="zoom" delay={index * 100}>
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-orange-600" />
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

