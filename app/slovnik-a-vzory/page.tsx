"use client"

import { Download, ChevronRight, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { SectionWrapper } from "@/components/section-wrapper"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

export default function SlovnikAVzoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("vzory")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Define a consistent header offset to use throughout the component
  const HEADER_OFFSET = 150

  // Document templates data
  const documents = [
    {
      id: "smenka-bez-protestu",
      title: "Směnka bez protestu",
      description: "Vzor ke stažení zdarma",
      content:
        "Vzor směnky bez protestu ke stažení zdarma. Náhled vyplněné směnky včetně prázdného vzoru pro stažení a vyplnění.",
      type: "document",
    },
    {
      id: "smlouva-o-zapujcce",
      title: "Smlouva o zápůjčce",
      description: "Vzor ke stažení zdarma",
      content:
        "Vzor smlouvy o zápůjčce ke stažení zdarma. Dokument je připraven k vyplnění a použití pro vaše potřeby.",
      type: "document",
    },
    {
      id: "uznani-dluhu",
      title: "Uznání dluhu a dohoda o splátkách",
      description: "Vzor ke stažení zdarma",
      content:
        "Vzor uznání dluhu a dohody o splátkách ke stažení zdarma. Náhled vyplněného dokumentu včetně prázdného vzoru.",
      type: "document",
    },
  ]

  // Dictionary terms data
  const dictionaryTerms = [
    {
      id: "detail-pohledavka",
      title: "Pohledávka",
      description: "Co je to pohledávka?",
      content:
        "Pohledávka je právo věřitele (fyzické či právnické osoby) požadovat na dlužníkovi plnění vzniklé z určitého závazku. Pohledávka může být peněžitá i nepeněžitá.",
      type: "dictionary",
    },
    {
      id: "detail-smenka",
      title: "Směnka",
      description: "Co je to směnka?",
      content:
        "Směnka je cenný papír obsahující bezpodmínečný platební příkaz nebo slib zaplatit určitou částku. Existuje několik druhů směnek, jako je zajišťovací směnka, směnka vlastní, směnka cizí a další.",
      type: "dictionary",
    },
    {
      id: "detail-prevzeti-dluhu",
      title: "Převzetí dluhu",
      description: "Co znamená převzetí dluhu?",
      content:
        "Převzetí dluhu je právní institut, kdy třetí osoba přebírá dluh od původního dlužníka. K převzetí dluhu je potřeba souhlas věřitele.",
      type: "dictionary",
    },
  ]

  // All searchable items
  const allItems = [...documents, ...dictionaryTerms]

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
  }, [searchTerm])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
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
  const handleKeyDown = (e) => {
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
  const navigateToItem = (item) => {
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
  const scrollToDetail = (id) => {
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

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) return

    // Search through all items
    const searchTermLower = searchTerm.toLowerCase()
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

  // Highlight matching text in suggestions
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    return text.replace(regex, '<mark class="bg-yellow-200 text-gray-900">$1</mark>')
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Slovník a vzory</h1>
            <p className="text-lg text-zinc-300 max-w-3xl">
              Přinášíme vám užitečné informace o právních pojmech z oblasti pohledávek a vzory dokumentů ke stažení
              zdarma.
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
                  placeholder="Hledat pojmy a vzory..."
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
                  Hledat
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
                            {item.type === "document" ? "Vzor" : "Pojem"}
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
                Vzory ke stažení
              </TabsTrigger>
              <TabsTrigger value="slovnik" className="text-lg py-3">
                Slovník pojmů
              </TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="vzory">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Směnka bez protestu */}
                <Card id="smenka-bez-protestu" className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-orange-50 border-b h-28 flex flex-col justify-center">
                    <CardTitle className="text-xl text-orange-700">Směnka bez protestu</CardTitle>
                    <CardDescription>Vzor ke stažení zdarma</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="aspect-[4/3] bg-gray-100 mb-4 rounded overflow-hidden">
                      <img
                        src="https://expohledavky.cz/uploads/vzory/smenka-bez-protestu.jpg"
                        alt="Směnka bez protestu"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Vzor směnky bez protestu ke stažení zdarma. Náhled vyplněné směnky včetně prázdného vzoru pro
                      stažení a vyplnění.
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch gap-2">
                    <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                      <Download size={16} />
                      <span>Stáhnout DOC</span>
                    </Button>
                    <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                      <Download size={16} />
                      <span>Stáhnout PDF</span>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Smlouva o zápůjčce */}
                <Card id="smlouva-o-zapujcce" className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-blue-50 border-b h-28 flex flex-col justify-center">
                    <CardTitle className="text-xl text-blue-700">Smlouva o zápůjčce</CardTitle>
                    <CardDescription>Vzor ke stažení zdarma</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="aspect-[4/3] bg-gray-100 mb-4 rounded overflow-hidden">
                      <img
                        src="https://expohledavky.cz/uploads/vzory/smlouva-o-zapujcce.jpg"
                        alt="Smlouva o zápůjčce"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Vzor smlouvy o zápůjčce ke stažení zdarma. Dokument je připraven k vyplnění a použití pro vaše
                      potřeby.
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch gap-2">
                    <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                      <Download size={16} />
                      <span>Stáhnout DOC</span>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Uznání dluhu a dohoda o splátkách */}
                <Card id="uznani-dluhu" className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-green-50 border-b h-28 flex flex-col justify-center">
                    <CardTitle className="text-xl text-green-700">Uznání dluhu a dohoda o splátkách</CardTitle>
                    <CardDescription>Vzor ke stažení zdarma</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="aspect-[4/3] bg-gray-100 mb-4 rounded overflow-hidden">
                      <img
                        src="https://expohledavky.cz/uploads/vzory/uznani-dluhu-a-dohoda-o-splatkach-k-vyplneni.jpg"
                        alt="Uznání dluhu a dohoda o splátkách"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Vzor uznání dluhu a dohody o splátkách ke stažení zdarma. Náhled vyplněného dokumentu včetně
                      prázdného vzoru.
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch gap-2">
                    <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                      <Download size={16} />
                      <span>Stáhnout DOC</span>
                    </Button>
                    <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                      <Download size={16} />
                      <span>Stáhnout PDF</span>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Dictionary Tab */}
            <TabsContent value="slovnik">
              <div className="space-y-8">
                {/* Pohledávka */}
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl text-orange-700">Pohledávka</CardTitle>
                        <CardDescription>Co je to pohledávka?</CardDescription>
                      </div>
                      <div className="text-orange-500 text-5xl font-bold opacity-20">P</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      <p>
                        <strong>Pohledávka</strong> je právo <strong>věřitele</strong> (fyzické či právnické osoby)
                        požadovat na <strong>dlužníkovi</strong> plnění vzniklé z určitého závazku. Pohledávka může být
                        peněžitá i nepeněžitá.
                      </p>
                      <p className="text-sm text-gray-500">Poslední aktualizace: 12.10.2021</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="ml-auto flex items-center gap-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                      onClick={() => scrollToDetail("detail-pohledavka")}
                    >
                      <span>Číst více</span>
                      <ChevronRight size={16} />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Směnka */}
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl text-blue-700">Směnka</CardTitle>
                        <CardDescription>Co je to směnka?</CardDescription>
                      </div>
                      <div className="text-blue-500 text-5xl font-bold opacity-20">S</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      <p>
                        Směnka je cenný papír obsahující bezpodmínečný platební příkaz nebo slib zaplatit určitou
                        částku. Existuje několik druhů směnek, jako je zajišťovací směnka, směnka vlastní, směnka cizí a
                        další.
                      </p>
                      <p className="text-sm text-gray-500">Poslední aktualizace: 12.10.2021</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="ml-auto flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => scrollToDetail("detail-smenka")}
                    >
                      <span>Číst více</span>
                      <ChevronRight size={16} />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Převzetí dluhu */}
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl text-green-700">Převzetí dluhu</CardTitle>
                        <CardDescription>Co znamená převzetí dluhu?</CardDescription>
                      </div>
                      <div className="text-green-500 text-5xl font-bold opacity-20">P</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      <p>
                        Převzetí dluhu je právní institut, kdy třetí osoba přebírá dluh od původního dlužníka. K
                        převzetí dluhu je potřeba souhlas věřitele.
                      </p>
                      <p className="text-sm text-gray-500">Poslední aktualizace: 12.10.2021</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="ml-auto flex items-center gap-1 text-green-600 hover:text-green-800 hover:bg-green-50"
                      onClick={() => scrollToDetail("detail-prevzeti-dluhu")}
                    >
                      <span>Číst více</span>
                      <ChevronRight size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </SectionWrapper>

        {/* Call to action */}
        <SectionWrapper animation="fade-up" delay={300} className="mt-16">
          <div className="bg-zinc-800 text-white rounded-xl p-8 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Potřebujete pomoc s vašimi pohledávkami?</h2>
            <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
              Naši specialisté vám rádi pomohou s řešením vašich pohledávek. Kontaktujte nás pro nezávaznou konzultaci.
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
                  <span className="relative z-10">Kontaktujte nás</span>
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
            <h2 className="text-3xl font-bold mb-12 text-center">Podrobný slovník pojmů</h2>

            <div className="max-w-4xl mx-auto">
              <div id="detail-pohledavka" className="bg-white rounded-lg shadow-md p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-100 text-orange-700 text-3xl font-bold w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    P
                  </div>
                  <h3 className="text-2xl font-bold">Pohledávka</h3>
                </div>

                <div className="prose max-w-none">
                  <p>
                    <strong>Pohledávka</strong> je právo <strong>věřitele</strong> (fyzické či právnické osoby)
                    požadovat na <strong>dlužníkovi</strong> plnění vzniklé z určitého závazku. Pohledávka může být
                    peněžitá i nepeněžitá. Věřitel má v době splatnosti právo vymáhat pohledávku po dlužníkovi a ten má
                    povinnost tento závazek vůči věřiteli vyrovnat.
                  </p>

                  <h4>Jaký je rozdíl mezi pohledávkou a dluhem?</h4>
                  <p>
                    Pohledávka je vlastně právo plnění plynoucí z určitého závazku, které má určitá osoba (
                    <strong>věřitel</strong>) vůči jinému účastníkovi závazku (<strong>dlužníkovi</strong>). Naopak
                    proti pohledávce stojí takzvaný dluh – tedy povinnost účastníka závazku něco dát, něčeho se zdržet,
                    něco udělat či něco strpět.
                  </p>

                  <h4>Typy pohledávek dle doby splatnosti</h4>
                  <ul>
                    <li>
                      <strong>Krátkodobá pohledávka</strong> je splatná do 12 měsíců.
                    </li>
                    <li>
                      <strong>Dlouhodobá pohledávka</strong> má dobu splatnosti delší než 12 měsíců.
                    </li>
                  </ul>
                </div>

                <Button
                  variant="ghost"
                  className="mt-4 text-orange-600 hover:text-orange-800 hover:bg-orange-50 flex items-center gap-1"
                >
                  <span>Zobrazit celý článek</span>
                  <ChevronRight size={16} />
                </Button>
              </div>

              <div id="detail-smenka" className="bg-white rounded-lg shadow-md p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 text-blue-700 text-3xl font-bold w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    S
                  </div>
                  <h3 className="text-2xl font-bold">Směnka</h3>
                </div>

                <div className="prose max-w-none">
                  <p>
                    Směnka je cenný papír obsahující bezpodmínečný platební příkaz nebo slib zaplatit určitou částku.
                  </p>

                  <h4>Zajišťovací směnka</h4>
                  <p>
                    Směnka může sloužit i jako zajištění peněžitého závazku a je možno ji uplatnit poté, co povinnost na
                    základně původního peněžitého závazku nebyla splněna.
                  </p>

                  <h4>Směnka vlastní</h4>
                  <p>
                    Tvořena na základně dvou směnečných účastníků – emitent (výstavce) a remitent (osoba, na jejíž řad
                    nebo jméno je směnka vydána). Obsahuje bezpodmínečný platební slib („Zaplatím").
                  </p>
                </div>

                <Button
                  variant="ghost"
                  className="mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
                >
                  <span>Zobrazit celý článek</span>
                  <ChevronRight size={16} />
                </Button>
              </div>

              <div id="detail-prevzeti-dluhu" className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 text-green-700 text-3xl font-bold w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    P
                  </div>
                  <h3 className="text-2xl font-bold">Převzetí dluhu</h3>
                </div>

                <div className="prose max-w-none">
                  <p>
                    Převzetí dluhu je právní institut, kdy třetí osoba přebírá dluh od původního dlužníka. K převzetí
                    dluhu je potřeba souhlas věřitele.
                  </p>

                  <p>
                    Obsah této stránky je momentálně ve výstavbě. Brzy zde naleznete podrobné informace o převzetí
                    dluhu.
                  </p>
                </div>

                <Button
                  variant="ghost"
                  className="mt-4 text-green-600 hover:text-green-800 hover:bg-green-50 flex items-center gap-1"
                >
                  <span>Zobrazit celý článek</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </div>
    </div>
  )
}

