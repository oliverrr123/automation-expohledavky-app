"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, Tag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

type PostSuggestion = {
  slug: string;
  locale: string;
  frontMatter: {
    title: string;
    description?: string;
    category?: string;
    date: string;
    tags?: string[];
    image?: string;
  };
};

export default function SearchBox({ 
  locale, 
  initialQuery = "",
  placeholderText = "Hledat články...",
}: { 
  locale: string;
  initialQuery?: string;
  placeholderText?: string;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<PostSuggestion[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [popularArticles, setPopularArticles] = useState<PostSuggestion[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Načíst populární články při inicializaci komponenty
  useEffect(() => {
    const fetchPopularArticles = async () => {
      setIsLoadingPopular(true);
      try {
        const response = await fetch(`/api/popular-articles?locale=${locale}`);
        if (!response.ok) throw new Error('Failed to load popular articles');
        
        const data = await response.json();
        setPopularArticles(data.results);
      } catch (error) {
        console.error('Error fetching popular articles:', error);
        setPopularArticles([]);
      } finally {
        setIsLoadingPopular(false);
      }
    };
    
    fetchPopularArticles();
  }, [locale]);
  
  // Fetch suggestions when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(isFocused); // Zobrazit populární články, pokud je input zaměřen
      return;
    }
    
    const fetchSuggestions = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setSuggestions(data.results);
        setShowSuggestions(isFocused || data.results.length > 0);
        setSelectedSuggestionIndex(-1);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, locale, isFocused]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
    }
  };
  
  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };
  
  // Handle input blur
  const handleBlur = () => {
    // Nezavírat automaticky, to se bude řešit přes kliknutí mimo
    // setIsFocused(false);
    // setShowSuggestions(false);
  };
  
  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    
    const items = searchQuery.trim() ? suggestions : popularArticles;
    
    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => 
        prev < items.length - 1 ? prev + 1 : prev
      );
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => 
        prev > 0 ? prev - 1 : 0
      );
    }
    // Enter
    else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      navigateToPost(items[selectedSuggestionIndex]);
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false);
      setIsFocused(false);
      searchInputRef.current?.blur();
    }
  };
  
  // Navigate to post
  const navigateToPost = (post: PostSuggestion) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setIsFocused(false);
    
    const articleUrl = post.locale === locale 
      ? `/blog/${post.slug}` 
      : `/${post.locale}/blog/${post.slug}`;
      
    router.push(articleUrl);
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Highlight matching text in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    
    try {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      const parts = text.split(regex);
      
      return parts.map((part, index) => 
        regex.test(part) ? 
          <mark key={index} className="bg-orange-600 text-white font-bold px-1 py-0.5 rounded">{part}</mark> : 
          <span key={index}>{part}</span>
      );
    } catch (error) {
      return text;
    }
  };
  
  // Get flag emoji based on locale
  const getLocaleFlag = (postLocale: string) => {
    if (postLocale === 'cs') return '🇨🇿';
    if (postLocale === 'sk') return '🇸🇰';
    if (postLocale === 'de') return '🇩🇪';
    if (postLocale === 'en') return '🇬🇧';
    return '';
  };
  
  // Format date based on locale
  const formatDate = (dateString: string, postLocale = locale) => {
    return new Date(dateString).toLocaleDateString(
      postLocale === 'cs' ? 'cs-CZ' :
      postLocale === 'sk' ? 'sk-SK' :
      postLocale === 'de' ? 'de-DE' :
      'en-US',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
  };
  
  // Překlad pro nadpis populárních článků
  const getPopularArticlesTitle = () => {
    switch (locale) {
      case 'cs': return 'Populární články';
      case 'sk': return 'Populárne články';
      case 'de': return 'Beliebte Artikel';
      case 'en': return 'Popular articles';
      default: return 'Populární články';
    }
  };
  
  // Add styles for search suggestions
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .search-suggestions {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        border: 2px solid rgba(249, 115, 22, 0.5);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        overflow-y: auto;
        max-height: 480px;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 2000;
        border-radius: 0.75rem;
        transition: all 0.2s ease;
        animation: slideDown 0.2s ease;
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
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
      .suggestion-item {
        transition: all 0.15s ease;
        border-left: 3px solid transparent;
      }
      .suggestion-item:hover {
        background-color: rgba(249, 115, 22, 0.1);
        border-left-color: rgba(249, 115, 22, 0.5);
      }
      .suggestion-item.selected {
        background-color: rgba(249, 115, 22, 0.15);
        border-left-color: rgba(249, 115, 22, 1);
      }
      .search-placeholder {
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% {
          background-color: rgba(249, 115, 22, 0.1);
        }
        50% {
          background-color: rgba(249, 115, 22, 0.2);
        }
        100% {
          background-color: rgba(249, 115, 22, 0.1);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative rounded-full overflow-hidden border-0 bg-white/10 transition-all duration-300 ${isFocused ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' : 'focus-within:ring-2 focus-within:ring-orange-500'}`}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className="w-full py-3 pl-12 pr-14 text-white bg-transparent backdrop-blur-sm outline-none placeholder-gray-300 transition-all"
            aria-label={placeholderText}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
            <Search size={20} className={isFocused ? 'text-orange-400' : ''} />
          </div>
          
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Loader2 size={20} className="animate-spin text-white" />
            </div>
          )}
          
          {!isLoading && searchQuery.trim() && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-10 flex items-center text-white/70 hover:text-white transition-colors"
              aria-label="Vymazat vyhledávání"
            >
              <X size={18} />
            </button>
          )}
          
          {!isLoading && searchQuery.trim() && (
            <button 
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white hover:text-orange-300 transition-colors"
              aria-label="Vyhledat"
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 transition-colors">
                <Search size={16} />
              </div>
            </button>
          )}
        </div>
      </form>
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="search-suggestions mt-1"
        >
          {!searchQuery.trim() ? (
            // Zobrazit populární články, když není zadán žádný dotaz
            <>
              <div className="px-4 py-3 border-b border-zinc-100">
                <h3 className="text-zinc-700 font-medium flex items-center gap-2">
                  <Tag size={16} className="text-orange-500" />
                  {getPopularArticlesTitle()}
                </h3>
              </div>
              
              {isLoadingPopular ? (
                <div className="flex justify-center items-center py-6">
                  <Loader2 size={24} className="animate-spin text-orange-500" />
                </div>
              ) : popularArticles.length > 0 ? (
                popularArticles.map((post, index) => (
                  <div
                    key={`${post.locale}-${post.slug}`}
                    className={`suggestion-item p-3 cursor-pointer border-b border-zinc-100 ${
                      selectedSuggestionIndex === index ? "selected" : ""
                    }`}
                    onClick={() => navigateToPost(post)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    <div className="flex items-start gap-3">
                      {post.frontMatter.image && (
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-zinc-100">
                          <div className="search-placeholder absolute inset-0" />
                          <Image
                            src={post.frontMatter.image}
                            alt={post.frontMatter.title}
                            fill
                            sizes="64px"
                            className="object-cover z-10"
                            onLoad={(e) => {
                              const target = e.target as HTMLImageElement;
                              const parent = target.parentElement;
                              if (parent) {
                                const placeholder = parent.querySelector('.search-placeholder');
                                if (placeholder) placeholder.classList.add('hidden');
                              }
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                          {post.frontMatter.category && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                              {post.frontMatter.category}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(post.frontMatter.date, post.locale)}
                          </span>
                          {post.locale !== locale && <span>{getLocaleFlag(post.locale)}</span>}
                        </div>
                        <h4 className="font-medium text-left text-zinc-900 line-clamp-2">
                          {post.frontMatter.title}
                        </h4>
                        {post.frontMatter.description && (
                          <p className="text-sm text-zinc-600 line-clamp-1 mt-1">
                            {post.frontMatter.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-zinc-500">
                  {locale === 'cs' ? 'Žádné články k zobrazení' :
                   locale === 'sk' ? 'Žiadne články na zobrazenie' :
                   locale === 'de' ? 'Keine Artikel zum Anzeigen' :
                   'No articles to display'}
                </div>
              )}
            </>
          ) : (
            // Zobrazit výsledky vyhledávání
            <>
              <div className="px-4 py-3 border-b border-zinc-100">
                <h3 className="text-zinc-700 font-medium flex items-center gap-2">
                  <Search size={16} className="text-orange-500" />
                  {locale === 'cs' ? 'Výsledky pro: ' :
                   locale === 'sk' ? 'Výsledky pre: ' :
                   locale === 'de' ? 'Ergebnisse für: ' :
                   'Results for: '}
                  <span className="font-semibold text-zinc-900">{searchQuery}</span>
                </h3>
              </div>
            
              {suggestions.length > 0 ? (
                suggestions.map((post, index) => (
                  <div
                    key={`${post.locale}-${post.slug}`}
                    className={`suggestion-item p-3 cursor-pointer border-b border-zinc-100 ${
                      selectedSuggestionIndex === index ? "selected" : ""
                    }`}
                    onClick={() => navigateToPost(post)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    <div className="flex items-start gap-3">
                      {post.frontMatter.image && (
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-zinc-100">
                          <div className="search-placeholder absolute inset-0" />
                          <Image
                            src={post.frontMatter.image}
                            alt={post.frontMatter.title}
                            fill
                            sizes="64px"
                            className="object-cover z-10"
                            onLoad={(e) => {
                              const target = e.target as HTMLImageElement;
                              const parent = target.parentElement;
                              if (parent) {
                                const placeholder = parent.querySelector('.search-placeholder');
                                if (placeholder) placeholder.classList.add('hidden');
                              }
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                          {post.frontMatter.category && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                              {post.frontMatter.category}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(post.frontMatter.date, post.locale)}
                          </span>
                          {post.locale !== locale && <span>{getLocaleFlag(post.locale)}</span>}
                        </div>
                        <h4 className="font-medium text-left text-zinc-900 line-clamp-2">
                          {highlightMatch(post.frontMatter.title, searchQuery)}
                        </h4>
                        {post.frontMatter.description && (
                          <p className="text-sm text-zinc-600 line-clamp-1 mt-1">
                            {highlightMatch(post.frontMatter.description, searchQuery)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-zinc-500">
                  {locale === 'cs' ? 'Žádné výsledky nenalezeny' :
                   locale === 'sk' ? 'Žiadne výsledky nenájdené' :
                   locale === 'de' ? 'Keine Ergebnisse gefunden' :
                   'No results found'}
                </div>
              )}
              
              {suggestions.length > 0 && (
                <div className="px-4 py-3 border-t border-zinc-100">
                  <button
                    onClick={handleSubmit}
                    className="w-full py-2 px-3 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Search size={16} />
                    {locale === 'cs' ? 'Zobrazit všechny výsledky' :
                    locale === 'sk' ? 'Zobraziť všetky výsledky' :
                    locale === 'de' ? 'Alle Ergebnisse anzeigen' :
                    'View all results'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 