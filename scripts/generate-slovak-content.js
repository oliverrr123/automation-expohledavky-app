const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const matter = require('gray-matter');

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Categories for Slovak articles
const categories = [
  'Správa pohľadávok',
  'Finančná analýza',
  'Vymáhanie pohľadávok',
  'Etika vymáhania',
  'Insolvencia',
  'Prevencia'
];

// Authors for Slovak articles
const authors = [
  {
    name: "Ján Novák",
    position: "Špecialista na pohľadávky",
    image: "/placeholder.svg?height=120&width=120",
    bio: "Špecialista na správu a vymáhanie pohľadávok s viac ako 10 rokmi skúseností v obore."
  },
  {
    name: "Mgr. Martin Kováč",
    position: "Právny špecialista",
    image: "/placeholder.svg?height=120&width=120",
    bio: "Právnik špecializujúci sa na oblasť obchodného práva a vymáhania pohľadávok s praxou v advokácii."
  },
  {
    name: "Ing. Petra Svobodová",
    position: "Finančný analytik",
    image: "/placeholder.svg?height=120&width=120",
    bio: "Finančná analytička zameriavajúca sa na riadenie cash flow a prevenciu platobnej neschopnosti."
  }
];

// Function to select a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to check if text contains AI references - localized for Slovak
function containsAIReference(text) {
  const lowerText = text.toLowerCase();
  const forbiddenTerms = [
    'ai', 'umelá inteligencia', 'strojové učenie', 'automatizácia', 
    'robot', 'algoritmus', 'digitalizácia', 'softvér', 'automatický', 
    'automatizovaný', 'big data', 'machine learning', 'chatbot'
  ];
  
  return forbiddenTerms.some(term => lowerText.includes(term));
}

// Function to count AI references in text
function countAIReferences(text) {
  const lowerText = text.toLowerCase();
  const forbiddenTerms = [
    'ai', 'umelá inteligencia', 'strojové učenie', 'automatizácia', 
    'robot', 'algoritmus', 'digitalizácia', 'softvér', 'automatický', 
    'automatizovaný', 'big data', 'machine learning', 'chatbot'
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
    console.log(`Generujem náhodnú tému pre kategóriu: ${category}...`);
    
    const prompt = `Vygeneruj originálnu, špecifickú a zaujímavú tému pre odborný článok o pohľadávkach v kategórii "${category}".
    
Téma by mala byť:
1. Relevantná pre slovenský trh a právny systém
2. Zameraná na praktické aspekty správy a vymáhania pohľadávok pre firmy
3. Špecifická (nie všeobecná ako "Vymáhanie pohľadávok", ale skôr "Stratégie vymáhania pohľadávok u malých a stredných podnikov v čase ekonomickej recesie")
4. Aktuálna a reflektujúca súčasné obchodné trendy a ekonomickú situáciu
5. Zaujímavá pre podnikateľov a firmy
6. Vhodná pre odborný článok s dĺžkou 800-1200 slov

DÔLEŽITÉ OBMEDZENIA:
- ÚPLNE SA VYHÝBAJ témam týkajúcim sa AI, umelej inteligencie, strojového učenia alebo automatizácie
- NIKDY nespomínaj AI alebo automatizáciu v názve alebo ako hlavnú tému
- Zameraj sa VÝHRADNE na tradičné finančné, právne, procesné a vzťahové aspekty pohľadávok 
- Téma musí byť relevantná pre bežných podnikateľov bez znalostí pokročilých technológií
- Preferuj témy o konkrétnych postupoch, právnych aspektoch, vyjednávaní a finančných stratégiách

Vráť iba názov témy bez ďalších komentárov alebo vysvetlení. Téma musí byť v slovenskom jazyku.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Si špecialista na pohľadávky, právne aspekty ich správy a vymáhania. Tvojou úlohou je generovať originálne a špecifické témy pre odborné články zamerané na biznis, financie a právo. Vyhýbaš sa VŠETKÝM témam súvisiacim s technológiami a AI. Zameriavaš sa na praktické aspekty vymáhania pohľadávok z právneho, finančného a medziľudského hľadiska." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Vygenerovaná téma: ${topic}`);
    
    // Check if the topic contains AI references
    if (containsAIReference(topic)) {
      console.log("Téma obsahuje zmienku o AI alebo automatizácii, generujem novú tému...");
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
    console.error("Chyba pri generovaní témy:", error);
    // Fallback topics in case of API failure
    const fallbackTopic = getRandomElement([
      `Aktuálne trendy v ${category.toLowerCase()}`,
      `Praktický sprievodca: ${category}`,
      `Ako optimalizovať ${category.toLowerCase()} v roku ${new Date().getFullYear()}`,
      `Najčastejšie chyby pri ${category.toLowerCase()}`,
      `Budúcnosť ${category.toLowerCase()} v meniacom sa ekonomickom prostredí`,
      `Právne aspekty ${category.toLowerCase()} po novelizácii zákonov`,
      `Finančné dopady správneho riadenia ${category.toLowerCase()}`,
      `Strategický prístup k ${category.toLowerCase()} pre malé podniky`
    ]);
    
    return {
      topic: fallbackTopic,
      mainThesis: `Je dôležité porozumieť aspektom témy ${fallbackTopic}.`,
      keyPoints: [
        "Legislatívny rámec a aktuálne zmeny",
        "Praktické postupy a odporúčania",
        "Prípadové štúdie a príklady z praxe",
        "Finančné a právne aspekty témy"
      ],
      uniquePerspective: `Pohľad z perspektívy efektivity a optimalizácie procesov v oblasti ${category.toLowerCase()}.`
    };
  }
}

// Function to generate a unique approach to a topic
async function generateUniqueApproach(topic, category) {
  try {
    console.log("Generujem unikátny prístup k téme...");
    
    const prompt = `Pre tému "${topic}" v kategórii "${category}" navrhni unikátny uhol pohľadu alebo prístup, ktorý by odlíšil článok od bežných textov na túto tému.

Navrhni:
1. Hlavnú tézu alebo argument článku
2. 3-4 kľúčové body, ktoré by mal článok pokryť
3. Unikátnu perspektívu alebo prístup k téme 

DÔLEŽITÉ OBMEDZENIA:
- Vyhni sa AKÝMKOĽVEK zmienkam o technológiách, AI, automatizácii alebo digitalizácii
- Zameraj sa na ľudský faktor, právne aspekty, finančné stratégie, medziľudské vzťahy a komunikáciu
- Zdôrazni praktické aspekty, ktoré nevyžadujú pokročilé technológie
- Preferuj tradične biznisové, právne a finančné uhly pohľadu

Odpovedz vo formáte JSON s kľúčmi "mainThesis", "keyPoints" a "uniquePerspective".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Si kreatívny stratég obsahu špecializujúci sa na finančné a právne témy. Vyhýbaš sa témam súvisiacim s technológiami a AI." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const approach = JSON.parse(completion.choices[0].message.content);
    
    // Check if the approach contains AI references
    if (containsAIReference(approach.mainThesis) || 
        approach.keyPoints.some(point => containsAIReference(point)) || 
        containsAIReference(approach.uniquePerspective)) {
      console.log("Vygenerovaný prístup obsahuje zmienky o AI alebo technológiách, generujem nový prístup...");
      return generateUniqueApproach(topic, category); 
    }
    
    return approach;
  } catch (error) {
    console.error("Chyba pri generovaní prístupu k téme:", error);
    // Fallback approach without technology mentions
    return {
      mainThesis: `Je dôležité porozumieť praktickým a právnym aspektom témy ${topic}.`,
      keyPoints: [
        "Legislatívny rámec a aktuálne zmeny",
        "Finančné dopady a riziká",
        "Efektívne komunikačné postupy",
        "Strategické a preventívne opatrenia"
      ],
      uniquePerspective: `Pohľad z perspektívy vyváženosti medzi právnymi nárokmi a zachovaním obchodných vzťahov v oblasti ${category.toLowerCase()}.`
    };
  }
}

// Function to get an image from Unsplash
async function getUnsplashImage(category) {
  try {
    // Professional business prompts without technological focus
    const businessPrompts = [
      "professional business meeting",
      "corporate office",
      "business people handshake",
      "modern office",
      "business professionals",
      "corporate team meeting",
      "financial documents",
      "executive desk",
      "business contract signing",
      "professional corporate environment",
      "business negotiation",
      "legal documents",
      "handshake agreement",
      "business consultation",
      "office meeting room"
    ];
    
    // Randomly select one of the professional prompts
    const randomPrompt = businessPrompts[Math.floor(Math.random() * businessPrompts.length)];
    
    // Add the category as a supplement to the main professional prompt
    const searchQuery = `${randomPrompt} ${category}`;
    
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
      { method: 'GET' }
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
      // If the first attempt fails, try a purely professional prompt without the category
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(randomPrompt)}&orientation=landscape&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
        { method: 'GET' }
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
    
    throw new Error('Nepodarilo sa získať obrázok z Unsplash');
  } catch (error) {
    console.error('Chyba pri získavaní obrázku z Unsplash:', error);
    // Fallback to a default image
    return {
      url: '/images/default-business.jpg',
      credit: {
        name: 'Default Image',
        link: 'https://expohledavky.cz'
      }
    };
  }
}

// Function to generate article content
async function generateArticleContent(topic, category, uniquePerspective) {
  try {
    console.log(`Generujem obsah článku pre tému: ${topic}...`);
    
    const prompt = `Vytvor profesionálny a informatívny článok na tému "${topic}" v kategórii "${category}". 
    
Článok by mal mať tento unikátny uhol pohľadu: "${uniquePerspective}"

Dodržuj tieto špecifikácie:
1. Článok píš v slovenčine, v profesionálnom, ale zrozumiteľnom jazyku pre majiteľov firiem a podnikateľov
2. Zameraj sa na praktické informácie relevantné pre slovenské právne prostredie
3. Používaj Markdown pre formátovanie
4. Nepoužívaj hlavný nadpis H1 (ten bude automaticky generovaný z titulku)
5. Používaj nadpisy úrovne H2 (##) pre hlavné sekcie a H3 (###) pre podsekcie
6. Formátuj dôležité termíny tučne (**termín**) a kľúčové frázy kurzívou (*fráza*)
7. Rozdeľ text do krátkych odsekov (3-4 vety)
8. Používaj odrážky pre zoznamy a číslované zoznamy pre procesy
9. Zahrň 1-2 praktické príklady alebo citácie, formátované ako bloková citácia (> citácia)
10. Dĺžka článku by mala byť 800-1200 slov
11. Na konci uveď zhrnutie kľúčových bodov

DÔLEŽITÉ OBMEDZENIA:
- ÚPLNE SA VYHÝBAJ témam týkajúcim sa AI, umelej inteligencie, strojového učenia alebo automatizácie
- Článok NESMIE propagovať technologické riešenia alebo digitalizáciu ako hlavné riešenie problémov
- Zameraj sa na tradičné biznisové prístupy, ľudský faktor, právne aspekty, vyjednávanie a stratégiu
- Zdôrazni praktické aspekty nevyžadujúce pokročilé technológie

Článok by mal obsahovať:
- Úvod vysvetľujúci dôležitosť témy
- 3-4 hlavné sekcie rozoberajúce rôzne aspekty témy
- Praktické tipy alebo odporúčania
- Záverečné zhrnutie

Obsah musí byť aktuálny, fakticky správny a relevantný pre slovenské podniky a podnikateľov.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Si odborník na pohľadávky, finančné riadenie a slovenské obchodné právo. Píšeš profesionálne, fakticky presné a prakticky zamerané články pre podnikateľov bez dôrazu na technológie. Vždy používaš kvalitné štruktúrovanie textu, nadpisy, odrážky a ďalšie prvky pre lepšiu čitateľnosť." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });
    
    const content = completion.choices[0].message.content.trim();
    
    // Check if the content contains too many AI references
    if (countAIReferences(content) > 2) { // Allow max 2 mentions to keep the content natural
      console.log("Obsah článku obsahuje príliš veľa zmienok o AI alebo technológiách, generujem nový obsah...");
      return generateArticleContent(topic, category, uniquePerspective);
    }
    
    return content;
  } catch (error) {
    console.error("Chyba pri generovaní obsahu článku:", error);
    // Fallback content without technology mentions
    return `
## Úvod k téme ${topic}

V dnešnom podnikateľskom prostredí je téma "${topic}" stále dôležitejšia. Tento článok sa zameriava na kľúčové aspekty z perspektívy "${uniquePerspective}".

## Legislatívny rámec

Slovenské zákony v tejto oblasti definujú niekoľko dôležitých pravidiel, ktoré musia podniky dodržiavať.

## Praktické postupy

Pre efektívne riešenie tejto problematiky odporúčame nasledovať tieto kroky:

1. Analyzujte súčasnú situáciu
2. Konzultujte s odborníkom
3. Implementujte preventívne opatrenia

## Prípadové štúdie

> "V našej spoločnosti sme zaviedli nový systém komunikácie s dlžníkmi, ktorý zlepšil úspešnosť vymáhania o 35%." - Skúsený podnikateľ

## Záverečné zhrnutie

Téma "${topic}" vyžaduje strategický prístup a znalosť aktuálnej legislatívy. Implementáciou odporúčaných postupov môžete výrazne zlepšiť svoje výsledky.
`;
  }
}

// Function to generate article metadata
async function generateMetadata(topic, category, articleContent) {
  try {
    console.log("Generujem metadáta článku...");
    
    const prompt = `Na základe tohto článku na tému "${topic}" v kategórii "${category}" vygeneruj následujúce metadáta:

1. Chytľavý titulok (max 60 znakov)
2. Pútavý podtitulok (max 100 znakov)
3. Krátky popis pre SEO (max 160 znakov)
4. 5-7 relevantných tagov oddelených čiarkou
5. Odhadovaný čas čítania vo formáte "X minút čítania"

DÔLEŽITÉ OBMEDZENIA:
- Vyhni sa AKÝMKOĽVEK zmienkam o AI, technológiách alebo automatizácii v titulku a podtitulku
- Preferuj tagy zamerané na financie, právo, obchodné vzťahy a praktické aspekty

Odpovedz vo formáte JSON s kľúčmi "title", "subtitle", "description", "tags" a "readTime".

Obsah článku:
${articleContent.substring(0, 1500)}...`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Si špecialista na SEO a tvorbu metadát pre odborné články. Tvojou úlohou je vytvárať chytľavé, ale profesionálne titulky a popisy bez dôrazu na technológie."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const metadata = JSON.parse(completion.choices[0].message.content);
    
    // Check if the metadata contains AI references
    if (containsAIReference(metadata.title) || 
        containsAIReference(metadata.subtitle) || 
        (metadata.tags && containsAIReference(metadata.tags))) {
      console.log("Metadáta obsahujú zmienky o AI alebo technológiách, generujem nové metadáta...");
      return generateMetadata(topic, category, articleContent);
    }
    
    return metadata;
  } catch (error) {
    console.error("Chyba pri generovaní metadát:", error);
    
    // Create estimated reading time (assuming an average reading speed of 200 words per minute)
    const wordCount = articleContent.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    
    // Fallback metadata without technology mentions
    return {
      title: topic,
      subtitle: `Praktické informácie o ${topic} pre slovenských podnikateľov`,
      description: `Odborný článok na tému ${topic} v kategórii ${category}. Praktické rady a tipy pre podnikateľov.`,
      tags: `${category.toLowerCase()}, pohľadávky, správa pohľadávok, slovenské firmy, podnikanie, právne aspekty`,
      readTime: `${readTimeMinutes} minút čítania`
    };
  }
}

// Create a slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Main function to control the article generation process
async function generateSlovakContent() {
  try {
    // 1. Randomly select a category from the predefined list
    console.log("Vyberám kategóriu...");
    const category = getRandomElement(categories);
    console.log(`Vybraná kategória: ${category}`);
    
    // 2. Generate a random topic within the selected category
    console.log("Generujem tému pomocou OpenAI...");
    const topicResult = await generateRandomTopic(category);
    const topic = topicResult.topic;
    console.log(`Vygenerovaná téma: ${topic}`);
    
    // 3. Randomly select an author
    console.log("Vyberám autora...");
    const author = getRandomElement(authors);
    console.log(`Vybraný autor: ${author.name}, ${author.position}`);
    
    // 4. Generate article content
    console.log("Generujem obsah článku pomocou OpenAI...");
    const articleContent = await generateArticleContent(topic, category, topicResult.uniquePerspective);
    
    // 5. Generate metadata (title, subtitle, description, tags, reading time)
    console.log("Generujem metadáta článku...");
    const metaData = await generateMetadata(topic, category, articleContent);
    
    // Create SEO-friendly slug from the title
    const slug = createSlug(metaData.title);
    
    // 6. Get an image from Unsplash
    console.log("Získavam obrázok z Unsplash...");
    const imageData = await getUnsplashImage(category);
    
    // 7. Create MDX file
    console.log("Vytváram MDX súbor...");
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
    
    // Create directory if it doesn't exist
    const contentDir = path.join(process.cwd(), 'content', 'posts-sk');
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    // Format the current date for the filename (YYYY-MM-DD)
    const today = new Date();
    const datePrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Save MDX file
    const mdxFilePath = path.join(contentDir, `${datePrefix}-${slug}.mdx`);
    fs.writeFileSync(mdxFilePath, mdxContent);
    console.log(`MDX súbor vytvorený: ${mdxFilePath}`);
    
    console.log("----------------------------------------");
    console.log("🎉 Generovanie článku úspešne dokončené!");
    console.log("----------------------------------------");
    console.log(`Titulok: ${metaData.title}`);
    console.log(`Slug: ${slug}`);
    console.log(`Kategória: ${category}`);
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
    console.error("Chyba pri generovaní článku:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the script
generateSlovakContent().catch(console.error); 