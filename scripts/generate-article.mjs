import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import axios from 'axios';
import matter from 'gray-matter';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurace OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Konfigurace Unsplash
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

// Kategorie pro články - tyto zůstávají fixní pro konzistenci
const categories = [
  'Správa pohledávek',
  'Finanční analýza',
  'Vymáhání pohledávek',
  'Etika vymáhání',
  'Insolvence',
  'Prevence'
];

// Autoři článků
const authors = [
  {
    name: 'Jan Novák',
    position: 'Specialista na pohledávky',
    image: '/placeholder.svg?height=120&width=120',
    bio: 'Specialista na správu a vymáhání pohledávek s více než 10 lety zkušeností v oboru.'
  },
  {
    name: 'Mgr. Martin Dvořák',
    position: 'Právní specialista',
    image: '/placeholder.svg?height=120&width=120',
    bio: 'Právník specializující se na oblast obchodního práva a vymáhání pohledávek s praxí v advokacii.'
  },
  {
    name: 'Ing. Petra Svobodová',
    position: 'Finanční analytik',
    image: '/placeholder.svg?height=120&width=120',
    bio: 'Finanční analytička zaměřující se na řízení cash flow a prevenci platební neschopnosti.'
  }
];

// Funkce pro výběr náhodného prvku z pole
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Funkce pro generování náhodného tématu na základě kategorie
async function generateRandomTopic(category) {
  try {
    console.log(`Generuji náhodné téma pro kategorii: ${category}...`);
    
    const prompt = `Vygeneruj originální, specifické a zajímavé téma pro odborný článek o pohledávkách v kategorii "${category}".
    
Téma by mělo být:
1. Relevantní pro český trh a právní systém
2. Specifické (ne obecné jako "Vymáhání pohledávek", ale spíše "Strategie vymáhání pohledávek u malých a středních podniků v době ekonomické recese")
3. Aktuální a reflektující současné trendy
4. Zajímavé pro podnikatele a firmy
5. Vhodné pro odborný článek o délce 800-1200 slov

Vrať pouze název tématu bez dalších komentářů nebo vysvětlení. Téma musí být v českém jazyce.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi specialista na pohledávky, právní aspekty jejich správy a vymáhání. Tvým úkolem je generovat originální a specifická témata pro odborné články." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9, // Vyšší teplota pro větší kreativitu
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Vygenerované téma: ${topic}`);
    
    // Získání unikátního přístupu k tématu
    const approach = await generateUniqueApproach(topic, category);
    
    return {
      topic: topic,
      mainThesis: approach.mainThesis,
      keyPoints: approach.keyPoints,
      uniquePerspective: approach.uniquePerspective
    };
  } catch (error) {
    console.error("Chyba při generování tématu:", error);
    // Fallback témata pro případ selhání API
    const fallbackTopic = getRandomElement([
      `Aktuální trendy v ${category.toLowerCase()}`,
      `Praktický průvodce: ${category}`,
      `Jak optimalizovat ${category.toLowerCase()} v roce ${new Date().getFullYear()}`,
      `Nejčastější chyby při ${category.toLowerCase()}`,
      `Budoucnost ${category.toLowerCase()} v digitální éře`
    ]);
    
    return {
      topic: fallbackTopic,
      mainThesis: `Je důležité porozumět aspektům tématu ${fallbackTopic}.`,
      keyPoints: [
        "Legislativní rámec a aktuální změny",
        "Praktické postupy a doporučení",
        "Případové studie a příklady z praxe"
      ],
      uniquePerspective: `Pohled z perspektivy efektivity a optimalizace procesů v oblasti ${category.toLowerCase()}.`
    };
  }
}

// Funkce pro generování unikátního přístupu k tématu
async function generateUniqueApproach(topic, category) {
  try {
    console.log("Generuji unikátní přístup k tématu...");
    
    const prompt = `Pro téma "${topic}" v kategorii "${category}" navrhni unikátní úhel pohledu nebo přístup, který by odlišil článek od běžných textů na toto téma.

Navrhni:
1. Hlavní tezi nebo argument článku
2. 3-4 klíčové body, které by měl článek pokrýt
3. Unikátní perspektivu nebo přístup k tématu (např. z pohledu malých firem, z pohledu mezinárodního srovnání, z pohledu nových technologií, atd.)

Odpověz ve formátu JSON s klíči "mainThesis", "keyPoints" a "uniquePerspective".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi kreativní stratég obsahu specializující se na finanční a právní témata." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const approach = JSON.parse(completion.choices[0].message.content);
    return approach;
  } catch (error) {
    console.error("Chyba při generování přístupu k tématu:", error);
    // Fallback přístup
    return {
      mainThesis: `Je důležité porozumět všem aspektům tématu ${topic}.`,
      keyPoints: [
        "Legislativní rámec a aktuální změny",
        "Praktické postupy a doporučení",
        "Případové studie a příklady z praxe",
        "Budoucí trendy a vývoj"
      ],
      uniquePerspective: `Pohled z perspektivy efektivity a optimalizace procesů v oblasti ${category.toLowerCase()}.`
    };
  }
}

// Získání obrázku z Unsplash
const getUnsplashImage = async (category) => {
  try {
    // Profesionální byznisové prompty
    const businessPrompts = [
      "professional business meeting",
      "corporate office skyscraper",
      "business people handshake",
      "modern office building",
      "business professionals conference room",
      "corporate team meeting",
      "business district skyscrapers",
      "executive office desk",
      "business contract signing",
      "professional corporate environment"
    ];
    
    // Náhodně vybereme jeden z profesionálních promptů
    const randomPrompt = businessPrompts[Math.floor(Math.random() * businessPrompts.length)];
    
    // Přidáme kategorii, ale jen jako doplněk k hlavnímu profesionálnímu promtu
    const searchQuery = `${randomPrompt} ${category}`;
    
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return {
        url: data.urls.regular,
        credit: {
          name: data.user.name,
          link: data.user.links.html
        }
      };
    } else {
      // Pokud první pokus selže, zkusíme čistě profesionální prompt bez kategorie
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(randomPrompt)}&orientation=landscape&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return {
          url: fallbackData.urls.regular,
          credit: {
            name: fallbackData.user.name,
            link: fallbackData.user.links.html
          }
        };
      }
    }
    
    throw new Error('Nepodařilo se získat obrázek z Unsplash');
  } catch (error) {
    console.error('Chyba při získávání obrázku z Unsplash:', error);
    // Fallback na výchozí obrázek
    return {
      url: '/images/default-business.jpg',
      credit: {
        name: 'Default Image',
        link: 'https://expohledavky.cz'
      }
    };
  }
};

// Funkce pro generování obsahu článku
async function generateArticleContent(topic, category, uniquePerspective) {
  try {
    console.log(`Generuji obsah článku pro téma: ${topic}...`);
    
    const prompt = `Vytvoř profesionální a informativní článek na téma "${topic}" v kategorii "${category}". 
    
Článek by měl mít tento unikátní úhel pohledu: "${uniquePerspective}"

Dodržuj tyto specifikace:
1. Článek piš v češtině, v profesionálním, ale srozumitelném jazyce pro majitele firem a podnikatele
2. Zaměř se na praktické informace relevantní pro české právní prostředí
3. Používej Markdown pro formátování
4. Nepoužívej hlavní nadpis H1 (ten bude automaticky generován z titulku)
5. Používej nadpisy úrovně H2 (##) pro hlavní sekce a H3 (###) pro podsekce
6. Formátuj důležité termíny tučně (**termín**) a klíčové fráze kurzívou (*fráze*)
7. Rozděl text do krátkých odstavců (3-4 věty)
8. Používej odrážky pro seznamy a číslované seznamy pro procesy
9. Zahrň 1-2 praktické příklady nebo citace, formátované jako bloková citace (> citace)
10. Délka článku by měla být 800-1200 slov
11. Na konci uveď shrnutí klíčových bodů

Článek by měl obsahovat:
- Úvod vysvětlující důležitost tématu
- 3-4 hlavní sekce rozebírající různé aspekty tématu
- Praktické tipy nebo doporučení
- Závěrečné shrnutí

Obsah musí být aktuální, fakticky správný a relevantní pro české podniky a podnikatele.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi odborník na pohledávky, finanční řízení a české obchodní právo. Píšeš profesionální, fakticky přesné a prakticky zaměřené články pro podnikatele. Vždy používáš kvalitní strukturování textu, nadpisy, odrážky a další prvky pro lepší čitelnost." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Chyba při generování obsahu článku:", error);
    // Fallback obsah
    return `
## Úvod k tématu ${topic}

V dnešním podnikatelském prostředí je téma "${topic}" stále důležitější. Tento článek se zaměřuje na klíčové aspekty z perspektivy "${uniquePerspective}".

## Legislativní rámec

České zákony v této oblasti definují několik důležitých pravidel, která musí podniky dodržovat.

## Praktické postupy

Pro efektivní řešení této problematiky doporučujeme následovat tyto kroky:

1. Analyzujte současnou situaci
2. Konzultujte s odborníkem
3. Implementujte preventivní opatření

## Případové studie

> "V naší společnosti jsme implementovali nový systém, který zlepšil efektivitu o 35%." - Zkušený podnikatel

## Závěrečné shrnutí

Téma "${topic}" vyžaduje strategický přístup a znalost aktuální legislativy. Implementací doporučených postupů můžete výrazně zlepšit své výsledky.
`;
  }
}

// Funkce pro generování metadat článku
async function generateMetadata(topic, category, articleContent) {
  try {
    console.log("Generuji metadata článku...");
    
    const prompt = `Na základě tohoto článku na téma "${topic}" v kategorii "${category}" vygeneruj následující metadata:

1. Chytlavý titulek (max 60 znaků)
2. Poutavý podtitulek (max 100 znaků)
3. Krátký popis pro SEO (max 160 znaků)
4. 5-7 relevantních tagů oddělených čárkou
5. Odhadovaný čas čtení ve formátu "X minut čtení"

Odpověz ve formátu JSON s klíči "title", "subtitle", "description", "tags" a "readTime".

Obsah článku:
${articleContent.substring(0, 1500)}...`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi specialista na SEO a tvorbu metadat pro odborné články. Tvým úkolem je vytvářet chytlavé, ale profesionální titulky a popisy."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Chyba při generování metadat:", error);
    
    // Vytvoření odhadovaného času čtení (předpokládáme průměrnou rychlost čtení 200 slov za minutu)
    const wordCount = articleContent.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    
    // Fallback metadata
    return {
      title: topic,
      subtitle: `Důležité informace o ${topic} pro české podnikatele`,
      description: `Odborný článek na téma ${topic} v kategorii ${category}. Praktické rady a tipy pro podnikatele.`,
      tags: `${category.toLowerCase()}, pohledávky, správa pohledávek, české firmy, podnikání`,
      readTime: `${readTimeMinutes} minut čtení`
    };
  }
}

// Funkce main, která řídí celý proces generování článků
async function main() {
  try {
    // 1. Náhodně vybíráme kategorii z předem definovaného seznamu
    console.log("Vybírám kategorii...");
    const category = getRandomElement(categories);
    console.log(`Vybraná kategorie: ${category}`);
    
    // 2. Generujeme náhodné téma v rámci vybrané kategorie
    console.log("Generuji téma pomocí OpenAI...");
    const topicResult = await generateRandomTopic(category);
    const topic = topicResult.topic;
    console.log(`Vygenerované téma: ${topic}`);
    
    // 3. Náhodně vybíráme autora
    console.log("Vybírám autora...");
    const author = getRandomElement(authors);
    console.log(`Vybraný autor: ${author.name}, ${author.position}`);
    
    // 4. Generujeme obsah článku
    console.log("Generuji obsah článku pomocí OpenAI...");
    const articleContent = await generateArticleContent(topic, category, topicResult.uniquePerspective);
    
    // 5. Generujeme metadata (titulek, podtitulek, description, tagy, čas čtení)
    console.log("Generuji metadata článku...");
    const metaData = await generateMetadata(topic, category, articleContent);
    
    // Vytvoření SEO-friendly slugu z titulku
    const slug = metaData.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Odstranění diakritiky
      .replace(/[^\w\s-]/g, '') // Odstranění speciálních znaků
      .replace(/\s+/g, '-') // Nahrazení mezer pomlčkami
      .replace(/-+/g, '-') // Odstranění vícenásobných pomlček
      .trim();
    
    // 6. Získání obrázku z Unsplash
    console.log("Získávám obrázek z Unsplash...");
    const imageData = await getUnsplashImage(category);
    
    // 7. Vytvoření MDX souboru
    console.log("Vytvářím MDX soubor...");
    const frontMatter = {
      title: metaData.title,
      subtitle: metaData.subtitle,
      date: new Date().toISOString(),
      description: metaData.description,
      image: imageData.url,
      category: category,
      tags: metaData.tags.split(',').map(tag => tag.trim()),
      author: author.name,
      authorPosition: author.position,
      authorImage: author.image,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: imageData.credit,
      generatedTopic: topic,
      uniqueApproach: topicResult.uniquePerspective
    };
    
    const mdxContent = `---
${Object.entries(frontMatter).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}:\n  ${value.map(item => `- "${item}"`).join('\n  ')}`;
  } else if (typeof value === 'object') {
    return `${key}:\n  ${Object.entries(value).map(([k, v]) => `${k}: '${v}'`).join('\n  ')}`;
  } else {
    return `${key}: "${String(value).replace(/"/g, '\\"')}"`;
  }
}).join('\n')}
---

${articleContent}`;
    
    // Vytvoření adresáře, pokud neexistuje
    const contentDir = path.join(process.cwd(), 'content', 'posts');
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    // Formátování aktuálního data pro název souboru (YYYY-MM-DD)
    const today = new Date();
    const datePrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Uložení MDX souboru
    const mdxFilePath = path.join(contentDir, `${datePrefix}-${slug}.mdx`);
    fs.writeFileSync(mdxFilePath, mdxContent);
    console.log(`MDX soubor vytvořen: ${mdxFilePath}`);
    
    // 8. Aktualizace blogPosts array v app/blog/page.tsx
    await updateBlogPostsArray(slug, metaData, category, author, imageData.url);
    
    console.log("----------------------------------------");
    console.log("🎉 Generování článku úspěšně dokončeno!");
    console.log("----------------------------------------");
    console.log(`Titulek: ${metaData.title}`);
    console.log(`Slug: ${slug}`);
    console.log(`Kategorie: ${category}`);
    console.log("----------------------------------------");
    
    return {
      success: true,
      title: metaData.title,
      slug: slug,
      imagePath: imageData.url,
      topic: topic,
      category: category
    };
  } catch (error) {
    console.error("Chyba při generování článku:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Funkce pro aktualizaci pole blogPosts v app/blog/page.tsx
async function updateBlogPostsArray(slug, metaData, category, author, imagePath) {
  try {
    console.log("Aktualizuji seznam článků v app/blog/page.tsx...");
    
    const pageFilePath = path.join(process.cwd(), 'app', 'blog', 'page.tsx');
    
    // Kontrola, zda soubor existuje
    if (!fs.existsSync(pageFilePath)) {
      console.log("Soubor app/blog/page.tsx nenalezen, přeskakuji aktualizaci.");
      return;
    }
    
    // Načtení obsahu souboru
    let content = fs.readFileSync(pageFilePath, 'utf8');
    
    // Vytvoření nového objektu článku
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}. ${currentDate.getMonth() + 1}. ${currentDate.getFullYear()}`;
    
    // Převod tagů na pole, pokud je to string
    const tagsArray = typeof metaData.tags === 'string' 
      ? metaData.tags.split(',').map(tag => tag.trim()) 
      : metaData.tags;
    
    const newBlogPostWithComma = `  {
    slug: "${slug}",
    title: "${metaData.title.replace(/"/g, '\\"')}",
    subtitle: "${metaData.subtitle.replace(/"/g, '\\"')}",
    date: "${formattedDate}",
    author: "${author.name}",
    authorPosition: "${author.position}",
    authorImage: "${author.image}",
    readTime: "${metaData.readTime}",
    category: "${category}",
    tags: ${JSON.stringify(tagsArray)},
    image: "${imagePath}",
    excerpt: "${metaData.description.replace(/"/g, '\\"')}",
  },`;
    
    // Verze bez čárky pro použití, když je to jediný prvek v poli
    const newBlogPostWithoutComma = `  {
    slug: "${slug}",
    title: "${metaData.title.replace(/"/g, '\\"')}",
    subtitle: "${metaData.subtitle.replace(/"/g, '\\"')}",
    date: "${formattedDate}",
    author: "${author.name}",
    authorPosition: "${author.position}",
    authorImage: "${author.image}",
    readTime: "${metaData.readTime}",
    category: "${category}",
    tags: ${JSON.stringify(tagsArray)},
    image: "${imagePath}",
    excerpt: "${metaData.description.replace(/"/g, '\\"')}",
  }`;
    
    // Najdeme pozici, kam vložit nový článek
    const blogPostsArrayStart = content.indexOf('const blogPosts: BlogPost[] = [');
    
    if (blogPostsArrayStart !== -1) {
      // Pokud je pole prázdné, přidáme první článek bez čárky
      if (content.includes('const blogPosts: BlogPost[] = []')) {
        content = content.replace(
          'const blogPosts: BlogPost[] = []',
          `const blogPosts: BlogPost[] = [
${newBlogPostWithoutComma}
]`
        );
      } else {
        // Kontrolujeme, zda v poli již nějaké články jsou
        const existingArrayContent = content.substring(
          content.indexOf('[', blogPostsArrayStart) + 1,
          content.indexOf(']', blogPostsArrayStart)
        ).trim();
        
        const arrayStart = content.indexOf('[', blogPostsArrayStart);
        
        if (arrayStart !== -1) {
          // Pokud je pole prázdné nebo obsahuje pouze bílé znaky, přidáme článek bez čárky
          if (!existingArrayContent) {
            content = content.slice(0, arrayStart + 1) + 
                     '\n' + newBlogPostWithoutComma + 
                     '\n' + content.slice(content.indexOf(']', arrayStart));
          } else {
            // Jinak přidáme článek s čárkou a zajistíme, že ostatní články mají správnou syntaxi
            content = content.slice(0, arrayStart + 1) + 
                     '\n' + newBlogPostWithComma + 
                     content.slice(arrayStart + 1);
            
            // Ujistíme se, že poslední článek nemá čárku
            const lastCommaPos = content.lastIndexOf(',', content.indexOf(']', arrayStart));
            const closingBracketPos = content.indexOf(']', arrayStart);
            
            if (lastCommaPos > arrayStart && lastCommaPos > content.lastIndexOf('}', closingBracketPos)) {
              content = content.slice(0, lastCommaPos) + content.slice(lastCommaPos + 1);
            }
          }
        }
      }
      
      // Uložíme aktualizovaný soubor
      fs.writeFileSync(pageFilePath, content, 'utf8');
      console.log("Seznam článků úspěšně aktualizován.");
    } else {
      console.log("Nepodařilo se najít pole blogPosts v souboru, přeskakuji aktualizaci.");
    }
  } catch (error) {
    console.error("Chyba při aktualizaci seznamu článků:", error);
  }
}

// Spuštění generátoru
console.log("Spouštím generátor článků...");
main().then((result) => {
  console.log("Výsledek generování:", result);
  process.exit(result.success ? 0 : 1);
}); 