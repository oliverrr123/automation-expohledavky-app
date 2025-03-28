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
];

// Main function to generate Czech content
async function generateCzechContent() {
  try {
    console.log('=== Spouštím generování českého obsahu ===');
    
    // 1. Select category
    console.log('Vybírám kategorii...');
    const category = getRandomElement(categories);
    console.log(`Vybraná kategorie: ${category}`);
    
    // 2. Generate topic using OpenAI
    console.log('Generuji téma pomocí OpenAI...');
    const topic = await generateRandomTopic(openai, category, 'cs');
    console.log(`Vygenerované téma: ${topic}`);
    
    // 3. Generate unique approach for the topic
    console.log('Generuji unikátní přístup k tématu...');
    const uniqueApproach = await generateUniqueApproach(openai, topic, category, 'cs');
    
    // 4. Select author
    console.log('Vybírám autora...');
    const author = getRandomElement(authors);
    console.log(`Vybraný autor: ${author.name}, ${author.position}`);
    
    // 5. Generate article content using OpenAI
    console.log('Generuji obsah článku pomocí OpenAI...');
    const articleContent = await generateArticleContent(openai, topic, category, uniqueApproach, 'cs');
    
    // 6. Generate metadata
    console.log('Generuji metadata článku...');
    const metaData = await generateMetadata(openai, topic, category, 'cs');
    
    // 7. Get image from Unsplash
    console.log("Získávám obrázek z Unsplash...");
    const imageData = await getArticleImage(category, topic, 'cs');
    
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
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: imageData.photographer,
      excerpt: metaData.description
    };
    
    // Create MDX content
    const mdxContent = matter.stringify(articleContent, frontMatter);
    
    // Create filename with date and slug
    const date = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const fileName = `${date}-${slug}.mdx`;
    const filePath = path.join(process.cwd(), 'content', 'posts-cs', fileName);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, mdxContent);
    console.log(`MDX soubor vytvořen: ${filePath}`);
    
    console.log('=================================================');
    console.log('🎉 Generování českého článku úspěšně dokončeno!');
    console.log('=================================================');
    console.log(`Titulek: ${metaData.title || topic}`);
    console.log(`Slug: ${slug}`);
    console.log(`Kategorie: ${category}`);
    
    return {
      success: true,
      title: metaData.title || topic,
      slug: slug,
      filePath: filePath
    };
  } catch (error) {
    console.error('❌ Chyba při generování českého obsahu:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateCzechContent()
    .then((result) => {
      if (result.success) {
        console.log(`✅ Proces generování českého obsahu dokončen.`);
        process.exit(0);
      } else {
        console.error(`❌ Generování selhalo: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fatální chyba v hlavním procesu:', error);
      process.exit(1);
    });
} 

// Export the function for potential use by other scripts
module.exports = generateCzechContent; 