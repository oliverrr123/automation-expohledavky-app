"use client"

import React from "react"
import { useTranslations } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, Calculator, Scale, MessageCircle, FileCheck, Award, Target, Shield, Clock } from "lucide-react"
import Link from "next/link"

interface ServiceItem {
  icon: keyof typeof iconMap
  title: string
  description: string
}

interface ProcessStep {
  number: string
  title: string
  description: string
}

interface BenefitItem {
  icon: keyof typeof iconMap
  title: string
  description: string
}

const iconMap = {
  Search,
  Calculator,
  Scale,
  MessageCircle,
  FileCheck,
  Award,
  Target,
  Shield,
  Clock
} as const

export default function CompanyAcquisitionPage() {
  const t = useTranslations("companyAcquisitionPage")

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-sm mb-4">
              {t("hero.badge")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-xl text-white/90">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm mb-4">
              {t("mainSection.badge")}
            </span>
            <h2 className="text-3xl font-bold mb-6">
              {t("mainSection.title")}
            </h2>
            {t("mainSection.paragraphs").map((paragraph: string, index: number) => (
              <p key={index} className="text-lg text-gray-600 mb-4">
                {paragraph}
              </p>
            ))}
            <Button className="mt-8">
              {t("mainSection.button")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm mb-4">
                {t("services.badge")}
              </span>
              <h2 className="text-3xl font-bold">
                {t("services.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t("services.items").map((item: ServiceItem, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  {item.icon && iconMap[item.icon] ? (
                    React.createElement(iconMap[item.icon], {
                      className: "h-12 w-12 text-blue-600 mb-4"
                    })
                  ) : null}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm mb-4">
                {t("process.badge")}
              </span>
              <h2 className="text-3xl font-bold">
                {t("process.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t("process.steps").map((step: ProcessStep, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm mb-4">
                {t("benefits.badge")}
              </span>
              <h2 className="text-3xl font-bold">
                {t("benefits.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t("benefits.items").map((item: BenefitItem, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  {item.icon && iconMap[item.icon] ? (
                    React.createElement(iconMap[item.icon], {
                      className: "h-12 w-12 text-blue-600 mb-4"
                    })
                  ) : null}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-8">
              {t("benefits.note")}
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                {t("cta.primaryButton")}
              </Button>
              <Button variant="outline">
                {t("cta.secondaryButton")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}