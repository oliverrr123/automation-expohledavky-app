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

// Categories for Slovak articles
const categories = [
  'Správa pohľadávok',
  'Finančná analýza',
  'Vymáhanie pohľadávok',
  'Etika vymáhania',
  'Insolvencia',
  'Prevencia'
];

// Authors for Slovak articles with gender specification for profile images
const authors = [
  {
    name: "Juraj Kováč",
    position: "Špecialista na pohľadávky",
    bio: "Špecialista na správu a vymáhanie pohľadávok s viac ako 10 rokmi skúseností v odbore.",
    gender: "male"
  },
  {
    name: "Mgr. Martin Novotný",
    position: "Právny špecialista",
    bio: "Právnik špecializujúci sa na obchodné právo a vymáhanie pohľadávok s rozsiahlou praxou v právnom poradenstve.",
    gender: "male"
  },
  {
    name: "Ing. Jana Svobodová",
    position: "Finančný analytik",
    bio: "Finančná analytička zameriavajúca sa na riadenie cash flow a prevenciu platobnej neschopnosti.",
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
    console.log(`Generujem náhodnú tému pre kategóriu: ${category}...`);
    
    const prompt = `Vygeneruj originálnu, zaujímavú a podnetnou tému pre odborný článok o pohľadávkach v kategórii "${category}".
    
Téma by mala byť:
1. Relevantná pre slovenský právny rámec a atraktívna pre obchodných profesionálov
2. Zameraná na praktické a strategické aspekty správy a vymáhania pohľadávok
3. Vhodná pre komplexný odborný článok s dĺžkou 1500-2000 slov
4. Dostatočne špecifická, aby poskytovala hodnotné poznatky skôr než všeobecný prehľad
5. Inovatívna a skúmajúca nové perspektívy alebo nové trendy

Vyhni sa témam súvisiacim s umelou inteligenciou, automatizáciou alebo technológiami.
Vráť iba názov témy bez ďalších komentárov.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Si špecialista na pohľadávky a právne aspekty ich správy s rozsiahlymi skúsenosťami v tvorbe obsahu pre profesionálov. Generuj praktické, špecifické a inovatívne témy pre odborné články." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Vygenerovaná téma: ${topic}`);
    
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
      `Aktuálne trendy v oblasti ${category.toLowerCase()}`,
      `Praktický sprievodca: ${category}`,
      `Ako optimalizovať ${category.toLowerCase()} v roku ${new Date().getFullYear()}`,
      `Časté chyby v ${category.toLowerCase()}`,
      `Budúcnosť ${category.toLowerCase()} v meniacom sa ekonomickom prostredí`,
      `Právne aspekty ${category.toLowerCase()} po novelách zákonov`,
      `Finančné dopady správneho riadenia ${category.toLowerCase()}`,
      `Strategický prístup k ${category.toLowerCase()} pre malé firmy`
    ]);
    
    return {
      topic: fallbackTopic,
      mainThesis: `Je dôležité porozumieť aspektom ${fallbackTopic}.`,
      keyPoints: [
        "Právny rámec a aktuálne zmeny",
        "Praktické postupy a odporúčania",
        "Prípadové štúdie a praktické príklady",
        "Finančné a právne aspekty témy"
      ],
      uniquePerspective: `Pohľad z hľadiska efektivity a optimalizácie procesov v oblasti ${category.toLowerCase()}.`
    };
  }
}

// Function to generate a unique approach to a topic
async function generateUniqueApproach(topic, category) {
  try {
    console.log("Generujem unikátny prístup k téme...");
    
    const prompt = `Pre tému "${topic}" v kategórii "${category}" navrhni prepracovaný a jedinečný prístup pre odborný článok.

Navrhni:
1. Presvedčivú hlavnú tézu, ktorá ponúka jasný smer pre článok s dĺžkou 1500-2000 slov
2. 5-6 kľúčových bodov, ktoré poskytnú hĺbku a komplexné pokrytie témy
3. Skutočne unikátnu perspektívu, ktorá odlišuje článok od štandardných pojednávaní
4. Špecifikáciu cieľovej skupiny a ako tento prístup bude práve pre ňu prínosný

Zameraj sa na právne, finančné a obchodné aspekty, pričom zaisti, aby prístup kombinoval teoretické znalosti s praktickou aplikáciou.
Odpovedz vo formáte JSON s kľúčmi "mainThesis", "keyPoints", "uniquePerspective" a "targetAudience".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Si kreatívny obsahový stratég špecializujúci sa na finančné a právne témy s odbornými znalosťami v tvorbe vysoko hodnotného obsahu pre obchodných profesionálov." 
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
    console.error("Chyba pri generovaní prístupu:", error);
    return {
      mainThesis: `Kľúčom k úspešnému riešeniu v oblasti ${category.toLowerCase()} je štruktúrovaný a systematický prístup zameraný na výsledky.`,
      keyPoints: [
        "Právny rámec a jeho praktické dopady",
        "Efektívna komunikácia a vyjednávanie",
        "Finančná perspektíva a plánovanie",
        "Prevencia problémov a rizík",
        "Dlhodobá stratégia udržateľnosti vzťahov"
      ],
      uniquePerspective: `Zameranie na vzťahový manažment ako kľúčový faktor úspechu v riešení pohľadávok.`,
      targetAudience: "Finanční manažéri a riaditelia malých a stredných podnikov"
    };
  }
}

// Function to generate metadata for the article
async function generateMetadata(topic, category, articleContent) {
  try {
    console.log('Generujem metadáta článku...');
    
    const prompt = `Pre článok na tému "${topic}" v kategórii "${category}" vytvor metadáta.

Vygeneruj:
1. Chytľavý titulok: max 70 znakov
2. Podtitulok: stručné zhrnutie hlavnej témy
3. Popis: max 150 znakov sumarizujúcich o čom článok je
4. Kľúčové slová: 4-7 relevantných tagov oddelených čiarkou
5. Čas čítania: odhadovaný čas čítania v minútach

Vráť odpoveď vo formáte JSON s kľúčmi "title", "subtitle", "description", "tags", "readTime".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Si odborník na SEO a tvorbu obsahu. Vytváraš presné a pútavé metadáta pre odborné články." 
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
    console.error('Chyba pri generovaní metadát:', error);
    // Default metadata if the API call fails
    return {
      title: topic,
      subtitle: `Praktický sprievodca v oblasti ${category}`,
      description: `Komplexný prehľad témy ${topic} s praktickými radami a postupmi pre slovenských podnikateľov`,
      tags: `pohľadávky, ${category.toLowerCase()}, financie, právo, podnikanie`,
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

// Main function to generate Slovak content
async function generateSlovakContent() {
  try {
    console.log('Spúšťam generovanie slovenského obsahu...');
    
    // 1. Select category
    console.log('Vyberám kategóriu...');
    const category = getRandomElement(categories);
    console.log(`Vybraná kategória: ${category}`);
    
    // 2. Generate topic using OpenAI
    console.log('Generujem tému pomocou OpenAI...');
    const topicResult = await generateRandomTopic(category);
    const topic = topicResult.topic;
    
    // 3. Select author
    console.log('Vyberám autora...');
    const author = getRandomElement(authors);
    console.log(`Vybraný autor: ${author.name}, ${author.position}`);
    
    // 4. Generate author profile image
    const authorImagePath = await getAuthorProfileImage(author, 'sk');
    
    // 5. Generate article content using OpenAI
    console.log('Generujem obsah článku pomocou OpenAI...');
    const articleContent = await generateArticleContent(openai, topic, category, topicResult, 'sk');
    
    // 6. Generate metadata
    console.log('Generujem metadáta článku...');
    const metaData = await generateMetadata(topic, category, articleContent);
    
    // 7. Get image from Unsplash
    console.log("Získavam obrázok z Unsplash...");
    const imageData = await getArticleImage(category, topic);
    
    // 8. Create MDX file
    console.log('Vytváram MDX súbor...');
    
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
    const filePath = path.join(process.cwd(), 'content', 'posts-sk', fileName);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, mdxContent);
    console.log(`MDX súbor vytvorený: ${filePath}`);
    
    console.log('----------------------------------------');
    console.log('🎉 Generovanie článku úspešne dokončené!');
    console.log('----------------------------------------');
    console.log(`Titulok: ${metaData.title || topic}`);
    console.log(`Slug: ${slug}`);
    console.log(`Kategória: ${category}`);
    
    // Return basic article info for potential further use
    return {
      title: metaData.title || topic,
      slug: slug,
      imagePath: imageData.path,
      topic: topic,
      category: category
    };
  } catch (error) {
    console.error('Chyba pri generovaní slovenského obsahu:', error);
    throw error;
  }
}

// Run the function
generateSlovakContent()
  .then(() => console.log('Proces generovania slovenského obsahu dokončený'))
  .catch(error => console.error('Chyba v hlavnom procese:', error)); 