const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Terms that indicate AI content
const aiTerms = [
  'ai', 'umělá inteligence', 'artificial intelligence', 'künstliche intelligenz',
  'machine learning', 'strojové učení', 'automatizace', 'automation',
  'robot', 'chatbot', 'digitalizace', 'digitalization'
];

// Function to check if content contains AI references
function containsAIContent(content) {
  const lowerContent = content.toLowerCase();
  return aiTerms.some(term => lowerContent.includes(term.toLowerCase()));
}

// Function to check a single article
function checkArticle(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Check title, subtitle, description, tags, and content for AI references
    const hasAIContent = 
      containsAIContent(data.title) ||
      containsAIContent(data.subtitle || '') ||
      containsAIContent(data.description || '') ||
      (Array.isArray(data.tags) && data.tags.some(tag => containsAIContent(tag))) ||
      containsAIContent(content);
    
    return hasAIContent;
  } catch (error) {
    console.error(`Error checking article ${filePath}:`, error);
    return false;
  }
}

// Function to remove AI articles
async function removeAIArticles() {
  const contentDir = path.join(process.cwd(), 'content');
  const langDirs = ['posts', 'posts-en', 'posts-de', 'posts-sk'];
  const removedArticles = [];
  
  for (const lang of langDirs) {
    const langDir = path.join(contentDir, lang);
    if (!fs.existsSync(langDir)) continue;
    
    const files = fs.readdirSync(langDir);
    for (const file of files) {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(langDir, file);
        if (checkArticle(filePath)) {
          console.log(`Removing AI-related article: ${filePath}`);
          fs.unlinkSync(filePath);
          removedArticles.push({ lang, file });
        }
      }
    }
  }
  
  console.log('\nRemoved articles:', removedArticles);
  return removedArticles;
}

// Run the script
removeAIArticles().catch(console.error); 