"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ArrowRight, Calendar, Clock, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import csBlogPage from '@/locales/cs/blog-page.json'

// Default translations to use before client-side hydration
const defaultTranslations = csBlogPage;

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  slug: string
  readTime?: string
  category?: string
  author?: string
  authorImage?: string
  subtitle?: string
  authorPosition?: string
  tags?: string[]
}

interface Category {
  name: string
  slug: string
  count?: number
}

const categoryDefinitions: Category[] = [
  { name: "Všechny články", slug: "" },
  { name: "Prevence", slug: "prevence" },
  { name: "Insolvence", slug: "insolvence" },
  { name: "Vymáhání pohledávek", slug: "vymahani-pohledavek" },
  { name: "Správa pohledávek", slug: "sprava-pohledavek" },
  { name: "Etika vymáhání", slug: "etika-vymahani" },
  { name: "Finanční analýza", slug: "financni-analyza" }
]

const blogPosts: BlogPost[] = [
  {
    slug: "jak-mediace-usnadnuje-vymahani-pohledavek",
    title: "Jak mediace usnadňuje vymáhání pohledávek",
    subtitle: "Praktické tipy a právní rámec pro české podniky",
    date: "25. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Vymáhání pohledávek",
    tags: ["mediace","obchodní pohledávky","právní rámec","české podniky","finance","obchodní právo","praktické rady"],
    image: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDI4ODcwNjV8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak mediace může efektivně pomoci při vymáhání obchodních pohledávek.",
  },

  {
    slug: "efektivni-komunikace-s-dluzniky-v-insolvenci",
    title: "Efektivní komunikace s dlužníky v insolvenci",
    subtitle: "Naučte se vést úspěšná jednání o pohledávkách v krizi",
    date: "24. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","dlužníci","vyjednávání","pohledávky","právo","finance","komunikace"],
    image: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDI4MDA1ODV8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte strategie pro efektivní vyjednávání během insolvenčního procesu v ČR.",
  },

  {
    id: "mediace-klic-k-uspesnemu-vymahani-pohledavek",
    slug: "mediace-klic-k-uspesnemu-vymahani-pohledavek",
    title: "Mediace: Klíč k úspěšnému vymáhání pohledávek",
    subtitle: "Objevte, jak mediace usnadňuje řešení pohledávek a chrání obchodní vztahy",
    date: "23. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Vymáhání pohledávek",
    tags: ["mediace","vymáhání pohledávek","obchodní vztahy","právo","finance","podnikání"],
    image: "https://images.unsplash.com/photo-1474314881477-04c4aac40a0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDI3MTQwMTB8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Zkoumejte roli mediace ve vymáhání pohledávek a zefektivněte své podnikání.",
  },

  {
    id: "prevence-pohledavek-klic-k-uspechu",
    slug: "prevence-pohledavek-klic-k-uspechu",
    title: "Prevence pohledávek: Klíč k úspěchu",
    subtitle: "Získejte kontrolu nad pohledávkami s právem a empatií",
    date: "22. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "7 minut čtení",
    category: "Prevence",
    tags: ["prevence pohledávek","právní postupy","vyjednávání","finanční stabilita","obchodní vztahy"],
    image: "https://images.unsplash.com/photo-1681505504714-4ded1bc247e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDI2Mjc2MzZ8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Zjistěte, jak předcházet platební neschopnosti klientů s právními a vyjednávacími technikami.",
  },

  {
    id: "ochrana-v-obchodu-jak-predejit-nedobytnym-dluhum",
    slug: "ochrana-v-obchodu-jak-predejit-nedobytnym-dluhum",
    title: "Ochrana v obchodu: Jak předejít nedobytným dluhům",
    subtitle: "Klíčová role důvěry a vztahů v obchodních transakcích",
    date: "21. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "5 minut čtení",
    category: "Prevence",
    tags: ["nedobytné pohledávky","obchodní vztahy","finanční stabilita","smluvní ochrana","důvěra","vztahový management"],
    image: "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDI1NDEzMTZ8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte osvědčené strategie k prevenci nedobytných pohledávek a posílení obchodních vztahů.",
  },

  {
    id: "zmeny-zakona-vyzva-pro-spravu-pohledavek",
    slug: "zmeny-zakona-vyzva-pro-spravu-pohledavek",
    title: "Změny zákona: Výzva pro správu pohledávek",
    subtitle: "Jak se české střední firmy přizpůsobují novým právním normám",
    date: "20. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "7 minut čtení",
    category: "Finanční analýza",
    tags: ["finanční analýza","obchodní právo","správa pohledávek","české firmy","lidský faktor"],
    image: "https://images.unsplash.com/photo-1518475155060-0d631de637e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDI0NTQ5MjZ8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte dopady zákonných změn na správu pohledávek u středních firem v ČR.",
  },

  {
    id: "mimosoudni-vyrovnani-klic-k-lepsim-vztahum",
    slug: "mimosoudni-vyrovnani-klic-k-lepsim-vztahum",
    title: "Mimosoudní vyrovnání: Klíč k lepším vztahům",
    subtitle: "Jak osobní vztahy ovlivňují řešení neuhrazených pohledávek",
    date: "19. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "5 minut čtení",
    category: "Vymáhání pohledávek",
    tags: ["pohledávky","mimosoudní vyrovnání","obchodní vztahy","důvěra","komunikace","finance","právo"],
    image: "https://images.unsplash.com/photo-1556557285-cbd49d68f67f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIzNjg1NTJ8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte roli důvěry a komunikace při mimosoudním vyrovnání pohledávek v Česku.",
  },

  {
    id: "optimalizace-cash-flow-klic-k-uspechu-2024",
    slug: "optimalizace-cash-flow-klic-k-uspechu-2024",
    title: "Optimalizace cash flow: Klíč k úspěchu 2024",
    subtitle: "Strategie pro řízení pohledávek a obchodních vztahů",
    date: "18. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "6 minut čtení",
    category: "Finanční analýza",
    tags: ["cash flow","finanční strategie","řízení pohledávek","obchodní vztahy","právo","vyjednávání"],
    image: "https://images.unsplash.com/photo-1517940001917-1c03b8b1b85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIyODIxNzd8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Zlepšete finanční zdraví firmy efektivním řízením pohledávek. Komunikace a vyjednávání v roce 2024.",
  },

  {
    id: "eticke-vymahani-pohledavek-v-cr",
    slug: "eticke-vymahani-pohledavek-v-cr",
    title: "Etické vymáhání pohledávek v ČR",
    subtitle: "Jak vymáhat pohledávky a zachovat dobré vztahy",
    date: "17. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "8 minut čtení",
    category: "Etika vymáhání",
    tags: ["etika","vymáhání pohledávek","české právo","obchodní vztahy","ekonomická stabilita"],
    image: "https://images.unsplash.com/photo-1707623988408-ab88c9981730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIyMTgxNTN8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak eticky vymáhat pohledávky v ČR a udržet dobré firemní vztahy.",
  },

  {
    id: "eticka-dilemata-ve-vymahani-pohledavek",
    slug: "eticka-dilemata-ve-vymahani-pohledavek",
    title: "Etická dilemata ve vymáhání pohledávek",
    subtitle: "Jak balancovat právo a lidskost v českém prostředí",
    date: "17. 3. 2025",
    author: "Jan Novák",
    authorPosition: "Specialista na pohledávky",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "7 minut čtení",
    category: "Etika vymáhání",
    tags: ["etika","vymáhání pohledávek","české právo","obchodní vztahy","finanční stabilita"],
    image: "https://images.unsplash.com/photo-1531498352491-042fbae4cf57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIxOTU3ODB8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Prozkoumejte etická dilemata při vymáhání pohledávek a balancujte mezi právními nástroji a lidským přístupem.",
  },

  {
    id: "prevence-nedobytnych-pohledavek-v-inflaci",
    slug: "prevence-nedobytnych-pohledavek-v-inflaci",
    title: "Prevence nedobytných pohledávek v inflaci",
    subtitle: "Jak chránit finance pomocí důvěry a právních jistot",
    date: "16. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "/placeholder.svg?height=120&width=120",
    readTime: "8 minut čtení",
    category: "Prevence",
    tags: ["finance","právo","obchodní vztahy","nedobytné pohledávky","inflace","prevence","právní jistota"],
    image: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIxNTgwNDN8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte strategie k minimalizaci rizika nedobytných pohledávek v době rostoucí inflace.",
  },

  {
    id: "1",
    slug: "prevence-platebni-neschopnosti-u-zakazniku",
    title: "Prevence platební neschopnosti u zákazníků",
    subtitle: "Získejte klid díky osobnímu přístupu a pravidelným auditům",
    date: "16. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "https://i.ibb.co/h1g0nf3P/man2.jpg",
    readTime: "5 minut čtení",
    category: "Prevence",
    tags: ["platební neschopnost","pohledávky","obchodní vztahy","prevence","finance","audity","podnikání"],
    image: "https://images.unsplash.com/45/QDSMoAMTYaZoXpcwBjsL__DSC0104-1.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIxMzIyOTF8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak předcházet platební neschopnosti u klíčových zákazníků pomocí osobního přístupu a preventivních auditů.",
  },

  {
    id: "2",
    slug: "novy-insolvencni-zakon-sance-a-vyzvy-2024",
    title: "Nový Insolvenční Zákon: Šance a Výzvy 2024",
    subtitle: "Jak změny ovlivní vymáhání pohledávek v Česku?",
    date: "16. 3. 2025",
    author: "Jan Petrů",
    authorPosition: "Specialista na pohledávky",
    authorImage: "https://i.ibb.co/GfpZGQK8/man1.jpg",
    readTime: "6 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","pohledávky","právní změny","obchodní vztahy","restrukturalizace","podnikání"],
    image: "https://images.unsplash.com/photo-1573164574397-dd250bc8a598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIxMDkyMzN8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte dopady nového insolvenčního zákona na vymáhání pohledávek. Klíčové změny a jejich vliv na české podniky.",
  },

  {
    id: "3",
    slug: "insolvence-sprava-pohledavek-v-krizi",
    title: "Insolvence: Správa pohledávek v krizi",
    subtitle: "Strategie a přístupy pro české podniky v nestabilní době",
    date: "15. 3. 2025",
    author: "Jan Petrů",
    authorPosition: "Specialista na pohledávky",
    authorImage: "https://i.ibb.co/GfpZGQK8/man1.jpg",
    readTime: "8 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","správa pohledávek","české podniky","finance","obchodní právo","komunikace","důvěra"],
    image: "https://images.unsplash.com/photo-1463620910506-d0458143143e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNzY4NjN8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak insolvenční řízení může pomoci českým podnikům efektivně spravovat pohledávky.",
  },

  {
    id: "4",
    slug: "uspesne-vymahani-klicove-strategie",
    title: "Úspěšné Vymáhání: Klíčové Strategie",
    subtitle: "Jak vyjednávat s dlužníky a minimalizovat náklady",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "https://i.ibb.co/gLQvHwmc/woman2.jpg",
    readTime: "8 minut čtení",
    category: "Vymáhání pohledávek",
    tags: ["vymáhání pohledávek","právo","finance","obchodní vztahy","vyjednávání","důvěra","podnikání"],
    image: "https://images.unsplash.com/photo-1641197861542-83e511654ac0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNzU1MjB8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte strategie mimosoudního vymáhání pohledávek v ČR a zlepšete komunikaci s dlužníky.",
  },

  {
    id: "5",
    slug: "smirci-rizeni-klic-k-prevenci-soudnich-sporu",
    title: "Smírčí řízení: Klíč k prevenci soudních sporů",
    subtitle: "Optimalizace procesu s AI v oblasti správy pohledávek",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "https://i.ibb.co/gLQvHwmc/woman2.jpg",
    readTime: "7 minut čtení",
    category: "Správa pohledávek",
    tags: ["správa pohledávek","smírčí řízení","prevence sporů","AI","automatizace","MSP","právní proces"],
    image: "https://images.unsplash.com/photo-1575886876783-ea3cbbc8204d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNzM0NTB8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak smírčí řízení a AI pomáhají předcházet soudním sporům ve správě pohledávek.",
  },

  {
    id: "6",
    slug: "insolvence-po-pandemii-nove-strategie-v-cr",
    title: "Insolvence po pandemii: Nové strategie v ČR",
    subtitle: "Jak legislativní změny a AI formují vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "https://i.ibb.co/h1g0nf3P/man2.jpg",
    readTime: "5 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","česká legislativa","pohledávky","automatizace","umělá inteligence","firmy","post-pandemická nejistota"],
    image: "https://images.unsplash.com/photo-1590649849991-e9af438ea77d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNzAyNzZ8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Zkoumáme vliv českých legislativních změn a AI na strategie firem v insolvenci.",
  },

  {
    id: "7",
    slug: "optimalizace-dluhu-role-insolvencniho-spravce",
    title: "Optimalizace dluhů: Role insolvenčního správce",
    subtitle: "Efektivní strategie a moderní technologie v insolvenci",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "https://i.ibb.co/gLQvHwmc/woman2.jpg",
    readTime: "8 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","restrukturalizace","firemní dluhy","automatizace","digitalizace","umělá inteligence","vymáhání pohledávek"],
    image: "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjk5Mzl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte klíčové strategie a technologie pro optimalizaci vymáhání firemních dluhů s pomocí insolvenčního správce.",
  },

  {
    id: "8",
    slug: "moratoria-na-insolvence-vyzvy-pro-veritele",
    title: "Moratoria na insolvence: Výzvy pro věřitele",
    subtitle: "Jak moderní technologie mění vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "https://i.ibb.co/gLQvHwmc/woman2.jpg",
    readTime: "6 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","moratorium","vymáhání pohledávek","technologie","digitalizace","automatizace","věřitelé"],
    image: "https://images.unsplash.com/photo-1573483537868-423d82530f54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjg5MDh8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak moratoria ovlivňují věřitele a jak moderní technologie pomáhají vymáhat pohledávky efektivněji.",
  },

  {
    id: "9",
    slug: "novelizace-insolvencniho-zakona-vyzvy-a-sance",
    title: "Novelizace insolvenčního zákona: Výzvy a šance",
    subtitle: "Jak změny ovlivní vymáhání pohledávek českých firem",
    date: "15. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "https://i.ibb.co/h1g0nf3P/man2.jpg",
    readTime: "6 minut čtení",
    category: "Insolvence",
    tags: ["insolvence","vymáhání pohledávek","české firmy","právní změny","věřitelé","automatizace","digitalizace"],
    image: "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjg3Nzl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte vliv změn insolvenčního zákona na vymáhání pohledávek a příležitosti pro věřitele.",
  },

  {
    id: "10",
    slug: "eticke-vymahani-jak-chranit-reputaci-firmy",
    title: "Etické vymáhání: Jak chránit reputaci firmy",
    subtitle: "Minimalizujte rizika s etickými přístupy ve vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Jan Petrů",
    authorPosition: "Specialista na pohledávky",
    authorImage: "https://i.ibb.co/GfpZGQK8/man1.jpg",
    readTime: "6 minut čtení",
    category: "Etika vymáhání",
    tags: ["etika vymáhání","pohledávky","reputační rizika","podnikání","technologie","automatizace","Česká republika"],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjg0MTh8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte etické strategie vymáhání pohledávek a chraňte reputaci své firmy v ČR.",
  },
  {
    id: "11",
    slug: "eticke-vymahani-pravo-vs-vztahy",
    title: "Etické vymáhání: Právo vs. vztahy",
    subtitle: "Jak české MSP zvládají etická dilemata při vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "https://i.ibb.co/h1g0nf3P/man2.jpg",
    readTime: "6 minut čtení",
    category: "Etika vymáhání",
    tags: ["etika", "vymáhání pohledávek", "obchodní vztahy", "MSP", "Česká republika", "právo", "podnikání"],
    image: "https://images.unsplash.com/photo-1573164574048-f968d7ee9f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjc2NDN8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak české MSP balancují mezi právními nároky a obchodními vztahy v etickém vymáhání.",
  },
  {
    id: "12",
    slug: "inkasovani-pohledavek-v-case-inflace",
    title: "Inkasování pohledávek v čase inflace",
    subtitle: "Chraňte jmění před inflací s efektivními postupy",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "https://i.ibb.co/gLQvHwmc/woman2.jpg",
    readTime: "6 minut čtení",
    category: "Správa pohledávek",
    tags: ["pohledávky","inflace","MSP","automatizace","správa financí","technologie"],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjY0NjV8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte strategie pro správu pohledávek během inflace a chraňte své jmění.",
  },
  {
    id: "13",
    slug: "ai-revoluce-v-predikci-platebni-moralky",
    title: "AI revoluce v predikci platební morálky",
    subtitle: "Objevte efektivitu a právní výzvy AI v českých firmách",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "https://i.ibb.co/gLQvHwmc/woman2.jpg",
    readTime: "6 minut čtení",
    category: "Správa pohledávek",
    tags: ["AI","platební morálka","správa pohledávek","české firmy","právní výzvy","MSP","automatizace"],
    image: "https://images.unsplash.com/photo-1551845728-6820a30c64e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjUzMTh8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Využití AI v predikci platební morálky zlepšuje správu pohledávek a přináší právní výzvy.",
  },
  {
    id: "14",
    slug: "ai-a-digitalizace-ve-sprave-pohledavek",
    title: "AI a digitalizace ve správě pohledávek",
    subtitle: "České podniky využívají AI pro lepší správu pohledávek",
    date: "15. 3. 2025",
    author: "Ing. Petra Svobodová",
    authorPosition: "Finanční analytik",
    authorImage: "https://i.ibb.co/gLQvHwmc/woman2.jpg",
    readTime: "6 minut čtení",
    category: "Správa pohledávek",
    tags: ["AI","digitalizace","správa pohledávek","české podniky","MSP","automatizace"],
    image: "https://images.unsplash.com/photo-1573496267478-37727ee5b694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjM3ODl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Zjistěte, jak AI a digitální technologie mění správu pohledávek v českých MSP.",
  },
  {
    id: "15",
    slug: "digitalizace-meni-spravu-pohledavek-v-ceskych-msp",
    title: "Digitalizace mění správu pohledávek v českých MSP",
    subtitle: "Jak automatizace zvyšuje efektivitu a konkurenceschopnost podniků",
    date: "15. 3. 2025",
    author: "Jan Petrů",
    authorPosition: "Specialista na pohledávky",
    authorImage: "https://i.ibb.co/GfpZGQK8/man1.jpg",
    readTime: "5 minut čtení",
    category: "Finanční analýza",
    tags: ["digitalizace","automatizace","správa pohledávek","české MSP","efektivita"],
    image: "https://images.unsplash.com/photo-1471347334704-25603ca7d537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjE5NDd8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Digitalizace a automatizace zlepšují správu pohledávek v českých MSP.",
  },
  {
    id: "16",
    slug: "prediktivni-analyza-klic-ke-zdravym-pohledavkam-msp",
    title: "Prediktivní analýza: Klíč ke zdravým pohledávkám MSP",
    subtitle: "Transformujte správu pohledávek pomocí moderních technologií",
    date: "15. 3. 2025",
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "https://i.ibb.co/h1g0nf3P/man2.jpg",
    readTime: "3 minuty čtení",
    category: "Prevence",
    tags: ["správa pohledávek","prediktivní analýza","MSP","cash flow","technologie"],
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjE1MTB8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Objevte, jak prediktivní analýza zlepší řízení pohledávek v MSP.",
  },
  {
    id: "17",
    slug: "digitalizace-soudniho-vymahani-sance-pro-ceske-firmy",
    title: "Digitalizace soudního vymáhání: Šance pro české firmy",
    subtitle: "Rychlost a transparentnost vymáhání pohledávek díky digitalizaci",
    date: "15. 3. 2025", 
    author: "Mgr. Martin Dvořák",
    authorPosition: "Právní specialista",
    authorImage: "https://i.ibb.co/h1g0nf3P/man2.jpg",
    readTime: "4 minuty čtení",
    category: "Vymáhání pohledávek",
    tags: ["digitalizace", "soudní vymáhání", "pohledávky", "legislativa", "konkurenceschopnost"],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjkzNDl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Jak digitalizace mění soudní vymáhání pohledávek a jaké to přináší výhody českým firmám."
  },
  {
    id: "18",
    slug: "kvalita-versus-rychlost-vymahani",
    title: "Kvalita versus rychlost vymáhání: Co upřednostnit?",
    subtitle: "Jak najít rovnováhu mezi efektivitou a etikou při vymáhání pohledávek",
    date: "15. 3. 2025",
    author: "Jan Petrů",
    authorPosition: "Specialista na pohledávky",
    authorImage: "https://i.ibb.co/GfpZGQK8/man1.jpg",
    readTime: "5 minut čtení",
    category: "Etika vymáhání",
    tags: ["etika", "vymáhání pohledávek", "efektivita", "obchodní vztahy", "praxe"],
    image: "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDIwNjk1NDl8&ixlib=rb-4.0.3&q=80&w=1080",
    excerpt: "Prozkoumejte, jak najít rovnováhu mezi efektivním vymáháním pohledávek a etickými přístupy k dlužníkům."
  }
]

const categories = [
  "Správa pohledávek",
  "Finanční analýza",
  "Vymáhání pohledávek",
  "Etika vymáhání",
  "Insolvence",
  "Prevence"
]

export default function BlogPage() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Add state to track if client-side rendered
  const [isClient, setIsClient] = useState(false);
  
  // Always call hooks unconditionally
  const clientTranslations = useTranslations('blog-page');
  
  // Use client translations or default translations based on client state
  const t = isClient ? clientTranslations : defaultTranslations;
  
  // Set isClient to true after hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<BlogPost[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  // Add state for animations
  useEffect(() => {
    const animateElements = () => {
      // Hero section animation
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        setTimeout(() => {
          heroSection.classList.remove('opacity-0');
        }, 100);
      }

      // Category buttons animation
      const categoryButtons = document.querySelectorAll('.category-button');
      categoryButtons.forEach((button, index) => {
        setTimeout(() => {
          button.classList.remove('opacity-0');
          button.classList.remove('translate-y-5');
        }, 50 * index);
      });

      // Section animations
      const sections = document.querySelectorAll('.animate-section');
      sections.forEach((section, index) => {
        setTimeout(() => {
          section.classList.remove('opacity-0');
          section.classList.remove('translate-y-5');
        }, 200 * (index + 1));
      });

      // Article cards animation
      const cards = document.querySelectorAll('.article-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.remove('opacity-0');
          card.classList.remove('translate-y-5');
        }, 100 * index);
      });
    };

    if (isClient) {
      animateElements();
    }
  }, [isClient, showSearchResults]);

  const allCategories = useMemo(() => {
    // Count posts by category
    const categoryCounts: Record<string, number> = {};
    blogPosts.forEach((post) => {
      if (post.category) {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
      }
    });

    // Add counts to categories
    return categoryDefinitions.map((cat) => ({
      ...cat,
      count: cat.slug === "" ? blogPosts.length : categoryCounts[cat.name] || 0,
    }));
  }, []);

  // Get filtered posts
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return blogPosts;
    return blogPosts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  // Featured post is the first one
  const featuredPost = blogPosts[0];

  // Search function
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const results = blogPosts.filter((post) => 
      post.title.toLowerCase().includes(normalizedQuery) || 
      post.excerpt.toLowerCase().includes(normalizedQuery) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) ||
      (post.category && post.category.toLowerCase().includes(normalizedQuery))
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
    setShowSuggestions(false);
    
    // Scroll to results
    searchRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Update suggestions as user types
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length === 0) {
      // For empty query, show the most recent posts as suggestions
      setSearchSuggestions(blogPosts.slice(0, 5));
      setShowSuggestions(true);
      return;
    }
    
    const normalizedQuery = value.toLowerCase().trim();
    const suggestions = blogPosts.filter((post) => 
      post.title.toLowerCase().includes(normalizedQuery) || 
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) ||
      (post.category && post.category.toLowerCase().includes(normalizedQuery))
    ).slice(0, 5); // Limit to 5 suggestions
    
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };
  
  // Show suggestions on focus
  const handleSearchFocus = () => {
    // If there's already a query, use that to filter
    if (searchQuery.trim().length > 0) {
      handleSearchInputChange({ target: { value: searchQuery } } as React.ChangeEvent<HTMLInputElement>);
      return;
    }
    
    // Otherwise show the most recent posts
    setSearchSuggestions(blogPosts.slice(0, 5));
    setShowSuggestions(true);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (slug: string) => {
    setShowSuggestions(false);
    router.push(`/blog/${slug}`);
  };
  
  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filter by category
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    
    // Set active filter for UI highlighting
    const categoryDef = categoryDefinitions.find(cat => cat.name === category);
    setActiveFilter(categoryDef?.slug || "");
  };

  return (
    <div className="jsx-b86d5aa5da73a6b5 min-h-screen bg-gray-50 pb-16 pt-28">
      {/* Hero Section */}
      <section className="jsx-b86d5aa5da73a6b5 bg-zinc-900 py-16 text-white transition-opacity duration-1000 opacity-0 hero-section">
        <div className="jsx-b86d5aa5da73a6b5 container">
          <div className="jsx-b86d5aa5da73a6b5 mx-auto max-w-3xl text-center">
            <h1 className="jsx-b86d5aa5da73a6b5 mb-4 text-4xl font-bold md:text-5xl">
              <span className="jsx-b86d5aa5da73a6b5 text-white">EX</span>
              <span className="jsx-b86d5aa5da73a6b5 text-orange-500">POHLEDÁVKY</span>
            </h1>
            <h2 className="jsx-b86d5aa5da73a6b5 mb-6 text-xl font-medium md:text-2xl">
              Odborný portál o správě a vymáhání pohledávek
            </h2>
            <p className="jsx-b86d5aa5da73a6b5 mb-8 text-gray-200">
              Vítejte na našem blogu věnovaném správě, odkupu a vymáhání pohledávek. Najdete zde odborné články s praktickými radami pro firmy a podnikatele v českém právním prostředí.
            </p>
            <div style={{ position: "relative", zIndex: 10 }} className="jsx-b86d5aa5da73a6b5 mx-auto mb-8 max-w-xl transform transition-all duration-500 ease-in-out hover:scale-[1.02]">
              <div className="jsx-b86d5aa5da73a6b5 relative">
                <form className="jsx-b86d5aa5da73a6b5 relative z-[100]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white z-20" size={20} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Hledat články..." 
                    className="jsx-b86d5aa5da73a6b5 w-full rounded-full border-0 bg-white/10 px-5 pl-10 py-3 text-white placeholder-gray-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchFocus}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    type="submit"
                    className="jsx-b86d5aa5da73a6b5 absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 p-2 text-white hover:bg-orange-600 transition-colors duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSearch();
                    }}
                  >
                    <Search className="h-5 w-5" />
                  </button>

                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && (
                    <div className="jsx-b86d5aa5da73a6b5 absolute left-0 right-0 top-full mt-2 rounded-xl bg-white shadow-lg overflow-hidden z-50">
                      <div className="jsx-b86d5aa5da73a6b5 max-h-60 overflow-y-auto">
                        {searchSuggestions.map((suggestion) => (
                          <div 
                            key={suggestion.id}
                            className="jsx-b86d5aa5da73a6b5 flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors"
                            onClick={() => handleSuggestionClick(suggestion.slug)}
                          >
                            <div className="jsx-b86d5aa5da73a6b5 relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={suggestion.image} 
                                alt={suggestion.title}
                                fill
                                className="object-cover"
                                />
                              </div>
                            <div className="jsx-b86d5aa5da73a6b5 flex-1">
                              <h4 className="jsx-b86d5aa5da73a6b5 text-sm font-semibold text-zinc-900 text-left">
                                {suggestion.title}
                              </h4>
                              <div className="jsx-b86d5aa5da73a6b5 flex items-center gap-2 mt-1">
                                <span className="jsx-b86d5aa5da73a6b5 text-xs px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                                  {suggestion.category}
                              </span>
                                <span className="jsx-b86d5aa5da73a6b5 text-xs text-zinc-500">
                                  {suggestion.date}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <div className="text-center">
              <Button asChild className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input h-11 rounded-md px-8 bg-transparent text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105">
                <Link href="/o-nas">Více o nás</Link>
            </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="jsx-b86d5aa5da73a6b5 container">
        {/* Category Filters */}
        <div className="jsx-b86d5aa5da73a6b5 my-8 overflow-x-auto relative">
          <div className="jsx-b86d5aa5da73a6b5 flex gap-4 whitespace-nowrap pb-2">
            {allCategories.map((category, index) => (
                      <button
                        key={category.slug}
                style={{ transitionDelay: `${index * 50}ms`, opacity: 0, transform: "translateY(20px)" }}
                onClick={() => handleCategoryClick(category.name)}
                className={`jsx-b86d5aa5da73a6b5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 category-button ${
                  activeFilter === category.slug
                    ? "bg-orange-500 text-white"
                    : "bg-white text-zinc-700 hover:bg-orange-100"
                }`}
              >
                {category.name}{" "}
                <span className="jsx-b86d5aa5da73a6b5 ml-1 text-xs opacity-70">
                  ({category.count})
                </span>
                      </button>
                    ))}
                  </div>
                </div>

        {/* Search Results */}
        {showSearchResults && (
          <div ref={searchRef} className="transition-all duration-700 opacity-0 translate-y-5 animate-section mb-10">
            <section className="jsx-b86d5aa5da73a6b5 py-8 bg-white rounded-xl shadow-sm">
              <div className="jsx-b86d5aa5da73a6b5 flex justify-between items-center mb-8 px-6">
                <h2 className="jsx-b86d5aa5da73a6b5 text-2xl font-bold text-zinc-900">
                  Výsledky vyhledávání: {searchQuery}
                </h2>
                  <button
                  onClick={clearSearch}
                  className="jsx-b86d5aa5da73a6b5 flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors"
                >
                  <X size={18} />
                  <span>Zrušit vyhledávání</span>
                  </button>
            </div>

              {searchResults.length === 0 ? (
                <div className="jsx-b86d5aa5da73a6b5 text-center py-8">
                  <p className="jsx-b86d5aa5da73a6b5 text-zinc-600">Žádné výsledky nenalezeny</p>
                  </div>
              ) : (
                <div className="jsx-b86d5aa5da73a6b5 grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-6">
                  {searchResults.map((post, index) => (
                      <div
                        key={post.id}
                      className="jsx-b86d5aa5da73a6b5 transform transition-all duration-500 ease-in-out hover:scale-[1.03] opacity-0 translate-y-5 article-card delay-100"
                    >
                      <Link href={`/blog/${post.slug}`} className="group">
                        <article className="h-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                          <div className="relative aspect-[16/9]">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <div className="rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white inline">
                                {post.category}
                      </div>
                  </div>
                  </div>
                          <div className="p-6">
                            <div className="mb-2 flex items-center gap-2">
                              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                                <Image
                                  src={post.authorImage || "/placeholder.svg?height=120&width=120"}
                                  alt={post.author || ""}
                                  fill
                                  className="object-cover"
                                />
                  </div>
                              <span className="text-xs text-zinc-600">{post.author}</span>
                              <span className="text-xs text-zinc-400">•</span>
                              <span className="text-xs text-zinc-500">{post.date}</span>
                </div>
                            <h3 className="mb-2 text-xl font-bold text-zinc-900 group-hover:text-orange-500">
                              {post.title}
                            </h3>
                            <p className="mb-4 text-sm text-zinc-600">{post.excerpt}</p>
                            <div className="mt-auto flex items-center gap-1 text-sm text-zinc-500">
                              <Clock className="h-4 w-4" />
                              {post.readTime}
      </div>
    </div>
                        </article>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Featured Article */}
        <div className="transition-all duration-700 opacity-0 translate-y-5 animate-section delay-100">
          <section className="jsx-b86d5aa5da73a6b5 py-8">
            <h2 className="jsx-b86d5aa5da73a6b5 mb-8 text-2xl font-bold text-zinc-900">
              Nejnovější článek
            </h2>
            <div className="jsx-b86d5aa5da73a6b5 transform transition-all duration-500 ease-in-out hover:scale-[1.01]">
              <Link href={`/blog/${featuredPost.slug}`} className="group">
      <article className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[16/9] md:aspect-auto">
            <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-6 lg:py-12 xl:py-24">
            <div className="mb-2 flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                            src={featuredPost.authorImage || "/placeholder.svg?height=120&width=120"}
                            alt={featuredPost.author || ""}
                  fill
                  className="object-cover"
                />
              </div>
                        <span className="text-sm text-zinc-600">{featuredPost.author}</span>
              <span className="text-sm text-zinc-400">•</span>
                        <span className="text-sm text-zinc-500">{featuredPost.date}</span>
            </div>
            <div className="mb-3 w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                        {featuredPost.category}
            </div>
                      <h2 className="mb-3 text-2xl font-bold text-zinc-900 group-hover:text-orange-500">
                        {featuredPost.title}
                      </h2>
                      <p className="mb-4 text-zinc-600">{featuredPost.excerpt}</p>
            <div className="mt-auto flex items-center gap-1 text-sm text-zinc-500">
              <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
            </div>
          </div>
        </div>
      </article>
    </Link>
            </div>
          </section>
        </div>

        {/* All Articles */}
        <div className="transition-all duration-700 opacity-0 translate-y-5 animate-section delay-200">
          <section className="jsx-b86d5aa5da73a6b5 py-8">
            <h2 className="jsx-b86d5aa5da73a6b5 mb-8 text-2xl font-bold text-zinc-900">
              Všechny články
            </h2>
            <div className="jsx-b86d5aa5da73a6b5 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`jsx-b86d5aa5da73a6b5 transform transition-all duration-500 ease-in-out hover:scale-[1.03] opacity-0 translate-y-5 article-card ${
                    index < 1 ? 'delay-100' : index < 2 ? 'delay-200' : index < 3 ? 'delay-300' : 'delay-500'
                  }`}
                >
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="h-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
        <div className="relative aspect-[16/9]">
          <Image
                          src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white inline">
              {post.category}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-full">
              <Image
                              src={post.authorImage || "/placeholder.svg?height=120&width=120"}
                              alt={post.author || ""}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-zinc-600">{post.author}</span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500">{post.date}</span>
          </div>
                        <h3 className="mb-2 text-xl font-bold text-zinc-900 group-hover:text-orange-500">
                          {post.title}
                        </h3>
          <p className="mb-4 text-sm text-zinc-600">{post.excerpt}</p>
          <div className="mt-auto flex items-center gap-1 text-sm text-zinc-500">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </div>
        </div>
      </article>
    </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Newsletter Section */}
        <div className="transition-all duration-700 opacity-0 translate-y-5 animate-section delay-300">
          <section className="jsx-b86d5aa5da73a6b5 my-12 rounded-xl bg-zinc-100 p-8">
            <div className="jsx-b86d5aa5da73a6b5 mx-auto max-w-2xl text-center">
              <h2 className="jsx-b86d5aa5da73a6b5 mb-4 text-2xl font-bold">
                Odebírejte náš newsletter
              </h2>
              <p className="jsx-b86d5aa5da73a6b5 mb-6 text-zinc-600">
                Přihlaste se k odběru našeho newsletteru a dostávejte nejnovější články a aktuální informace z oblasti správy a vymáhání pohledávek.
              </p>
              <div className="jsx-b86d5aa5da73a6b5 flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="Váš e-mail"
                  className="jsx-b86d5aa5da73a6b5 flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                />
                <Button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 whitespace-nowrap transition-all duration-300 hover:scale-105">
                  Přihlásit se
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

