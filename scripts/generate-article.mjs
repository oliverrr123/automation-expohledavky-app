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
    return topic;
  } catch (error) {
    console.error("Chyba při generování tématu:", error);
    // Fallback témata pro případ selhání API
    const fallbackTopics = [
      `Aktuální trendy v ${category.toLowerCase()}`,
      `Praktický průvodce: ${category}`,
      `Jak optimalizovat ${category.toLowerCase()} v roce ${new Date().getFullYear()}`,
      `Nejčastější chyby při ${category.toLowerCase()}`,
      `Budoucnost ${category.toLowerCase()} v digitální éře`
    ];
    return getRandomElement(fallbackTopics);
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

// Hlavní funkce pro generování článku
async function generateArticle() {
  try {
    console.log("Začínám generování nového článku...");
    
    // 1. Náhodně vybereme kategorii a autora
    const category = getRandomElement(categories);
    const author = getRandomElement(authors);
    
    console.log(`Vybraná kategorie: ${category}`);
    console.log(`Vybraný autor: ${author.name}`);
    
    // 2. Vygenerujeme náhodné téma na základě kategorie
    const topic = await generateRandomTopic(category);
    
    // 3. Vygenerujeme unikátní přístup k tématu
    const approach = await generateUniqueApproach(topic, category);
    
    // 4. Vygenerujeme článek pomocí GPT-4O s unikátním přístupem
    console.log("Generuji obsah článku pomocí OpenAI...");
    
    const prompt = `Napiš odborný článek na téma "${topic}" pro web expohledavky.cz, který se zabývá správou a vymáháním pohledávek.

Hlavní teze článku: ${approach.mainThesis}

Klíčové body k pokrytí:
${approach.keyPoints.map(point => `- ${point}`).join('\n')}

Unikátní perspektiva: ${approach.uniquePerspective}

Článek musí být:
- Plně v českém jazyce
- Odborný, ale srozumitelný pro běžného podnikatele
- Strukturovaný s nadpisy a podnadpisy (použij markdown formátování)
- Obsahovat praktické rady a tipy
- Délka mezi 800-1200 slov
- Obsahovat aktuální informace relevantní pro český právní systém
- Kategorie: ${category}

Na konci článku přidej krátké shrnutí hlavních bodů.

Formátuj text v Markdown (## pro nadpisy, *kurzíva*, **tučné**, atd.). Vynech úvodní nadpis H1, ten bude automaticky vytvořen z názvu.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi specialista na pohledávky, právní aspekty jejich správy a vymáhání. Tvým úkolem je generovat kvalitní odborné články pro blog expohledavky.cz. Každý tvůj článek musí být unikátní, informativní a prakticky užitečný." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });
    
    const articleContent = completion.choices[0].message.content;
    console.log("Obsah článku vygenerován.");
    
    // 5. Získání titulku a další parametry
    console.log("Generuji metadata článku...");
    const titlePrompt = `Na základě následujícího článku vytvoř:
1. Chytlavý, profesionální titulek (max. 70 znaků)
2. Poutavý podtitulek (max. 120 znaků)
3. Stručný popis pro meta description a excerpt (max. 160 znaků)
4. Seznam 4-6 relevantních tagů (klíčových slov) oddělených čárkou
5. Odhadovanou dobu čtení (ve formátu "X minut čtení")

Vrať výsledek jako JSON objekt s položkami title, subtitle, description, tags a readTime.

Článek:
${articleContent.substring(0, 1500)}...`;

    const titleCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: titlePrompt }],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const metaData = JSON.parse(titleCompletion.choices[0].message.content);
    console.log(`Titulek: ${metaData.title}`);
    console.log(`Podtitulek: ${metaData.subtitle}`);
    
    // 6. Získání obrázku z Unsplash
    console.log("Získávám obrázek z Unsplash...");
    
    // Kombinujeme kategorii a tagy pro lepší výsledky vyhledávání
    const tags = metaData.tags.split(',').map(tag => tag.trim());
    const randomTag = getRandomElement(tags);
    const imageKeywords = `business document ${category.toLowerCase()} ${randomTag} contract legal paper`;
    
    const unsplashResponse = await axios.get(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(imageKeywords)}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${unsplashAccessKey}`,
        },
      }
    );
    
    const imageUrl = unsplashResponse.data.urls.regular;
    const imageDownloadUrl = unsplashResponse.data.links.download;
    const photographer = unsplashResponse.data.user.name;
    const photographerUrl = unsplashResponse.data.user.links.html;
    
    // Stažení a uložení obrázku
    const imageDir = path.join(process.cwd(), 'public', 'images', 'blog');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    const imageFileName = `article-${Date.now()}.jpg`;
    const imagePath = path.join(imageDir, imageFileName);
    
    const imageResponse = await axios.get(imageDownloadUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(imagePath, imageResponse.data);
    console.log(`Obrázek uložen: ${imagePath}`);
    
    // 7. Vytvoření MDX souboru
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    
    // Vytvoření slug z titulku
    let slug = metaData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // odstranění diakritiky
      .replace(/[^a-z0-9]+/g, '-')     // nahrazení speciálních znaků pomlčkou
      .replace(/^-+|-+$/g, '');        // odstranění pomlček na začátku a konci
    
    // Přidání data k názvu souboru pro lepší organizaci
    const fileName = `${formattedDate}-${slug}.mdx`;
    
    // Převod tagů na pole
    const tagsArray = metaData.tags.split(',').map(tag => tag.trim());
    
    // Vytvoření frontmatter
    const frontMatter = {
      title: metaData.title,
      subtitle: metaData.subtitle,
      date: new Date().toISOString(),
      description: metaData.description,
      image: `/images/blog/${imageFileName}`,
      category: category,
      tags: tagsArray,
      author: author.name,
      authorPosition: author.position,
      authorImage: author.image,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: {
        photographer: photographer,
        url: photographerUrl
      },
      generatedTopic: topic,
      uniqueApproach: approach.uniquePerspective
    };
    
    // Spojení frontmatter a obsahu
    const fileContent = matter.stringify(articleContent, frontMatter);
    
    // Uložení MDX souboru
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    const filePath = path.join(postsDir, fileName);
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`Článek úspěšně vygenerován a uložen jako: ${fileName}`);
    
    // 8. Aktualizace blogPosts array v app/blog/page.tsx
    await updateBlogPostsArray(slug, metaData, category, author, `/images/blog/${imageFileName}`);
    
    return {
      success: true,
      fileName,
      title: metaData.title,
      slug: slug,
      imagePath: `/images/blog/${imageFileName}`,
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
    
    const newBlogPost = `  {
    slug: "${slug}",
    title: "${metaData.title.replace(/"/g, '\\"')}",
    subtitle: "${metaData.subtitle.replace(/"/g, '\\"')}",
    date: "${formattedDate}",
    author: "${author.name}",
    authorPosition: "${author.position}",
    authorImage: "${author.image}",
    readTime: "${metaData.readTime}",
    category: "${category}",
    tags: ${JSON.stringify(metaData.tags.split(',').map(tag => tag.trim()))},
    image: "${imagePath}",
    excerpt: "${metaData.description.replace(/"/g, '\\"')}",
  },`;
    
    // Najdeme pozici, kam vložit nový článek
    const blogPostsArrayStart = content.indexOf('const blogPosts: BlogPost[] = [');
    
    if (blogPostsArrayStart !== -1) {
      // Pokud je pole prázdné, přidáme první článek
      if (content.includes('const blogPosts: BlogPost[] = []')) {
        content = content.replace(
          'const blogPosts: BlogPost[] = []',
          `const blogPosts: BlogPost[] = [
${newBlogPost}
]`
        );
      } else {
        // Jinak přidáme na začátek pole
        const arrayStart = content.indexOf('[', blogPostsArrayStart);
        if (arrayStart !== -1) {
          content = content.slice(0, arrayStart + 1) + 
                   '\n' + newBlogPost + 
                   content.slice(arrayStart + 1);
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
generateArticle().then((result) => {
  console.log("Výsledek generování:", result);
  process.exit(result.success ? 0 : 1);
}); 