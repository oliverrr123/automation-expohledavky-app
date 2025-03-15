"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Phone, Globe, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "Úvod", href: "/" },
  { name: "O nás", href: "/o-nas" },
  {
    name: "Naše služby",
    href: "/nase-sluzby",
    hasDropdown: true,
    submenu: [
      { name: "Vymáhání pohledávek", href: "/nase-sluzby/vymahani-pohledavek" },
      { name: "Správa firemních pohledávek", href: "/nase-sluzby/sprava-firemnich-pohledavek" },
      { name: "Odkup a prodej pohledávek", href: "/nase-sluzby/odkup-prodej-pohledavek" },
      { name: "Odkup firem", href: "/nase-sluzby/odkup-firem" },
      { name: "Odkup směnek", href: "/nase-sluzby/odkup-smenek" },
      { name: "Partner v Lichtenštejnsku", href: "https://expohledavky.cz/firstAdvisoryGroup.pdf", target: "_blank" },
    ],
  },
  { name: "Ceník", href: "/cenik" },
  { name: "Slovník a vzory", href: "/slovnik-a-vzory" },
  { name: "Blog", href: "/blog" },
  { name: "Kariéra", href: "/kariera" },
  { name: "Kontakt", href: "/kontakt" },
]

export function Header({ isLandingPage = false }: { isLandingPage?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveDropdown(name)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 100) // Small delay to allow moving to dropdown
  }

  useEffect(() => {
    if (isLandingPage) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 0)
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    } else {
      // Always set to scrolled state for non-landing pages
      setIsScrolled(true)
    }
  }, [isLandingPage])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-colors duration-500">
      <div className="bg-zinc-900 text-zinc-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+420735500003" className="text-sm hover:text-white">
                +420 735 500 003
              </a>
            </div>
            <span className="hidden text-sm text-zinc-400 sm:block">9:30 – 16:00</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-zinc-200 hover:bg-zinc-800 hover:text-zinc-50">
                <Globe className="mr-2 h-4 w-4" />
                Česká republika
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="https://exreceivables.com/">United Kingdom</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="https://expohladavky.sk/">Slovakia</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="https://excredit.ro/">Romania</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className={`${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"} transition-all duration-500`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="text-2xl font-bold">
                  <span className={`${isScrolled ? "text-zinc-900" : "text-white"} transition-colors duration-500`}>
                    EX
                  </span>
                  <span className="text-orange-500">POHLEDÁVKY</span>
                </span>
              </Link>
            </div>

            <div className="flex lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-transparent">
                    <Menu className={`h-6 w-6 ${isScrolled ? "text-zinc-900" : "text-white"} bg-blue`} />
                    <span className="sr-only">Otevřít menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        {item.hasDropdown ? (
                          <>
                            <Link
                              href={item.href}
                              className="block py-3 text-lg font-semibold text-zinc-900 hover:text-orange-500"
                            >
                              {item.name}
                            </Link>
                            <div className="pl-4 border-l border-gray-200">
                              {item.submenu?.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  target={subItem.target}
                                  className="block py-2 text-base text-zinc-700 hover:text-orange-500"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            className="block py-3 text-lg font-semibold text-zinc-900 hover:text-orange-500"
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                    <Button className="mt-6 w-full" variant="default">
                      Klientská zóna
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden lg:flex lg:gap-x-8">
              {navigation.map((item) =>
                item.hasDropdown ? (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center text-sm font-semibold leading-6 transition-colors duration-500 ${
                        isScrolled ? "text-zinc-900 hover:text-orange-500" : "text-white hover:text-orange-300"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Link>

                    {activeDropdown === item.name && (
                      <div
                        className="absolute left-0 top-full z-50 mt-3 w-64 rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.submenu?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            target={subItem.target}
                            className="block rounded-md px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-semibold leading-6 transition-colors duration-500 ${
                      isScrolled ? "text-zinc-900 hover:text-orange-500" : "text-white hover:text-orange-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                ),
              )}
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Button
                className={`transition-colors duration-300 ${
                  !isScrolled
                    ? "bg-white text-zinc-900 hover:bg-white/90"
                    : "bg-zinc-900 text-white hover:bg-zinc-900/90"
                }`}
              >
                <Link href="/klient-prihlaseni">Klientská zóna</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

