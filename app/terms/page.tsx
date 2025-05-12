"use client"

import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionWrapper } from "@/components/section-wrapper"
import { useTranslations } from "@/lib/i18n"

export default function TermsOfServicePage() {
  const t = useTranslations('termsPage')
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative pb-16 pt-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionWrapper animation="fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">{t?.title || "Terms of Service"}</h1>
              <p className="text-xl text-zinc-600 mb-8 text-center">
                {t?.subtitle || "Please read these terms carefully before using our services."}
              </p>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionWrapper animation="fade-up">
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.introduction?.title || "1. Introduction"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.introduction?.content || "By accessing and using the services provided by EX Pohledávky, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services."}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.services?.title || "2. Description of Services"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.services?.content || "EX Pohledávky provides screening services to verify individuals and companies through publicly available registries and databases. Our services include but are not limited to insolvency checks, enforcement registry verification, business registry verification, and other publicly available information."}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.usage?.title || "3. Use of Services"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.usage?.content || "You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for providing accurate information when using our services, and you understand that the results are based on publicly available information at the time of screening."}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.payment?.title || "4. Payment Terms"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.payment?.content || "Payment for our services is due at the time of ordering. Prices are displayed in the currency applicable to your region. All payments are processed securely through Stripe, and we do not store your payment information. Refunds may be available under certain circumstances as detailed in our refund policy."}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.liability?.title || "5. Limitation of Liability"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.liability?.content || "EX Pohledávky provides screening services based on publicly available information. While we strive for accuracy, we cannot guarantee that all information is complete, accurate, or up-to-date. Our services are provided 'as is' without warranties of any kind. We are not liable for any decisions made based on the information provided through our services."}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.privacy?.title || "6. Privacy and Data Protection"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.privacy?.content || "We process personal data in accordance with our Privacy Policy and applicable data protection laws, including GDPR. By using our services, you consent to the collection and processing of your personal data as described in our Privacy Policy."}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.termination?.title || "7. Termination"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.termination?.content || "We reserve the right to terminate or suspend your access to our services immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms of Service."}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.changes?.title || "8. Changes to Terms"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.changes?.content || "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes to the Terms constitutes your acceptance of the new Terms."}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.governing?.title || "9. Governing Law"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.governing?.content || "These Terms shall be governed by and construed in accordance with the laws of the Czech Republic, without regard to its conflict of law provisions."}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-4">{t?.sections?.contact?.title || "10. Contact Us"}</h2>
                <div className="prose prose-zinc max-w-none">
                  <p>{t?.sections?.contact?.content || "If you have any questions about these Terms, please contact us at info@exreceivables.com."}</p>
                </div>
              </div>
            </SectionWrapper>

            <SectionWrapper animation="fade-up" delay={200}>
              <div className="text-center mt-8 text-zinc-500 text-sm">
                <p>{t?.lastUpdated || "Last updated: June 1, 2024"}</p>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 