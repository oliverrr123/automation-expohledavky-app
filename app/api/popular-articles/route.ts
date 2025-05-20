import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

// Nastavení dynamického routingu bez statické generace
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Funkce pro sanitizaci textových řetězců v JSON datech
function sanitizeString(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    // Odstranit potenciálně problematické znaky a escapovat uvozovky
    return value
      .replace(/[\u0000-\u001F]/g, '')  // Odstranit control znaky
      .replace(/\\/g, '\\\\')           // Escapovat zpětná lomítka
      .replace(/"/g, '\\"');            // Escapovat uvozovky
  }
  
  return String(value);
}

export async function GET(request: NextRequest) {
  try {
    // Získat locale parametr
    const searchParams = request.nextUrl.searchParams;
    let locale = searchParams.get('locale') || 'cs'; // Výchozí locale je cs
    
    console.log(`Fetching popular articles for locale "${locale}"`);
    
    // Ověřit, že locale je platné
    const validLocales = ['cs', 'sk', 'de', 'en'];
    if (!validLocales.includes(locale)) {
      console.error(`Invalid locale: ${locale}, using default cs`);
      locale = 'cs';
    }
    
    // Získat všechny články pro požadovaný jazyk
    const allPosts = await getAllPosts(locale);
    
    console.log(`Found ${allPosts.length} total posts for locale "${locale}"`);
    
    // Seřadit články podle data (nejnovější první)
    const sortedPosts = allPosts.sort((a, b) => {
      return new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime();
    });
    
    // Vybrat max 5 nejnovějších článků
    const popularPosts = sortedPosts.slice(0, 5);
    
    // Odstranit mdxSource (není potřeba a může být velký)
    const sanitizedResults = popularPosts.map(post => ({
      slug: sanitizeString(post.slug),
      locale: sanitizeString(locale),
      frontMatter: {
        title: sanitizeString(post.frontMatter.title),
        description: sanitizeString(post.frontMatter.description),
        category: sanitizeString(post.frontMatter.category),
        date: sanitizeString(post.frontMatter.date),
        tags: Array.isArray(post.frontMatter.tags) 
          ? post.frontMatter.tags.map(tag => sanitizeString(tag)) 
          : [],
        image: sanitizeString(post.frontMatter.image),
      }
    }));
    
    // Pro detekci problémů s formátem sledujme původní a nový formát
    const serializedData = JSON.stringify({ results: sanitizedResults }, null, 0);
    console.log(`API response size: ${serializedData.length} bytes`);
    
    // Kontrola, zda není v datech nějaký problém s JSON formátem
    try {
      JSON.parse(serializedData);
      console.log('JSON validation successful');
    } catch (jsonError) {
      console.error('JSON validation failed:', jsonError);
      // Pokud JSON není validní, vrátit bezpečnější prázdnou odpověď
      return NextResponse.json({ results: [] });
    }
    
    return new NextResponse(serializedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching popular articles:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching popular articles', results: [] },
      { status: 500 }
    );
  }
} 