"use client"

import React, { useState, useEffect } from "react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  
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
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            
            {/* Vylepšený vyhledávací formulář */}
            <div className="relative max-w-2xl mx-auto group animate-fade-in-up" style={{animationDelay: "0.3s"}}>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full opacity-80 blur-xl group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative bg-zinc-800/80 backdrop-blur-sm rounded-full border border-orange-600/30 shadow-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-orange-400" />
                <Input
                  type="search"
                  placeholder="Hledat články..."
                  className="bg-transparent border-transparent pl-16 pr-16 py-8 text-lg text-white placeholder:text-zinc-400 w-full rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Procházet podle kategorií - vylepšený design */}
      <section className="bg-gradient-to-b from-white to-orange-50/30 py-16 relative">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoaded ? (
              filteredPosts
                .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                .map((post) => (
                  <Card key={post.slug} className="group overflow-hidden flex flex-col h-full border-none rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                    <Link href={`/blog/${post.slug}`} className="relative block h-52 overflow-hidden">
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

                    <CardHeader className="flex-grow">
                      <div className="flex items-center gap-4 text-sm text-zinc-500 mb-3">
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
                        <CardTitle className="text-xl font-bold text-zinc-900 group-hover:text-orange-600 transition-colors mb-2">
                          {post.title}
                        </CardTitle>
                      </Link>

                      <p className="text-zinc-600 text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault()
                              filterByTag(tag)
                            }}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </CardHeader>

                    <CardFooter className="pt-4 border-t border-zinc-100">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Přečíst článek
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              // Loading stav
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-zinc-100 animate-pulse rounded-xl h-[400px]"
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
    </div>
  )
}

