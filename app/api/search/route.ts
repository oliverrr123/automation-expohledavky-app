import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET(request: NextRequest) {
  try {
    // Získat query parametr a locale
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    let locale = searchParams.get('locale') || 'cs'; // Defaultní locale je cs
    
    console.log(`Searching for "${query}" in locale "${locale}"`);
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }
    
    // Sanitizovat query
    const sanitizedQuery = query
      .replace(/[^\w\s.,?!-]/g, '') // Povolit pouze alfanumerické znaky, mezery a základní interpunkci
      .substring(0, 100); // Omezit délku
    
    if (!sanitizedQuery) {
      return NextResponse.json({ results: [] });
    }
    
    // Ověřit, že locale je platné
    const validLocales = ['cs', 'sk', 'de', 'en'];
    if (!validLocales.includes(locale)) {
      console.error(`Invalid locale: ${locale}, using default cs`);
      locale = 'cs';
    }
    
    // Získat články pouze pro požadovaný jazyk
    const posts = await getAllPosts(locale);
    
    console.log(`Found ${posts.length} total posts for locale "${locale}"`);
    
    const lowerCaseQuery = sanitizedQuery.toLowerCase();
    
    // Filtrovat články podle query
    const results = posts.filter(post => {
      const { title, description, category, tags } = post.frontMatter;
      
      // Hledat v titulku
      if (title && title.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      // Hledat v popisu
      if (description && description.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      // Hledat v kategorii
      if (category && category.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      // Hledat v tazích
      if (tags && Array.isArray(tags)) {
        return tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
      }
      
      return false;
    })
    // Omezit počet výsledků na 10
    .slice(0, 10);
    
    console.log(`Found ${results.length} matching posts for query "${query}" in locale "${locale}"`);
    
    // Přidat informaci o locale do výsledků a odstranit mdxSource (není potřeba pro návrhy a může být velký)
    const sanitizedResults = results.map(post => ({
      slug: post.slug,
      locale: locale,
      frontMatter: {
        title: post.frontMatter.title,
        description: post.frontMatter.description,
        category: post.frontMatter.category,
        date: post.frontMatter.date,
        tags: post.frontMatter.tags,
      }
    }));
    
    return NextResponse.json({ results: sanitizedResults });
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching' },
      { status: 500 }
    );
  }
} 