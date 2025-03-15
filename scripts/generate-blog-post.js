const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const axios = require('axios');
const matter = require('gray-matter');

// Konfigurace OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Konfigurace Unsplash
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

// Témata pro generování článků
const topics = [
  'Vymáhání pohledávek v České republice',
  'Insolvence a její dopady na věřitele',
  'Preventivní opatření proti neplatičům',
  'Exekuční řízení - na co si dát pozor',
  'Vyrovnání pohledávek mimo soud',
  'Postoupení pohledávky - praktické rady',
  'Promlčení pohledávek v obchodních vztazích',
  'Jak správně vystavit fakturu, aby byla vymahatelná',
  'Předžalobní upomínka a její náležitosti',
  'Zástavní právo jako zajištění pohledávky'
];

// Kategorie pro články
const categories = ['Vymáhání pohledávek', 'Správa pohledávek', 'Exekuce', 'Insolvence', 'Právní aspekty', 'Finance'];

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

// Hlavní funkce pro generování článku
async function generateBlogPost() {
  try {
    // 1. Vybereme náhodné téma a další metadata
    const topic = getRandomElement(topics);
    const category = getRandomElement(categories);
    const author = getRandomElement(authors);
    
    console.log(`Generuji článek na téma: ${topic}`);
    
    // 2. Vygenerujeme článek pomocí GPT-4O
    const prompt = `Napiš odborný článek na téma "${topic}" pro web expohledavky.cz, který se zabývá správou a vymáháním pohledávek.

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
          content: "Jsi specialista na pohledávky, právní aspekty jejich správy a vymáhání. Tvým úkolem je generovat kvalitní odborné články pro blog expohledavky.cz." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });
    
    const articleContent = completion.choices[0].message.content;
    
    // 3. Získání titulku a další parametry
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
    
    // 4. Získání obrázku z Unsplash
    console.log("Získávám obrázek z Unsplash");
    
    const imageKeywords = `business document ${category.toLowerCase()} contract legal paper`;
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
    
    // 5. Vytvoření MDX souboru
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
    const tags = metaData.tags.split(',').map(tag => tag.trim());
    
    // Vytvoření frontmatter
    const frontMatter = {
      title: metaData.title,
      subtitle: metaData.subtitle,
      date: new Date().toISOString(),
      description: metaData.description,
      image: `/images/blog/${imageFileName}`,
      category: category,
      tags: tags,
      author: author.name,
      authorPosition: author.position,
      authorImage: author.image,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: {
        photographer: photographer,
        url: photographerUrl
      }
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
    
    return {
      success: true,
      fileName,
      title: metaData.title,
      slug: slug,
      imagePath: `/images/blog/${imageFileName}`
    };
    
  } catch (error) {
    console.error("Chyba při generování článku:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Spuštění generátoru
generateBlogPost().then((result) => {
  console.log("Výsledek generování:", result);
  process.exit(result.success ? 0 : 1);
}); 