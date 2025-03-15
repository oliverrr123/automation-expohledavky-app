"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Montserrat } from "next/font/google"
import Image from "next/image"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["900"],
})

export function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://player.vimeo.com/api/player.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (iframeRef.current) {
        // @ts-ignore - Vimeo types not available
        const player = new window.Vimeo.Player(iframeRef.current)
        player.on("play", () => {
          setIsVideoLoaded(true)
        })
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="relative isolate pt-12">
      {/* Enhanced gradient background */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-500 to-orange-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="relative h-[calc(100vh-3.5rem)]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced overlay with gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"
            aria-hidden="true"
          />

          <div className="absolute inset-0">
            <Image
              src={`https://i.ibb.co/hFQ8VWBP/thumb.jpg`}
              alt="Background"
              fill
              className="object-cover object-center animate-zoom-out"
              priority
            />
          </div>

          <div
            className={`absolute inset-0 transition-opacity duration-700 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 [&>iframe]:w-[177.77777778vh] [&>iframe]:h-[56.25vw] [&>iframe]:min-w-full [&>iframe]:min-h-full [&>iframe]:absolute [&>iframe]:top-1/2 [&>iframe]:left-1/2 [&>iframe]:-translate-x-1/2 [&>iframe]:-translate-y-1/2">
              <iframe
                ref={iframeRef}
                src="https://player.vimeo.com/video/1059169392?h=2d12ab0104&badge=0&autopause=0&player_id=0&app_id=58479&background=1&muted=1&loop=1&autoplay=1"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                title="expohledavky"
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center [filter:drop-shadow(0_8px_24px_rgb(0_0_0/0.25))]">
              <h1
                className={`${montserrat.className} text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 opacity-0 animate-fade-in-up`}
                style={{ animationDelay: "200ms" }}
              >
                <span
                  className="relative inline-block"
                  style={{
                    background: "-webkit-linear-gradient(#fff, #bbb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <span className="absolute -inset-1.5 bg-orange-500/10 blur-xl" aria-hidden="true" />
                  KOMPLEXNÍ ŘEŠENÍ
                </span>
                <br />
                <span
                  className="relative inline-block"
                  style={{
                    background: "-webkit-linear-gradient(#fff, #aaa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <span className="absolute -inset-1.5 bg-orange-500/10 blur-xl" aria-hidden="true" />
                  VAŠICH POHLEDÁVEK
                </span>
              </h1>
              <p
                className="text-lg leading-8 text-zinc-100 opacity-0 animate-fade-in-up relative"
                style={{ animationDelay: "400ms" }}
              >
                <span className="relative z-10">
                  Konec dluhům! Vymáháme směnky, faktury, půjčky, nájemné a další...
                </span>
              </p>
              <p
                className="mt-4 text-lg font-medium italic text-orange-400 opacity-0 animate-fade-in-up relative"
                style={{ animationDelay: "600ms" }}
              >
                <span className="relative z-10">„I z vašich pohledávek uděláme EX!"</span>
              </p>
              <div
                className="mt-10 flex flex-col gap-4 sm:flex-row justify-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: "800ms" }}
              >
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
                  <Link href="/poptavka" className="relative">
                    <div
                      className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">Chci VYMÁHAT</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden border-2 border-white text-white bg-white/5 backdrop-blur-sm font-semibold transition-all duration-500 hover:scale-[1.04] hover:bg-white/20 shadow-xl shadow-black/20"
                >
                  <Link href="/poptavka">Chci PRODAT</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced bottom gradient */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-orange-500 to-orange-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] animate-pulse"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  )
}

