import Link from "next/link"
import Image from "next/image"
import { Search, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllPosts } from "@/lib/posts"
import { getCurrentLocale } from "@/lib/server-locale"
// Import translations for each language
import csBlogPage from '@/locales/cs/blog-page.json'
import skBlogPage from '@/locales/sk/blog-page.json'
import enBlogPage from '@/locales/en/blog-page.json'
import deBlogPage from '@/locales/de/blog-page.json'

// Server component for the blog page
export default async function BlogPage() {
  // Get current locale from server
  const locale = getCurrentLocale();
  
  // Get translations based on locale
  let translations;
  switch (locale) {
    case 'sk':
      translations = skBlogPage;
      break;
    case 'en':
      translations = enBlogPage;
      break;
    case 'de':
      translations = deBlogPage;
      break;
    default:
      translations = csBlogPage;
  }
  
  // Get all blog posts for the current locale only
  const allPosts = await getAllPosts(locale);
  
  // If there are no posts for this locale, show an empty state
  if (allPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 pt-28">
        {/* Hero Section */}
        <section className="bg-zinc-900 py-16 text-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                <span className="text-white">EX</span>
                <span className="text-orange-500">
                  {locale === 'de' ? 'FORDERUNGEN' : 
                   locale === 'en' ? 'RECEIVABLES' : 
                   'POHLEDÁVKY'}
                </span>
              </h1>
              <h2 className="mb-6 text-xl font-medium md:text-2xl">
                {locale === 'cs' ? 'Odborný portál o správě a vymáhání pohledávek' :
                 locale === 'sk' ? 'Odborný portál o správe a vymáhaní pohľadávok' :
                 locale === 'de' ? 'Fachportal für Forderungsmanagement und Inkasso' :
                 'Expert portal for receivables management and debt collection'}
              </h2>
              <p className="mb-8 text-gray-200">
                {locale === 'cs' ? 'Vítejte na našem blogu věnovaném správě, odkupu a vymáhání pohledávek. Najdete zde odborné články s praktickými radami pro firmy a podnikatele v českém právním prostředí.' :
                 locale === 'sk' ? 'Vitajte na našom blogu venovanom správe, odkúpe a vymáhaní pohľadávok. Nájdete tu odborné články s praktickými radami pre firmy a podnikateľov v slovenskom právnom prostredí.' :
                 locale === 'de' ? 'Willkommen auf unserem Blog zum Thema Forderungsmanagement, Forderungsankauf und Inkasso. Hier finden Sie Fachartikel mit praktischen Ratschlägen für Unternehmen im deutschen Rechtsumfeld.' :
                 'Welcome to our blog dedicated to receivables management, debt purchase, and collection. Here you will find expert articles with practical advice for businesses in the international legal environment.'}
              </p>
              <div className="mx-auto mb-8 max-w-xl">
                <div className="relative">
                  <form className="relative z-[100]" action="/blog/search" method="get">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white z-20" size={20} />
                    <input
                      name="q"
                      type="text"
                      placeholder={locale === 'cs' ? 'Hledat články...' :
                                   locale === 'sk' ? 'Hľadať články...' :
                                   locale === 'de' ? 'Artikel suchen...' :
                                   'Search articles...'}
                      className="w-full rounded-full border-0 bg-white/10 px-5 pl-10 py-3 text-white placeholder-gray-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    />
                    <input type="hidden" name="locale" value={locale} />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 p-2 text-white hover:bg-orange-600 transition-colors duration-300"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>
              <div className="text-center">
                <Button asChild className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input h-11 rounded-md px-8 bg-transparent text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105">
                  <Link href="/o-nas">
                    {locale === 'cs' ? 'Více o nás' :
                     locale === 'sk' ? 'Viac o nás' :
                     locale === 'de' ? 'Mehr über uns' :
                     'More about us'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <div className="container my-16 text-center">
          <div className="bg-white rounded-xl shadow-sm p-12">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">
              {locale === 'cs' ? 'Zatím nemáme žádné články' :
               locale === 'sk' ? 'Zatiaľ nemáme žiadne články' :
               locale === 'de' ? 'Wir haben noch keine Artikel' :
               'We don\'t have any articles yet'}
            </h2>
            <p className="text-zinc-600 mb-8 max-w-lg mx-auto">
              {locale === 'cs' ? 'Sledujte náš blog, brzy přidáme nové články. Zatím si můžete přečíst české články kliknutím na tlačítko níže.' :
               locale === 'sk' ? 'Sledujte náš blog, čoskoro pridáme nové články. Zatiaľ si môžete prečítať české články kliknutím na tlačidlo nižšie.' :
               locale === 'de' ? 'Bleiben Sie dran, wir werden bald neue Artikel hinzufügen. In der Zwischenzeit können Sie tschechische Artikel lesen, indem Sie unten klicken.' :
               'Stay tuned, we\'ll be adding new articles soon. In the meantime, you can read Czech articles by clicking the button below.'}
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/" locale="cs">
                {locale === 'cs' ? 'Zobrazit české články' :
                 locale === 'sk' ? 'Zobraziť české články' :
                 locale === 'de' ? 'Tschechische Artikel anzeigen' :
                 'View Czech articles'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Define category names in the current locale
  const categories = locale === 'cs' ? [
    "Správa pohledávek",
    "Finanční analýza",
    "Vymáhání pohledávek",
    "Etika vymáhání",
    "Insolvence",
    "Prevence"
  ] : locale === 'sk' ? [
    "Správa pohľadávok",
    "Finančná analýza",
    "Vymáhanie pohľadávok",
    "Etika vymáhania",
    "Insolvencia",
    "Prevencia"
  ] : locale === 'de' ? [
    "Forderungsmanagement",
    "Finanzanalyse",
    "Inkasso",
    "Inkasso-Ethik",
    "Insolvenz",
    "Prävention"
  ] : [
    "Receivables Management",
    "Financial Analysis",
    "Debt Collection",
    "Collection Ethics",
    "Insolvency",
    "Prevention"
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-28">
      {/* Hero Section */}
      <section className="bg-zinc-900 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              <span className="text-white">EX</span>
              <span className="text-orange-500">
                {locale === 'de' ? 'FORDERUNGEN' : 
                 locale === 'en' ? 'RECEIVABLES' : 
                 'POHLEDÁVKY'}
              </span>
            </h1>
            <h2 className="mb-6 text-xl font-medium md:text-2xl">
              {locale === 'cs' ? 'Odborný portál o správě a vymáhání pohledávek' :
               locale === 'sk' ? 'Odborný portál o správe a vymáhaní pohľadávok' :
               locale === 'de' ? 'Fachportal für Forderungsmanagement und Inkasso' :
               'Expert portal for receivables management and debt collection'}
            </h2>
            <p className="mb-8 text-gray-200">
              {locale === 'cs' ? 'Vítejte na našem blogu věnovaném správě, odkupu a vymáhání pohledávek. Najdete zde odborné články s praktickými radami pro firmy a podnikatele v českém právním prostředí.' :
               locale === 'sk' ? 'Vitajte na našom blogu venovanom správe, odkúpe a vymáhaní pohľadávok. Nájdete tu odborné články s praktickými radami pre firmy a podnikateľov v slovenskom právnom prostredí.' :
               locale === 'de' ? 'Willkommen auf unserem Blog zum Thema Forderungsmanagement, Forderungsankauf und Inkasso. Hier finden Sie Fachartikel mit praktischen Ratschlägen für Unternehmen im deutschen Rechtsumfeld.' :
               'Welcome to our blog dedicated to receivables management, debt purchase, and collection. Here you will find expert articles with practical advice for businesses in the international legal environment.'}
            </p>
            <div className="mx-auto mb-8 max-w-xl">
              <div className="relative">
                <form className="relative z-[100]" action="/blog/search" method="get">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white z-20" size={20} />
                  <input
                    name="q"
                    type="text"
                    placeholder={locale === 'cs' ? 'Hledat články...' :
                                 locale === 'sk' ? 'Hľadať články...' :
                                 locale === 'de' ? 'Artikel suchen...' :
                                 'Search articles...'}
                    className="w-full rounded-full border-0 bg-white/10 px-5 pl-10 py-3 text-white placeholder-gray-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  />
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 p-2 text-white hover:bg-orange-600 transition-colors duration-300"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
            <div className="text-center">
              <Button asChild className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input h-11 rounded-md px-8 bg-transparent text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105">
                <Link href="/o-nas">
                  {locale === 'cs' ? 'Více o nás' :
                   locale === 'sk' ? 'Viac o nás' :
                   locale === 'de' ? 'Mehr über uns' :
                   'More about us'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Featured Article */}
        <section className="py-8 mt-8">
          <h2 className="mb-8 text-2xl font-bold text-zinc-900">
            {locale === 'cs' ? 'Nejnovější článek' :
             locale === 'sk' ? 'Najnovší článok' :
             locale === 'de' ? 'Neuester Artikel' :
             'Latest article'}
          </h2>
          <div className="transform transition-all duration-500 ease-in-out hover:scale-[1.01]">
            <Link href={`/blog/${allPosts[0].slug}`} className="group">
              <article className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="relative aspect-[16/9] md:aspect-auto">
                    <Image
                      src={allPosts[0].frontMatter.image || "/placeholder.jpg"}
                      alt={allPosts[0].frontMatter.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 lg:py-12">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={allPosts[0].frontMatter.authorImage || "/placeholder.svg?height=120&width=120"}
                          alt={allPosts[0].frontMatter.author || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-zinc-600">{allPosts[0].frontMatter.author}</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-sm text-zinc-500">{new Date(allPosts[0].frontMatter.date).toLocaleDateString(
                        locale === 'cs' ? 'cs-CZ' :
                        locale === 'sk' ? 'sk-SK' :
                        locale === 'de' ? 'de-DE' :
                        'en-US',
                        { day: 'numeric', month: 'long', year: 'numeric' }
                      )}</span>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-zinc-900 group-hover:text-orange-500 transition-colors">
                      {allPosts[0].frontMatter.title}
                    </h3>
                    <p className="mb-4 text-zinc-600">{allPosts[0].frontMatter.description}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                        {allPosts[0].frontMatter.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-zinc-500">
                        <Clock className="h-4 w-4" />
                        {allPosts[0].frontMatter.readTime || `${Math.ceil((allPosts[0].frontMatter.description?.length || 0) / 1000)} min`}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-orange-500 group-hover:gap-3 transition-all">
                      <span className="text-sm font-medium">
                        {locale === 'cs' ? 'Číst článek' :
                         locale === 'sk' ? 'Čítať článok' :
                         locale === 'de' ? 'Artikel lesen' :
                         'Read article'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>

        {/* All Articles */}
        <section className="py-8">
          <h2 className="mb-8 text-2xl font-bold text-zinc-900">
            {locale === 'cs' ? 'Všechny články' :
             locale === 'sk' ? 'Všetky články' :
             locale === 'de' ? 'Alle Artikel' :
             'All articles'}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allPosts.slice(1).map((post) => (
              <div key={post.slug} className="transform transition-all duration-500 ease-in-out hover:scale-[1.03]">
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
                            src={post.frontMatter.authorImage || "/placeholder.svg?height=120&width=120"}
                            alt={post.frontMatter.author || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs text-zinc-600">{post.frontMatter.author}</span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs text-zinc-500">{new Date(post.frontMatter.date).toLocaleDateString(
                          locale === 'cs' ? 'cs-CZ' :
                          locale === 'sk' ? 'sk-SK' :
                          locale === 'de' ? 'de-DE' :
                          'en-US',
                          { day: 'numeric', month: 'long', year: 'numeric' }
                        )}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-zinc-900 group-hover:text-orange-500 transition-colors">
                        {post.frontMatter.title}
                      </h3>
                      <p className="mb-4 text-sm text-zinc-600">{post.frontMatter.description}</p>
                      <div className="mt-auto flex items-center gap-1 text-sm text-zinc-500">
                        <Clock className="h-4 w-4" />
                        {post.frontMatter.readTime || `${Math.ceil((post.frontMatter.description?.length || 0) / 1000)} min`}
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12">
          <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 md:p-12 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30 mb-6">
                <span className="relative">
                  {locale === 'cs' ? 'Získejte odbornou pomoc' :
                   locale === 'sk' ? 'Získajte odbornú pomoc' :
                   locale === 'de' ? 'Holen Sie sich Expertenberatung' :
                   'Get expert help'}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {locale === 'cs' ? 'Potřebujete pomoc s vymáháním pohledávek?' :
                 locale === 'sk' ? 'Potrebujete pomoc s vymáhaním pohľadávok?' :
                 locale === 'de' ? 'Benötigen Sie Hilfe bei der Forderungseintreibung?' :
                 'Need help with debt collection?'}
              </h3>
              <p className="text-lg text-white/90 mb-8 max-w-2xl">
                {locale === 'cs' ? 'Naši specialisté jsou připraveni vám pomoci s jakýmkoliv problémem týkajícím se pohledávek. Získejte bezplatnou konzultaci ještě dnes.' :
                 locale === 'sk' ? 'Naši špecialisti sú pripravení vám pomôcť s akýmkoľvek problémom týkajúcim sa pohľadávok. Získajte bezplatnú konzultáciu ešte dnes.' :
                 locale === 'de' ? 'Unsere Spezialisten stehen bereit, Ihnen bei Problemen mit Forderungen zu helfen. Holen Sie sich noch heute eine kostenlose Beratung.' :
                 'Our specialists are ready to help you with any receivables issue. Get a free consultation today.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-white/90 hover:text-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/poptavka">
                    {locale === 'cs' ? 'Nezávazně poptat' :
                     locale === 'sk' ? 'Nezáväzne dopytovať' :
                     locale === 'de' ? 'Unverbindlich anfragen' :
                     'Request a quote'}
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <Link href="/kontakt">
                    {locale === 'cs' ? 'Kontaktovat nás' :
                     locale === 'sk' ? 'Kontaktovať nás' :
                     locale === 'de' ? 'Kontaktieren Sie uns' :
                     'Contact us'}
                  </Link>
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {locale === 'cs' ? 'Odpovídáme do 24 hodin' :
                     locale === 'sk' ? 'Odpovedáme do 24 hodín' :
                     locale === 'de' ? 'Wir antworten innerhalb von 24 Stunden' :
                     'We respond within 24 hours'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

