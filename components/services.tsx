import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionWrapper } from "./section-wrapper"
import { useTranslations } from "@/lib/i18n"

export function Services() {
  const t = useTranslations('services')
  
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Section-specific background effects */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(249,115,22,0.1),transparent_50%),radial-gradient(circle_at_0%_0%,rgba(249,115,22,0.05),transparent_50%)] animate-gradient-shift"
        style={{ backgroundSize: "200% 200%" }}
      />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="container relative">
        <SectionWrapper animation="fade-up">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
              {t.badge}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500">
              {t.title}
            </h2>
            <p className="mt-4 text-lg text-gray-600">{t.subtitle}</p>
          </div>
        </SectionWrapper>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.map((service: any, index: number) => (
            <SectionWrapper key={service.title} animation="zoom" delay={index * 100}>
              <Link href={service.href} className="block h-full">
                <div className="group relative rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-sm shadow-orange-500/5 border border-orange-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 hover:bg-white/95 h-full flex flex-col">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 opacity-0 blur transition duration-300 group-hover:opacity-5" />
                  <div className="relative flex-1">
                    <h3 className="text-xl font-semibold text-zinc-900">{service.title}</h3>
                    <p className="mt-4 text-gray-600">{service.description}</p>
                    <div className="mt-6 flex items-center gap-2">
                      <span className="text-orange-500">{t.linkText}</span>
                      <ArrowRight className="h-4 w-4 text-orange-500 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

