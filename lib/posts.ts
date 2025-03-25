import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote-client/serialize';

export interface PostData {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
    description?: string;
    image?: string;
    category?: string;
    tags?: string[];
    author?: string;
    authorPosition?: string;
    authorImage?: string;
    readTime?: string;
    [key: string]: any;
  };
  mdxSource?: any;
  locale?: string;
}

// Get the posts directory based on locale
function getPostsDirectory(locale: string = 'cs'): string {
  let postsSubDir = 'posts'; // Default is Czech
  
  // Map locale to the correct subdirectory
  if (locale === 'sk') {
    postsSubDir = 'posts-sk';
  } else if (locale === 'en') {
    postsSubDir = 'posts-en';
  } else if (locale === 'de') {
    postsSubDir = 'posts-de';
  }
  
  const directory = path.join(process.cwd(), 'content', postsSubDir);
  
  // Create directory if it doesn't exist
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory for locale ${locale}:`, error);
  }
  
  return directory;
}

// Original Czech posts directory (kept for backward compatibility)
const postsDirectory = path.join(process.cwd(), 'content', 'posts');

// Vytvoření adresáře, pokud neexistuje
try {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
} catch (error) {
  console.error('Chyba při vytváření adresáře:', error);
}

// Helper to sanitize slugs to prevent path traversal
function sanitizeSlug(slug: string): string {
  if (!slug) return '';
  
  // Remove any path traversal characters or patterns and forbidden characters
  return slug
    .replace(/\.\./g, '') // Remove path traversal sequences
    .replace(/[\/\\]/g, '') // Remove slashes
    .replace(/[^a-zA-Z0-9-_]/g, '') // Only allow alphanumeric, dashes and underscores
    .substring(0, 100); // Limit length
}

// Get post by slug, with optional locale
export async function getPostBySlug(slug: string, locale: string = 'cs'): Promise<PostData | null> {
  try {
    // Sanitize slug to prevent path traversal attacks
    const sanitizedSlug = sanitizeSlug(slug);
    
    // If the slug was modified during sanitization, it might be malicious
    if (sanitizedSlug !== slug) {
      console.warn(`Potentially malicious slug was sanitized: ${slug}`);
      if (!sanitizedSlug) return null;
    }
    
    // Get the appropriate directory based on locale
    const targetDirectory = getPostsDirectory(locale);
    
    const files = fs.readdirSync(targetDirectory);
    const datePattern = /^\d{4}-\d{2}-\d{2}-/;
    const matchingFile = files.find(file => {
      // Odstraníme datum z názvu souboru a porovnáme se slugem
      const fileWithoutDate = file.replace(datePattern, '').replace(/\.mdx$/, '');
      return fileWithoutDate === sanitizedSlug;
    });

    let filePath;
    if (matchingFile) {
      filePath = path.join(targetDirectory, matchingFile);
    } else {
      // Pokud nenajdeme soubor s datem, zkusíme najít soubor bez data
      filePath = path.join(targetDirectory, `${sanitizedSlug}.mdx`);
    }

    // Verify that the file path is within the posts directory
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(targetDirectory))) {
      console.error(`Path traversal attempt detected: ${slug}`);
      return null;
    }

    const source = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(source);
    const mdxSource = await serialize({
      source: content,
      options: {
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
        scope: data,
      }
    });
    
    // Zajistíme, že frontMatter obsahuje povinné vlastnosti
    const frontMatter = {
      title: data.title || 'Bez názvu',
      date: data.date || new Date().toISOString(),
      ...data
    };
    
    return {
      slug: sanitizedSlug,
      frontMatter,
      mdxSource,
      locale,
    };
  } catch (error) {
    console.error(`Chyba při načítání článku ${slug} pro jazyk ${locale}:`, error);
    return null;
  }
}

// Get all post slugs for a specific locale
export function getAllPostSlugs(locale: string = 'cs'): string[] {
  try {
    const targetDirectory = getPostsDirectory(locale);
    
    if (!fs.existsSync(targetDirectory)) {
      return [];
    }
    
    const datePattern = /^\d{4}-\d{2}-\d{2}-/;
    return fs.readdirSync(targetDirectory)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        // Odstraníme datum z názvu souboru, pokud existuje
        return file.replace(datePattern, '').replace(/\.mdx$/, '');
      });
  } catch (error) {
    console.error(`Chyba při načítání slugů článků pro jazyk ${locale}:`, error);
    return [];
  }
}

// Get all posts for a specific locale
export async function getAllPosts(locale: string = 'cs'): Promise<PostData[]> {
  try {
    const targetDirectory = getPostsDirectory(locale);
    
    if (!fs.existsSync(targetDirectory)) {
      return [];
    }
    
    const files = fs.readdirSync(targetDirectory).filter(file => file.endsWith('.mdx'));
    const datePattern = /^(\d{4}-\d{2}-\d{2})-(.+)\.mdx$/;
    
    const postsPromises = files.map(async (file) => {
      const filePath = path.join(targetDirectory, file);
      const source = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(source);
      
      // Extrahujeme slug z názvu souboru (odstraníme datum, pokud existuje)
      let slug;
      const match = file.match(datePattern);
      if (match) {
        // Pokud soubor obsahuje datum, použijeme část za datem jako slug
        slug = match[2];
      } else {
        // Jinak použijeme celý název souboru bez přípony
        slug = file.replace(/\.mdx$/, '');
      }
      
      // Zajistíme, že frontMatter obsahuje povinné vlastnosti
      const frontMatter = {
        title: data.title || 'Bez názvu',
        date: data.date || new Date().toISOString(),
        ...data
      };
      
      return {
        slug,
        frontMatter,
        locale,
      };
    });

    const posts = await Promise.all(postsPromises);
    // Seřadíme podle data sestupně
    return posts.sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime());
  } catch (error) {
    console.error(`Chyba při načítání všech článků pro jazyk ${locale}:`, error);
    return [];
  }
}

// Get tags from all posts for a specific locale
export async function getAllTags(locale: string = 'cs'): Promise<string[]> {
  try {
    const posts = await getAllPosts(locale);
    const tags = new Set<string>();
    
    posts.forEach(post => {
      if (post.frontMatter.tags && Array.isArray(post.frontMatter.tags)) {
        post.frontMatter.tags.forEach(tag => tags.add(tag));
      }
    });
    
    return Array.from(tags);
  } catch (error) {
    console.error(`Chyba při načítání tagů pro jazyk ${locale}:`, error);
    return [];
  }
}

// Search posts with locale support
export async function searchPosts(query: string, locale: string = 'cs'): Promise<PostData[]> {
  console.log(`Searching for "${query}" in locale "${locale}"`);
  
  try {
    // Validate and sanitize query parameter
    if (!query) {
      console.log("Empty query provided, returning empty results");
      return [];
    }
    
    // Sanitize the query
    const sanitizedQuery = query
      .replace(/[^\w\s.,?!-]/g, '') // Only allow alphanumeric, spaces and basic punctuation
      .substring(0, 100); // Limit length to 100 characters
    
    if (!sanitizedQuery) {
      console.log("Query was sanitized to empty string, returning empty results");
      return [];
    }
    
    console.log(`Getting all posts for locale "${locale}" to search in`);
    const allPosts = await getAllPosts(locale);
    console.log(`Found ${allPosts.length} posts in locale "${locale}"`);
    
    const lowerCaseQuery = sanitizedQuery.toLowerCase();
    
    const results = allPosts.filter(post => {
      const { title, description, category, tags } = post.frontMatter;
      
      // Hledání v titulku
      if (title && title.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      // Hledání v popisu
      if (description && description.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      // Hledání v kategorii
      if (category && category.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      // Hledání v tazích
      if (tags && Array.isArray(tags)) {
        return tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
      }
      
      return false;
    });
    
    console.log(`Found ${results.length} matching posts for query "${query}" in locale "${locale}"`);
    return results;
  } catch (error) {
    console.error(`Chyba při vyhledávání článků pro jazyk ${locale}:`, error);
    return [];
  }
} 