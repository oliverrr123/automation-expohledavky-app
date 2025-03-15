"use client"

import { SectionWrapper } from "./section-wrapper"

const partners = [
  { name: "Partner 1", logo: "https://www.expohledavky.cz/assets/images/klienti/logo-01.png" },
  { name: "Partner 2", logo: "https://www.expohledavky.cz/assets/images/klienti/logo-02.png" },
  { name: "Partner 3", logo: "https://www.expohledavky.cz/assets/images/klienti/logo-03.png" },
  { name: "Partner 4", logo: "https://www.expohledavky.cz/assets/images/klienti/logo-04.png" },
  { name: "Partner 5", logo: "https://www.expohledavky.cz/assets/images/klienti/logo-05.png" },
  { name: "Partner 6", logo: "https://www.expohledavky.cz/assets/images/klienti/logo-06.png" },
  { name: "Partner 7", logo: "https://www.expohledavky.cz/assets/images/klienti/logo-07.png" },
  { name: "Partner 8", logo: "https://www.expohledavky.cz/assets/images/klienti/logo-08.png" },
  { name: "Partner 9", logo: "https://www.expohledavky.cz/assets/images/klienti/benefit.png" },
]

export function Partners() {
  return (
    <section className="py-24">
      <div className="container">
        <SectionWrapper animation="fade-up">
          <div className="text-center">
            <p className="text-lg text-gray-600">
              Podle nezávislého testu recenzního portálu{" "}
              <a
                href="https://entuzio.cz/agentury-na-vymahani-pohledavek-a-dluhu/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-500 hover:text-orange-600"
              >
                Entuzio.cz
              </a>{" "}
              patříme mezi nejlepší firmy na vymáhání pohledávek.
            </p>
          </div>
        </SectionWrapper>

        <div className="mt-16 relative w-full overflow-hidden">
          <style jsx>{`
            .logos-slide {
              display: flex;
              gap: 2rem;
              animation: slide 30s linear infinite;
              width: max-content;
              will-change: transform;
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }

            @keyframes slide {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-50% - 1rem)); /* Adjust for half of the gap */
              }
            }

            .logos-slide:hover {
              animation-play-state: paused;
            }

            .logo-item {
              min-width: 160px;
              transform: translateZ(0);
              -webkit-transform: translateZ(0);
            }
          `}</style>

          <div className="logos-slide">
            {/* First set of partners */}
            {partners.map((partner) => (
              <div key={partner.name} className="logo-item flex items-center justify-center">
                <img 
                  src={partner.logo || "/placeholder.svg"} 
                  alt={partner.name} 
                  className="h-16 w-auto object-contain"
                  loading="eager"
                />
              </div>
            ))}
            {/* Second set of partners (duplicate) */}
            {partners.map((partner) => (
              <div key={`${partner.name}-duplicate`} className="logo-item flex items-center justify-center">
                <img 
                  src={partner.logo || "/placeholder.svg"} 
                  alt={partner.name} 
                  className="h-16 w-auto object-contain"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

