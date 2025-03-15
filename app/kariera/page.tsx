"use client"

import { useState } from "react"
import { SectionWrapper } from "@/components/section-wrapper"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar, Award, Briefcase, Users, Gift, Clock, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CareerPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />

        {/* Animated floating gradients */}
        <div
          className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full animate-float"
          style={{
            background: "radial-gradient(circle at center, rgba(249, 115, 22, 0.03) 0%, rgba(249, 115, 22, 0) 70%)",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full animate-float"
          style={{
            background: "radial-gradient(circle at center, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0) 70%)",
            animationDelay: "-2s",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[800px] h-[800px] rounded-full animate-float"
          style={{
            background: "radial-gradient(circle at center, rgba(249, 115, 22, 0.04) 0%, rgba(249, 115, 22, 0) 70%)",
            animationDelay: "-4s",
          }}
        />

        {/* Gradient mesh */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(249, 115, 22, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(249, 115, 22, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-72 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/90 z-0">
          <Image
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1469&auto=format&fit=crop"
            alt="Career background"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <SectionWrapper animation="fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Kariéra v EX Pohledávkách</h1>
              <p className="text-xl text-zinc-300 mb-8">
                Staňte se součástí našeho úspěšného týmu a rozvíjejte svou kariéru v dynamickém prostředí
              </p>
            </SectionWrapper>
          </div>
        </div>
      </section>

      <main className="pb-24 -mt-20">
        {/* Job Listing Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Job Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4">
                        Aktuální pozice
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Obchodník - Specialista telefonního vymáhání
                      </h2>
                      <p className="text-white/80 text-lg">Optimálně pro muže s důrazným hlasem</p>
                    </div>
                  </div>

                  {/* Job Content */}
                  <div className="p-8">
                    {/* Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Lokalita</div>
                          <div className="font-medium">Praha – Pankrác</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Nástup</div>
                          <div className="font-medium">Ihned</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Typ úvazku</div>
                          <div className="font-medium">Plný úvazek</div>
                        </div>
                      </div>
                    </div>

                    {/* Job Description Sections */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="h-5 w-5 text-orange-500" />
                            <h3 className="text-xl font-bold text-zinc-900">Náplň práce</h3>
                          </div>
                          <ul className="space-y-3">
                            {[
                              "Odchozí a příchozí hovory s dlužníky",
                              "Aktivní vymáhání pohledávek",
                              "Vyjednání úhrad či splátkových kalendářů",
                              "Odolnost vůči stresu",
                            ].map((item, index) => (
                              <li key={index} className="flex items-start gap-3 group">
                                <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2 group-hover:scale-110 transition-transform"></div>
                                <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-orange-500" />
                            <h3 className="text-xl font-bold text-zinc-900">Co požadujeme</h3>
                          </div>
                          <ul className="space-y-3">
                            {[
                              "Vyjednávací schopnost",
                              "Zkušenosti s podobnou pozicí jsou velkou výhodou",
                              "Velmi dobrou znalost českého jazyka",
                              "Hlavní je mít chuť a obchodního ducha",
                            ].map((item, index) => (
                              <li key={index} className="flex items-start gap-3 group">
                                <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2 group-hover:scale-110 transition-transform"></div>
                                <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Gift className="h-5 w-5 text-orange-500" />
                          <h3 className="text-xl font-bold text-zinc-900">Co nabízíme?</h3>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
                          <ul className="space-y-4">
                            {[
                              {
                                icon: <Star className="h-5 w-5 text-orange-500" />,
                                text: "Nástupní plat 25 000 Kč + zajímavé osobní ohodnocení dle výsledků",
                              },
                              {
                                icon: <Calendar className="h-5 w-5 text-orange-500" />,
                                text: "Nástup možný ihned",
                              },
                              {
                                icon: <MapPin className="h-5 w-5 text-orange-500" />,
                                text: "Místo výkonu práce: Praha – Pankrác",
                                bold: true,
                              },
                              {
                                icon: <Phone className="h-5 w-5 text-orange-500" />,
                                text: "Firemní mobilní telefon",
                              },
                              {
                                icon: <Clock className="h-5 w-5 text-orange-500" />,
                                text: "Sick days",
                              },
                              {
                                icon: <Award className="h-5 w-5 text-orange-500" />,
                                text: "Multisport karta",
                              },
                              {
                                icon: <Users className="h-5 w-5 text-orange-500" />,
                                text: "Skvělý tým nápomocných kolegů",
                              },
                            ].map((item, index) => (
                              <li key={index} className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow transition-shadow">
                                  {item.icon}
                                </div>
                                <span className="mt-1">
                                  {item.bold ? (
                                    <>
                                      Místo výkonu práce: <strong>Praha – Pankrác</strong>
                                    </>
                                  ) : (
                                    item.text
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mb-8">
                      <div className="bg-zinc-900 rounded-xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 text-orange-500/10">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-full h-full"
                          >
                            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                          </svg>
                        </div>
                        <div className="relative z-10">
                          <p className="italic mb-4">
                            "Práce v EX Pohledávky mi dala možnost rozvíjet své komunikační dovednosti a vyjednávací
                            schopnosti. Každý den je jiný a přináší nové výzvy. Oceňuji především skvělý kolektiv a
                            férové ohodnocení."
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                              <span className="font-bold text-white">JN</span>
                            </div>
                            <div>
                              <div className="font-medium">Jan Novák</div>
                              <div className="text-sm text-gray-300">Specialista vymáhání, 3 roky v týmu</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Application CTA */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.05),transparent_50%)]" />
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-zinc-900 mb-4">Zaujala vás tato pozice?</h3>
                        <p className="text-gray-600 mb-6">
                          Stále tě to zajímá? Ozvi se nám na e-mailovou adresu{" "}
                          <strong className="text-orange-600">pohledavky@expohledavky.cz</strong>. Potkáme se, vzájemně
                          se představíme, probereme možnosti a hlavně se k nám podíváš. Tak se přihlas, těšíme se na
                          tebe!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 items-center">
                          <Button
                            asChild
                            className="text-white font-semibold transition-all duration-500 relative overflow-hidden group shadow-xl shadow-orange-500/20 w-full sm:w-auto"
                            style={{
                              background:
                                "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                              backgroundPosition: "bottom",
                              backgroundSize: "150% 100%",
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                          >
                            <Link
                              href="mailto:pohledavky@expohledavky.cz"
                              className="flex items-center justify-center gap-2 py-6 px-8"
                            >
                              <Mail
                                className={`h-5 w-5 transition-transform duration-500 ${isHovered ? "translate-y-[-2px]" : ""}`}
                              />
                              <span
                                className={`relative z-10 transition-transform duration-500 ${isHovered ? "translate-y-[-2px]" : ""}`}
                              >
                                Poslat životopis
                              </span>
                              <div
                                className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                                aria-hidden="true"
                              />
                            </Link>
                          </Button>

                          <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
                            <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse" />
                            Nástup ihned!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

