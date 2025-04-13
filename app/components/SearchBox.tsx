"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PostSuggestion = {
  slug: string;
  locale: string;
  frontMatter: {
    title: string;
    description?: string;
    category?: string;
    date: string;
    tags?: string[];
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
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Fetch suggestions when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setSuggestions(data.results);
        setShowSuggestions(data.results.length > 0);
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
  }, [searchQuery, locale]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
    }
  };
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    
    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
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
      navigateToPost(suggestions[selectedSuggestionIndex]);
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };
  
  // Navigate to post
  const navigateToPost = (post: PostSuggestion) => {
    setShowSuggestions(false);
    setSearchQuery("");
    
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
  
  // Add styles for search suggestions
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .search-suggestions {
        background: rgba(255, 255, 255, 1);
        backdrop-filter: blur(12px);
        border: 2px solid rgba(249, 115, 22, 0.5);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        overflow-y: auto;
        max-height: 420px;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 2000;
        border-radius: 0.5rem;
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
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-full overflow-hidden border-0 bg-white/10 focus-within:ring-2 focus-within:ring-orange-500 transition-all duration-300">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className="w-full py-3 pl-12 pr-14 text-white bg-transparent backdrop-blur-sm outline-none placeholder-gray-300"
            aria-label="Vyhledávání článků"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
            <Search size={20} />
          </div>
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          )}
          {!isLoading && searchQuery.trim() && (
            <button 
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white hover:text-orange-500 transition-colors"
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
          {suggestions.map((post, index) => (
            <div
              key={`${post.locale}-${post.slug}`}
              className={`suggestion-item p-3 cursor-pointer border-b border-zinc-100 ${
                selectedSuggestionIndex === index ? "selected" : ""
              }`}
              onClick={() => navigateToPost(post)}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
            >
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                {post.frontMatter.category && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                    {post.frontMatter.category}
                  </span>
                )}
                <span>{new Date(post.frontMatter.date).toLocaleDateString(
                  post.locale === 'cs' ? 'cs-CZ' :
                  post.locale === 'sk' ? 'sk-SK' :
                  post.locale === 'de' ? 'de-DE' :
                  'en-US',
                  { day: 'numeric', month: 'short', year: 'numeric' }
                )}</span>
                {post.locale !== locale && <span>{getLocaleFlag(post.locale)}</span>}
              </div>
              <h4 className="font-medium text-zinc-900">
                {highlightMatch(post.frontMatter.title, searchQuery)}
              </h4>
              {post.frontMatter.description && (
                <p className="text-sm text-zinc-600 truncate mt-1">
                  {highlightMatch(post.frontMatter.description, searchQuery)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 