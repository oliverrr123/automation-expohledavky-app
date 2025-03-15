import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

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

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);
    const source = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(source);
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
      scope: data,
    });
    
    // Zajistíme, že frontMatter obsahuje povinné vlastnosti
    const frontMatter = {
      title: data.title || 'Bez názvu',
      date: data.date || new Date().toISOString(),
      ...data
    };
    
    return {
      slug,
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
    
    return fs.readdirSync(postsDirectory)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error("Chyba při načítání slugů článků:", error);
    return [];
  }
}

export async function getAllPosts(): Promise<PostData[]> {
  try {
    const slugs = getAllPostSlugs();
    
    if (slugs.length === 0) {
      return [];
    }
    
    const postsPromises = slugs.map(async (slug) => {
      const filePath = path.join(postsDirectory, `${slug}.mdx`);
      const source = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(source);
      
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
    const allPosts = await getAllPosts();
    const lowerCaseQuery = query.toLowerCase();
    
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