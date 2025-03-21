"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Phone, Mail, MapPin, FileText, Facebook, Linkedin, Instagram } from "lucide-react"
import { toast } from "sonner"
import type { LucideIcon } from "lucide-react"

// Define types for the translations
interface PhoneContact {
  number: string;
  display: string;
}

interface NavigationLink {
  title: string;
  href: string;
}

interface TemplateLink {
  title: string;
  href: string;
}

interface BankAccount {
  bank: string;
  account: string;
}

interface SocialLink {
  type: string;
  href: string;
}

interface FooterTranslations {
  company: {
    prefix: string;
    name: string;
    slogan: string;
    motto: string;
  };
  contact: {
    address: {
      text: string;
      successMessage: string;
    };
    email: {
      text: string;
      successMessage: string;
    };
    phones: PhoneContact[];
    successMessage: {
      phone: string;
      bankAccount: string;
      error: string;
    };
  };
  navigation: {
    title: string;
    links: NavigationLink[];
  };
  downloads: {
    title: string;
    templates: TemplateLink[];
  };
  bank: {
    title: string;
    accounts: BankAccount[];
  };
  social: {
    title: string;
    links: SocialLink[];
  };
  copyright: {
    text: string;
    privacyPolicy: string;
  };
}

export function Footer() {
  const { locale } = useParams() || { locale: "cs" }
  const [translations, setTranslations] = useState<FooterTranslations | null>(null)

  // Load translations based on locale
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const footerTranslations = await import(`@/locales/${locale || 'cs'}/footer.json`)
        setTranslations(footerTranslations.default)
      } catch (error) {
        console.error("Failed to load footer translations:", error)
        // Fallback to Czech if translations fail to load
        const fallbackTranslations = await import(`@/locales/cs/footer.json`)
        setTranslations(fallbackTranslations.default)
      }
    }
    
    loadTranslations()
  }, [locale])

  const handleCopy = async (text: string) => {
    if (!translations) return;
    
    try {
      await navigator.clipboard.writeText(text)
      if (text.includes("@")) {
        toast.success(translations.contact.email.successMessage)
      } else if (text.includes("Praha") || text.includes("Prague")) {
        toast.success(translations.contact.address.successMessage)
      } else if (text.includes("/")) {
        toast.success(translations.contact.successMessage.bankAccount)
      } else {
        toast.success(translations.contact.successMessage.phone)
      }
    } catch (err) {
      toast.error(translations.contact.successMessage.error)
    }
  }

  // Don't render until translations are loaded
  if (!translations) return null

  // Map icon types to components
  const socialIcons: Record<string, LucideIcon> = {
    facebook: Facebook,
    linkedin: Linkedin,
    instagram: Instagram
  }

  return (
    <footer className="bg-zinc-900 text-white">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold">
                <span className="text-white">{translations.company.prefix}</span>
                <span className="text-orange-500">{translations.company.name}</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-400">
              {translations.company.slogan}
              <br />
              <em>{translations.company.motto}</em>
            </p>
            <div className="mt-6 space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-none" />
                <span 
                  className="cursor-pointer hover:text-white"
                  onClick={() => handleCopy(translations.contact.address.text)}
                >
                  {translations.contact.address.text}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-none" />
                <a 
                  href={`mailto:${translations.contact.email.text}`}
                  className="hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    handleCopy(translations.contact.email.text)
                  }}
                >
                  {translations.contact.email.text}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 flex-none" />
                <div>
                  {translations.contact.phones.map((phone: PhoneContact, index: number) => (
                    <a 
                      key={index}
                      href={`tel:${phone.number}`}
                      className="block hover:text-white cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        handleCopy(phone.number)
                      }}
                    >
                      {phone.display}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold">{translations.navigation.title}</h3>
            <ul className="mt-4 space-y-2">
              {translations.navigation.links.map((link: NavigationLink) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-gray-400 hover:text-white">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Downloads */}
          <div>
            <h3 className="text-lg font-semibold">{translations.downloads.title}</h3>
            <ul className="mt-4 space-y-4">
              {translations.downloads.templates.map((template: TemplateLink) => (
                <li key={template.title}>
                  <Link href={template.href} className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <FileText className="h-4 w-4" />
                    {template.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Bank */}
          <div>
            <h3 className="text-lg font-semibold">{translations.bank.title}</h3>
            <div className="mt-4 space-y-4 text-gray-400">
              {translations.bank.accounts.map((account: BankAccount, index: number) => (
                <p key={index}>
                  {account.bank}
                  <br />
                  <span 
                    className="font-medium text-white cursor-pointer hover:text-orange-500 transition-colors"
                    onClick={() => handleCopy(account.account)}
                  >
                    {account.account}
                  </span>
                </p>
              ))}
            </div>

            <h3 className="mt-8 text-lg font-semibold">{translations.social.title}</h3>
            <div className="mt-4 flex gap-4">
              {translations.social.links.map((link: SocialLink, idx: number) => {
                const Icon = socialIcons[link.type]
                return (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-gray-400">{translations.copyright.text}</p>
          <Link href="/ochrana-osobnich-udaju" className="text-sm text-gray-400 hover:text-white">
            {translations.copyright.privacyPolicy}
          </Link>
        </div>
      </div>
    </footer>
  )
}

