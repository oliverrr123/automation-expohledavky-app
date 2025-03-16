"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ArrowRight, Calendar, Clock, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Sample blog posts data - v reálné aplikaci by toto přicházelo z API nebo MDX souborů
interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  authorPosition: string;
  authorImage: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  excerpt: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: "eticke-vymahani-dluhu-v-ceskych-firmach",
    title: "Etické vymáhání dluhů v českých firmách",
    subtitle: "Právní pravidla vs. obchodní etika: Kde je hranice?",
    date: "16. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Etika vymáhání",
    tags: ["etika","vymáhání pohledávek","obchodní etika","právo","finance","mediace"],
    image: "https://images.unsplash.com/photo-1531498352491-042fbae4cf57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIxNDg0MDh8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Prozkoumejte etické vymáhání pohledávek v ČR s důrazem na právní a etické standardy.",
  },

  {
    slug: "restrukturalizace-pro-msp-pravni-a-prakticke-kroky",
    title: "Restrukturalizace pro MSP: Právní a praktické kroky",
    subtitle: "Jak efektivně vymáhat pohledávky v insolvenci",
    date: "16. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "7 minut čtení",
    category: "Insolvence",
    tags: ["restrukturalizace","insolvence","právní strategie","vymáhání pohledávek","obchodní poradenství"],
    image: "https://images.unsplash.com/photo-1620856900883-e12a5ea43735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIxMzc2MDd8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte právní strategie a praktické kroky pro úspěšnou restrukturalizaci malých a středních podniků.",
  },

  {
    slug: "prevence-platebni-neschopnosti-u-zakazniku",
    title: "Prevence platební neschopnosti u zákazníků",
    subtitle: "Získejte klid díky osobnímu přístupu a pravidelným auditům",
    date: "16. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "5 minut čtení",
    category: "Prevence",
    tags: ["platební neschopnost","pohledávky","obchodní vztahy","prevence","finance","audity","podnikání"],
    image: "https://images.unsplash.com/45/QDSMoAMTYaZoXpcwBjsL__DSC0104-1.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIxMzIyOTF8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak předcházet platební neschopnosti u klíčových zákazníků pomocí osobního přístupu a preventivních auditů.",
  },

  {
    slug: "novy-insolvencni-zakon-sance-a-vyzvy-2024",
    title: "Nový Insolvenční Zákon: Šance a Výzvy 2024",
    subtitle: "Jak změny ovlivní vymáhání pohledávek v Česku?",
    date: "16. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","pohledávky","právní změny","obchodní vztahy","restrukturalizace","podnikání"],
    image: "https://images.unsplash.com/photo-1573164574397-dd250bc8a598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIxMDkyMzN8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte dopady nového insolvenčního zákona na vymáhání pohledávek. Klíčové změny a jejich vliv na české podniky.",
  },

  {
    slug: "insolvence-sprava-pohledavek-v-krizi",
    title: "Insolvence: Správa pohledávek v krizi",
    subtitle: "Strategie a přístupy pro české podniky v nestabilní době",
    date: "15. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "8 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","správa pohledávek","české podniky","finance","obchodní právo","komunikace","důvěra"],
    image: "https://images.unsplash.com/photo-1463620910506-d0458143143e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNzY4NjN8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak insolvenční řízení může pomoci českým podnikům efektivně spravovat pohledávky.",
  },

  {
    slug: "uspesne-vymahani-klicove-strategie",
    title: "Úspěšné Vymáhání: Klíčové Strategie",
    subtitle: "Jak vyjednávat s dlužníky a minimalizovat náklady",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "8 minut čtení",
    category: "Vymáhání pohledávek",
    tags: ["vymáhání pohledávek","právo","finance","obchodní vztahy","vyjednávání","důvěra","podnikání"],
    image: "https://images.unsplash.com/photo-1641197861542-83e511654ac0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNzU1MjB8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte strategie mimosoudního vymáhání pohledávek v ČR a zlepšete komunikaci s dlužníky.",
  },

  {
    slug: "smirci-rizeni-klic-k-prevenci-soudnich-sporu",
    title: "Smírčí řízení: Klíč k prevenci soudních sporů",
    subtitle: "Optimalizace procesu s AI v oblasti správy pohledávek",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "7 minut čtení",
    category: "Správa pohledávek",
    tags: ["správa pohledávek","smírčí řízení","prevence sporů","AI","automatizace","MSP","právní proces"],
    image: "https://images.unsplash.com/photo-1575886876783-ea3cbbc8204d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNzM0NTB8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak smírčí řízení a AI pomáhají předcházet soudním sporům ve správě pohledávek.",
  },

  {
    slug: "insolvence-po-pandemii-nove-strategie-v-cr",
    title: "Insolvence po pandemii: Nové strategie v ČR",
    subtitle: "Jak legislativní změny a AI formují vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "5 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","česká legislativa","pohledávky","automatizace","umělá inteligence","firmy","post-pandemická nejistota"],
    image: "https://images.unsplash.com/photo-1590649849991-e9af438ea77d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNzAyNzZ8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Zkoumáme vliv českých legislativních změn a AI na strategie firem v insolvenci.",
  },

  {
    slug: "optimalizace-dluhu-role-insolvencniho-spravce",
    title: "Optimalizace dluhů: Role insolvenčního správce",
    subtitle: "Efektivní strategie a moderní technologie v insolvenci",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "8 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","restrukturalizace","firemní dluhy","automatizace","digitalizace","umělá inteligence","vymáhání pohledávek"],
    image: "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjk5Mzl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte klíčové strategie a technologie pro optimalizaci vymáhání firemních dluhů s pomocí insolvenčního správce.",
  },

  {
    slug: "moratoria-na-insolvence-vyzvy-pro-veritele",
    title: "Moratoria na insolvence: Výzvy pro věřitele",
    subtitle: "Jak moderní technologie mění vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","moratorium","vymáhání pohledávek","technologie","digitalizace","automatizace","věřitelé"],
    image: "https://images.unsplash.com/photo-1573483537868-423d82530f54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjg5MDh8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak moratoria ovlivňují věřitele a jak moderní technologie pomáhají vymáhat pohledávky efektivněji.",
  },

  {
    slug: "novelizace-insolvencniho-zakona-vyzvy-a-sance",
    title: "Novelizace insolvenčního zákona: Výzvy a šance",
    subtitle: "Jak změny ovlivní vymáhání pohledávek českých firem",
    date: "15. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","vymáhání pohledávek","české firmy","právní změny","věřitelé","automatizace","digitalizace"],
    image: "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjg3Nzl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte vliv změn insolvenčního zákona na vymáhání pohledávek a příležitosti pro věřitele.",
  },

  {
    slug: "eticke-vymahani-jak-chranit-reputaci-firmy",
    title: "Etické vymáhání: Jak chránit reputaci firmy",
    subtitle: "Minimalizujte rizika s etickými přístupy ve vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Etika vymáhání",
    tags: ["etika vymáhání","pohledávky","reputační rizika","podnikání","technologie","automatizace","Česká republika"],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjg0MTh8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte etické strategie vymáhání pohledávek a chraňte reputaci své firmy v ČR.",
  },
  {
    slug: "eticke-vymahani-pravo-vs-vztahy",
    title: "Etické vymáhání: Právo vs. vztahy",
    subtitle: "Jak české MSP zvládají etická dilemata při vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Etika vymáhání",
    tags: ["etika", "vymáhání pohledávek", "obchodní vztahy", "MSP", "Česká republika", "právo", "podnikání"],
    image: "https://images.unsplash.com/photo-1573164574048-f968d7ee9f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjc2NDN8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak české MSP balancují mezi právními nároky a obchodními vztahy v etickém vymáhání.",
  },
  {
    slug: "inkasovani-pohledavek-v-case-inflace",
    title: "Inkasování pohledávek v čase inflace",
    subtitle: "Chraňte jmění před inflací s efektivními postupy",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Správa pohledávek",
    tags: ["pohledávky","inflace","MSP","automatizace","správa financí","technologie"],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjY0NjV8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte strategie pro správu pohledávek během inflace a chraňte své jmění.",
  },
  {
    slug: "ai-revoluce-v-predikci-platebni-moralky",
    title: "AI revoluce v predikci platební morálky",
    subtitle: "Objevte efektivitu a právní výzvy AI v českých firmách",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Správa pohledávek",
    tags: ["AI","platební morálka","správa pohledávek","české firmy","právní výzvy","MSP","automatizace"],
    image: "https://images.unsplash.com/photo-1551845728-6820a30c64e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjUzMTh8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Využití AI v predikci platební morálky zlepšuje správu pohledávek a přináší právní výzvy.",
  },
  {
    slug: "ai-a-digitalizace-ve-sprave-pohledavek",
    title: "AI a digitalizace ve správě pohledávek",
    subtitle: "České podniky využívají AI pro lepší správu pohledávek",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Správa pohledávek",
    tags: ["AI","digitalizace","správa pohledávek","české podniky","MSP","automatizace"],
    image: "https://images.unsplash.com/photo-1573496267478-37727ee5b694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjM3ODl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Zjistěte, jak AI a digitální technologie mění správu pohledávek v českých MSP.",
  },
  {
    slug: "digitalizace-meni-spravu-pohledavek-v-ceskych-msp",
    title: "Digitalizace mění správu pohledávek v českých MSP",
    subtitle: "Jak automatizace zvyšuje efektivitu a konkurenceschopnost podniků",
    date: "15. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "5 minut čtení",
    category: "Finanční analýza",
    tags: ["digitalizace","automatizace","správa pohledávek","české MSP","efektivita"],
    image: "https://images.unsplash.com/photo-1471347334704-25603ca7d537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjE5NDd8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Digitalizace a automatizace zlepšují správu pohledávek v českých MSP.",
  },
  {
    slug: "prediktivni-analyza-klic-ke-zdravym-pohledavkam-msp",
    title: "Prediktivní analýza: Klíč ke zdravým pohledávkám MSP",
    subtitle: "Transformujte správu pohledávek pomocí moderních technologií",
    date: "15. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "3 minuty čtení",
    category: "Prevence",
    tags: ["správa pohledávek","prediktivní analýza","MSP","cash flow","technologie"],
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjE1MTB8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak prediktivní analýza zlepší řízení pohledávek v MSP.",
  },
  {
    slug: "novela-insolvencniho-zakona-sance-pro-startupy",
    title: "Novela insolvenčního zákona: Šance pro startupy?",
    subtitle: "Jak změny ovlivňují zajišťování pohledávek u technologických firem",
    date: "15. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "3 minuty čtení",
    category: "Insolvence",
    tags: ["insolvenční zákon","startupy","technologické firmy","pohledávky","právní změny"],
    image: "/images/blog/article-1742057915664.jpg",
    excerpt: "Novelizace insolvenčního zákona přináší výzvy i příležitosti pro startupy v ČR.",
  },
  {
    slug: "digitalizace-soudniho-vymahani-sance-pro-ceske-firmy",
    title: "Digitalizace soudního vymáhání: Šance pro české firmy",
    subtitle: "Rychlost a transparentnost vymáhání pohledávek díky digitalizaci",
    date: "15. 3. 2025", 
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "4 minuty čtení",
    category: "Vymáhání pohledávek",
    tags: ["digitalizace", "soudní vymáhání", "pohledávky", "legislativa", "konkurenceschopnost"],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjkzNDl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Jak digitalizace mění soudní vymáhání pohledávek a jaké to přináší výhody českým firmám."
  },
  {
    slug: "kvalita-versus-rychlost-vymahani",
    title: "Kvalita versus rychlost vymáhání: Co upřednostnit?",
    subtitle: "Jak najít rovnováhu mezi efektivitou a etikou při vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "5 minut čtení",
    category: "Etika vymáhání",
    tags: ["etika", "vymáhání pohledávek", "efektivita", "obchodní vztahy", "praxe"],
    image: "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjk1NDl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Prozkoumejte, jak najít rovnováhu mezi efektivním vymáháním pohledávek a etickými přístupy k dlužníkům."
  }
]

// Kategorie pro filtry na hlavní stránce
const categories = [
  "Správa pohledávek",
  "Finanční analýza",
  "Vymáhání pohledávek",
  "Etika vymáhání",
  "Insolvence",
  "Prevence"
]

export default function BlogPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<BlogPost[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  
  const postsPerPage = 9
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  
  useEffect(() => {
    // Simulace načítání dat
    setTimeout(() => {
      setIsLoaded(true)
      setFilteredPosts(blogPosts)
    }, 500)
  }, [])

  // Filtrování podle kategorie
  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("")
    } else {
      setSelectedCategory(category)
    }
    setCurrentPage(1)
  }
  
  // Filtrování podle tagu
  const filterByTag = (tag: string) => {
    setSearchQuery(tag)
    setCurrentPage(1)
  }
  
  // Filtrování příspěvků podle vyhledávání a kategorie
  useEffect(() => {
    let filtered = [...blogPosts]
    
    // Filtrování podle kategorie
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }
    
    // Filtrování podle vyhledávacího dotazu
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.subtitle.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    // Řazení podle data (nejnovější první)
    filtered = filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    
    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategory])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault()
      navigateToPost(suggestions[selectedSuggestionIndex])
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  // Navigate to a post
  const navigateToPost = (post: BlogPost) => {
    setShowSuggestions(false)
    setSearchQuery("")
    window.location.href = `/blog/${post.slug}`
  }

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const searchTermLower = searchQuery.toLowerCase().trim()
      const matchedItems = blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTermLower) ||
          post.excerpt.toLowerCase().includes(searchTermLower) ||
          post.category?.toLowerCase().includes(searchTermLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      )

      setSuggestions(matchedItems)
      setShowSuggestions(matchedItems.length > 0)
      setSelectedSuggestionIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  // Highlight matching text in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    try {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      return text.replace(regex, '<mark class="bg-orange-600 text-white font-bold px-1 py-0.5 rounded">$1</mark>');
    } catch (error) {
      return text;
    }
  }

  // Add styles for search suggestions
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .search-suggestions {
        background: rgba(255, 255, 255, 1);
        backdrop-filter: blur(12px);
        border: 2px solid rgba(249, 115, 22, 0.5);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        overflow-y: auto;
        max-height: 420px;
        margin-bottom: -150px;
        padding-bottom: 0;
        position: relative;
        z-index: 2000;
      }
      .search-suggestions::-webkit-scrollbar {
        width: 6px;
      }
      .search-suggestions::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      .search-suggestions::-webkit-scrollbar-thumb {
        background-color: rgba(249, 115, 22, 0.8);
        border-radius: 3px;
        border: 1px solid rgba(249, 115, 22, 0.1);
      }
      .search-suggestions::-webkit-scrollbar-thumb:hover {
        background-color: rgba(249, 115, 22, 1);
      }
      .suggestion-item:hover mark {
        background-color: #f97316;
      }
      .suggestion-item.selected mark {
        background-color: #f97316;
      }
      .suggestion-item:hover {
        background-color: rgba(249, 115, 22, 0.1);
      }
      .suggestion-item.selected {
        background-color: rgba(249, 115, 22, 0.1);
      }
      mark {
        background-color: #f97316;
        color: white;
        font-weight: 700;
        padding: 0 4px;
        border-radius: 3px;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header isLandingPage={false} />
      
      {/* Hero section - moderní design s výraznějšími oranžovými prvky */}
      <section className="relative pt-36 pb-48 overflow-hidden">
        {/* Pozadí s gradientem a texturou */}
        <div className="absolute inset-0 bg-zinc-900 z-0">
          {/* Textury a gradienty */}
          <div className="absolute inset-0 opacity-30"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               }}
          ></div>
          
          {/* Vylepšené gradienty */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-zinc-900"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-orange-600/10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        
        {/* Dekorativní prvky */}
        <div className="absolute top-1/2 right-5 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div className="absolute top-1/3 left-10 w-[400px] h-[400px] rounded-full bg-orange-600/10 blur-[80px]"></div>
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-2/3 h-64 bg-orange-500/20 blur-[120px]"></div>
        
        {/* Animované plovoucí kruhy s většími rozměry */}
        <div className="absolute top-20 left-[10%] w-8 h-8 rounded-full bg-orange-400/40 animate-float"></div>
        <div className="absolute top-40 right-[20%] w-12 h-12 rounded-full bg-orange-500/40 animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-[30%] w-16 h-16 rounded-full bg-orange-600/30 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-48 right-[35%] w-10 h-10 rounded-full bg-orange-300/30 animate-float" style={{ animationDelay: "3s" }}></div>
        
        {/* Content container */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Oranžový badge nad nadpisem */}
            <div className="inline-flex items-center bg-orange-600/20 backdrop-blur-sm px-6 py-3 rounded-full border border-orange-500/30 mb-8 text-orange-300 animate-fade-in-up shadow-lg shadow-orange-500/10">
              <span className="block w-2 h-2 rounded-full bg-orange-400 mr-3"></span>
              <span className="text-sm font-medium tracking-wide">Odborné články pro firmy a podnikatele</span>
            </div>
            
            {/* Hlavní nadpis */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-center text-white leading-tight tracking-tight animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              <span className="relative inline-block">
                Náš
                <span className="absolute -bottom-3 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-transparent"></span>
              </span>
              <span className="relative ml-5 inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                blog
                <span className="absolute -bottom-3 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></span>
              </span>
            </h1>
            
            {/* Podnadpis s lepším formátováním */}
            <p className="text-xl md:text-2xl text-center max-w-4xl mx-auto mb-16 text-zinc-300 leading-relaxed animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              Aktualizovaný blog o správě, odkupu a vymáhání pohledávek. <br className="hidden md:block" />
              Najdete zde <span className="text-orange-300 font-medium">odborné články s praktickými radami</span> pro firmy
              a podnikatele v českém právním prostředí.
            </p>
            
            {/* Enhanced search bar with improved UX */}
            <div className="relative max-w-2xl mx-auto group animate-fade-in-up" style={{animationDelay: "0.3s"}}>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/40 to-orange-600/40 rounded-full blur-lg opacity-100 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-white shadow-md hover:shadow-lg rounded-full border-2 border-orange-300 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600 transition-transform duration-300 group-focus-within:scale-110">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Hledat články, témata nebo autory..."
                  className="bg-white border-transparent pl-12 pr-12 py-4 text-[16px] text-zinc-900 font-medium placeholder:text-zinc-500 w-full rounded-full focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 transition-colors p-1.5 hover:bg-zinc-100 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Improved Search suggestions with compact design */}
                {showSuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute left-0 right-0 md:absolute md:left-auto md:right-auto search-suggestions rounded-xl overflow-auto w-full md:w-auto min-w-full"
                    style={{
                      top: "calc(100% + 8px)",
                      zIndex: 2000,
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div className="py-1 bg-white backdrop-blur-sm border-2 border-orange-300 rounded-xl shadow-lg">
                      {suggestions.length > 0 ? (
                        <>
                          <div className="sticky top-0 px-4 py-3 text-base font-bold text-zinc-900 bg-orange-50 border-b-2 border-orange-200 backdrop-blur-sm z-10 flex items-center justify-between">
                            <span>Nalezeno <span className="text-orange-600">{suggestions.length}</span> výsledků</span>
                            <button
                              onClick={() => setShowSuggestions(false)}
                              className="text-zinc-700 hover:text-zinc-900 transition-colors p-1.5 hover:bg-orange-100 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="divide-y divide-orange-50">
                            {suggestions.map((post, index) => (
                              <div
                                key={post.slug}
                                className={`suggestion-item px-4 py-4 cursor-pointer transition-all duration-200 hover:bg-orange-100 ${
                                  selectedSuggestionIndex === index ? "bg-orange-100" : "bg-white"
                                }`}
                                onClick={() => navigateToPost(post)}
                                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                              >
                                <div className="flex items-start gap-4">
                                  {/* Thumbnail */}
                                  <div className="relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
                                    <img
                                      src={post.image}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Badge 
                                        variant="secondary" 
                                        className="px-2 py-0.5 text-[11px] bg-orange-500 text-white rounded-full font-bold shadow-sm"
                                      >
                                        {post.category}
                                      </Badge>
                                      <span className="text-[11px] text-zinc-800 font-medium flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-orange-600" />
                                        {post.readTime}
                                      </span>
                                    </div>
                                    <div
                                      className="font-bold text-[15px] text-zinc-900 mb-1.5 leading-tight line-clamp-1"
                                      dangerouslySetInnerHTML={{
                                        __html: highlightMatch(post.title, searchQuery)
                                      }}
                                    />
                                    <div
                                      className="text-[13px] text-zinc-800 line-clamp-2 leading-snug"
                                      dangerouslySetInnerHTML={{
                                        __html: highlightMatch(post.excerpt, searchQuery)
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="px-6 py-10 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-4 shadow-inner">
                            <Search className="h-7 w-7 text-orange-600" />
                          </div>
                          <p className="text-lg font-bold text-zinc-800 mb-2">Žádné výsledky nenalezeny</p>
                          <p className="text-base text-zinc-700">Zkuste upravit vyhledávací dotaz</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Procházet podle kategorií - vylepšený design */}
      <section className={`bg-gradient-to-b from-white to-orange-50/30 py-16 relative ${showSuggestions ? 'pt-32' : ''}`}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
              Procházet podle <span className="text-orange-600">kategorií</span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mb-8">
              Vyberte si kategorii, která vás zajímá, a objevte relevantní články z dané oblasti.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`relative group flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
                    : "bg-white hover:bg-orange-50 text-zinc-700 hover:text-orange-600 border border-zinc-100 hover:border-orange-200"
                }`}
              >
                <span className="font-medium text-sm text-center">{category}</span>
                {selectedCategory === category && (
                  <span className="absolute -top-1 -right-1 w-3 h-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Seznam článků - vylepšený design */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4 relative z-10">
          {/* Filtry a řazení */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="w-full md:w-auto flex items-center gap-4">
              {selectedCategory && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 px-4 py-2 bg-orange-100 text-orange-800 border-orange-200 rounded-full"
                >
                  {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory("")}
                    className="ml-2 hover:bg-orange-200 rounded-full p-1 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>

          {/* Výsledky vyhledávání */}
          {searchQuery && (
            <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-lg">
              <p className="text-zinc-700">
                {filteredPosts.length === 0 ? (
                  "Žádné články neodpovídají vašemu vyhledávání"
                ) : (
                  `Nalezeno ${filteredPosts.length} ${
                    filteredPosts.length === 1 ? "článek" : 
                    filteredPosts.length >= 2 && filteredPosts.length <= 4 ? "články" : "článků"
                  }`
                )}
                {searchQuery && ` pro "${searchQuery}"`}
                {selectedCategory && ` v kategorii "${selectedCategory}"`}
              </p>
            </div>
          )}

          {/* Grid s články */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {isLoaded ? (
              filteredPosts
                .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                .map((post) => (
                  <Card key={post.slug} className="group overflow-hidden flex flex-col h-full border-none rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                    <Link href={`/blog/${post.slug}`} className="relative block h-64 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg">
                          {post.category}
                        </Badge>
                      </div>
                    </Link>

                    <CardHeader className="flex-grow p-6 space-y-4">
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <CardTitle className="text-2xl font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                          {post.title}
                        </CardTitle>
                      </Link>

                      <p className="text-zinc-600 text-base line-clamp-3 min-h-[4.5rem]">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault()
                              filterByTag(tag)
                            }}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </CardHeader>

                    <CardFooter className="px-6 py-4 border-t border-zinc-100">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-base font-medium text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Přečíst článek
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              // Loading stav
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-zinc-100 animate-pulse rounded-xl h-[500px]"
                ></div>
              ))
            )}
          </div>

          {/* Stránkování */}
          {filteredPosts.length > postsPerPage && (
            <div className="mt-16 flex justify-center">
              <nav className="inline-flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="rounded-lg border-zinc-200"
                >
                  Předchozí
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 ${
                        currentPage === page
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "border-zinc-200 hover:border-orange-500 hover:text-orange-600"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="rounded-lg border-zinc-200"
                >
                  Další
                </Button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* Add custom scrollbar and highlight styles */}
      <style jsx global>{`
        /* Remove default search input styles */
        input[type="search"]::-webkit-search-decoration,
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-results-button,
        input[type="search"]::-webkit-search-results-decoration {
          -webkit-appearance: none;
        }
        
        /* Cool focus effect for search input */
        .search-suggestions input:focus {
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
        }
        
        /* Smooth hover transitions */
        .suggestion-item {
          transition: all 0.2s ease;
        }
        
        /* Subtle hover animation */
        .suggestion-item:hover {
          transform: translateX(4px);
        }
        
        /* Fix for Firefox scrollbar */
        .search-suggestions {
          scrollbar-width: thin;
          scrollbar-color: rgba(249, 115, 22, 0.3) rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}

