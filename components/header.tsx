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
import { getLanguageFromHostname } from "@/lib/domain-mapping"
import { LocalizedLink } from "./ui/localized-link"

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

// Create an empty translations object structure without default values
const emptyTranslations: HeaderTranslations = {
  phone: {
    number: "",
    display: "",
    successMessage: "",
    errorMessage: ""
  },
  topBar: {
    hours: "",
    country: ""
  },
  company: {
    prefix: "EX",
    name: "POHLEDÁVKY"
  },
  mobileMenu: {
    openMenu: "",
    menuTitle: ""
  },
  navigation: [],
  buttons: {
    clientZone: "",
    clientLogin: ""
  },
  countries: []
};

const navItemBaseClass = "flex items-center py-0 text-sm font-semibold transition-colors duration-200"

export function Header({ isLandingPage = false }: { isLandingPage?: boolean }) {
  const { locale } = useParams() || { locale: "" }
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Start with empty translations to avoid wrong language display
  const [translations, setTranslations] = useState<HeaderTranslations>(emptyTranslations)
  const [isLoaded, setIsLoaded] = useState(false)
  // Track if first load is complete, used to avoid initial flash
  const [initialRenderComplete, setInitialRenderComplete] = useState(false)
  
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

  // Effect to mark when first client render is complete
  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);
  
  // Load translations based on locale
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Detect locale from hostname using the utility function
        const hostname = window.location.hostname;
        const detectedLocale = getLanguageFromHostname(hostname);
        
        if (detectedLocale) {
          const headerTranslations = await import(`@/locales/${detectedLocale}/header.json`);
          setTranslations(headerTranslations.default);
        } else {
          console.error("No locale detected from hostname:", hostname);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load header translations:", error);
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

  // Don't render anything on first server render to prevent flash of default content
  // Only show content after client-side hydration and locale detection
  if (!initialRenderComplete) {
    // Return a minimal header with the same layout structure but no content
    return (
      <header className="fixed inset-x-0 top-0 z-40 transition-colors duration-500">
        <div className="bg-zinc-900 text-zinc-200">
          <div className="container mx-auto flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-6"></div>
            <div></div> {/* Placeholder for language switcher */}
          </div>
        </div>
        <div className={`${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"} transition-all duration-500`}>
          <div className="container mx-auto px-4">
            <nav className="flex h-16 items-center justify-between">
              <div className="flex xl:flex-1"></div>
              <div className="flex xl:hidden"></div>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // Only render content when we have translations loaded for a smoother experience
  return (
    <header className="fixed inset-x-0 top-0 z-40 transition-colors duration-500">
      <div className="bg-zinc-900 text-zinc-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            {translations.phone.number && (
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
            )}
            {translations.topBar.hours && (
              <span className="hidden text-sm text-zinc-400 sm:block transition-opacity duration-300">
                {translations.topBar.hours}
              </span>
            )}
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      
      <div
        className={`${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"} transition-all duration-500`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex">
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
            <div className="flex xl:hidden">
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
                    {translations.navigation.map((item) => (
                      <div key={item.name}>
                        {item.hasDropdown ? (
                          <div className="relative">
                            <LocalizedLink
                              href={item.href}
                              className="block py-3 text-base font-medium text-zinc-700"
                              onClick={() => setIsOpen(false)}
                            >
                              {item.name}
                            </LocalizedLink>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="absolute right-0 top-3">
                                  <ChevronDown className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-56">
                                {item.submenu?.map((subitem) => (
                                  <DropdownMenuItem key={subitem.name} asChild>
                                    <LocalizedLink
                                      href={subitem.href}
                                      target={subitem.target}
                                      className="cursor-pointer"
                                    >
                                      {subitem.name}
                                    </LocalizedLink>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ) : (
                          <LocalizedLink
                            href={item.href}
                            className="block py-3 text-base font-medium text-zinc-700"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </LocalizedLink>
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

            <div className="hidden xl:flex xl:gap-x-8 items-center h-16">
              {translations.navigation.map((item) => (
                <div key={item.name} className="relative flex items-center h-full">
                  {item.hasDropdown ? (
                    <div
                      className="group flex items-center h-full"
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <LocalizedLink
                        href={item.href}
                        className={`${navItemBaseClass} gap-1 ${
                          isScrolled ? "text-zinc-700 hover:text-zinc-900" : "text-white hover:text-orange-50"
                        }`}
                      >
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </LocalizedLink>
                      {activeDropdown === item.name && (
                        <div
                          className="absolute left-0 top-full z-10 mt-1 w-60 rounded-md bg-white p-2 shadow-lg ring-1 ring-black/5 transition-opacity duration-200 group-hover:opacity-100"
                          onMouseEnter={() => handleMouseEnter(item.name)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {item.submenu?.map((subitem) => (
                            <LocalizedLink
                              key={subitem.name}
                              href={subitem.href}
                              target={subitem.target}
                              className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-orange-50 transition-colors duration-200"
                            >
                              {subitem.name}
                            </LocalizedLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <LocalizedLink
                      href={item.href}
                      className={`${navItemBaseClass} ${
                        isScrolled ? "text-zinc-700 hover:text-zinc-900" : "text-white hover:text-orange-50"
                      }`}
                    >
                      {item.name}
                    </LocalizedLink>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden xl:flex">
              <Button
                className={`transition-colors duration-300 ${
                  !isScrolled
                    ? "bg-white text-zinc-900 hover:bg-white/90"
                    : "bg-zinc-900 text-white hover:bg-zinc-900/90"
                }`}
              >
                <LocalizedLink href={translations.buttons.clientLogin}>
                  {translations.buttons.clientZone}
                </LocalizedLink>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

