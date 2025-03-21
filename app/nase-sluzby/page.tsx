import Link from "next/link"
import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowRight, FileText, Building, CreditCard, Briefcase, FileSignature } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/lib/i18n"

// Icon mapping for service icons
const iconMap = {
  FileText,
  Building,
  CreditCard,
  Briefcase,
  FileSignature
}

const colorVariants = {
  orange: {
    light: "bg-orange-50 text-orange-600",
    medium: "bg-orange-100",
    dark: "bg-orange-500 text-white",
    border: "border-orange-200",
    hover: "hover:border-orange-300 hover:bg-orange-50",
    icon: "text-orange-500",
    gradient: "from-orange-500/10 to-orange-600/10 text-orange-600 ring-orange-500/20",
  },
  blue: {
    light: "bg-blue-50 text-blue-600",
    medium: "bg-blue-100",
    dark: "bg-blue-500 text-white",
    border: "border-blue-200",
    hover: "hover:border-blue-300 hover:bg-blue-50",
    icon: "text-blue-500",
    gradient: "from-blue-500/10 to-blue-600/10 text-blue-600 ring-blue-500/20",
  },
  green: {
    light: "bg-emerald-50 text-emerald-600",
    medium: "bg-emerald-100",
    dark: "bg-emerald-500 text-white",
    border: "border-emerald-200",
    hover: "hover:border-emerald-300 hover:bg-emerald-50",
    icon: "text-emerald-500",
    gradient: "from-emerald-500/10 to-emerald-600/10 text-emerald-600 ring-emerald-500/20",
  },
  purple: {
    light: "bg-purple-50 text-purple-600",
    medium: "bg-purple-100",
    dark: "bg-purple-500 text-white",
    border: "border-purple-200",
    hover: "hover:border-purple-300 hover:bg-purple-50",
    icon: "text-purple-500",
    gradient: "from-purple-500/10 to-purple-600/10 text-purple-600 ring-purple-500/20",
  },
  red: {
    light: "bg-red-50 text-red-600",
    medium: "bg-red-100",
    dark: "bg-red-500 text-white",
    border: "border-red-200",
    hover: "hover:border-red-300 hover:bg-red-50",
    icon: "text-red-500",
    gradient: "from-red-500/10 to-red-600/10 text-red-600 ring-red-500/20",
  },
}

export default function NaseSluzbyPage() {
  const t = useTranslations('servicesPage')
  
  return (
    <div className="pt-16 pb-24">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                {t.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6">{t.hero.title}</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t.hero.description}
              </p>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up" delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.services.map((service: any, index: number) => {
                const colors = colorVariants[service.color as keyof typeof colorVariants]
                const Icon = iconMap[service.icon as keyof typeof iconMap]

                return (
                  <Link
                    href={`/nase-sluzby/${service.id}`}
                    key={service.id}
                    className={cn(
                      "group flex flex-col h-full rounded-xl border bg-white p-6 shadow-sm transition-all duration-200",
                      colors.border,
                      colors.hover,
                    )}
                  >
                    <SectionWrapper animation="fade-up" delay={100 * (index + 1)}>
                      <div className="flex-1">
                        <div
                          className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", colors.medium)}
                        >
                          <Icon className={cn("h-6 w-6", colors.icon)} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-6">{service.description}</p>
                      </div>
                      <div className="flex items-center text-sm font-medium mt-2 group-hover:translate-x-1 transition-transform">
                        <span className={colors.icon}>{service.cta}</span>
                        <ArrowRight className={cn("ml-1 h-4 w-4", colors.icon)} />
                      </div>
                    </SectionWrapper>
                  </Link>
                )
              })}
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up" delay={400}>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">{t.cta.title}</h2>
                <p className="text-zinc-300 mb-8">
                  {t.cta.description}
                </p>
                <div className="flex justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-orange-500 text-white font-semibold transition-all duration-500 hover:scale-[1.04] relative overflow-hidden group shadow-xl shadow-orange-500/20"
                    style={{
                      background: "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                      backgroundPosition: "bottom",
                      backgroundSize: "150% 100%",
                    }}
                  >
                    <a href="#contact-form" className="relative">
                      <div
                        className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                        aria-hidden="true"
                      />
                      <span className="relative z-10">{t.cta.button}</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up" delay={500}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {t.whyChooseUs.badge}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">{t.whyChooseUs.title}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t.whyChooseUs.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {t.whyChooseUs.advantages.map((item: any, index: number) => (
                  <SectionWrapper key={index} animation="fade-up" delay={600 + index * 100}>
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full">
                      <h3 className="text-xl font-bold text-zinc-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </SectionWrapper>
                ))}
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  )
}

