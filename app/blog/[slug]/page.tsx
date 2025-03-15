import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, Facebook, Linkedin, Mail, Twitter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from '@/lib/posts';
import MDXContent from '@/components/mdx-content';

// Generování statických parametrů pro všechny články
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Metadata pro SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {
    title: 'Článek nenalezen | EXPOHLEDÁVKY',
    description: 'Požadovaný článek nebyl nalezen'
  };
  
  return {
    title: `${post.frontMatter.title} | EXPOHLEDÁVKY`,
    description: post.frontMatter.description || post.frontMatter.excerpt || 'Odborný článek na téma pohledávek',
    openGraph: {
      title: post.frontMatter.title,
      description: post.frontMatter.description || post.frontMatter.excerpt,
      images: [post.frontMatter.image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  // Pokud článek neexistuje, zobrazíme stránku s chybou
  if (!post) {
    return notFound();
  }

  // Získání všech článků pro sekci Související články
  const allPosts = await getAllPosts();
  
  // Filtrování souvisejících článků (stejná kategorie nebo sdílené tagy, ale ne aktuální článek)
  const relatedPosts = allPosts
    .filter(relatedPost => 
      relatedPost.slug !== params.slug && (
        relatedPost.frontMatter.category === post.frontMatter.category ||
        (post.frontMatter.tags && relatedPost.frontMatter.tags && 
          post.frontMatter.tags.some(tag => 
            relatedPost.frontMatter.tags && relatedPost.frontMatter.tags.includes(tag)
          ))
      )
    )
    .slice(0, 2); // Omezení na 2 související články

  // Rozdělení obsahu pro vytvoření obsahu článku
  const headingsRegex = /<h([2-3])\s+id="([^"]+)">([^<]+)<\/h\1>/g;
  const headings: { id: string; title: string; level: number }[] = [];
  
  let match;
  const contentString = post.mdxSource?.compiledSource || '';
  
  while ((match = headingsRegex.exec(contentString)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2],
      title: match[3],
    });
  }

  // Vytvoření URL pro sdílení
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${params.slug}`
    : `https://expohledavky.cz/blog/${params.slug}`;
  
  const shareTitle = encodeURIComponent(post.frontMatter.title);
  const shareText = encodeURIComponent(post.frontMatter.excerpt || '');

  // Funkce pro generování URL pro sdílení
  const getShareUrl = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      case 'email':
        return `mailto:?subject=${shareTitle}&body=${shareText}%0A%0A${encodeURIComponent(shareUrl)}`;
      default:
        return '#';
    }
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Kompaktnější tmavý header */}
      <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-800 text-white pb-12 pt-28 relative overflow-hidden">
        {/* Dekorativní prvky v pozadí */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.4),transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.3),transparent_40%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumbs a zpět na blog v jednom řádku */}
          <div className="flex justify-between items-center border-b border-zinc-700/30 pb-3">
            <div className="flex items-center text-sm text-zinc-400">
              <Link href="/" className="hover:text-orange-400 transition-colors duration-300">
                ExPohledávky
              </Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-orange-400 transition-colors duration-300">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <span className="text-orange-400 truncate max-w-[200px]">
                {post.frontMatter.title}
              </span>
            </div>
            <Button variant="ghost" className="text-zinc-400 hover:text-orange-400 hover:bg-zinc-800/40 -mr-2" asChild>
              <Link href="/blog" className="flex items-center gap-1 text-sm">
                <ArrowLeft className="h-3 w-3" />
                Zpět na blog
              </Link>
            </Button>
          </div>

          {/* Header Content */}
          <div className="mx-auto max-w-4xl mt-6">
            {/* Kategorie a metadata v jednom řádku */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              {post.frontMatter.category && (
                <Badge className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-1">
                  {post.frontMatter.category}
                </Badge>
              )}
              
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                {post.frontMatter.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>{new Date(post.frontMatter.date).toLocaleDateString('cs-CZ', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                )}
                
                {post.frontMatter.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>{post.frontMatter.readTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl leading-tight">{post.frontMatter.title}</h1>
              
              {post.frontMatter.subtitle && (
                <p className="text-xl text-zinc-300">{post.frontMatter.subtitle}</p>
              )}
            </header>
          </div>
        </div>
      </div>

      {/* Vlnitá oddělující linie mezi headerem a obsahem */}
      <div className="bg-white relative -mt-6 z-10">
        <svg viewBox="0 0 1440 80" className="w-full h-auto fill-orange-50">
          <path d="M0,32L60,42.7C120,53,240,75,360,69.3C480,64,600,32,720,32C840,32,960,64,1080,64C1200,64,1320,32,1380,16L1440,0L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>

      {/* Světlý obsah článku */}
      <div className="bg-orange-50 pt-4 pb-16">
        <div className="container mx-auto px-4 relative z-20">  
          <div className="mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-md">
            {/* Featured Image */}
            {post.frontMatter.image && (
              <div className="mb-10 -mt-16 overflow-hidden rounded-lg shadow-xl">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={post.frontMatter.image}
                    alt={post.frontMatter.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                    priority
                  />
                </div>
              </div>
            )}
            
            {/* Flexibilní layout pro obsah a TOC na větších obrazovkách */}
            <div className="lg:flex lg:gap-8">
              {/* Table of Contents - na větších obrazovkách vpravo, na menších nahoře */}
              {headings.length > 0 && (
                <div className="lg:order-2 lg:w-1/4 mb-8 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
                  <div className="rounded-lg bg-orange-50 border border-orange-100 p-4 shadow-md">
                    <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-zinc-800">
                      <BookOpen className="h-4 w-4 text-orange-500" />
                      Obsah článku
                    </h3>
                    <ul className="space-y-1.5 text-sm">
                      {headings.map((item) => (
                        <li
                          key={item.id}
                          className={`transform transition-all duration-300 ${item.level === 3 ? 'ml-3' : ''}`}
                        >
                          <a
                            href={`#${item.id}`}
                            className="text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-300"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Article Content - vylepšené formátování */}
              <div className={`lg:order-1 ${headings.length > 0 ? 'lg:w-3/4' : 'w-full'}`}>
                <div className="prose prose-lg max-w-none 
                  prose-headings:text-zinc-800 prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
                  prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-6
                  prose-h2:text-2xl prose-h2:border-b prose-h2:border-orange-100 prose-h2:pb-2
                  prose-h3:text-xl
                  prose-p:text-zinc-700 prose-p:leading-relaxed prose-p:my-4
                  prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-orange-700 prose-strong:font-semibold
                  prose-code:bg-orange-50 prose-code:text-orange-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-blockquote:border-l-4 prose-blockquote:border-orange-300 prose-blockquote:bg-orange-50/50 prose-blockquote:py-1 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-img:rounded-lg prose-img:shadow-md
                  prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:my-2
                ">
                  <MDXContent source={post.mdxSource} />
                </div>

                {/* Tags */}
                {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-zinc-200">
                    <h3 className="mb-4 text-lg font-semibold text-zinc-800">Související témata</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.frontMatter.tags.map((tag: string) => (
                        <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                          <Badge variant="outline" className="border-orange-200 text-orange-700 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300">
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section - funkční sdílení */}
                <div className="mt-10 rounded-lg bg-orange-50 border border-orange-100 p-6 shadow-md">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-800">
                    <Share2 className="h-5 w-5 text-orange-500" />
                    Sdílet článek
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={getShareUrl('facebook')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-orange-200 text-zinc-700 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span>Facebook</span>
                    </a>
                    <a 
                      href={getShareUrl('linkedin')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-orange-200 text-zinc-700 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
                    >
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <span>LinkedIn</span>
                    </a>
                    <a 
                      href={getShareUrl('twitter')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-orange-200 text-zinc-700 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
                    >
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <span>Twitter</span>
                    </a>
                    <a 
                      href={getShareUrl('email')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-orange-200 text-zinc-700 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
                    >
                      <Mail className="h-4 w-4 text-zinc-600" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>

                {/* Related Articles - dynamické načítání souvisejících článků */}
                <div className="mt-10">
                  <h3 className="mb-6 text-xl font-bold text-zinc-800">Související články</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedPosts.length > 0 ? (
                      relatedPosts.map(relatedPost => (
                        <Link 
                          key={relatedPost.slug} 
                          href={`/blog/${relatedPost.slug}`} 
                          className="group block rounded-lg bg-white border border-orange-100 p-4 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-orange-200/30"
                        >
                          <h4 className="mb-2 font-medium text-zinc-800 group-hover:text-orange-600 transition-colors">
                            {relatedPost.frontMatter.title}
                          </h4>
                          <p className="text-sm text-zinc-600">
                            {relatedPost.frontMatter.excerpt || relatedPost.frontMatter.subtitle}
                          </p>
                        </Link>
                      ))
                    ) : (
                      // Fallback pokud nejsou žádné související články
                      <>
                        <Link href="/blog" className="group block rounded-lg bg-white border border-orange-100 p-4 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-orange-200/30">
                          <h4 className="mb-2 font-medium text-zinc-800 group-hover:text-orange-600 transition-colors">Vymáhání pohledávek v roce 2025</h4>
                          <p className="text-sm text-zinc-600">Zjistěte, jaké jsou nejnovější trendy a postupy v oblasti vymáhání pohledávek.</p>
                        </Link>
                        <Link href="/blog" className="group block rounded-lg bg-white border border-orange-100 p-4 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-orange-200/30">
                          <h4 className="mb-2 font-medium text-zinc-800 group-hover:text-orange-600 transition-colors">Prevence vzniku pohledávek</h4>
                          <p className="text-sm text-zinc-600">Jak nastavit obchodní podmínky a procesy, abyste minimalizovali riziko vzniku nedobytných pohledávek.</p>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-16 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 p-8 text-center shadow-lg">
              <h3 className="mb-3 text-2xl font-bold text-white">Potřebujete pomoc s vymáháním pohledávek?</h3>
              <p className="mb-6 text-white/90">Naši specialisté jsou připraveni vám pomoci s jakýmkoliv problémem týkajícím se pohledávek.</p>
              <Button asChild className="bg-black hover:bg-zinc-800 text-white shadow-md">
                <Link href="/kontakt">Kontaktujte nás</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

