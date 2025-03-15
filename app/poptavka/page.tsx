"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionWrapper } from "@/components/section-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import Script from "next/script"

export default function PoptavkaPage() {
  const [formData, setFormData] = useState({
    jmeno: "",
    email: "",
    telefon: "",
    vyse: "",
    zprava: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Get reCAPTCHA token
      // @ts-ignore - window.grecaptcha is added by the script
      const token = await window.grecaptcha?.getResponse()

      if (!token) {
        setErrorMessage("Prosím potvrďte, že nejste robot.")
        setSubmitStatus("error")
        setIsSubmitting(false)
        return
      }

      // Here you would normally send the data to your server
      // For now, we'll simulate a successful submission
      setTimeout(() => {
        console.log("Form submitted:", formData)
        setSubmitStatus("success")
        setIsSubmitting(false)

        // Reset form after successful submission
        setFormData({
          jmeno: "",
          email: "",
          telefon: "",
          vyse: "",
          zprava: "",
        })

        // Reset reCAPTCHA
        // @ts-ignore - window.grecaptcha is added by the script
        window.grecaptcha?.reset()
      }, 1500)
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage("Došlo k chybě při odesílání formuláře. Zkuste to prosím znovu.")
      setSubmitStatus("error")
      setIsSubmitting(false)
    }
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

      <main className="flex-1 pt-48 pb-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900">Podrobná poptávka</h1>
                <p className="text-orange-500 font-medium">ZADEJTE PODROBNOU POPTÁVKU K POSOUZENÍ</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="jmeno" className="text-sm font-medium text-gray-700">
                        Jméno a příjmení
                      </label>
                      <Input
                        required
                        id="jmeno"
                        name="jmeno"
                        value={formData.jmeno}
                        onChange={handleChange}
                        placeholder="Jméno a příjmení"
                        className="w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Váš e-mail
                      </label>
                      <Input
                        required
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Váš e-mail"
                        className="w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="telefon" className="text-sm font-medium text-gray-700">
                        Telefonní kontakt
                      </label>
                      <Input
                        required
                        id="telefon"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        placeholder="Telefonní kontakt"
                        className="w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="vyse" className="text-sm font-medium text-gray-700">
                        Výše pohledávky
                      </label>
                      <Input
                        required
                        id="vyse"
                        name="vyse"
                        value={formData.vyse}
                        onChange={handleChange}
                        placeholder="Výše pohledávky"
                        className="w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="zprava" className="text-sm font-medium text-gray-700">
                      Vaše zpráva
                    </label>
                    <Textarea
                      required
                      id="zprava"
                      name="zprava"
                      value={formData.zprava}
                      onChange={handleChange}
                      placeholder="Vaše zpráva... uveďte všechny známé podrobnosti k Vaší pohledávce..."
                      className="w-full min-h-[150px]"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="pt-2">
                    {/* Google reCAPTCHA */}
                    <div className="g-recaptcha mb-6" data-sitekey="6LcEJLYhAAAAADvV9mLgwaWHHy1YVfVWyIeg7Gkn"></div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto text-white font-semibold transition-all duration-500 relative overflow-hidden group shadow-xl shadow-orange-500/20 h-14 px-8"
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

                      {isSubmitting ? (
                        <span className="relative z-10 flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Odesílání...
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center justify-center">
                          Odeslat zprávu <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Status messages */}
                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4">
                      Vaše zpráva byla úspěšně odeslána. Budeme vás kontaktovat co nejdříve.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4">{errorMessage}</div>
                  )}
                </form>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </main>

      <Footer />

      {/* Google reCAPTCHA Script */}
      <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />
    </div>
  )
}

