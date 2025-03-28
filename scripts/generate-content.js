#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const matter = require('gray-matter');

// Import shared utilities
const { 
  getRandomElement,
  createSlug,
  generateArticleContent, 
  getArticleImage, 
  generateMetadata,
  generateUniqueApproach,
  generateRandomTopic
} = require('./article-generation-utils');

// Konfigurace pro OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Konfigurace pro všechny jazyky
const config = {
  // Čeština
  cs: {
    name: "Czech",
    emoji: "🇨🇿",
    folder: "posts-cs",
    logStart: "=== Spouštím generování českého obsahu ===",
    logSuccess: "🎉 Generování českého článku úspěšně dokončeno!",
    logCategory: "Vybírám kategorii...",
    logCategorySelected: "Vybraná kategorie",
    logTopic: "Generuji téma pomocí OpenAI...",
    logTopicGenerated: "Vygenerované téma",
    logApproach: "Generuji unikátní přístup k tématu...",
    logAuthor: "Vybírám autora...",
    logAuthorSelected: "Vybraný autor",
    logContent: "Generuji obsah článku pomocí OpenAI...",
    logMetadata: "Generuji metadata článku...",
    logImage: "Získávám obrázek z Unsplash...",
    logFile: "Vytvářím MDX soubor...",
    logFileCreated: "MDX soubor vytvořen",
    logTitle: "Titulek",
    logSlug: "Slug",
    logCategoryOutput: "Kategorie",
    errorGeneration: "❌ Chyba při generování českého obsahu:",
    successMessage: "✅ Proces generování českého obsahu dokončen.",
    failureMessage: "❌ Generování selhalo:",
    categories: [
      'Správa pohledávek',
      'Finanční analýza',
      'Vymáhání pohledávek',
      'Etika vymáhání',
      'Insolvence',
      'Prevence'
    ],
    authors: [
      {
        name: "Jan Novák",
        position: "Specialista na pohledávky",
        bio: "Specialista na správu a vymáhání pohledávek s více než 10 lety zkušeností v oboru."
      },
      {
        name: "Mgr. Martin Dvořák",
        position: "Právní specialista",
        bio: "Právník specializující se na obchodní právo a vymáhání pohledávek s rozsáhlou praxí v právním poradenství."
      },
      {
        name: "Ing. Petra Svobodová",
        position: "Finanční analytik",
        bio: "Finanční analytička zaměřující se na řízení cash flow a prevenci platební neschopnosti."
      }
    ]
  },
  
  // Slovenština
  sk: {
    name: "Slovak",
    emoji: "🇸🇰",
    folder: "posts-sk",
    logStart: "=== Spúšťam generovanie slovenského obsahu ===",
    logSuccess: "🎉 Generovanie slovenského článku úspešne dokončené!",
    logCategory: "Vyberám kategóriu...",
    logCategorySelected: "Vybraná kategória",
    logTopic: "Generujem tému pomocou OpenAI...",
    logTopicGenerated: "Vygenerovaná téma",
    logApproach: "Generujem unikátny prístup k téme...",
    logAuthor: "Vyberám autora...",
    logAuthorSelected: "Vybraný autor",
    logContent: "Generujem obsah článku pomocou OpenAI...",
    logMetadata: "Generujem metadata článku...",
    logImage: "Získavam obrázok z Unsplash...",
    logFile: "Vytváram MDX súbor...",
    logFileCreated: "MDX súbor vytvorený",
    logTitle: "Titulok",
    logSlug: "Slug",
    logCategoryOutput: "Kategória",
    errorGeneration: "❌ Chyba pri generovaní slovenského obsahu:",
    successMessage: "✅ Proces generovania slovenského obsahu dokončený.",
    failureMessage: "❌ Generovanie zlyhalo:",
    categories: [
      'Správa pohľadávok',
      'Finančná analýza',
      'Vymáhanie pohľadávok',
      'Etika vymáhania',
      'Insolvencia',
      'Prevencia'
    ],
    authors: [
      {
        name: "Ján Kováč",
        position: "Špecialista na pohľadávky",
        bio: "Špecialista na správu a vymáhanie pohľadávok s viac ako 10 rokmi skúseností v odbore."
      },
      {
        name: "Mgr. Mária Horváthová",
        position: "Právna poradkyňa",
        bio: "Právnička špecializujúca sa na obchodné právo a vymáhanie pohľadávok s rozsiahlou praxou v právnom poradenstve."
      },
      {
        name: "Ing. Peter Novotný",
        position: "Finančný analytik",
        bio: "Finančný analytik zameraný na riadenie cash flow a prevenciu platobnej neschopnosti."
      }
    ]
  },
  
  // Němčina
  de: {
    name: "German",
    emoji: "🇩🇪",
    folder: "posts-de",
    logStart: "=== Starte die Generierung von deutschen Inhalten ===",
    logSuccess: "🎉 Generierung des deutschen Artikels erfolgreich abgeschlossen!",
    logCategory: "Kategorie auswählen...",
    logCategorySelected: "Ausgewählte Kategorie",
    logTopic: "Generiere Thema mit OpenAI...",
    logTopicGenerated: "Generiertes Thema",
    logApproach: "Generiere einzigartigen Ansatz zum Thema...",
    logAuthor: "Autor auswählen...",
    logAuthorSelected: "Ausgewählter Autor",
    logContent: "Generiere Artikelinhalt mit OpenAI...",
    logMetadata: "Generiere Artikel-Metadaten...",
    logImage: "Bild von Unsplash abrufen...",
    logFile: "Erstelle MDX-Datei...",
    logFileCreated: "MDX-Datei erstellt",
    logTitle: "Titel",
    logSlug: "Slug",
    logCategoryOutput: "Kategorie",
    errorGeneration: "❌ Fehler bei der Generierung von deutschen Inhalten:",
    successMessage: "✅ Deutsche Inhaltsgenerierung abgeschlossen.",
    failureMessage: "❌ Generierung fehlgeschlagen:",
    categories: [
      'Forderungsmanagement',
      'Finanzanalyse',
      'Inkasso',
      'Inkasso-Ethik',
      'Insolvenz',
      'Prävention'
    ],
    authors: [
      {
        name: "Thomas Schmidt",
        position: "Forderungsmanagement Spezialist",
        bio: "Spezialist für Forderungsmanagement und Inkasso mit mehr als 10 Jahren Erfahrung in der Branche."
      },
      {
        name: "Dr. Anna Müller",
        position: "Rechtsberaterin",
        bio: "Juristin mit Schwerpunkt Wirtschaftsrecht und Forderungsmanagement mit umfassender Erfahrung in der Rechtsberatung."
      },
      {
        name: "Dipl.-Fin. Michael Weber",
        position: "Finanzanalyst",
        bio: "Finanzanalyst mit Fokus auf Cashflow-Management und Prävention von Zahlungsunfähigkeit."
      }
    ]
  },
  
  // Angličtina
  en: {
    name: "English",
    emoji: "🇬🇧",
    folder: "posts-en",
    logStart: "=== Starting English content generation ===",
    logSuccess: "🎉 English article generation successfully completed!",
    logCategory: "Selecting category...",
    logCategorySelected: "Selected category",
    logTopic: "Generating topic using OpenAI...",
    logTopicGenerated: "Generated topic",
    logApproach: "Generating unique approach to the topic...",
    logAuthor: "Selecting author...",
    logAuthorSelected: "Selected author",
    logContent: "Generating article content using OpenAI...",
    logMetadata: "Generating article metadata...",
    logImage: "Getting image from Unsplash...",
    logFile: "Creating MDX file...",
    logFileCreated: "MDX file created",
    logTitle: "Title",
    logSlug: "Slug",
    logCategoryOutput: "Category",
    errorGeneration: "❌ Error generating English content:",
    successMessage: "✅ English content generation process completed.",
    failureMessage: "❌ Generation failed:",
    categories: [
      'Receivables Management',
      'Financial Analysis',
      'Debt Collection',
      'Collection Ethics',
      'Insolvency',
      'Prevention'
    ],
    authors: [
      {
        name: "John Smith",
        position: "Receivables Management Specialist",
        bio: "Specialist in receivables management and debt collection with over 10 years of experience in the industry."
      },
      {
        name: "Sarah Johnson, LLB",
        position: "Legal Advisor",
        bio: "Legal professional specializing in business law and receivables management with extensive experience in legal consulting."
      },
      {
        name: "Michael Brown, CFA",
        position: "Financial Analyst",
        bio: "Financial analyst focusing on cash flow management and prevention of payment defaults."
      }
    ]
  }
};

/**
 * Generuje obsah článku pro zadaný jazyk
 * 
 * @param {string} lang - Kód jazyka (cs, sk, de, en)
 * @returns {Promise<Object>} - Výsledek generování
 */
async function generateContent(lang) {
  // Kontrola, zda je jazyk podporován
  if (!config[lang]) {
    throw new Error(`Nepodporovaný jazyk: ${lang}`);
  }

  const langConfig = config[lang];
  
  try {
    console.log(langConfig.logStart);
    
    // 1. Výběr kategorie
    console.log(langConfig.logCategory);
    const category = getRandomElement(langConfig.categories);
    console.log(`${langConfig.logCategorySelected}: ${category}`);
    
    // 2. Generování tématu pomocí OpenAI
    console.log(langConfig.logTopic);
    const topic = await generateRandomTopic(openai, category, lang);
    console.log(`${langConfig.logTopicGenerated}: "${topic}"`);
    
    // 3. Generování unikátního přístupu k tématu
    console.log(langConfig.logApproach);
    const uniqueApproach = await generateUniqueApproach(openai, topic, category, lang);
    
    // 4. Výběr autora
    console.log(langConfig.logAuthor);
    const author = getRandomElement(langConfig.authors);
    console.log(`${langConfig.logAuthorSelected}: ${author.name}, ${author.position}`);
    
    // 5. Generování obsahu článku pomocí OpenAI
    console.log(langConfig.logContent);
    const articleContent = await generateArticleContent(openai, topic, category, uniqueApproach, lang);
    
    // 6. Generování metadat
    console.log(langConfig.logMetadata);
    const metaData = await generateMetadata(openai, topic, category, lang);
    
    // 7. Získání obrázku z Unsplash
    console.log(langConfig.logImage);
    const imageData = await getArticleImage(category, topic, lang);
    
    // 8. Vytvoření MDX souboru
    console.log(langConfig.logFile);
    
    // Vytvoření slugu pro článek
    const slug = createSlug(topic);
    
    // Formátování data - následující den od dneška
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Formátování frontmatter
    const frontMatter = {
      title: metaData.title || topic,
      subtitle: metaData.subtitle,
      date: tomorrow.toISOString(),
      description: metaData.description,
      image: imageData.path,
      category: category,
      tags: Array.isArray(metaData.tags) ? metaData.tags : metaData.tags.split(',').map(tag => tag.trim()),
      author: author.name,
      authorPosition: author.position,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: imageData.photographer,
      excerpt: metaData.description
    };
    
    // Vytvoření MDX obsahu
    const mdxContent = matter.stringify(articleContent, frontMatter);
    
    // Vytvoření názvu souboru s datem a slugem
    const date = tomorrow.toISOString().split('T')[0]; // Formát: YYYY-MM-DD
    const fileName = `${date}-${slug}.mdx`;
    const filePath = path.join(process.cwd(), 'content', langConfig.folder, fileName);
    
    // Vytvoření adresáře, pokud neexistuje
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Zápis souboru
    fs.writeFileSync(filePath, mdxContent);
    console.log(`${langConfig.logFileCreated}: ${filePath}`);
    
    console.log('=================================================');
    console.log(langConfig.logSuccess);
    console.log('=================================================');
    console.log(`${langConfig.logTitle}: ${metaData.title || topic}`);
    console.log(`${langConfig.logSlug}: ${slug}`);
    console.log(`${langConfig.logCategoryOutput}: ${category}`);
    
    return {
      success: true,
      title: metaData.title || topic,
      slug: slug,
      filePath: filePath
    };
  } catch (error) {
    console.error(langConfig.errorGeneration, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Hlavní funkce pro generování obsahu pro všechny jazyky nebo vybrané jazyky
 * 
 * @param {string[]} languages - Pole jazyků, pro které generovat obsah (výchozí: všechny jazyky)
 * @returns {Promise<boolean>} - True, pokud byly všechny články úspěšně vygenerovány
 */
async function generateAllContent(languages = Object.keys(config)) {
  console.log('======================================================');
  console.log('🌍 Starting content generation');
  console.log('======================================================');
  
  const results = {};
  
  try {
    // Generování obsahu pro každý jazyk
    for (const lang of languages) {
      if (!config[lang]) {
        console.error(`⚠️ Nepodporovaný jazyk: ${lang}, přeskakuji...`);
        continue;
      }
      
      console.log(`\n${config[lang].emoji} Starting ${config[lang].name} content generation...`);
      results[lang] = await generateContent(lang);
      console.log(`${config[lang].emoji} ${config[lang].name} content: ${results[lang].success ? 'Success' : 'Failed'}`);
    }
    
    // Souhrn výsledků
    console.log('\n======================================================');
    console.log('📋 Content Generation Summary');
    console.log('======================================================');
    
    const allSuccessful = Object.values(results).every(r => r && r.success);
    
    if (allSuccessful) {
      console.log('✅ All content generated successfully!');
      
      // Výpis podrobností vygenerovaných článků
      console.log('\n📝 Generated Articles:');
      for (const lang in results) {
        if (results[lang] && results[lang].success) {
          console.log(`${config[lang].emoji} ${config[lang].name}: "${results[lang].title}" (${results[lang].slug})`);
        }
      }
    } else {
      console.log('⚠️ Some content generation tasks failed:');
      for (const lang in results) {
        if (results[lang] && !results[lang].success) {
          console.log(`${config[lang].emoji} ${config[lang].name}: Failed - ${results[lang].error}`);
        }
      }
    }
    
    return allSuccessful;
  } catch (error) {
    console.error('❌ Fatal error in content generation process:', error);
    return false;
  }
}

// Zpracování příkazové řádky pro možnost zadání konkrétních jazyků
if (require.main === module) {
  // Získání argumentů z příkazové řádky
  const args = process.argv.slice(2);
  
  // Pokud jsou zadány argumenty, použít je jako jazyky, jinak použít všechny jazyky
  const languages = args.length > 0 ? args : Object.keys(config);
  
  // Kontrola platnosti zadaných jazyků
  const invalidLanguages = languages.filter(lang => !config[lang]);
  if (invalidLanguages.length > 0) {
    console.error(`⚠️ Nepodporované jazyky: ${invalidLanguages.join(', ')}`);
    console.error(`👉 Podporované jazyky: ${Object.keys(config).join(', ')}`);
    process.exit(1);
  }
  
  // Spuštění generování obsahu
  generateAllContent(languages)
    .then(success => {
      console.log('\n======================================================');
      if (success) {
        console.log('✅ All content generation completed successfully.');
        process.exit(0);
      } else {
        console.log('⚠️ Content generation process completed with errors.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fatal error in main process:', error);
      process.exit(1);
    });
}

// Export funkcí pro externí použití
module.exports = {
  generateContent,
  generateAllContent
}; 