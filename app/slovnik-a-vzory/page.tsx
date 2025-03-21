"use client"

import { Download, ChevronRight, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { SectionWrapper } from "@/components/section-wrapper"
import Link from "next/link"
import { useEffect, useState, useRef, useMemo } from "react"
import { useTranslations } from "@/lib/i18n"
import { sanitizeHTML } from "@/lib/utils"

// Define types for templates and dictionary items
interface TemplateItem {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  downloadOptions: { url: string; label: string }[];
  headerBackground: string;
  headerTextColor: string;
  type: string;
}

interface DictionaryItem {
  id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  letter: string;
  background: string;
  textColor: string;
  buttonColor: string;
  updateDate: string;
  detailLetter: {
    background: string;
    textColor: string;
  };
  detailContent: {
    intro: string;
    sections: {
      title: string;
      content: string;
      isList?: boolean;
      items?: {
        bold: string;
        text: string;
      }[];
    }[];
  };
}

type SearchableItem = TemplateItem | DictionaryItem;

export default function SlovnikAVzoryPage() {
  const t = useTranslations('dictionaryTemplatesPage')
  
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("vzory")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchableItem[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Define a consistent header offset to use throughout the component
  const HEADER_OFFSET = 150

  // Memoize document templates data
  const documents = useMemo<TemplateItem[]>(() => {
    return t.templates.map((template: any) => ({
      ...template,
      type: "document"
    }));
  }, [t.templates]);

  // Memoize dictionary terms data
  const dictionaryTerms = useMemo<DictionaryItem[]>(() => {
    return t.dictionaryTerms.map((term: any) => ({
      ...term,
      id: `detail-${term.id}`
    }));
  }, [t.dictionaryTerms]);

  // Memoize all searchable items
  const allItems = useMemo<SearchableItem[]>(() => {
    return [...documents, ...dictionaryTerms];
  }, [documents, dictionaryTerms]);

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const searchTermLower = searchTerm.toLowerCase()
      const matchedItems = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTermLower) || item.content.toLowerCase().includes(searchTermLower),
      )

      setSuggestions(matchedItems)
      setShowSuggestions(matchedItems.length > 0)
      setSelectedSuggestionIndex(-1)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
      setSelectedSuggestionIndex(-1)
    }
  }, [searchTerm, allItems])

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
      navigateToItem(suggestions[selectedSuggestionIndex])
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  // Navigate to an item
  const navigateToItem = (item: SearchableItem) => {
    setShowSuggestions(false)

    // Set the active tab based on the type of the item
    if (item.type === "document") {
      setActiveTab("vzory")
    } else {
      setActiveTab("slovnik")
    }

    // Wait for tab change to take effect
    setTimeout(() => {
      // Navigate to the matched item
      const element = document.getElementById(item.id)
      if (element) {
        // Get the element's position
        const elementPosition = element.getBoundingClientRect().top
        // Get the current scroll position
        const offsetPosition = elementPosition + window.pageYOffset

        // Scroll to the element with the offset
        window.scrollTo({
          top: offsetPosition - HEADER_OFFSET,
          behavior: "smooth",
        })

        // Add a highlight class
        element.classList.add("highlight-card")
        setTimeout(() => {
          element.classList.remove("highlight-card")
        }, 3000)
      }
    }, 100)
  }

  // Handle scrolling to detail section with highlight
  const scrollToDetail = (id: string) => {
    // Find the element with the matching ID
    const element = document.getElementById(id)
    if (element) {
      // Get the element's position
      const elementPosition = element.getBoundingClientRect().top
      // Get the current scroll position
      const offsetPosition = elementPosition + window.pageYOffset

      // Scroll to the element with the offset
      window.scrollTo({
        top: offsetPosition - HEADER_OFFSET,
        behavior: "smooth",
      })

      // Add a highlight class
      element.classList.add("highlight-card")
      // Remove the highlight after 3 seconds
      setTimeout(() => {
        element.classList.remove("highlight-card")
      }, 3000)
    }
  }

  // Validate search query to prevent injection attacks
  const validateSearchQuery = (query: string): string => {
    // Remove potentially dangerous characters, limit length
    return query
      .replace(/[^\w\s.,?!-]/g, '') // Only allow alphanumeric, spaces and basic punctuation
      .substring(0, 100); // Limit length to 100 characters
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate search term
    const validatedTerm = validateSearchQuery(searchTerm);
    setSearchTerm(validatedTerm);
    
    if (!validatedTerm.trim()) return

    // Search through all items
    const searchTermLower = validatedTerm.toLowerCase()
    const matchedItems = allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTermLower) || item.content.toLowerCase().includes(searchTermLower),
    )

    if (matchedItems.length > 0) {
      navigateToItem(matchedItems[0])
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    setShowSuggestions(false)
    setSuggestions([])
  }

  // Check for hash in URL and scroll to element
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get the hash from the URL
      const hash = window.location.hash
      if (hash) {
        // Find the element with the matching ID
        const element = document.getElementById(hash.substring(1))
        if (element) {
          // Determine which tab to activate based on the element ID
          if (hash.includes("detail-")) {
            setActiveTab("slovnik")
          } else {
            setActiveTab("vzory")
          }

          // Wait a moment for the page to render fully
          setTimeout(() => {
            // Get the element's position
            const elementPosition = element.getBoundingClientRect().top
            // Get the current scroll position
            const offsetPosition = elementPosition + window.pageYOffset

            // Scroll to the element with the offset
            window.scrollTo({
              top: offsetPosition - HEADER_OFFSET,
              behavior: "smooth",
            })

            // Add a highlight class
            element.classList.add("highlight-card")
            // Remove the highlight after 3 seconds
            setTimeout(() => {
              element.classList.remove("highlight-card")
            }, 3000)
          }, 500)
        }
      }
    }
  }, [])

  // Add a useEffect hook to handle the hash in the URL when the page loads
  useEffect(() => {
    // Check if there's a hash in the URL when the page loads
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1) // Remove the # character

      // Small delay to ensure the page has fully loaded
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          // Calculate position
          const rect = element.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const elementPosition = rect.top + scrollTop
          const offsetPosition = elementPosition - HEADER_OFFSET

          // Scroll to the element
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })

          // Add highlight effect
          element.classList.add("highlight-card")

          // Remove highlight after 3 seconds
          setTimeout(() => {
            element.classList.remove("highlight-card")
          }, 3000)
        }
      }, 300)
    }
  }, [])

  // Highlight matching text in suggestions with proper sanitation
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    // Sanitize the query string before using it in regex
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(`(${sanitizedQuery})`, "gi")
    return sanitizeHTML(text.replace(regex, '<mark class="bg-yellow-200 text-gray-900">$1</mark>'))
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-28">
      {/* Add a style for the highlight effect */}
      <style jsx global>{`
        .highlight-card {
          box-shadow: 0 0 0 3px #f97316, 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }
        .suggestion-item:hover {
          background-color: #f3f4f6;
        }
        .suggestion-item.selected {
          background-color: #f3f4f6;
        }
        mark {
          padding: 0;
          background-color: #fef3c7;
        }
      `}</style>

      {/* Header with background */}
      <div className="bg-zinc-800 text-white py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.header.title}</h1>
            <p className="text-lg text-zinc-300 max-w-3xl">
              {t.header.description}
            </p>
          </SectionWrapper>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <SectionWrapper animation="fade-up" delay={100} className="relative z-10">
          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="search-container">
              <form onSubmit={handleSearch} className="relative z-10">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t.search.placeholder}
                  className="pl-10 py-6 text-lg rounded-lg shadow-sm border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (!searchTerm) {
                      setSuggestions(allItems)
                      setShowSuggestions(true)
                    }
                  }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600"
                >
                  {t.search.button}
                </Button>

                {/* Search suggestions */}
                {showSuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    <ul className="py-1 text-base">
                      {suggestions.map((item, index) => (
                        <li
                          key={item.id}
                          className={`suggestion-item px-4 py-2 cursor-pointer flex items-start ${selectedSuggestionIndex === index ? "selected" : ""}`}
                          onClick={() => navigateToItem(item)}
                          onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        >
                          <div className="flex-1">
                            <div
                              className="font-medium"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(item.title, searchTerm),
                              }}
                            />
                            <div
                              className="text-sm text-gray-500 truncate"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(
                                  item.content.substring(0, 75) + (item.content.length > 75 ? "..." : ""),
                                  searchTerm,
                                ),
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 ml-2 mt-1 capitalize">
                            {t.search.typeLabels[item.type as keyof typeof t.search.typeLabels]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper animation="fade-up" delay={200}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-16">
              <TabsTrigger value="vzory" className="text-lg py-3">
                {t.tabs.templates}
              </TabsTrigger>
              <TabsTrigger value="slovnik" className="text-lg py-3">
                {t.tabs.dictionary}
              </TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="vzory">
              <div className="grid md:grid-cols-3 gap-6">
                {t.templates.map((template: any, index: number) => (
                  <Card key={index} id={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className={`${template.headerBackground} border-b h-28 flex flex-col justify-center`}>
                      <CardTitle className={`text-xl ${template.headerTextColor}`}>{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="aspect-[4/3] bg-gray-100 mb-4 rounded overflow-hidden">
                        <img
                          src={template.imageUrl}
                          alt={template.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {template.content}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-stretch gap-2">
                      {template.downloadOptions.map((option: { url: string; label: string }, idx: number) => (
                        <a 
                          key={idx}
                          href={option.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                            <Download size={16} />
                            <span>{option.label}</span>
                          </Button>
                        </a>
                      ))}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Dictionary Tab */}
            <TabsContent value="slovnik">
              <div className="space-y-8">
                {t.dictionaryTerms.map((term: any, index: number) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className={`bg-gradient-to-r ${term.background} border-b`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className={`text-2xl ${term.textColor}`}>{term.title}</CardTitle>
                          <CardDescription>{term.description}</CardDescription>
                        </div>
                        <div className={`${term.textColor} text-5xl font-bold opacity-20`}>{term.letter}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="prose prose-sm leading-normal max-w-none">
                        <h3 className="text-lg font-semibold mt-0 mb-1">{term.title}</h3>
                        <div
                          className="text-zinc-700 text-sm"
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(term.content) }}
                        />
                      </div>
                      <p className="text-sm text-gray-500">Poslední aktualizace: {term.updateDate}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="ghost"
                        className={`ml-auto flex items-center gap-1 ${term.buttonColor}`}
                        onClick={() => scrollToDetail(`detail-${term.id}`)}
                      >
                        <span>{t.readMore}</span>
                        <ChevronRight size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </SectionWrapper>

        {/* Call to action */}
        <SectionWrapper animation="fade-up" delay={300} className="mt-16">
          <div className="bg-zinc-800 text-white rounded-xl p-8 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.cta.title}</h2>
            <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
              {t.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/poptavka">
                <Button
                  size="lg"
                  className="bg-orange-500 text-white font-semibold transition-all duration-500 hover:scale-[1.04] relative overflow-hidden group shadow-xl shadow-orange-500/20"
                  style={{
                    background: "radial-gradient(ellipse at 50% 125%, hsl(17, 88%, 40%) 20%, hsl(27, 96%, 61%) 80%)",
                    backgroundPosition: "bottom",
                    backgroundSize: "150% 100%",
                  }}
                >
                  <div
                    className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{t.cta.button}</span>
                </Button>
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </div>

      {/* Detailed dictionary section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <SectionWrapper animation="fade-up">
            <h2 className="text-3xl font-bold mb-12 text-center">{t.detailedDictionary.title}</h2>

            <div className="max-w-4xl mx-auto">
              {t.dictionaryTerms.map((term: any, index: number) => (
                <div 
                  key={index} 
                  id={`detail-${term.id}`} 
                  className="bg-white rounded-lg shadow-md p-8 mb-8"
                >
                  <div className="flex items-center mb-6">
                    <div className={`${term.detailLetter.background} ${term.detailLetter.textColor} text-3xl font-bold w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
                      {term.letter}
                    </div>
                    <h3 className="text-2xl font-bold">{term.title}</h3>
                  </div>

                  <div className="prose max-w-none">
                    <p>
                      {term.detailContent.intro}
                    </p>

                    {term.detailContent.sections.map((section: any, idx: number) => (
                      <div key={idx}>
                        {section.title && <h4>{section.title}</h4>}
                        
                        {section.isList ? (
                          <ul>
                            {section.items.map((item: { bold: string; text: string }, itemIdx: number) => (
                              <li key={itemIdx}>
                                <strong>{item.bold}</strong>{item.text}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>{section.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </div>
    </div>
  )
}

