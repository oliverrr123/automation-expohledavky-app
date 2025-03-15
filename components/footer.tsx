import Link from "next/link"
import { Phone, Mail, MapPin, FileText, Facebook, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-white">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold">
                <span className="text-white">EX</span>
                <span className="text-orange-500">POHLEDÁVKY</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-400">
              Komplexní řešení vašich pohledávek.
              <br />
              <em>"I z vašich pohledávek uděláme EX!"</em>
            </p>
            <div className="mt-6 space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-none" />
                <span>Na strži 1702/65, 140 00, Praha 4-Nusle</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-none" />
                <a href="mailto:info@expohledavky.cz" className="hover:text-white">
                  info@expohledavky.cz
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 flex-none" />
                <div>
                  <a href="tel:+420266710318" className="block hover:text-white">
                    +420 266 710 318
                  </a>
                  <a href="tel:+420735500003" className="block hover:text-white">
                    +420 735 500 003
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold">Navigace</h3>
            <ul className="mt-4 space-y-2">
              {[
                ["Úvod", "/"],
                ["O nás", "/o-nas"],
                ["Vymáhání pohledávek", "/nase-sluzby/vymahani-pohledavek"],
                ["Odkup pohledávek", "/nase-sluzby/odkup-prodej-pohledavek"],
                ["Registr exekucí", "https://lustrace.expohledavky.cz/"],
                ["Kontakt", "/kontakt"],
              ].map(([title, href]) => (
                <li key={title}>
                  <Link href={href} className="text-gray-400 hover:text-white">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Downloads */}
          <div>
            <h3 className="text-lg font-semibold">Vzory ke stažení zdarma</h3>
            <ul className="mt-4 space-y-4">
              {[
                ["Směnka bez protestu", "/slovnik-a-vzory#smenka-bez-protestu"],
                ["Smlouva o zápůjčce", "/slovnik-a-vzory#smlouva-o-zapujcce"],
                ["Uznání dluhu", "/slovnik-a-vzory#uznani-dluhu"],
              ].map(([title, href]) => (
                <li key={title}>
                  <Link href={href} className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <FileText className="h-4 w-4" />
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Bank */}
          <div>
            <h3 className="text-lg font-semibold">Platební údaje</h3>
            <div className="mt-4 space-y-4 text-gray-400">
              <p>
                Číslo účtu vedený u Raiffeisenbank, a.s.
                <br />
                <span className="font-medium text-white">777 7777 355 / 5500</span>
              </p>
              <p>
                Číslo účtu vedený u Fio banka, a.s.
                <br />
                <span className="font-medium text-white">250 2040 263 / 2010</span>
              </p>
            </div>

            <h3 className="mt-8 text-lg font-semibold">Sledujte nás</h3>
            <div className="mt-4 flex gap-4">
              {[
                [Facebook, "https://www.facebook.com/expohledavkypraha/"],
                [Linkedin, "https://www.linkedin.com/company/expohledávky-s-r-o/"],
                [Instagram, "https://www.instagram.com/expohledavky/"],
              ].map(([Icon, href], idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-gray-400">&copy; 2025 Všechna práva vyhrazena.</p>
          <Link href="/ochrana-osobnich-udaju" className="text-sm text-gray-400 hover:text-white">
            Ochrana osobních údajů
          </Link>
        </div>
      </div>
    </footer>
  )
}

