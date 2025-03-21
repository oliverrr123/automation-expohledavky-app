"use client"

import type React from "react"

import { SectionWrapper } from "@/components/section-wrapper"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTranslations } from "@/lib/i18n"

export default function PricingPage() {
  const t = useTranslations('pricingPage')
  
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
    alert(t.contactForm.successMessage)
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
                  <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-6">{t.title}</h1>
                </div>

                <div className="mb-8 font-semibold text-lg text-center">{t.subtitle}</div>

                {/* Pricing Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  {/* Table Header */}
                  <div className="grid grid-cols-2 bg-zinc-900 text-white">
                    <div className="p-4 font-semibold border-r border-zinc-700">
                      {t.pricingTable.header.specification}
                    </div>
                    <div className="p-4 font-semibold text-center">{t.pricingTable.header.rate}</div>
                  </div>

                  {/* Table Rows */}
                  {t.pricingTable.rows.map((row: {service: string, price: string}, index: number) => (
                    <div 
                      key={index} 
                      className={`grid grid-cols-2 border-b border-gray-200 ${index % 2 !== 0 ? 'bg-gray-50' : ''}`}
                    >
                      <div className="p-4 border-r border-gray-200">{row.service}</div>
                      <div className="p-4 text-center font-medium">{row.price}</div>
                    </div>
                  ))}
                </div>

                <div className="text-gray-600 space-y-1 mb-12">
                  {t.notes.map((note: string, index: number) => (
                    <p key={index}>{note}</p>
                  ))}
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
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t.contactForm.title}</h2>
                </div>

                <div className="bg-white rounded-xl shadow-md p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="jmeno" className="block text-sm font-medium text-gray-700 mb-1">
                          {t.contactForm.fields.name.label}
                        </label>
                        <input
                          required
                          id="jmeno"
                          name="jmeno"
                          type="text"
                          value={formData.jmeno}
                          onChange={handleChange}
                          placeholder={t.contactForm.fields.name.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          {t.contactForm.fields.email.label}
                        </label>
                        <input
                          required
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t.contactForm.fields.email.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                          {t.contactForm.fields.phone.label}
                        </label>
                        <input
                          required
                          id="telefon"
                          name="telefon"
                          type="text"
                          value={formData.telefon}
                          onChange={handleChange}
                          placeholder={t.contactForm.fields.phone.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="vyse" className="block text-sm font-medium text-gray-700 mb-1">
                          {t.contactForm.fields.amount.label}
                        </label>
                        <input
                          required
                          id="vyse"
                          name="vyse"
                          type="text"
                          value={formData.vyse}
                          onChange={handleChange}
                          placeholder={t.contactForm.fields.amount.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="zprava" className="block text-sm font-medium text-gray-700 mb-1">
                        {t.contactForm.fields.message.label}
                      </label>
                      <textarea
                        required
                        id="zprava"
                        name="zprava"
                        rows={5}
                        value={formData.zprava}
                        onChange={handleChange}
                        placeholder={t.contactForm.fields.message.placeholder}
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
                        <span className="relative z-10">{t.contactForm.submitButton}</span>
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

