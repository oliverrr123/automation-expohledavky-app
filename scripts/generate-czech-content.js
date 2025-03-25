const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const matter = require('gray-matter');

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Categories for Czech articles
const categories = [
  'Správa pohledávek',
  'Finanční analýza',
  'Vymáhání pohledávek',
  'Etika vymáhání',
  'Insolvence',
  'Prevence'
];

// Authors for Czech articles
const authors = [
  {
    name: "Jan Novák",
    position: "Specialista na pohledávky",
    image: "/placeholder.svg?height=120&width=120",
    bio: "Specialista na správu a vymáhání pohledávek s více než 10 lety zkušeností v oboru."
  },
  {
    name: "Mgr. Martin Dvořák",
    position: "Právní specialista",
    image: "/placeholder.svg?height=120&width=120",
    bio: "Právník specializující se na obchodní právo a vymáhání pohledávek s rozsáhlou praxí v právním poradenství."
  },
  {
    name: "Ing. Petra Svobodová",
    position: "Finanční analytik",
    image: "/placeholder.svg?height=120&width=120",
    bio: "Finanční analytička zaměřující se na řízení cash flow a prevenci platební neschopnosti."
  }
];

// Function to select a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to check if text contains AI references
function containsAIReference(text) {
  const lowerText = text.toLowerCase();
  const forbiddenTerms = [
    'ai', 'umělá inteligence', 'strojové učení', 'automatizace', 
    'robot', 'algoritmus', 'digitalizace', 'software', 'automatické', 
    'automatizované', 'big data', 'chatbot'
  ];
  
  return forbiddenTerms.some(term => lowerText.includes(term));
}

// Function to count AI references in text
function countAIReferences(text) {
  const lowerText = text.toLowerCase();
  const forbiddenTerms = [
    'ai', 'umělá inteligence', 'strojové učení', 'automatizace', 
    'robot', 'algoritmus', 'digitalizace', 'software', 'automatické', 
    'automatizované', 'big data', 'chatbot'
  ];
  
  let count = 0;
  forbiddenTerms.forEach(term => {
    const regex = new RegExp(term, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      count += matches.length;
    }
  });
  
  return count;
}

// Function to generate random topic based on category
async function generateRandomTopic(category) {
  try {
    console.log(`Generuji náhodné téma pro kategorii: ${category}...`);
    
    const prompt = `Vygeneruj originální, specifické a zajímavé téma pro odborný článek o pohledávkách v kategorii "${category}".
    
Téma by mělo být:
1. Relevantní pro český právní rámec
2. Zaměřené na praktické aspekty správy a vymáhání pohledávek pro firmy
3. Specifické (ne obecné jako "Vymáhání pohledávek", ale spíše "Strategie vymáhání pohledávek pro malé a střední podniky během ekonomické recese")
4. Aktuální a odrážející současné podnikatelské trendy a ekonomickou situaci
5. Zajímavé pro majitele firem a podnikatele
6. Vhodné pro odborný článek o délce 800-1200 slov

DŮLEŽITÁ OMEZENÍ:
- ZCELA SE VYHNI tématům souvisejícím s AI, umělou inteligencí, strojovým učením nebo automatizací
- NIKDY nezmiňuj AI nebo automatizaci v názvu nebo jako hlavní téma
- Zaměř se VÝHRADNĚ na tradiční finanční, právní, procesní a vztahové aspekty pohledávek
- Téma musí být relevantní pro běžné podnikatele bez znalosti pokročilých technologií
- Preferuj témata o konkrétních postupech, právních aspektech, vyjednávání a finančních strategiích

Vrať pouze název tématu bez dalších komentářů nebo vysvětlení. Téma musí být v češtině.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi specialista na pohledávky, právní aspekty jejich správy a vymáhání. Tvým úkolem je generovat originální a specifická témata pro odborné články zaměřené na podnikání, finance a právo. Vyhýbáš se VŠEM tématům souvisejícím s technologiemi a AI. Zaměřuješ se na praktické aspekty vymáhání pohledávek z právního, finančního a mezilidského hlediska." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Vygenerované téma: ${topic}`);
    
    // Check if the topic contains AI references
    if (containsAIReference(topic)) {
      console.log("Téma obsahuje zmínku o AI nebo automatizaci, generuji nové téma...");
      return generateRandomTopic(category); // Recursively generate a new topic
    }
    
    // Get a unique approach to the topic
    const approach = await generateUniqueApproach(topic, category);
    
    return {
      topic: topic,
      mainThesis: approach.mainThesis,
      keyPoints: approach.keyPoints,
      uniquePerspective: approach.uniquePerspective
    };
  } catch (error) {
    console.error("Chyba při generování tématu:", error);
    // Fallback topics in case of API failure
    const fallbackTopic = getRandomElement([
      `Aktuální trendy v oblasti ${category.toLowerCase()}`,
      `Praktický průvodce: ${category}`,
      `Jak optimalizovat ${category.toLowerCase()} v roce ${new Date().getFullYear()}`,
      `Časté chyby v ${category.toLowerCase()}`,
      `Budoucnost ${category.toLowerCase()} v měnícím se ekonomickém prostředí`,
      `Právní aspekty ${category.toLowerCase()} po novelách zákonů`,
      `Finanční dopady správného řízení ${category.toLowerCase()}`,
      `Strategický přístup k ${category.toLowerCase()} pro malé firmy`
    ]);
    
    return {
      topic: fallbackTopic,
      mainThesis: `Je důležité porozumět aspektům ${fallbackTopic}.`,
      keyPoints: [
        "Právní rámec a aktuální změny",
        "Praktické postupy a doporučení",
        "Případové studie a praktické příklady",
        "Finanční a právní aspekty tématu"
      ],
      uniquePerspective: `Pohled z hlediska efektivity a optimalizace procesů v oblasti ${category.toLowerCase()}.`
    };
  }
}

// Function to generate a unique approach to a topic
async function generateUniqueApproach(topic, category) {
  try {
    console.log("Generuji unikátní přístup k tématu...");
    
    const prompt = `Pro téma "${topic}" v kategorii "${category}" navrhni unikátní úhel nebo přístup, který by článek odlišil od běžných textů na toto téma.

Navrhni:
1. Hlavní tezi nebo argument článku
2. 3-4 klíčové body, které by měl článek pokrýt
3. Unikátní perspektivu nebo přístup k tématu

DŮLEŽITÁ OMEZENÍ:
- Vyhni se JAKÝMKOLIV zmínkám o technologiích, AI, automatizaci nebo digitalizaci
- Zaměř se na lidský faktor, právní aspekty, finanční strategie, mezilidské vztahy a komunikaci
- Zdůrazni praktické aspekty, které nevyžadují pokročilé technologie
- Preferuj tradiční podnikatelské, právní a finanční úhly pohledu

Odpověz ve formátu JSON s klíči "mainThesis", "keyPoints" a "uniquePerspective".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi kreativní obsahový stratég specializující se na finanční a právní témata. Vyhýbáš se tématům souvisejícím s technologiemi a AI." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const approach = JSON.parse(completion.choices[0].message.content);
    
    // Check if the approach contains AI references
    if (containsAIReference(JSON.stringify(approach))) {
      console.log("Přístup obsahuje zmínku o AI nebo technologiích, generuji nový přístup...");
      return generateUniqueApproach(topic, category); // Recursively generate a new approach
    }
    
    return approach;
  } catch (error) {
    console.error("Chyba při generování přístupu:", error);
    return {
      mainThesis: `Klíčem k úspěšnému řešení v oblasti ${category.toLowerCase()} je strukturovaný a systematický přístup zaměřený na výsledky.`,
      keyPoints: [
        "Právní rámec a jeho praktické dopady",
        "Efektivní komunikace a vyjednávání",
        "Finanční perspektiva a plánování",
        "Prevence problémů a rizik"
      ],
      uniquePerspective: `Zaměření na vztahový management jako klíčový faktor úspěchu v řešení pohledávek.`
    };
  }
}

// Function to get a relevant image for the article
async function getUnsplashImage(category) {
  try {
    console.log("Hledám vhodný obrázek na Unsplash...");
    
    // Map categories to search terms
    const categorySearchTerms = {
      'Správa pohledávek': 'business management office',
      'Finanční analýza': 'financial analysis charts',
      'Vymáhání pohledávek': 'business contract negotiation',
      'Etika vymáhání': 'business ethics handshake',
      'Insolvence': 'business financial problems',
      'Prevence': 'business planning strategy'
    };
    
    // Default search term if category not found
    const searchTerm = categorySearchTerms[category] || 'business professional office';
    
    // Using Unsplash API would be better, but for simplicity, we'll use a random approach
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const imageUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjA5MjJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDI4ODcwNjV8&ixlib=rb-4.0.3&q=80&w=1080`;
    
    // Use a fallback image if the fetched one fails
    return imageUrl;
  } catch (error) {
    console.error("Chyba při získávání obrázku:", error);
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
  }
}

// Function to generate article content
async function generateArticleContent(topic, category, uniquePerspective) {
  try {
    console.log("Generuji obsah článku...");
    
    const prompt = `Napiš odborný článek v češtině na téma "${topic}" v kategorii "${category}" s unikátním přístupem: "${uniquePerspective.uniquePerspective}".

Hlavní teze článku: "${uniquePerspective.mainThesis}"

Klíčové body k pokrytí:
${uniquePerspective.keyPoints.map(point => `- ${point}`).join('\n')}

Důležité pokyny:
1. Piš profesionálně, ale čtivě, pro publikum složené z podnikatelů, manažerů a odborníků v oblasti financí
2. Zaměř se na český právní a obchodní kontext
3. Používej praktické příklady, případové studie nebo ilustrativní situace
4. Poskytni konkrétní postupy a doporučení, které čtenáři mohou přímo aplikovat
5. Článek strukturuj s úvodem, hlavní částí (několik oddílů) a závěrem
6. Délka: přibližně 800-1200 slov
7. Vyhni se akademickému stylu, piš obchodně a prakticky
8. Používej odstavce, podnadpisy a odrážky pro lepší čitelnost

DŮLEŽITÁ OMEZENÍ:
- VYHNI SE JAKÝMKOLIV zmínkám o umělé inteligenci, AI, automatizaci, digitalizaci a technologiích
- Zaměř se na mezilidské, právní, finanční a procesní aspekty bez technologických řešení
- NIKDY nezmiňuj digitální nástroje, software nebo automatizační řešení
- Piš o tradičních, osvědčených, na člověka zaměřených přístupech k řešení problémů
- Text musí být relevantní pro běžné podnikatele bez pokročilých technologických znalostí

Formátuj text v Markdown, používej ## pro hlavní nadpisy a ### pro podnadpisy.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi odborník na pohledávky, finance a obchodní právo v českém právním prostředí. Píšeš praktické odborné články pro podnikatele a manažery." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });
    
    let articleContent = completion.choices[0].message.content;
    
    // Check if the content contains AI references
    if (countAIReferences(articleContent) > 2) {
      console.log("Obsah článku obsahuje příliš mnoho zmínek o AI nebo technologiích, generuji nový obsah...");
      return generateArticleContent(topic, category, uniquePerspective); // Recursively generate new content
    }
    
    return articleContent;
  } catch (error) {
    console.error("Chyba při generování obsahu článku:", error);
    return `## ${topic}

### Úvod

V dnešním podnikatelském prostředí je důležité věnovat pozornost otázkám spojeným s ${category.toLowerCase()}. Tento článek se zaměřuje na praktické aspekty a nabízí užitečné tipy pro podnikatele.

### Hlavní aspekty ${category.toLowerCase()}

${uniquePerspective.mainThesis}

${uniquePerspective.keyPoints.map(point => `#### ${point}\n\nTento aspekt je klíčový pro úspěšné řízení pohledávek. Je důležité věnovat mu dostatečnou pozornost a systematicky ho řešit.\n\n`).join('')}

### Praktické doporučení

Pro efektivní řízení v této oblasti doporučujeme zaměřit se na následující oblasti:

1. Prevence a včasná identifikace rizik
2. Správná dokumentace a evidence
3. Efektivní komunikace s dlužníky
4. Znalost právního rámce a možností

### Závěr

Správně nastavené procesy a systematický přístup k ${category.toLowerCase()} může významně přispět k finanční stabilitě vaší firmy. Implementace těchto doporučení vám pomůže zlepšit celkovou efektivitu a snížit rizika.`;
  }
}

// Function to generate metadata for the article
async function generateMetadata(topic, category, articleContent) {
  try {
    console.log("Generuji metadata pro článek...");
    
    const prompt = `Pro následující článek s názvem "${topic}" v kategorii "${category}" vygeneruj:

1. Poutavý titulek (max 70 znaků)
2. Podnázev/subtitle (max 120 znaků)
3. Krátký popis/excerpt (max 160 znaků)
4. 5-8 relevantních tagů oddělených čárkami
5. Přibližný čas čtení v minutách (odhadni na základě délky obsahu)

Článek začíná takto:
${articleContent.substring(0, 300)}...

Odpověz ve formátu JSON s klíči: "title", "subtitle", "excerpt", "tags", "readTime".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi specialista na obsahový marketing, který vytváří poutavá a SEO-optimalizovaná metadata pro odborné články." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const metadata = JSON.parse(completion.choices[0].message.content);
    return metadata;
  } catch (error) {
    console.error("Chyba při generování metadat:", error);
    return {
      title: topic,
      subtitle: `Praktický průvodce pro podnikatele v oblasti ${category.toLowerCase()}`,
      excerpt: `Zjistěte, jak efektivně řešit ${category.toLowerCase()} v současném podnikatelském prostředí.`,
      tags: ["pohledávky", "finance", "podnikání", "právo", category.toLowerCase().replace(/\s+/g, '-')],
      readTime: `${Math.ceil(articleContent.length / 1000)} min čtení`
    };
  }
}

// Function to create a slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim(); // Trim leading/trailing spaces
}

// Main function to generate Czech content
async function generateCzechContent() {
  try {
    console.log("Začínám generovat český obsah...");
    
    // Select a random category
    const selectedCategory = getRandomElement(categories);
    console.log(`Vybraná kategorie: ${selectedCategory}`);
    
    // Generate a random topic and approach
    const topicData = await generateRandomTopic(selectedCategory);
    console.log(`Téma: ${topicData.topic}`);
    console.log(`Hlavní teze: ${topicData.mainThesis}`);
    console.log(`Klíčové body: ${topicData.keyPoints.join(', ')}`);
    
    // Generate article content
    const articleContent = await generateArticleContent(topicData.topic, selectedCategory, topicData);
    console.log("Obsah článku byl vygenerován");
    
    // Generate metadata
    const metadata = await generateMetadata(topicData.topic, selectedCategory, articleContent);
    console.log("Metadata byla vygenerována");
    
    // Generate image
    const imageUrl = await getUnsplashImage(selectedCategory);
    console.log(`Obrázek URL: ${imageUrl}`);
    
    // Create slug from title
    const slug = createSlug(metadata.title);
    console.log(`Slug: ${slug}`);
    
    // Select random author
    const selectedAuthor = getRandomElement(authors);
    console.log(`Autor: ${selectedAuthor.name}`);
    
    // Create today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Create frontmatter for the article
    const frontmatter = {
      title: metadata.title,
      subtitle: metadata.subtitle,
      date: formattedDate,
      category: selectedCategory,
      tags: metadata.tags,
      excerpt: metadata.excerpt,
      image: imageUrl,
      author: selectedAuthor.name,
      authorPosition: selectedAuthor.position,
      authorImage: selectedAuthor.image,
      readTime: metadata.readTime
    };
    
    // Create the MDX content
    const mdxContent = `---
${Object.entries(frontmatter).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}:\n${value.map(item => `  - "${item}"`).join('\n')}`;
  }
  return `${key}: "${value}"`;
}).join('\n')}
---

${articleContent}`;
    
    // Create the file name with date and slug
    const fileName = `${formattedDate}-${slug}.mdx`;
    const filePath = path.join(process.cwd(), 'content', 'posts', fileName);
    
    // Save the file
    fs.writeFileSync(filePath, mdxContent);
    console.log(`Článek byl uložen do souboru: ${fileName}`);
    
    return {
      success: true,
      filePath,
      fileName,
      title: metadata.title,
      category: selectedCategory
    };
  } catch (error) {
    console.error("Chyba při generování českého obsahu:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Execute the main function
generateCzechContent().then(result => {
  if (result.success) {
    console.log(`Generování českého obsahu bylo úspěšně dokončeno. Soubor: ${result.fileName}`);
  } else {
    console.error(`Došlo k chybě při generování českého obsahu: ${result.error}`);
    process.exit(1);
  }
}).catch(error => {
  console.error("Kritická chyba při generování obsahu:", error);
  process.exit(1);
}); 