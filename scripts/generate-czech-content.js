const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const matter = require('gray-matter');

// Import shared utilities
const { 
  generateArticleContent, 
  getArticleImage, 
  getAuthorProfileImage,
  containsAIReference 
} = require('./article-generation-utils');

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

// Authors for Czech articles with gender specification for profile images
const authors = [
  {
    name: "Jan Novák",
    position: "Specialista na pohledávky",
    bio: "Specialista na správu a vymáhání pohledávek s více než 10 lety zkušeností v oboru.",
    gender: "male"
  },
  {
    name: "Mgr. Martin Dvořák",
    position: "Právní specialista",
    bio: "Právník specializující se na obchodní právo a vymáhání pohledávek s rozsáhlou praxí v právním poradenství.",
    gender: "male"
  },
  {
    name: "Ing. Petra Svobodová",
    position: "Finanční analytik",
    bio: "Finanční analytička zaměřující se na řízení cash flow a prevenci platební neschopnosti.",
    gender: "female"
  }
];

// Function to select a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to generate random topic based on category
async function generateRandomTopic(category) {
  try {
    console.log(`Generuji náhodné téma pro kategorii: ${category}...`);
    
    const prompt = `Vygeneruj originální, zajímavé a podnětné téma pro odborný článek o pohledávkách v kategorii "${category}".
    
Téma by mělo být:
1. Relevantní pro český právní rámec a atraktivní pro obchodní profesionály
2. Zaměřené na praktické a strategické aspekty správy a vymáhání pohledávek
3. Vhodné pro komplexní odborný článek o délce 1500-2000 slov
4. Dostatečně specifické, aby poskytovalo hodnotné poznatky spíše než obecný přehled
5. Inovativní a zkoumající nové perspektivy nebo nové trendy

Vyhni se tématům souvisejícím s umělou inteligencí, automatizací nebo technologiemi.
Vrať pouze název tématu bez dalších komentářů.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi specialista na pohledávky a právní aspekty jejich správy s rozsáhlými zkušenostmi v tvorbě obsahu pro profesionály. Generuj praktická, specifická a inovativní témata pro odborné články." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Vygenerované téma: ${topic}`);
    
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
    
    const prompt = `Pro téma "${topic}" v kategorii "${category}" navrhni propracovaný a jedinečný přístup pro odborný článek.

Navrhni:
1. Přesvědčivou hlavní tezi, která nabízí jasný směr pro článek o délce 1500-2000 slov
2. 5-6 klíčových bodů, které poskytnou hloubku a komplexní pokrytí tématu
3. Skutečně unikátní perspektivu, která odlišuje článek od standardních pojednání
4. Specifikaci cílové skupiny a jak tento přístup bude právě pro ni přínosný

Zaměř se na právní, finanční a obchodní aspekty, přičemž zajisti, aby přístup kombinoval teoretické znalosti s praktickou aplikací.
Odpověz ve formátu JSON s klíči "mainThesis", "keyPoints", "uniquePerspective" a "targetAudience".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi kreativní obsahový stratég specializující se na finanční a právní témata s odbornými znalostmi v tvorbě vysoce hodnotného obsahu pro obchodní profesionály." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });
    
    const approach = JSON.parse(completion.choices[0].message.content);
    
    return approach;
  } catch (error) {
    console.error("Chyba při generování přístupu:", error);
    return {
      mainThesis: `Klíčem k úspěšnému řešení v oblasti ${category.toLowerCase()} je strukturovaný a systematický přístup zaměřený na výsledky.`,
      keyPoints: [
        "Právní rámec a jeho praktické dopady",
        "Efektivní komunikace a vyjednávání",
        "Finanční perspektiva a plánování",
        "Prevence problémů a rizik",
        "Dlouhodobá strategie udržitelnosti vztahů"
      ],
      uniquePerspective: `Zaměření na vztahový management jako klíčový faktor úspěchu v řešení pohledávek.`,
      targetAudience: "Finanční manažeři a ředitelé malých a středních podniků"
    };
  }
}

// Function to generate metadata for the article
async function generateMetadata(topic, category, articleContent) {
  try {
    console.log('Generuji metadata článku...');
    
    const prompt = `Pro článek na téma "${topic}" v kategorii "${category}" vytvoř metadata.

Vygeneruj:
1. Chytlavý titulek: max 70 znaků
2. Podtitulek: stručné shrnutí hlavního tématu
3. Popis: max 150 znaků shrnující o čem článek je
4. Klíčová slova: 4-7 relevantních tagů oddělených čárkou
5. Čas čtení: odhadovaná doba čtení v minutách

Vrať odpověď ve formátu JSON s klíči "title", "subtitle", "description", "tags", "readTime".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Jsi odborník na SEO a tvorbu obsahu. Vytváříš přesná a poutavá metadata pro odborné články." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const metaData = JSON.parse(completion.choices[0].message.content);
    return metaData;
  } catch (error) {
    console.error('Chyba při generování metadat:', error);
    // Default metadata if the API call fails
    return {
      title: topic,
      subtitle: `Praktický průvodce v oblasti ${category}`,
      description: `Komplexní přehled tématu ${topic} s praktickými radami a postupy pro české podnikatele`,
      tags: `pohledávky, ${category.toLowerCase()}, finance, právo, podnikání`,
      readTime: '8 min'
    };
  }
}

// Function to create a slug from a title
function createSlug(title) {
  return title
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Main function to generate Czech content
async function generateCzechContent() {
  try {
    console.log('Spouštím generování českého obsahu...');
    
    // 1. Select category
    console.log('Vybírám kategorii...');
    const category = getRandomElement(categories);
    console.log(`Vybraná kategorie: ${category}`);
    
    // 2. Generate topic using OpenAI
    console.log('Generuji téma pomocí OpenAI...');
    const topicResult = await generateRandomTopic(category);
    const topic = topicResult.topic;
    
    // 3. Select author
    console.log('Vybírám autora...');
    const author = getRandomElement(authors);
    console.log(`Vybraný autor: ${author.name}, ${author.position}`);
    
    // 4. Generate author profile image
    const authorImagePath = await getAuthorProfileImage(author, 'cs');
    
    // 5. Generate article content using OpenAI
    console.log('Generuji obsah článku pomocí OpenAI...');
    const articleContent = await generateArticleContent(openai, topic, category, topicResult, 'cs');
    
    // 6. Generate metadata
    console.log('Generuji metadata článku...');
    const metaData = await generateMetadata(topic, category, articleContent);
    
    // 7. Get image from Unsplash
    console.log("Získávám obrázek z Unsplash...");
    const imageData = await getArticleImage(category, topic);
    
    // 8. Create MDX file
    console.log('Vytvářím MDX soubor...');
    
    // Create a slug for the article
    const slug = createSlug(topic);
    
    // Format the date - next day from today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format frontmatter
    const frontMatter = {
      title: metaData.title || topic,
      subtitle: metaData.subtitle,
      date: tomorrow.toISOString(),
      description: metaData.description,
      image: imageData.path,
      category: category,
      tags: metaData.tags.split(',').map(tag => tag.trim()),
      author: author.name,
      authorPosition: author.position,
      authorImage: authorImagePath,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: imageData.photographer,
      generatedTopic: topic,
      uniqueApproach: topicResult.uniquePerspective
    };
    
    // Serialize frontmatter to YAML
    const mdxContent = matter.stringify(articleContent, frontMatter);
    
    // Create filename with date and slug
    const date = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const fileName = `${date}-${createSlug(topic)}.mdx`;
    const filePath = path.join(process.cwd(), 'content', 'posts-cs', fileName);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, mdxContent);
    console.log(`MDX soubor vytvořen: ${filePath}`);
    
    console.log('----------------------------------------');
    console.log('🎉 Generování článku úspěšně dokončeno!');
    console.log('----------------------------------------');
    console.log(`Titulek: ${metaData.title || topic}`);
    console.log(`Slug: ${slug}`);
    console.log(`Kategorie: ${category}`);
    
    // Return basic article info for potential further use
    return {
      title: metaData.title || topic,
      slug: slug,
      imagePath: imageData.path,
      topic: topic,
      category: category
    };
  } catch (error) {
    console.error('Chyba při generování českého obsahu:', error);
    throw error;
  }
}

// Run the function
generateCzechContent()
  .then(() => console.log('Proces generování českého obsahu dokončen'))
  .catch(error => console.error('Chyba v hlavním procesu:', error)); 