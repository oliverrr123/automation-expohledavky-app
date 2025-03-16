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
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
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
    
    // Řazení podle data
    filtered = filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
    })
    
    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-white">
      <Header isLandingPage={false} />
      
      {/* Hero section - upraveno pro lepší responsivitu */}
      <section className="pt-28 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 pb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
            Náš blog
          </h1>
          <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-8">
            Aktualizovaný blog o správě, odkupu a vymáhání pohledávek. Najdete zde
            odborné články s praktickými radami pro firmy
            a podnikatele v českém právním prostředí.
          </p>
          
          {/* Vyhledávací formulář - upraveno pro lepší responsivitu */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input
              type="search"
              placeholder="Hledat články..."
              className="bg-white/10 border-white/20 pl-10 text-white placeholder:text-zinc-400 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            )}
          </div>
        </div>
        
        {/* Vlnitá čára - upraveno pro lepší responsivitu */}
        <div className="w-full overflow-hidden">
          <svg
            className="w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Procházet podle kategorií - upraveno pro lepší responzivitu */}
      <section className="bg-orange-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-8 text-center">
            Procházet podle kategorií
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/ /g, "-")}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleCategorySelect(category)
                }}
                className={`flex items-center justify-center px-6 py-4 rounded-full border-2 transition-colors ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-zinc-800 border-orange-200 hover:border-orange-500"
                }`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Seznam článků - upraveno pro lepší responzivitu */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filtry a řazení */}
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              {selectedCategory && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-900 border-orange-200"
                >
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("")} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500">Řadit podle:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                className="border rounded px-2 py-1 text-sm text-zinc-800"
              >
                <option value="newest">Nejnovější</option>
                <option value="oldest">Nejstarší</option>
              </select>
            </div>
          </div>

          {/* Seznam článků - upravená grid struktura pro lepší responzivitu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.slug} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-orange-500 hover:bg-orange-600">{post.category}</Badge>
                    </div>
                  </div>
                  <CardHeader className="flex-grow">
                    <div className="flex items-center gap-4 text-sm text-zinc-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl leading-tight mb-2 font-bold transition-colors hover:text-orange-600">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <p className="text-sm text-zinc-600 line-clamp-3">{post.excerpt}</p>
                  </CardHeader>
                  <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-orange-50 hover:bg-orange-100" onClick={() => filterByTag(tag)}>
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="bg-gray-50">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </CardFooter>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button variant="link" asChild className="p-0 text-orange-600 font-semibold">
                      <Link href={`/blog/${post.slug}`}>
                        Číst více
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-12">
                <p className="text-lg text-zinc-500">
                  Žádné články neodpovídají vašemu vyhledávání. Zkuste jiné klíčové slovo nebo kategorii.
                </p>
              </div>
            )}
          </div>

          {/* Stránkování - upraveno pro lepší responsivitu */}
          {filteredPosts.length > 0 && (
            <div className="mt-12 flex justify-center">
              <nav aria-label="Pagination" className="inline-flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Předchozí
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
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

