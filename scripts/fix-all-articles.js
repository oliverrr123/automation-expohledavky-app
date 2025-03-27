require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { OpenAI } = require('openai');
const axios = require('axios');

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Unsplash configuration
const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

// Image guidelines by language
const IMAGE_GUIDELINES = {
  cs: 'Obrázek musí být profesionální, související s tématem pohledávek, financí nebo práva. Ideálně fotografie kanceláří, právních dokumentů, finančních grafů nebo obchodních jednání.',
  sk: 'Obrázok musí byť profesionálny, súvisiaci s témou pohľadávok, financií alebo práva. Ideálne fotografie kancelárií, právnych dokumentov, finančných grafov alebo obchodných rokovaní.',
  de: 'Das Bild muss professionell sein und mit dem Thema Forderungen, Finanzen oder Recht zusammenhängen. Idealerweise Fotos von Büros, Rechtsdokumenten, Finanzdiagrammen oder Geschäftstreffen.',
  en: 'The image must be professional, related to the topic of receivables, finance, or law. Ideally photos of offices, legal documents, financial graphs, or business meetings.'
};

// Minimum word counts by language
const MIN_WORD_COUNTS = {
  cs: 1000,
  sk: 1000,
  de: 1000,
  en: 1200
};

// Function to fetch an image from Unsplash without collections
async function getUnsplashImage(category, language) {
  console.log(`Getting image for category: ${category} in ${language}`);
  
  // Instead of using the Unsplash API which has authentication issues,
  // we'll use the direct Unsplash Source URL which doesn't require authentication
  
  // Build a search query based on category and language
  let query;
  if (language === 'en') {
    query = `business,office,finance,${category.toLowerCase().replace(/\s+/g, ',')}`;
  } else if (language === 'de') {
    query = `büro,finanzen,geschäft,${category.toLowerCase().replace(/\s+/g, ',')}`;
  } else if (language === 'sk') {
    query = `kancelária,financie,podnikanie,${category.toLowerCase().replace(/\s+/g, ',')}`;
  } else {
    query = `kancelář,finance,podnikání,${category.toLowerCase().replace(/\s+/g, ',')}`;
  }
  
  // Generate a unique seed to avoid getting the same image
  const seed = Math.floor(Math.random() * 10000);
  
  // Use direct Unsplash source URL
  const imageUrl = `https://source.unsplash.com/1600x900/?${query}&sig=${seed}`;
  console.log(`Using direct Unsplash source URL: ${imageUrl}`);
  
  // Fake success response with direct URL
  return {
    success: true,
    imageUrl: imageUrl,
    photographer: 'Unsplash Photographer',
    photographerUrl: 'https://unsplash.com'
  };
}

// Function to download and save an image
async function downloadImage(imageUrl, savePath) {
  try {
    console.log(`Downloading image from ${imageUrl} to ${savePath}`);
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000
    });
    
    fs.writeFileSync(savePath, response.data);
    console.log(`Image saved successfully`);
    return true;
  } catch (error) {
    console.error(`Error downloading image: ${error.message}`);
    return false;
  }
}

// Function to expand article content
async function expandArticleContent(title, originalContent, category, language) {
  console.log(`Expanding content for article: ${title} in ${language}`);
  
  // Determine language-specific instructions
  let languageInstructions;
  switch(language) {
    case 'cs':
      languageInstructions = "v českém jazyce";
      break;
    case 'sk':
      languageInstructions = "ve slovenském jazyce";
      break;
    case 'de':
      languageInstructions = "v německém jazyce";
      break;
    default:
      languageInstructions = "v anglickém jazyce";
  }
  
  // Skip expansion if the content is already substantial
  const wordCount = originalContent.split(/\s+/).length;
  if (wordCount >= MIN_WORD_COUNTS[language]) {
    console.log(`Article already has ${wordCount} words, skipping expansion`);
    return originalContent;
  }
  
  const prompt = `Rozšiř tento odborný článek na téma "${title}" z kategorie "${category}" ${languageInstructions}, aby byl více obsáhlý a profesionální.

Článek musí obsahovat:
1. Úvod vysvětlující důležitost tématu
2. Alespoň 3 hlavní sekce s detailními informacemi, praktickými tipy a best practices
3. Příklady z praxe nebo případové studie
4. Profesionální postřehy a analýzy
5. Závěr s klíčovými poznatky
6. Správné formátování pomocí markdown (## pro nadpisy a další markdown prvky)

Článek by měl mít přibližně ${MIN_WORD_COUNTS[language]}-${MIN_WORD_COUNTS[language] + 300} slov a být zaměřen na profesionály z oboru financí. Článek musí být detailní, přesný a praktický.

Současný obsah k rozšíření:
${originalContent}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "Jsi profesionální finanční a právní copywriter specializující se na správu pohledávek, vymáhání dluhů a mezinárodní finance. Tvým úkolem je rozšířit články o profesionální, detailní a přesný obsah, který poskytne skutečnou hodnotu čtenářům z byznysu." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3500,
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error expanding article content:", error);
    return originalContent;
  }
}

// Function to process a single article
async function processArticle(filePath, language) {
  try {
    console.log(`Processing article: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontMatter, content: originalContent } = matter(fileContent);
    
    let modified = false;
    let updatedContent = originalContent;
    
    // Make sure the category is set
    if (!frontMatter.category) {
      frontMatter.category = language === 'en' ? 'Receivables Management' : 
                            language === 'de' ? 'Forderungsmanagement' :
                            language === 'sk' ? 'Správa pohľadávok' :
                            'Správa pohledávek';
      modified = true;
    }
    
    // 1. Check and expand content if needed
    const wordCount = originalContent.split(/\s+/).length;
    if (wordCount < MIN_WORD_COUNTS[language]) {
      console.log(`Article has only ${wordCount} words, expanding...`);
      updatedContent = await expandArticleContent(
        frontMatter.title, 
        originalContent, 
        frontMatter.category,
        language
      );
      const newWordCount = updatedContent.split(/\s+/).length;
      console.log(`Expanded from ${wordCount} to ${newWordCount} words`);
      
      // Only update if we actually got more content
      if (newWordCount > wordCount) {
        modified = true;
      }
    }
    
    // 2. Ensure article has proper image
    if (!frontMatter.image || 
        frontMatter.image.includes('source.unsplash.com') || 
        frontMatter.image.includes('images.unsplash.com')) {
      console.log('Article needs a proper downloaded image');
      
      // Create language-specific directory
      const blogImageDir = path.join(process.cwd(), 'public', 'images', 'blog', language);
      if (!fs.existsSync(blogImageDir)) {
        fs.mkdirSync(blogImageDir, { recursive: true });
      }
      
      // Get image from Unsplash
      const imageData = await getUnsplashImage(frontMatter.category, language);
      
      // Generate a unique filename based on the article slug
      const fileName = path.basename(filePath, '.mdx');
      const imageFileName = `${language}-${fileName}.jpg`;
      const imagePath = path.join(blogImageDir, imageFileName);
      
      // Download and save the image
      const downloadSuccess = await downloadImage(imageData.imageUrl, imagePath);
      
      if (downloadSuccess) {
        // Update frontmatter with new image path
        frontMatter.image = `/images/blog/${language}/${imageFileName}`;
        frontMatter.imageCredit = {
          photographer: imageData.photographer,
          url: imageData.photographerUrl
        };
        modified = true;
      } else {
        // Fall back to a default image
        console.log('Using default image due to download failure');
        frontMatter.image = '/images/default-business.jpg';
        frontMatter.imageCredit = {
          photographer: 'Default Image',
          url: 'https://unsplash.com/'
        };
        modified = true;
      }
    }
    
    // 3. Add image guidelines if missing
    if (!frontMatter.imageGuidelines) {
      frontMatter.imageGuidelines = IMAGE_GUIDELINES[language];
      modified = true;
    }
    
    // 4. Ensure description/excerpt exists
    if (!frontMatter.description) {
      // Generate a basic description based on title
      if (language === 'en') {
        frontMatter.description = `Professional guide to ${frontMatter.title.toLowerCase()} in international business finance and debt collection.`;
      } else if (language === 'de') {
        frontMatter.description = `Professioneller Leitfaden zum Thema ${frontMatter.title.toLowerCase()} im Forderungsmanagement und internationalen Finanzwesen.`;
      } else if (language === 'sk') {
        frontMatter.description = `Odborný sprievodca témou ${frontMatter.title.toLowerCase()} v oblasti správy pohľadávok a medzinárodných financií.`;
      } else {
        frontMatter.description = `Odborný průvodce tématem ${frontMatter.title.toLowerCase()} v oblasti správy pohledávek a mezinárodních financí.`;
      }
      modified = true;
    }
    
    // Set excerpt to be the same as description if missing
    if (!frontMatter.excerpt) {
      frontMatter.excerpt = frontMatter.description;
      modified = true;
    }
    
    // 5. Ensure read time is set
    if (!frontMatter.readTime) {
      // Calculate based on word count (approx 200 words per minute)
      const minutes = Math.max(Math.ceil(originalContent.split(/\s+/).length / 200), 6);
      frontMatter.readTime = language === 'en' ? `${minutes} min read` : 
                             language === 'de' ? `${minutes} Min. Lesezeit` :
                             `${minutes} min čtení`;
      modified = true;
    }
    
    // Save changes if any were made
    if (modified) {
      const updatedFileContent = matter.stringify(updatedContent, frontMatter);
      fs.writeFileSync(filePath, updatedFileContent);
      console.log(`Article updated: ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`No changes needed for: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`Error processing article ${filePath}:`, error);
    return false;
  }
}

// Main function to process all articles in all languages
async function fixAllArticles() {
  const languages = ['cs', 'sk', 'de', 'en'];
  const results = {
    total: 0,
    updated: 0,
    skipped: 0,
    failed: 0
  };
  
  for (const language of languages) {
    console.log(`\nProcessing ${language.toUpperCase()} articles...`);
    console.log('----------------------------------------');
    
    const langDir = path.join(process.cwd(), 'content', `posts-${language}`);
    
    // Check if directory exists
    if (!fs.existsSync(langDir)) {
      console.log(`Directory for ${language} does not exist, skipping.`);
      continue;
    }
    
    // Get all MDX files in the directory
    const files = fs.readdirSync(langDir).filter(file => file.endsWith('.mdx'));
    results.total += files.length;
    
    console.log(`Found ${files.length} articles for ${language}.`);
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(langDir, file);
      
      try {
        const updated = await processArticle(filePath, language);
        if (updated) {
          results.updated++;
        } else {
          results.skipped++;
        }
      } catch (error) {
        console.error(`Failed to process ${file}:`, error);
        results.failed++;
      }
    }
  }
  
  console.log('\nProcessing Complete:');
  console.log('----------------------------------------');
  console.log(`Total articles: ${results.total}`);
  console.log(`Updated: ${results.updated}`);
  console.log(`Skipped (no changes needed): ${results.skipped}`);
  console.log(`Failed: ${results.failed}`);
}

// Run the process
fixAllArticles().then(() => {
  console.log('Article fixing completed successfully.');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 