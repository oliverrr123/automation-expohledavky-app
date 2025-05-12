"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SectionWrapper } from "@/components/section-wrapper"
import { Eye, User, FileText, Gavel, CreditCard, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"
import { useTranslations } from "@/lib/i18n"
import Script from 'next/script'

// Add Google reCAPTCHA site key
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

// Add type declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false)
  const t = useTranslations('servicesLayout')
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // State for process section tabs
  const [activeTab, setActiveTab] = useState("kontrola")

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

      <main className="relative pt-16">
        {children}

        {/* Process Section */}
        <section className="py-10 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-3 sm:px-4">
            <SectionWrapper animation="fade-up">
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-4">
                  {isClient ? t?.process?.badge : ''}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                  {isClient ? t?.process?.title : ''}
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  {isClient ? t?.process?.description : ''}
                </p>
              </div>
            </SectionWrapper>

            <SectionWrapper animation="fade-up" delay={200}>
              {isClient && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="p-4 sm:p-6 md:p-8">
                    {/* Tab Content */}
                    <div className="relative overflow-x-hidden overflow-y-hidden">
                      {/* Process steps */}
                      {(t?.process?.steps || []).map((step: any) => (
                        <div
                          key={step?.key || 'default'}
                          className={`transition-all duration-500 ${activeTab === step?.key ? "block opacity-100" : "hidden opacity-0"}`}
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                              {step?.key === "kontrola" && <Eye className="h-8 w-8 text-orange-500" />}
                              {step?.key === "zastoupeni" && <User className="h-8 w-8 text-orange-500" />}
                              {step?.key === "vyzva" && <FileText className="h-8 w-8 text-orange-500" />}
                              {step?.key === "zaloba" && <Gavel className="h-8 w-8 text-orange-500" />}
                              {step?.key === "exekuce" && <CreditCard className="h-8 w-8 text-orange-500" />}
                            </div>
                            <div className="w-full break-words">
                              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-zinc-900 text-center sm:text-left">{step?.title ?? ""}</h3>
                              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base break-words">{step?.description ?? ""}</p>
                              {step?.additionalText && <p className="text-gray-600 text-sm sm:text-base break-words mb-4">{step.additionalText}</p>}
                              
                              {step?.fee && (
                                <div className="p-3 sm:p-4 bg-orange-50 border border-orange-100 rounded-lg mt-3 mb-4 text-sm sm:text-base">
                                  <p className="font-medium text-orange-800">{step.fee}</p>
                                </div>
                              )}
                              
                              {step?.success && (
                                <div className="p-3 sm:p-4 bg-green-50 border border-green-100 rounded-lg mt-3 mb-4 text-sm sm:text-base">
                                  <p className="font-medium text-green-800">{step.success}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tab Navigation */}
                    <div className="mt-8 sm:mt-16 border-t pt-6 sm:pt-8">
                      <div className="grid grid-cols-1 sm:flex sm:flex-wrap lg:flex-nowrap items-center justify-center gap-3 sm:gap-3">
                        {(t?.process?.steps || []).map((step: any, index: number, array: any[]) => {
                          const isActive = activeTab === step?.key;
                          const isLast = index === array.length - 1;
                          
                          // Map step key to icon
                          let Icon;
                          switch(step?.key) {
                            case "kontrola": Icon = Eye; break;
                            case "zastoupeni": Icon = User; break;
                            case "vyzva": Icon = FileText; break;
                            case "zaloba": Icon = Gavel; break;
                            case "exekuce": Icon = CreditCard; break;
                            default: Icon = Eye;
                          }

                          return (
                            <React.Fragment key={step?.key || index}>
                              <button
                                onClick={() => setActiveTab(step?.key || 'default')}
                                className={cn(
                                  "flex items-center gap-2 sm:gap-3 rounded-lg px-3 py-4 sm:px-4 sm:py-3 text-sm sm:text-sm font-medium transition-all duration-300 shadow-sm hover:shadow w-full sm:w-auto justify-center",
                                  isActive
                                    ? "bg-orange-500 text-white shadow-orange-500/25"
                                    : "bg-white hover:bg-white hover:scale-[1.02]",
                                )}
                              >
                                <Icon className="h-5 w-5 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className="truncate">{step?.title ?? ""}</span>
                              </button>

                              {/* Arrow between items - only show on large screens and up */}
                              {!isLast && (
                                <div className="hidden lg:flex items-center justify-center text-orange-300">
                                  <ArrowRight className="h-5 w-5" />
                                </div>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </SectionWrapper>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* reCAPTCHA Enterprise Script */}
      <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
    </div>
  )
}

