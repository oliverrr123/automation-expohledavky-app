"use client"

import type React from "react"

import { SectionWrapper } from "@/components/section-wrapper"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function PricingPage() {
  const [formData, setFormData] = useState({
    jmeno: "",
    email: "",
    telefon: "",
    vyse: "",
    zprava: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log("Form submitted:", formData)
    // Reset form after submission
    setFormData({
      jmeno: "",
      email: "",
      telefon: "",
      vyse: "",
      zprava: "",
    })
    // Show success message
    alert("Zpráva byla odeslána. Děkujeme!")
  }

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

      <main className="pt-32 pb-24">
        {/* Pricing Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-6">CENÍK</h1>
                </div>

                <div className="mb-8 font-semibold text-lg text-center">Základní sazby platné od 1. 1. 2023</div>

                {/* Pricing Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  {/* Table Header */}
                  <div className="grid grid-cols-2 bg-zinc-900 text-white">
                    <div className="p-4 font-semibold border-r border-zinc-700">
                      Specifikace jednotlivých oddělení při zpracování každé pohledávky
                    </div>
                    <div className="p-4 font-semibold text-center">Sazba za úkon – zpracování jedné pohledávky</div>
                  </div>

                  {/* Table Rows */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="p-4 border-r border-gray-200">Administrativa – zprocesování pohledávky</div>
                    <div className="p-4 text-center font-medium">1 000,- Kč</div>
                  </div>

                  <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
                    <div className="p-4 border-r border-gray-200">Lustrační oddělení</div>
                    <div className="p-4 text-center font-medium">1 300,- Kč</div>
                  </div>

                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="p-4 border-r border-gray-200">Vymáhání inkasními specialisty</div>
                    <div className="p-4 text-center font-medium">2 000,- Kč</div>
                  </div>

                  <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
                    <div className="p-4 border-r border-gray-200">Právní oddělení</div>
                    <div className="p-4 text-center font-medium">3 000,- Kč</div>
                  </div>

                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="p-4 border-r border-gray-200">Soudní žaloba – 15% z výše pohledávky</div>
                    <div className="p-4 text-center font-medium">minimálně však 15 000,- Kč</div>
                  </div>

                  <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
                    <div className="p-4 border-r border-gray-200">Doložka právní vykonatelnosti u notáře</div>
                    <div className="p-4 text-center font-medium">minimálně 12 000,- Kč</div>
                  </div>

                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="p-4 border-r border-gray-200">Výjezd za dlužníkem</div>
                    <div className="p-4 text-center font-medium">30,- Kč/km + 500,- Kč/hodina</div>
                  </div>
                </div>

                <div className="text-gray-600 space-y-1 mb-12">
                  <p>Při úkonech v cizím jazyce se hodinová sazba navyšuje o 30 %.</p>
                  <p>Ceny jsou uvedeny bez DPH.</p>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">Kontaktní formulář</h2>
                </div>

                <div className="bg-white rounded-xl shadow-md p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="jmeno" className="block text-sm font-medium text-gray-700 mb-1">
                          Jméno a příjmení
                        </label>
                        <input
                          required
                          id="jmeno"
                          name="jmeno"
                          type="text"
                          value={formData.jmeno}
                          onChange={handleChange}
                          placeholder="Jméno a příjmení"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Váš e-mail
                        </label>
                        <input
                          required
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Váš e-mail"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                          Telefonní kontakt
                        </label>
                        <input
                          required
                          id="telefon"
                          name="telefon"
                          type="text"
                          value={formData.telefon}
                          onChange={handleChange}
                          placeholder="Telefonní kontakt"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="vyse" className="block text-sm font-medium text-gray-700 mb-1">
                          Výše pohledávky
                        </label>
                        <input
                          required
                          id="vyse"
                          name="vyse"
                          type="text"
                          value={formData.vyse}
                          onChange={handleChange}
                          placeholder="Výše pohledávky"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="zprava" className="block text-sm font-medium text-gray-700 mb-1">
                        Vaše zpráva
                      </label>
                      <textarea
                        required
                        id="zprava"
                        name="zprava"
                        rows={5}
                        value={formData.zprava}
                        onChange={handleChange}
                        placeholder="Vaše zpráva... uveďte všechny známé podrobnosti k Vaší pohledávce..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      ></textarea>
                    </div>
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full text-white font-semibold transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group shadow-xl shadow-orange-500/20"
                        style={{
                          background:
                            "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                          backgroundPosition: "bottom",
                          backgroundSize: "150% 100%",
                        }}
                      >
                        <div
                          className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                          aria-hidden="true"
                        />
                        <span className="relative z-10">Odeslat zprávu</span>
                      </Button>
                    </div>
                  </form>
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

