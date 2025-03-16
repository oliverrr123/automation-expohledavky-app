import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, Facebook, Linkedin, Mail, Twitter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from '@/lib/posts';
import MDXContent from '@/components/mdx-content';

// Generate static parameters for all articles
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Metadata for SEO
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
  
  // If the article doesn't exist, show error page
  if (!post) {
    return notFound();
  }

  // Get all posts for Related Articles section
  const allPosts = await getAllPosts();
  
  // Filter related posts (same category or shared tags, but not current article)
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
    .slice(0, 2); // Limit to 2 related articles

  // Split content to create article table of contents
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

  // Create sharing URLs
  const shareUrl = `https://expohledavky.cz/blog/${params.slug}`;
  const shareTitle = encodeURIComponent(post.frontMatter.title);
  const shareText = encodeURIComponent(post.frontMatter.excerpt || '');

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
    <article className="min-h-screen bg-gray-50 pb-16 pt-32">
      {/* Breadcrumbs */}
      <div className="container border-b border-gray-200 pb-4">
        <div className="flex items-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-orange-500 transition-colors duration-300">
            ExPohledávky
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-orange-500 transition-colors duration-300">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-700">
            {post.frontMatter.title}
          </span>
        </div>
      </div>

      <div className="container mt-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zpět na blogy
          </Link>
        </Button>

        <div className="mx-auto max-w-4xl">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="mb-6 text-3xl font-bold text-zinc-900 md:text-4xl">{post.frontMatter.title}</h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-4">
                {post.frontMatter.category && (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                    {post.frontMatter.category}
                  </span>
                )}
                
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  {post.frontMatter.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.frontMatter.date).toLocaleDateString('cs-CZ', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                  )}
                  
                  {post.frontMatter.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.frontMatter.readTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.frontMatter.image && (
              <div className="mb-8 overflow-hidden rounded-xl">
                <div className="relative aspect-[21/9]">
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

            {/* Article Excerpt */}
            {post.frontMatter.excerpt && (
              <div className="mb-8 rounded-lg bg-zinc-100 p-6 text-lg text-zinc-700">
                {post.frontMatter.excerpt}
              </div>
            )}
          </header>

          {/* Content Layout */}
          <div className="lg:flex lg:gap-8">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="lg:order-2 lg:w-1/4 mb-8 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-lg border border-gray-200 p-6 hover:border-orange-200 transition-colors duration-300">
                  <h4 className="mb-4 font-bold">Obsah článku</h4>
                  <ul className="space-y-2">
                    {headings.map((item) => (
                      <li
                        key={item.id}
                        className={item.level === 3 ? 'ml-3' : ''}
                      >
                        <a
                          href={`#${item.id}`}
                          className="text-orange-600 hover:text-orange-800 hover:underline transition-colors duration-300"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className={`lg:order-1 ${headings.length > 0 ? 'lg:w-3/4' : 'w-full'}`}>
              <div className="prose prose-zinc prose-lg mx-auto">
                <MDXContent source={post.mdxSource} />
              </div>

              {/* CTA Section */}
              <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 md:p-12 shadow-xl">
                <div className="absolute inset-0 bg-grid-white/10" />
                <div className="relative">
                  <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30 mb-6">
                    <span className="relative">Získejte odbornou pomoc</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Potřebujete pomoc s vymáháním pohledávek?
                  </h3>
                  <p className="text-lg text-white/90 mb-8 max-w-2xl">
                    Naši specialisté jsou připraveni vám pomoci s jakýmkoliv problémem týkajícím se pohledávek. Získejte bezplatnou konzultaci ještě dnes.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      asChild
                      size="lg"
                      className="bg-white text-orange-600 hover:bg-white/90 hover:text-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Link href="/poptavka">
                        Nezávazně poptat
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      variant="outline"
                      size="lg"
                      className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                      <Link href="/kontakt">
                        Kontaktovat nás
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-6 flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Odpovídáme do 24 hodin</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      <span>90% úspěšnost vymáhání</span>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Tags */}
              {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                <div className="mt-4 pt-8">
                  <h3 className="mb-4 text-lg font-bold">Související témata</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.frontMatter.tags.map((tag: string) => (
                      <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                        <Badge variant="outline" className="border-orange-200 text-orange-700 hover:border-orange-500 hover:bg-orange-50">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <Share2 className="h-5 w-5" />
                  Sdílet článek
                </h3>
                <div className="flex gap-4">
                  {[
                    { platform: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-orange-500' },
                    { platform: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-orange-500' },
                    { platform: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-orange-500' },
                    { platform: 'email', label: 'Email', icon: Mail, color: 'text-orange-500' }
                  ].map((item) => (
                    <Button
                      key={item.platform}
                      variant="outline"
                      size="sm"
                      className="transition-all duration-300 hover:scale-105 hover:bg-orange-50"
                      asChild
                    >
                      <a
                        href={getShareUrl(item.platform)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        {item.label}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <h3 className="mb-6 text-xl font-bold">Související články</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {relatedPosts.map((relatedPost) => (
                      <Link 
                        key={relatedPost.slug} 
                        href={`/blog/${relatedPost.slug}`}
                        className="group block"
                      >
                        <div className="rounded-lg border border-gray-200 overflow-hidden hover:border-orange-200 transition-all duration-300">
                          {relatedPost.frontMatter.image && (
                            <div className="relative aspect-[16/9]">
                              <Image
                                src={relatedPost.frontMatter.image}
                                alt={relatedPost.frontMatter.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h4 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors duration-300">
                              {relatedPost.frontMatter.title}
                            </h4>
                            {relatedPost.frontMatter.excerpt && (
                              <p className="mt-2 text-sm text-zinc-600 line-clamp-2">
                                {relatedPost.frontMatter.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

           </div>
          </div>
        </div>
      </div>
    </article>
  );
}

