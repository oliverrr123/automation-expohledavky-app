import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, X } from "lucide-react";
import { searchPosts } from "@/lib/posts";
import { Button } from "@/components/ui/button";
import { getCurrentLocale } from "@/lib/server-locale";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string; locale?: string };
}) {
  // Get the query parameter
  const query = searchParams.q || "";
  
  // Get the current locale (either from URL parameter or context)
  const contextLocale = getCurrentLocale();
  const locale = searchParams.locale || contextLocale;
  
  console.log("Search params:", { query, locale, contextLocale, searchParams });
  
  // Get the search results for the current locale only
  const searchResults = await searchPosts(query, locale);
  
  console.log(`Found ${searchResults.length} results for query "${query}" in locale "${locale}"`);

  // Localized strings
  const localeStrings = {
    searchResults: locale === 'cs' ? 'Výsledky vyhledávání' :
                   locale === 'sk' ? 'Výsledky vyhľadávania' :
                   locale === 'de' ? 'Suchergebnisse' :
                   'Search results',
    backToBlog: locale === 'cs' ? 'Zpět na blog' :
                locale === 'sk' ? 'Späť na blog' :
                locale === 'de' ? 'Zurück zum Blog' :
                'Back to blog',
    noResults: locale === 'cs' ? 'Žádné výsledky nenalezeny' :
               locale === 'sk' ? 'Žiadne výsledky nenájdené' :
               locale === 'de' ? 'Keine Ergebnisse gefunden' :
               'No results found',
    clearSearch: locale === 'cs' ? 'Zrušit vyhledávání' :
                 locale === 'sk' ? 'Zrušiť vyhľadávanie' :
                 locale === 'de' ? 'Suche löschen' :
                 'Clear search'
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-28">
      <div className="container">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {localeStrings.backToBlog}
          </Link>
        </Button>

        <section className="py-8 bg-white rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-8 px-6">
            <h2 className="text-2xl font-bold text-zinc-900">
              {localeStrings.searchResults}: {query}
            </h2>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors"
              asChild
            >
              <Link href="/blog">
                <X size={18} />
                <span>{localeStrings.clearSearch}</span>
              </Link>
            </Button>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-600">{localeStrings.noResults}</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-6">
              {searchResults.map((post, index) => (
                <div
                  key={post.slug}
                  className="transform transition-all duration-500 ease-in-out hover:scale-[1.03]"
                >
                  <Link href={`/blog/${post.slug}`} className="group">
                    <article className="h-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={post.frontMatter.image || "/placeholder.jpg"}
                          alt={post.frontMatter.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white inline">
                            {post.frontMatter.category}
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="relative h-6 w-6 overflow-hidden rounded-full">
                            <Image
                              src={
                                post.frontMatter.authorImage ||
                                "/placeholder.svg?height=120&width=120"
                              }
                              alt={post.frontMatter.author || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-xs text-zinc-600">
                            {post.frontMatter.author}
                          </span>
                          <span className="text-xs text-zinc-400">•</span>
                          <span className="text-xs text-zinc-500">
                            {new Date(post.frontMatter.date).toLocaleDateString(
                              locale === 'cs' ? 'cs-CZ' :
                              locale === 'sk' ? 'sk-SK' :
                              locale === 'de' ? 'de-DE' :
                              'en-US',
                              { day: 'numeric', month: 'long', year: 'numeric' }
                            )}
                          </span>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-zinc-900 group-hover:text-orange-500 transition-colors">
                          {post.frontMatter.title}
                        </h3>
                        <p className="mb-4 text-sm text-zinc-600">
                          {post.frontMatter.description}
                        </p>
                        <div className="mt-auto flex items-center gap-1 text-sm text-zinc-500">
                          <Clock className="h-4 w-4" />
                          {post.frontMatter.readTime || 
                           `${Math.ceil((post.frontMatter.description?.length || 0) / 1000)} min`}
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
    </div>
  );
} 