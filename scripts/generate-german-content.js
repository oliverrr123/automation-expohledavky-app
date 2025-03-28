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

// Categories for German articles
const categories = [
  'Forderungsmanagement',
  'Finanzanalyse',
  'Inkasso',
  'Inkasso-Ethik',
  'Insolvenz',
  'Prävention'
];

// Authors for German articles
const authors = [
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
];

// Main function to generate German content
async function generateGermanContent() {
  try {
    console.log('=== Starte die Generierung von deutschen Inhalten ===');
    
    // 1. Select category
    console.log('Kategorie auswählen...');
    const category = getRandomElement(categories);
    console.log(`Ausgewählte Kategorie: ${category}`);
    
    // 2. Generate topic using OpenAI
    console.log('Generiere Thema mit OpenAI...');
    const topic = await generateRandomTopic(openai, category, 'de');
    console.log(`Generiertes Thema: ${topic}`);
    
    // 3. Generate unique approach for the topic
    console.log('Generiere einzigartigen Ansatz zum Thema...');
    const uniqueApproach = await generateUniqueApproach(openai, topic, category, 'de');
    
    // 4. Select author
    console.log('Autor auswählen...');
    const author = getRandomElement(authors);
    console.log(`Ausgewählter Autor: ${author.name}, ${author.position}`);
    
    // 5. Generate article content using OpenAI
    console.log('Generiere Artikelinhalt mit OpenAI...');
    const articleContent = await generateArticleContent(openai, topic, category, uniqueApproach, 'de');
    
    // 6. Generate metadata
    console.log('Generiere Artikel-Metadaten...');
    const metaData = await generateMetadata(openai, topic, category, 'de');
    
    // 7. Get image from Unsplash
    console.log("Bild von Unsplash abrufen...");
    const imageData = await getArticleImage(category, topic, 'de');
    
    // 8. Create MDX file
    console.log('Erstelle MDX-Datei...');
    
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
    const filePath = path.join(process.cwd(), 'content', 'posts-de', fileName);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, mdxContent);
    console.log(`MDX-Datei erstellt: ${filePath}`);
    
    console.log('=================================================');
    console.log('🎉 Generierung des deutschen Artikels erfolgreich abgeschlossen!');
    console.log('=================================================');
    console.log(`Titel: ${metaData.title || topic}`);
    console.log(`Slug: ${slug}`);
    console.log(`Kategorie: ${category}`);
    
    return {
      success: true,
      title: metaData.title || topic,
      slug: slug,
      filePath: filePath
    };
  } catch (error) {
    console.error('❌ Fehler bei der Generierung von deutschen Inhalten:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateGermanContent()
    .then((result) => {
      if (result.success) {
        console.log(`✅ Deutsche Inhaltsgenerierung abgeschlossen.`);
        process.exit(0);
      } else {
        console.error(`❌ Generierung fehlgeschlagen: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fataler Fehler im Hauptprozess:', error);
      process.exit(1);
    });
} 

// Export the function for potential use by other scripts
module.exports = generateGermanContent; 