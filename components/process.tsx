"use client"

import { useState, useEffect } from "react"
import { Eye, User, FileText, Gavel, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"

const steps = [
  {
    key: "kontrola",
    title: "Kontrola",
    icon: Eye,
    description:
      "Po zaslání Vaší pohledávky na náš email se do jejího rozboru zapojí naše specializované oddělení, které odborně posoudí všechny podklady a vyhodnotí nejoptimálnější postup, zejména, zda je pohledávka vhodná k odkupu či k vymáhání.",
  },
  {
    key: "zastoupeni",
    title: "Zastoupení",
    icon: User,
    description:
      "Pokud budou Vámi dodané podklady kompletní a bude možné pohledávku vymáhat, zašleme Vám obratem adekvátní návrh smlouvy na zastupování v rámci vymáhání Vašeho finančního nároku vůči dlužníkovi.",
  },
  {
    key: "vyzva",
    title: "Výzva",
    icon: FileText,
    description:
      "V případě, že vymáhání není ani po dobu cca 14 – 21 dnů úspěšné, navrhneme Vám zaslat předžalobní výzvu. Předžalobní výzva je odesílána naší externí advokátní kanceláří.",
  },
  {
    key: "zaloba",
    title: "Žaloba",
    icon: Gavel,
    description:
      "Nesplní-li dlužník dobrovolně dluh na základě předžalobní výzvy, je na něj podána žaloba, respektive návrh na vydání elektronického platebního rozkazu. Podáním žaloby začíná soudní fáze vymáhání Vaší pohledávky.",
  },
  {
    key: "exekuce",
    title: "Exekuce",
    icon: CreditCard,
    description:
      "Pokud Váš dlužník ani na základě vydaného Platebního rozkazu neplní, vybereme nejvhodnějšího exekutora a předáme mu soudní rozhodnutí. Tím celý proces vymáhání a soudního řízení dospěje do finální fáze.",
  },
]

export function Process() {
  const [activeStep, setActiveStep] = useState("kontrola")

  // Add auto-scrolling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => {
        const currentIndex = steps.findIndex((step) => step.key === current)
        const nextIndex = (currentIndex + 1) % steps.length
        return steps[nextIndex].key
      })
    }, 5000) // Change step every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(249,115,22,0.1),transparent_50%),radial-gradient(circle_at_0%_0%,rgba(249,115,22,0.05),transparent_50%)] animate-gradient-shift"
        style={{ backgroundSize: "200% 200%" }}
      />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      <div className="container relative z-10">
        <SectionWrapper animation="fade-up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500">
              Průběh naší spolupráce
            </h2>
            <p className="mt-4">Zjistěte, jak vám můžeme pomoci krok za krokem</p>
          </div>
        </SectionWrapper>

        <div className="mt-8 lg:mt-20">
          <div className="flex flex-col gap-8">
            <SectionWrapper animation="zoom" delay={200}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 min-h-[300px] sm:min-h-[200px] relative overflow-hidden">
                {steps.map((step) => {
                  const isActive = step.key === activeStep
                  const currentIndex = steps.findIndex((s) => s.key === activeStep)
                  const stepIndex = steps.findIndex((s) => s.key === step.key)
                  const shouldEnterFromTop = stepIndex > currentIndex

                  return (
                    <div
                      key={step.key}
                      className={cn(
                        "transition-all duration-500 absolute inset-x-0 px-8",
                        isActive
                          ? "opacity-100 transform translate-y-0"
                          : shouldEnterFromTop
                            ? "opacity-0 transform -translate-y-4" // Enter from top
                            : "opacity-0 transform translate-y-4", // Exit to bottom
                      )}
                    >
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                      <p className="mt-4 text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  )
                })}
              </div>
            </SectionWrapper>

            <SectionWrapper animation="fade-up" delay={400}>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isLast = index === steps.length - 1
                  return (
                    <div key={step.key} className="flex items-center">
                      <button
                        onClick={() => setActiveStep(step.key)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 shadow-sm hover:shadow w-[140px] justify-center",
                          activeStep === step.key
                            ? "bg-orange-500 text-white shadow-orange-500/25"
                            : "bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-[1.02]",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {step.title}
                      </button>
                      {/* Desktop arrow - hidden on last item */}
                      {!isLast && (
                        <div className="hidden lg:flex text-orange-500/50 px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-orange-500"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </div>
                      )}
                      {/* Mobile arrow - shown on all items */}
                      <div className="lg:hidden h-12 flex items-center justify-center text-orange-500/50 pl-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="rotate-90"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )
                })}
              </div>
            </SectionWrapper>
          </div>
        </div>
      </div>
    </section>
  )
}

