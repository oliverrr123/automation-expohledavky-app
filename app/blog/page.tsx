"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
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
import { SectionWrapper } from "@/components/section-wrapper"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<BlogPost[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState("")

  const allPosts = useRef(blogPosts).current

  // Calculate category counts based on actual data
  const categories = useMemo(() => {
    // Create a map to count posts by category slug
    const categoryCounts = new Map<string, number>()

    // Count posts for each category
    allPosts.forEach((post) => {
      if (post.category) {
        const categorySlug = post.category
          .toLowerCase()
          .replace(/\s+/g, "-")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
        const currentCount = categoryCounts.get(categorySlug) || 0
        categoryCounts.set(categorySlug, currentCount + 1)
      }
    })

    // Create the categories array with real counts
    return categoryDefinitions.map((category: Category) => ({
      ...category,
      count: category.slug === "" ? allPosts.length : categoryCounts.get(category.slug) || 0,
    }))
  }, [allPosts])

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const searchTermLower = searchTerm.toLowerCase().trim()
      const matchedItems = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTermLower) ||
          post.excerpt.toLowerCase().includes(searchTermLower) ||
          post.category?.toLowerCase().includes(searchTermLower) ||
          post.author?.toLowerCase().includes(searchTermLower),
      )

      setSuggestions(matchedItems)
      setShowSuggestions(matchedItems.length > 0)
      setSelectedSuggestionIndex(-1)
    } else if (showSuggestions) {
      // If the search field is empty but suggestions should be shown (on focus)
      setSuggestions(allPosts)
    }
  }, [searchTerm, allPosts, showSuggestions])

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
    setSearchTerm("")
    window.location.href = `/blog/${post.slug}`
  }

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!searchTerm.trim()) {
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    setShowSuggestions(false)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    setShowSuggestions(false)
    setSuggestions([])
    setIsSearching(false)
  }

  // Handle focus on search input
  const handleFocus = () => {
    // Show all posts as suggestions when the field is focused
    setSuggestions(allPosts)
    setShowSuggestions(true)
  }

  // Highlight matching text in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    return text.replace(regex, '<mark class="px-0.5">$1</mark>')
  }

  useEffect(() => {
    // Set loaded state after a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) {
      return allPosts // Return all posts for "All articles" view
    }

    // For specific category
    return allPosts.filter((post) => {
      const postCategorySlug = post.category
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
      return postCategorySlug === selectedCategory
    })
  }, [selectedCategory, allPosts])

  // Get featured post (first post in the list)
  const featuredPost = allPosts[0]

  // Only show featured post separately on the "Všechny články" view
  const showFeaturedPost = selectedCategory === ""

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-28">
      {/* Add a style for the highlight effect */}
      <style jsx global>{`
        .suggestion-item:hover mark {
          background-color: rgba(249, 115, 22, 0.4);
          color: white;
        }
        .suggestion-item.selected mark {
          background-color: rgba(249, 115, 22, 0.4);
          color: white;
        }
        mark {
          padding: 0;
          background-color: rgba(249, 115, 22, 0.3);
          color: white;
          border-radius: 2px;
        }
      `}</style>

      {/* Hero Section with fade-in animation */}
      <section
        className={`bg-zinc-900 py-16 text-white transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              <span className="text-white">EX</span>
              <span className="text-orange-500">POHLEDÁVKY</span>
            </h1>
            <h2 className="mb-6 text-xl font-medium md:text-2xl">Odborný portál o správě a vymáhání pohledávek</h2>
            <p className="mb-8 text-gray-200">
              Vítejte na našem blogu věnovaném správě, odkupu a vymáhání pohledávek. Najdete zde odborné články s
              praktickými radami pro firmy a podnikatele v českém právním prostředí.
            </p>

            {/* Search Bar with subtle animation */}
            <div
              className="mx-auto mb-8 max-w-xl transform transition-all duration-500 ease-in-out hover:scale-[1.02]"
              style={{ position: "relative", zIndex: "10" }}
            >
              <div className="relative">
                <form onSubmit={handleSearch} className="relative z-[100]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white z-20" size={20} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Hledat články..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    className="w-full rounded-full border-0 bg-white/10 px-5 pl-10 py-3 text-white placeholder-gray-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      <X size={18} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 p-2 text-white hover:bg-orange-600 transition-colors duration-300"
                  >
                    <Search className="h-5 w-5" />
                  </button>

                  {/* Search suggestions */}
                  {showSuggestions && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-[100] mt-2 w-full bg-zinc-800/95 backdrop-blur-sm rounded-xl shadow-lg max-h-80 overflow-auto border border-zinc-700 transition-all duration-300"
                      style={{ transform: "translateY(4px)" }}
                    >
                      <div className="py-2 px-2">
                        <ul className="space-y-1">
                          {suggestions.map((post, index) => (
                            <li
                              key={post.id}
                              className={`suggestion-item px-3 py-2 cursor-pointer flex items-start rounded-lg transition-all duration-200 ${
                                selectedSuggestionIndex === index
                                  ? "bg-orange-500/20 text-white"
                                  : "hover:bg-zinc-700/50"
                              }`}
                              onClick={() => navigateToPost(post)}
                              onMouseEnter={() => setSelectedSuggestionIndex(index)}
                            >
                              <div className="flex-1 min-w-0 mr-2">
                                <div
                                  className={`font-medium text-left truncate ${selectedSuggestionIndex === index ? "text-white" : "text-zinc-200"}`}
                                  dangerouslySetInnerHTML={{
                                    __html: highlightMatch(post.title, searchTerm),
                                  }}
                                />
                                <div
                                  className="text-sm text-zinc-400 truncate text-left mt-1"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightMatch(
                                      post.excerpt.substring(0, 75) + (post.excerpt.length > 75 ? "..." : ""),
                                      searchTerm,
                                    ),
                                  }}
                                />
                              </div>
                              <span className="text-xs bg-orange-500/20 text-orange-300 rounded-full px-2 py-0.5 ml-auto flex-shrink-0 whitespace-nowrap">
                                {post.category}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <Link href="/o-nas">Více o nás</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Search Results */}
        {isSearching && (
          <div className="my-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">
                  {suggestions.length > 0
                    ? `Výsledky vyhledávání (${suggestions.length})`
                    : "Žádné výsledky nenalezeny"}
                </h2>
                <Button variant="ghost" size="sm" onClick={clearSearch} className="text-zinc-500 hover:text-zinc-700">
                  Zrušit vyhledávání
                </Button>
              </div>

              {suggestions.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((post) => (
                    <div key={post.id} className="transform transition-all duration-500 ease-in-out hover:scale-[1.03]">
                      <ArticleCard post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-600 mb-4">Zkuste upravit vyhledávací dotaz nebo procházet kategorie níže.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category: Category) => (
                      <button
                        key={category.slug}
                        onClick={() => setSelectedCategory(category.slug)}
                        className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 hover:bg-orange-200 transition-colors"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Only show regular content when not searching */}
        {!isSearching && (
          <>
            {/* Categories Navigation with horizontal scroll animation */}
            <div className="my-8 overflow-x-auto relative">
              <div className="flex gap-4 whitespace-nowrap pb-2">
                {categories.map((category: Category, index: number) => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      category.slug === selectedCategory
                        ? "bg-orange-500 text-white"
                        : "bg-white text-zinc-700 hover:bg-orange-100"
                    }`}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                      opacity: isLoaded ? 1 : 0,
                      transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                    }}
                  >
                    {category.name} <span className="ml-1 text-xs opacity-70">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Latest Article Section with fade-up animation - only shown on "Všechny články" */}
            {showFeaturedPost && (
              <SectionWrapper animation="fade-up">
                <section className="py-8">
                  <h2 className="mb-8 text-2xl font-bold text-zinc-900">Nejnovější článek</h2>
                  <div className="transform transition-all duration-500 ease-in-out hover:scale-[1.01]">
                    <FeaturedArticle post={featuredPost} />
                  </div>
                </section>
              </SectionWrapper>
            )}

            {/* All Articles Section with staggered fade-up animations */}
            <SectionWrapper animation="fade-up" delay={200}>
              <section className="py-8">
                <h2 className="mb-8 text-2xl font-bold text-zinc-900">
                  {selectedCategory
                    ? categories.find((c: Category) => c.slug === selectedCategory)?.name || "Články"
                    : "Všechny články"}
                </h2>
                {filteredPosts.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className="transform transition-all duration-500 ease-in-out hover:scale-[1.03]"
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <ArticleCard post={post} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <p className="text-zinc-600">Žádné články v této kategorii.</p>
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Zobrazit všechny články
                    </button>
                  </div>
                )}
              </section>
            </SectionWrapper>

            {/* Newsletter Section with fade-left animation */}
            <SectionWrapper animation="fade-left" delay={300}>
              <section className="my-12 rounded-xl bg-zinc-100 p-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="mb-4 text-2xl font-bold">Odebírejte náš newsletter</h2>
                  <p className="mb-6 text-zinc-600">
                    Přihlaste se k odběru našeho newsletteru a dostávejte nejnovější články a aktuální informace z
                    oblasti správy a vymáhání pohledávek.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <input
                      type="email"
                      placeholder="Váš e-mail"
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                    />
                    <Button className="whitespace-nowrap transition-all duration-300 hover:scale-105">
                      Přihlásit se
                    </Button>
                  </div>
                </div>
              </section>
            </SectionWrapper>
          </>
        )}
      </div>
    </div>
  )
}

function FeaturedArticle({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[16/9] md:aspect-auto">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center p-6 lg:py-12 xl:py-24">
            <div className="mb-2 flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={post.authorImage || "/placeholder.svg"}
                  alt={post.author || "Autor"}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-zinc-600">{post.author}</span>
              <span className="text-sm text-zinc-400">•</span>
              <span className="text-sm text-zinc-500">{post.date}</span>
            </div>

            <div className="mb-3 w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
              {post.category}
            </div>

            <h2 className="mb-3 text-2xl font-bold text-zinc-900 group-hover:text-orange-500">{post.title}</h2>
            <p className="mb-4 text-zinc-600">{post.excerpt}</p>

            <div className="mt-auto flex items-center gap-1 text-sm text-zinc-500">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="h-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
        <div className="relative aspect-[16/9]">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
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
                src={post.authorImage || "/placeholder.svg"}
                alt={post.author || "Autor"}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-zinc-600">{post.author}</span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500">{post.date}</span>
          </div>

          <h3 className="mb-2 text-xl font-bold text-zinc-900 group-hover:text-orange-500">{post.title}</h3>
          <p className="mb-4 text-sm text-zinc-600">{post.excerpt}</p>

          <div className="mt-auto flex items-center gap-1 text-sm text-zinc-500">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </div>
        </div>
      </article>
    </Link>
  )
}

