"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Phone, Globe, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { LanguageSwitcher } from "./language-switcher"

// Define types for navigation items and translations
interface SubmenuItem {
  name: string;
  href: string;
  target?: string;
}

interface NavigationItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  submenu?: SubmenuItem[];
}

interface CountryItem {
  name: string;
  href: string;
}

interface HeaderTranslations {
  phone: {
    number: string;
    display: string;
    successMessage: string;
    errorMessage: string;
  };
  topBar: {
    hours: string;
    country: string;
  };
  company: {
    prefix: string;
    name: string;
  };
  mobileMenu: {
    openMenu: string;
    menuTitle: string;
  };
  navigation: NavigationItem[];
  buttons: {
    clientZone: string;
    clientLogin: string;
  };
  countries: CountryItem[];
}

// Update the default translations to include basic navigation items
const defaultTranslations: HeaderTranslations = {
  phone: {
    number: "+420 777 123 456",
    display: "+420 777 123 456",
    successMessage: "Číslo zkopírováno do schránky",
    errorMessage: "Nepodařilo se zkopírovat číslo"
  },
  topBar: {
    hours: "Po-Pá: 9:00 - 17:00",
    country: "Česká republika"
  },
  company: {
    prefix: "EX",
    name: "POHLEDÁVKY"
  },
  mobileMenu: {
    openMenu: "Otevřít menu",
    menuTitle: "Menu"
  },
  navigation: [
    { name: "Úvod", href: "/" },
    { name: "O nás", href: "/o-nas" },
    { name: "Naše služby", href: "/nase-sluzby", hasDropdown: true, submenu: [
      { name: "Vymáhání pohledávek", href: "/nase-sluzby/vymahani-pohledavek" },
      { name: "Správa firemních pohledávek", href: "/nase-sluzby/sprava-firemnich-pohledavek" },
      { name: "Odkup a prodej pohledávek", href: "/nase-sluzby/odkup-a-prodej-pohledavek" },
      { name: "Odkup firem", href: "/nase-sluzby/odkup-firem" },
      { name: "Odkup směnek", href: "/nase-sluzby/odkup-smenek" },
      { name: "Partner v Lichtenštejnsku", href: "https://expohledavky.cz/firstAdvisoryGroup.pdf" }
    ] },
    { name: "Ceník", href: "/cenik" },
    { name: "Slovník a vzory", href: "/slovniky-a-vzory" },
    { name: "Blog", href: "/blog" },
    { name: "Kariéra", href: "/kariera" },
    { name: "Kontakt", href: "/kontakt" }
  ],
  buttons: {
    clientZone: "Klientská zóna",
    clientLogin: "/klient"
  },
  countries: []
};

export function Header({ isLandingPage = false }: { isLandingPage?: boolean }) {
  const { locale } = useParams() || { locale: "cs" }
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Start with default translations to avoid hydration mismatch
  const [translations, setTranslations] = useState<HeaderTranslations>(defaultTranslations)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(translations.phone.successMessage)
    } catch (err) {
      toast.error(translations.phone.errorMessage)
    }
  }

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

  // Load translations based on locale
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Detect locale from hostname directly
        const detectLocale = (): string => {
          const hostname = window.location.hostname;
          
          if (hostname.includes('expohledavky.cz')) return 'cs';
          if (hostname.includes('expohledavky.sk')) return 'sk';
          if (hostname.includes('expohledavky.de')) return 'de';
          if (hostname.includes('expohledavky.com')) return 'en';
          
          // Localhost development
          if (hostname.includes('cs.localhost')) return 'cs';
          if (hostname.includes('sk.localhost')) return 'sk';
          if (hostname.includes('de.localhost')) return 'de';
          if (hostname.includes('en.localhost')) return 'en';
          
          return 'cs'; // Default fallback
        };
        
        const detectedLocale = typeof window !== 'undefined' ? detectLocale() : 'cs';
        const headerTranslations = await import(`@/locales/${detectedLocale}/header.json`);
        setTranslations(headerTranslations.default);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load header translations:", error);
        // Fallback to Czech if translations fail to load
        const fallbackTranslations = await import(`@/locales/cs/header.json`);
        setTranslations(fallbackTranslations.default);
        setIsLoaded(true);
      }
    }
    
    loadTranslations();
  }, []);

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

  // Always render with default translations first, then update with real translations
  return (
    <header className="fixed inset-x-0 top-0 z-40 transition-colors duration-500">
      <div className="bg-zinc-900 text-zinc-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a 
                href={`tel:${translations.phone.number}`}
                className="text-sm hover:text-white cursor-pointer transition-opacity duration-300"
                onClick={(e) => {
                  e.preventDefault()
                  handleCopy(translations.phone.number)
                }}
              >
                {translations.phone.display}
              </a>
            </div>
            <span className="hidden text-sm text-zinc-400 sm:block transition-opacity duration-300">
              {translations.topBar.hours}
            </span>
          </div>
          <LanguageSwitcher />
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
                    {translations.company.prefix}
                  </span>
                  <span className="text-orange-500">{translations.company.name}</span>
                </span>
              </Link>
            </div>

            {/* Always show navigation items, with a fade-in effect when loaded */}
            <div className="flex lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-transparent">
                    <Menu className={`h-6 w-6 ${isScrolled ? "text-zinc-900" : "text-white"} bg-blue`} />
                    <span className="sr-only">{translations.mobileMenu.openMenu}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>{translations.mobileMenu.menuTitle}</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6">
                    {translations.navigation.map((item: any) => (
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
                              {item.submenu?.map((subItem: any) => (
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
                      {translations.buttons.clientZone}
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden lg:flex lg:gap-x-8">
              {translations.navigation.map((item: any) =>
                item.hasDropdown ? (
                  <div
                    key={item.name}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center text-sm font-semibold leading-6 transition-colors duration-500 opacity-100 ${
                        isScrolled ? "text-zinc-900 hover:text-orange-500" : "text-white hover:text-orange-300"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Link>

                    {activeDropdown === item.name && (
                      <div
                        className="dropdown-menu absolute left-0 top-full z-[100] mt-1 w-64 overflow-visible rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.submenu?.map((subItem: any) => (
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
                <Link href={translations.buttons.clientLogin}>{translations.buttons.clientZone}</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

