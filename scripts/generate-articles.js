// Script to generate new blog articles with reliable image handling
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const axios = require('axios');
const slugify = require('slugify');

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CONFIGURATION
const RELIABLE_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
  'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
  'https://images.unsplash.com/photo-1634224143538-ce0221abca4f',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216',
  'https://images.unsplash.com/photo-1577412647305-991150c7d163',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174',
  'https://images.unsplash.com/photo-1604933762023-f0b656193913',
  'https://images.unsplash.com/photo-1664575599736-c5197c684aec',
  'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc'
];

// Categories by language
const CATEGORIES = {
  en: [
    'Receivables Management',
    'Debt Collection',
    'Cross-Border Receivables',
    'Credit Risk Analysis',
    'Financial Recovery'
  ],
  de: [
    'Forderungsmanagement',
    'Inkasso',
    'Grenzüberschreitende Forderungen',
    'Kreditrisikobewertung',
    'Finanzielle Erholung'
  ],
  sk: [
    'Správa pohľadávok',
    'Vymáhanie dlhov',
    'Cezhraničné pohľadávky',
    'Analýza úverového rizika',
    'Finančné zotavenie'
  ],
  cs: [
    'Správa pohledávek',
    'Vymáhání dluhů',
    'Přeshraniční pohledávky',
    'Analýza úvěrového rizika',
    'Finanční obnova'
  ]
};

// Author names by language
const AUTHORS = {
  en: [
    'Sarah Johnson, MBA',
    'Dr. Michael Reynolds',
    'Jessica Parker, CPA',
    'Thomas Wilson, LLM'
  ],
  de: [
    'Dipl.-Kfm. Anna Fischer',
    'Dr. Markus Schmidt',
    'Mag. Julia Wagner',
    'RA Dr. Thomas Müller'
  ],
  sk: [
    'Ing. Jana Svobodová',
    'JUDr. Martin Novák',
    'Mgr. Eva Kovačová',
    'Ing. Peter Horváth, MBA'
  ],
  cs: [
    'Ing. Tomáš Novotný',
    'JUDr. Jana Dvořáková',
    'Mgr. Martin Dvořák',
    'Ing. Lucie Procházková, MBA'
  ]
};

// Image guidelines by language
const IMAGE_GUIDELINES = {
  cs: 'Obrázek musí být profesionální, související s tématem pohledávek, financí nebo práva. Ideálně fotografie kanceláří, právních dokumentů, finančních grafů nebo obchodních jednání.',
  sk: 'Obrázok musí byť profesionálny, súvisiaci s témou pohľadávok, financií alebo práva. Ideálne fotografie kancelárií, právnych dokumentov, finančných grafov alebo obchodných rokovaní.',
  de: 'Das Bild muss professionell sein und mit dem Thema Forderungen, Finanzen oder Recht zusammenhängen. Idealerweise Fotos von Büros, Rechtsdokumenten, Finanzdiagrammen oder Geschäftstreffen.',
  en: 'The image must be professional, related to the topic of receivables, finance, or law. Ideally photos of offices, legal documents, financial graphs, or business meetings.'
};

// Word counts by language
const WORD_COUNTS = {
  cs: 1000,
  sk: 1000,
  de: 1000,
  en: 1200
};

// Function to download an image reliably
async function downloadImage(imageUrl, savePath) {
  const MAX_RETRIES = 3;
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      console.log(`Downloading image (attempt ${attempt}/${MAX_RETRIES}): ${imageUrl}`);
      
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (response.status === 200 && response.data && response.data.length > 1000) {
        fs.writeFileSync(savePath, response.data);
        console.log(`Image saved successfully to ${savePath}`);
        return true;
      } else {
        console.error(`Received invalid image data (size: ${response.data ? response.data.length : 0} bytes)`);
        if (attempt < MAX_RETRIES) {
          console.log(`Retrying download...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
    } catch (error) {
      console.error(`Error downloading image (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying download...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }
  }
  
  console.error(`Failed to download image after ${MAX_RETRIES} attempts`);
  return false;
}

// Function to get a reliable image
function getReliableImageUrl() {
  const randomIndex = Math.floor(Math.random() * RELIABLE_IMAGE_URLS.length);
  const baseImageUrl = RELIABLE_IMAGE_URLS[randomIndex];
  return `${baseImageUrl}?fit=crop&w=1600&h=900&q=80`;
}

// Function to generate a unique article title based on language
async function generateArticleTitle(language) {
  // Define prompts by language
  const prompts = {
    en: "Generate a professional title for a business article about receivables management, debt collection, or financial risk. The title should be catchy, professional, and between 4-10 words. Return only the title without quotes or any other text.",
    de: "Generieren Sie einen professionellen Titel für einen Geschäftsartikel über Forderungsmanagement, Inkasso oder Finanzrisiken. Der Titel sollte eingängig, professionell und zwischen 4-10 Wörtern lang sein. Geben Sie nur den Titel ohne Anführungszeichen oder anderen Text zurück.",
    sk: "Vytvorte profesionálny nadpis pre obchodný článok o správe pohľadávok, vymáhaní dlhov alebo finančnom riziku. Nadpis by mal byť chytľavý, profesionálny a mať 4-10 slov. Vráťte iba nadpis bez úvodzoviek alebo iného textu.",
    cs: "Vytvořte profesionální nadpis pro obchodní článek o správě pohledávek, vymáhání dluhů nebo finančním riziku. Nadpis by měl být chytlavý, profesionální a mít 4-10 slov. Vraťte pouze nadpis bez uvozovek nebo jiného textu."
  };
  
  // Generate title with OpenAI
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional business writer specializing in financial and legal content." },
        { role: "user", content: prompts[language] }
      ],
      temperature: 0.8,
      max_tokens: 50,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating article title:", error);
    // Fallback titles if API fails
    const fallbackTitles = {
      en: "Best Practices in Modern Receivables Management",
      de: "Moderne Ansätze im Forderungsmanagement",
      sk: "Efektívne stratégie správy pohľadávok",
      cs: "Efektivní přístupy ve správě pohledávek"
    };
    return fallbackTitles[language];
  }
}

// Function to generate article content
async function generateArticleContent(title, language, category) {
  // Define prompts by language
  const prompts = {
    en: `Write a comprehensive, professional article about "${title}" in the category "${category}". The article should be detailed, educational, and tailored for business professionals dealing with financial matters. Include practical advice, case studies, and industry insights. Format using markdown with ## for section headers. The article should be approximately ${WORD_COUNTS[language]} words long.`,
    de: `Schreiben Sie einen umfassenden, professionellen Artikel über "${title}" in der Kategorie "${category}". Der Artikel sollte detailliert, lehrreich und auf Geschäftsleute zugeschnitten sein, die mit Finanzangelegenheiten zu tun haben. Fügen Sie praktische Ratschläge, Fallstudien und Brancheneinblicke ein. Formatieren Sie mit Markdown mit ## für Abschnittsüberschriften. Der Artikel sollte ungefähr ${WORD_COUNTS[language]} Wörter lang sein.`,
    sk: `Napíšte komplexný, profesionálny článok o "${title}" v kategórii "${category}". Článok by mal byť podrobný, vzdelávací a prispôsobený pre podnikateľov, ktorí sa zaoberajú finančnými záležitosťami. Zahrňte praktické rady, prípadové štúdie a prehľad odvetvia. Formátujte pomocou markdown s ## pre nadpisy sekcií. Článok by mal mať približne ${WORD_COUNTS[language]} slov.`,
    cs: `Napište komplexní, profesionální článek o "${title}" v kategorii "${category}". Článek by měl být podrobný, vzdělávací a přizpůsobený pro podnikatele, kteří se zabývají finančními záležitostmi. Zahrňte praktické rady, případové studie a přehled odvětví. Formátujte pomocí markdown s ## pro nadpisy sekcí. Článek by měl mít přibližně ${WORD_COUNTS[language]} slov.`
  };
  
  // Generate content with OpenAI
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert financial and legal writer specializing in business content. You write detailed, practical articles with real-world examples and advice." 
        },
        { role: "user", content: prompts[language] }
      ],
      temperature: 0.7,
      max_tokens: 3500,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating article content:", error);
    // Return a basic template if API fails
    return `
## Introduction
An introduction to ${title} in the field of ${category}.

## Key Concepts
The main concepts related to this topic.

## Practical Implementation
How to implement these ideas in practice.

## Case Studies
Examples from the industry.

## Conclusion
Summary of key points.
`;
  }
}

// Function to create a new article
async function createArticle(language) {
  try {
    console.log(`\nGenerating new article for language: ${language.toUpperCase()}...`);
    
    // 1. Generate a title
    const title = await generateArticleTitle(language);
    console.log(`Generated title: "${title}"`);
    
    // 2. Create a slug from the title
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: language
    });
    
    const fileName = `${formattedDate}-${slug}.mdx`;
    console.log(`Article slug: ${slug}`);
    
    // 3. Select a random category and author
    const category = CATEGORIES[language][Math.floor(Math.random() * CATEGORIES[language].length)];
    const author = AUTHORS[language][Math.floor(Math.random() * AUTHORS[language].length)];
    
    // 4. Generate article content
    console.log(`Generating content for category: ${category}`);
    const content = await generateArticleContent(title, language, category);
    
    // 5. Setup article directory
    const articlesDir = path.join(process.cwd(), 'content', `posts-${language}`);
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }
    
    // 6. Setup image directory
    const imageDir = path.join(process.cwd(), 'public', 'images', 'blog', language);
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    // 7. Get and save image
    const imageUrl = getReliableImageUrl();
    const imageFileName = `${language}-${formattedDate}-${slug}.jpg`;
    const imagePath = path.join(imageDir, imageFileName);
    
    const imageDownloaded = await downloadImage(imageUrl, imagePath);
    let imageSrc;
    
    if (imageDownloaded) {
      imageSrc = `/images/blog/${language}/${imageFileName}`;
      console.log(`Image saved successfully at: ${imageSrc}`);
    } else {
      imageSrc = '/images/default-business.jpg';
      console.log(`Using default image: ${imageSrc}`);
    }
    
    // 8. Calculate approximate read time
    const wordCount = content.split(/\s+/).length;
    const readingTimeMinutes = Math.max(Math.ceil(wordCount / 200), 6);
    const readTime = language === 'en' ? `${readingTimeMinutes} min read` : 
                     language === 'de' ? `${readingTimeMinutes} Min. Lesezeit` :
                     `${readingTimeMinutes} min čtení`;
    
    // 9. Generate excerpt from content
    let excerpt = '';
    const paragraphs = content.split('\n\n');
    for (const paragraph of paragraphs) {
      if (paragraph && !paragraph.startsWith('#') && paragraph.length > 100) {
        excerpt = paragraph.replace(/\*\*/g, '').slice(0, 200);
        if (excerpt.length === 200) excerpt += '...';
        break;
      }
    }
    
    // If no suitable paragraph was found
    if (!excerpt) {
      excerpt = language === 'en' ? `Professional guide on ${title.toLowerCase()}.` : 
                language === 'de' ? `Professioneller Leitfaden zum Thema ${title.toLowerCase()}.` :
                language === 'sk' ? `Odborný sprievodca témou ${title.toLowerCase()}.` :
                `Odborný průvodce tématem ${title.toLowerCase()}.`;
    }
    
    // 10. Create frontmatter
    const frontmatter = {
      title: title,
      date: new Date().toISOString(),
      author: author,
      category: category,
      tags: [category],
      image: imageSrc,
      imageCredit: {
        photographer: 'Unsplash Photographer',
        url: 'https://unsplash.com'
      },
      imageGuidelines: IMAGE_GUIDELINES[language],
      excerpt: excerpt,
      description: excerpt,
      readTime: readTime
    };
    
    // 11. Create markdown file with frontmatter
    const fileContent = `---
title: "${frontmatter.title}"
date: "${frontmatter.date}"
author: "${frontmatter.author}"
category: "${frontmatter.category}"
tags: ${JSON.stringify(frontmatter.tags)}
image: "${frontmatter.image}"
imageCredit: ${JSON.stringify(frontmatter.imageCredit)}
imageGuidelines: "${frontmatter.imageGuidelines}"
excerpt: "${frontmatter.excerpt}"
description: "${frontmatter.description}"
readTime: "${frontmatter.readTime}"
---

${content}
`;
    
    // 12. Save the article
    const filePath = path.join(articlesDir, fileName);
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`Article successfully created at: ${filePath}`);
    return { success: true, filePath, title };
    
  } catch (error) {
    console.error(`Error creating article for ${language}:`, error);
    return { success: false, error: error.message };
  }
}

// Main function to generate articles for all languages
async function generateArticles(count = 1) {
  const languages = ['cs', 'sk', 'de', 'en'];
  const results = {
    total: count * languages.length,
    created: 0,
    failed: 0,
    byLanguage: {}
  };
  
  // Initialize counts for each language
  languages.forEach(lang => {
    results.byLanguage[lang] = { created: 0, failed: 0 };
  });
  
  console.log(`Starting article generation: ${count} articles per language`);
  console.log('=================================================');
  
  for (const language of languages) {
    console.log(`\nGenerating ${count} articles for ${language.toUpperCase()}...`);
    
    for (let i = 0; i < count; i++) {
      console.log(`\nArticle ${i + 1}/${count} for ${language.toUpperCase()}`);
      
      const result = await createArticle(language);
      
      if (result.success) {
        results.created++;
        results.byLanguage[language].created++;
        console.log(`✅ Article created: ${result.title}`);
      } else {
        results.failed++;
        results.byLanguage[language].failed++;
        console.log(`❌ Article creation failed: ${result.error}`);
      }
    }
  }
  
  console.log('\n=================================================');
  console.log('Article Generation Summary:');
  console.log(`Total articles attempted: ${results.total}`);
  console.log(`Successfully created: ${results.created}`);
  console.log(`Failed: ${results.failed}`);
  
  console.log('\nBy Language:');
  languages.forEach(lang => {
    console.log(`${lang.toUpperCase()}: ${results.byLanguage[lang].created} created, ${results.byLanguage[lang].failed} failed`);
  });
}

// Get command line arguments
const args = process.argv.slice(2);
const count = parseInt(args[0]) || 1;

// Run the script
generateArticles(count)
  .then(() => {
    console.log('Article generation completed.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 