"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ArrowRight, Calendar, Clock, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const blogPosts: BlogPost[
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
  }
] = [
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
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Simulace načítání
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Filtrování článků podle vyhledávání a kategorie
  useEffect(() => {
    let result = blogPosts

    // Filtrování podle vyhledávání
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.subtitle.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filtrování podle kategorie
    if (selectedCategory) {
      result = result.filter(post => post.category === selectedCategory)
    }

    setFilteredPosts(result)
  }, [searchQuery, selectedCategory])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Tmavý header */}
      <div className="bg-gradient-to-b from-black to-zinc-900 text-white pb-24 pt-40">
        <div className="container mx-auto px-4 flex flex-col justify-center min-h-[350px]">
          {/* Header content */}
          <div className="text-center">
            <h1 className="mb-8 text-5xl font-bold md:text-6xl">
              <span className="text-white">EX</span>
              <span className="text-orange-500">POHLEDÁVKY</span>
            </h1>
            <h2 className="mb-6 text-xl font-medium md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
              Odborný portál o správě a vymáhání pohledávek
            </h2>
            <p className="mb-12 mx-auto max-w-2xl text-zinc-300">
              Vítejte na našem blogu věnovaném správě, odkupu a vymáhání pohledávek. 
              Najdete zde odborné články s praktickými radami pro firmy a podnikatele v českém právním prostředí.
            </p>

            {/* Search Bar */}
            <div className={`mx-auto relative max-w-xl transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <div className={`absolute left-0 top-0 w-full h-full rounded-full bg-orange-500/20 blur-md transition-opacity duration-300 ${isSearchFocused ? 'opacity-100' : 'opacity-0'}`}></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500" />
                <Input
                  type="text"
                  placeholder="Hledat články..."
                  className="pl-12 py-7 bg-white/10 backdrop-blur-sm border-zinc-700 text-white rounded-full focus:border-orange-500 focus:ring-orange-500 shadow-lg"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white hover:bg-orange-500/20 rounded-full h-8 w-8 flex items-center justify-center"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vlnitá oddělující linie mezi headerem a obsahem */}
      <div className="bg-white relative -mt-16 z-10">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-orange-50">
          <path d="M0,32L60,42.7C120,53,240,75,360,69.3C480,64,600,32,720,32C840,32,960,64,1080,64C1200,64,1320,32,1380,16L1440,0L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>

      {/* Světlý obsah stránky */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        {/* Procházet podle kategorií - nadpis */}
        <h3 className="text-center text-2xl font-bold text-orange-700 mb-8">Procházet podle kategorií</h3>
        
        {/* Kategorie (horizontální výběr) */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <Badge 
              key={category}
              className={`cursor-pointer px-5 py-2.5 text-sm transition-all duration-300 shadow-sm ${
                selectedCategory === category 
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20" 
                  : "bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 hover:shadow-md"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {!isLoaded ? (
          // Loading skeleton
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-orange-50 rounded-lg overflow-hidden shadow-md">
                <div className="h-48 w-full bg-orange-100 animate-pulse" />
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-orange-100 rounded animate-pulse" />
                  <div className="h-4 w-full bg-orange-100 rounded animate-pulse mt-3" />
                  <div className="h-4 w-full bg-orange-100 rounded animate-pulse mt-2" />
                  <div className="h-4 w-2/3 bg-orange-100 rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          // Žádné výsledky
          <div className="mt-10 rounded-lg bg-orange-50 p-8 text-center shadow-md">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <Search className="h-10 w-10 text-orange-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-800">Žádné články nebyly nalezeny</h3>
            <p className="mb-6 text-zinc-600">
              Zkuste upravit své vyhledávání pro zobrazení relevantních článků.
            </p>
            <Button onClick={handleClearSearch} className="bg-orange-500 hover:bg-orange-600 text-white">Vyčistit vyhledávání</Button>
          </div>
        ) : (
          // Seznam článků
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <Card 
                  className="group overflow-hidden bg-white border-orange-100 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-orange-200/50 h-full cursor-pointer"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <Badge className="absolute left-3 top-3 bg-orange-500 text-white hover:bg-orange-600">
                      {post.category}
                    </Badge>
                  </div>

                  <CardHeader className="pt-5 pb-2">
                    <CardTitle className="text-zinc-800 line-clamp-2 transition-colors group-hover:text-orange-600">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="line-clamp-2 text-zinc-600">{post.subtitle}</p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t border-orange-100 pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-orange-500" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-orange-500" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="text-orange-500 hover:text-orange-700 text-sm flex items-center">
                      Číst článek <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

