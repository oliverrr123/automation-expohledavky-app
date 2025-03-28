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
];

// Main function to generate Slovak content
async function generateSlovakContent() {
  try {
    console.log('=== Spúšťam generovanie slovenského obsahu ===');
    
    // 1. Select category
    console.log('Vyberám kategóriu...');
    const category = getRandomElement(categories);
    console.log(`Vybraná kategória: ${category}`);
    
    // 2. Generate topic using OpenAI
    console.log('Generujem tému pomocou OpenAI...');
    const topic = await generateRandomTopic(openai, category, 'sk');
    console.log(`Vygenerovaná téma: ${topic}`);
    
    // 3. Generate unique approach for the topic
    console.log('Generujem unikátny prístup k téme...');
    const uniqueApproach = await generateUniqueApproach(openai, topic, category, 'sk');
    
    // 4. Select author
    console.log('Vyberám autora...');
    const author = getRandomElement(authors);
    console.log(`Vybraný autor: ${author.name}, ${author.position}`);
    
    // 5. Generate article content using OpenAI
    console.log('Generujem obsah článku pomocou OpenAI...');
    const articleContent = await generateArticleContent(openai, topic, category, uniqueApproach, 'sk');
    
    // 6. Generate metadata
    console.log('Generujem metadata článku...');
    const metaData = await generateMetadata(openai, topic, category, 'sk');
    
    // 7. Get image from Unsplash
    console.log("Získavam obrázok z Unsplash...");
    const imageData = await getArticleImage(category, topic, 'sk');
    
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
    const filePath = path.join(process.cwd(), 'content', 'posts-sk', fileName);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, mdxContent);
    console.log(`MDX súbor vytvorený: ${filePath}`);
    
    console.log('=================================================');
    console.log('🎉 Generovanie slovenského článku úspešne dokončené!');
    console.log('=================================================');
    console.log(`Titulok: ${metaData.title || topic}`);
    console.log(`Slug: ${slug}`);
    console.log(`Kategória: ${category}`);
    
    return {
      success: true,
      title: metaData.title || topic,
      slug: slug,
      filePath: filePath
    };
  } catch (error) {
    console.error('❌ Chyba pri generovaní slovenského obsahu:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateSlovakContent()
    .then((result) => {
      if (result.success) {
        console.log(`✅ Proces generovania slovenského obsahu dokončený.`);
        process.exit(0);
      } else {
        console.error(`❌ Generovanie zlyhalo: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fatálna chyba v hlavnom procese:', error);
      process.exit(1);
    });
} 

// Export the function for potential use by other scripts
module.exports = generateSlovakContent; 