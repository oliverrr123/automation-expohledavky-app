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
}

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

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  try {
    // Sanitize slug to prevent path traversal attacks
    const sanitizedSlug = sanitizeSlug(slug);
    
    // If the slug was modified during sanitization, it might be malicious
    if (sanitizedSlug !== slug) {
      console.warn(`Potentially malicious slug was sanitized: ${slug}`);
      if (!sanitizedSlug) return null;
    }
    
    // Nejprve zkusíme najít soubor s datem v názvu
    const files = fs.readdirSync(postsDirectory);
    const datePattern = /^\d{4}-\d{2}-\d{2}-/;
    const matchingFile = files.find(file => {
      // Odstraníme datum z názvu souboru a porovnáme se slugem
      const fileWithoutDate = file.replace(datePattern, '').replace(/\.mdx$/, '');
      return fileWithoutDate === sanitizedSlug;
    });

    let filePath;
    if (matchingFile) {
      filePath = path.join(postsDirectory, matchingFile);
    } else {
      // Pokud nenajdeme soubor s datem, zkusíme najít soubor bez data
      filePath = path.join(postsDirectory, `${sanitizedSlug}.mdx`);
    }

    // Verify that the file path is within the posts directory
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(postsDirectory))) {
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
    };
  } catch (error) {
    console.error(`Chyba při načítání článku ${slug}:`, error);
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    
    const datePattern = /^\d{4}-\d{2}-\d{2}-/;
    return fs.readdirSync(postsDirectory)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        // Odstraníme datum z názvu souboru, pokud existuje
        return file.replace(datePattern, '').replace(/\.mdx$/, '');
      });
  } catch (error) {
    console.error("Chyba při načítání slugů článků:", error);
    return [];
  }
}

export async function getAllPosts(): Promise<PostData[]> {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    
    const files = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'));
    const datePattern = /^(\d{4}-\d{2}-\d{2})-(.+)\.mdx$/;
    
    const postsPromises = files.map(async (file) => {
      const filePath = path.join(postsDirectory, file);
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
      };
    });

    const posts = await Promise.all(postsPromises);
    // Seřadíme podle data sestupně
    return posts.sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime());
  } catch (error) {
    console.error("Chyba při načítání všech článků:", error);
    return [];
  }
}

// Získání tagů ze všech článků
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getAllPosts();
    const tags = new Set<string>();
    
    posts.forEach(post => {
      if (post.frontMatter.tags && Array.isArray(post.frontMatter.tags)) {
        post.frontMatter.tags.forEach(tag => tags.add(tag));
      }
    });
    
    return Array.from(tags);
  } catch (error) {
    console.error("Chyba při načítání tagů:", error);
    return [];
  }
}

// Získání kategorií ze všech článků
export async function getAllCategories(): Promise<string[]> {
  try {
    const posts = await getAllPosts();
    const categories = new Set<string>();
    
    posts.forEach(post => {
      if (post.frontMatter.category) {
        categories.add(post.frontMatter.category);
      }
    });
    
    return Array.from(categories);
  } catch (error) {
    console.error("Chyba při načítání kategorií:", error);
    return [];
  }
}

// Vyhledávání v článcích
export async function searchPosts(query: string): Promise<PostData[]> {
  try {
    // Validate and sanitize query parameter
    if (!query) {
      return [];
    }
    
    // Sanitize the query
    const sanitizedQuery = query
      .replace(/[^\w\s.,?!-]/g, '') // Only allow alphanumeric, spaces and basic punctuation
      .substring(0, 100); // Limit length to 100 characters
    
    if (!sanitizedQuery) {
      return [];
    }
    
    const allPosts = await getAllPosts();
    const lowerCaseQuery = sanitizedQuery.toLowerCase();
    
    return allPosts.filter(post => {
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
  } catch (error) {
    console.error("Chyba při vyhledávání článků:", error);
    return [];
  }
} 