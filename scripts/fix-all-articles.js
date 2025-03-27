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
  
  // Define a set of reliable Unsplash image URLs that we know exist
  const reliableImageUrls = [
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
  
  // Select a random image URL from the reliable list
  const randomIndex = Math.floor(Math.random() * reliableImageUrls.length);
  const baseImageUrl = reliableImageUrls[randomIndex];
  
  // Add parameters to image URL
  const imageUrl = `${baseImageUrl}?fit=crop&w=1600&h=900&q=80`;
  console.log(`Using reliable Unsplash image URL: ${imageUrl}`);
  
  return {
    success: true,
    imageUrl: imageUrl,
    photographer: 'Unsplash Photographer',
    photographerUrl: 'https://unsplash.com'
  };
}

// Function to download and save an image
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
      model: "gpt-4o",
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

// Special function to manually fix specific articles with issues
async function manuallyFixSpecificArticles() {
  console.log('\nManually fixing articles with known issues...');
  console.log('----------------------------------------');
  
  // Create a list of specific problematic articles
  const problematicArticles = [
    { path: 'content/posts-de/2025-03-28-die-rolle-der-mediation-im-forderungsmanagement-strategien-zur-au-ergerichtlichen-konfliktlosung-im-deutschen-rechtsrahmen.mdx', lang: 'de' },
    { path: 'content/posts-de/2025-03-27-forderungsmanagement-strategische-neuausrichtung-2023.mdx', lang: 'de' },
    { path: 'content/posts-de/2025-03-27-strategien-zur-risikominimierung-in-der-forderungsbetreibung.mdx', lang: 'de' },
    { path: 'content/posts-sk/2025-03-28-eticke-dilemy-vo-vymahani-pohladavok-balansovanie-medzi-zakonnymi-povinnostami-a-reputacnymi-rizikami-v-slovenskom-podnikatelskom-prostredi.mdx', lang: 'sk' },
    { path: 'content/posts-cs/2025-03-27-makroekonomicke-vlivy-na-vymahani-pohledavek-v-cr.mdx', lang: 'cs' }
  ];
  
  let fixedCount = 0;
  
  for (const article of problematicArticles) {
    console.log(`\nManually fixing: ${article.path}`);
    
    try {
      // Read the article file
      const filePath = path.join(process.cwd(), article.path);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontMatter, content: originalContent } = matter(fileContent);
      
      // Create language-specific directory if it doesn't exist
      const blogImageDir = path.join(process.cwd(), 'public', 'images', 'blog', article.lang);
      if (!fs.existsSync(blogImageDir)) {
        fs.mkdirSync(blogImageDir, { recursive: true });
      }
      
      // Get a reliable image
      const imageData = await getUnsplashImage(frontMatter.category || 'business', article.lang);
      
      // Generate a unique filename based on the article slug
      const fileName = path.basename(article.path, '.mdx');
      const imageFileName = `${article.lang}-${fileName}.jpg`;
      const imagePath = path.join(blogImageDir, imageFileName);
      
      // Download and save the image
      const downloadSuccess = await downloadImage(imageData.imageUrl, imagePath);
      
      if (downloadSuccess) {
        // Update frontmatter with new image path
        frontMatter.image = `/images/blog/${article.lang}/${imageFileName}`;
        frontMatter.imageCredit = {
          photographer: imageData.photographer,
          url: imageData.photographerUrl
        };
        
        // Write the updated file back
        const updatedFileContent = matter.stringify(originalContent, frontMatter);
        fs.writeFileSync(filePath, updatedFileContent);
        
        console.log(`Successfully fixed image for: ${path.basename(article.path)}`);
        fixedCount++;
      } else {
        // Fall back to the default image
        frontMatter.image = '/images/default-business.jpg';
        frontMatter.imageCredit = {
          photographer: 'Default Image',
          url: 'https://unsplash.com/'
        };
        
        // Write the updated file back
        const updatedFileContent = matter.stringify(originalContent, frontMatter);
        fs.writeFileSync(filePath, updatedFileContent);
        
        console.log(`Applied default image for: ${path.basename(article.path)}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error fixing article ${article.path}:`, error);
    }
  }
  
  console.log('\nManual fixes complete:');
  console.log(`Fixed ${fixedCount} articles out of ${problematicArticles.length}`);
}

// Run the process
async function runFixes() {
  try {
    // First, manually fix specific problematic articles
    await manuallyFixSpecificArticles();
    
    // Then run the general fix for all articles
    await fixAllArticles();
    
    console.log('Article fixing completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Start the fixing process
runFixes(); 