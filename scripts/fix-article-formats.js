const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Language-specific reading time formats
const readTimeFormats = {
  'posts': 'min',
  'posts-en': 'min',
  'posts-de': 'min',
  'posts-sk': 'min'
};

// Function to standardize reading time
function standardizeReadTime(readTime, lang) {
  if (!readTime) return '5 min'; // Default reading time if none provided
  
  // Extract number from reading time string
  const number = readTime.match(/\d+/);
  if (!number) return '5 min';
  
  return `${number[0]} ${readTimeFormats[lang]}`;
}

// Function to ensure tags are in array format
function standardizeTags(tags) {
  if (!tags) return ['pohledávky', 'finance']; // Default tags if none provided
  
  if (typeof tags === 'string') {
    // Convert comma-separated string to array
    return tags.split(',').map(tag => tag.trim());
  }
  
  if (Array.isArray(tags)) {
    return tags.map(tag => {
      // If tag is an object with name property (from some formats), extract the name
      if (typeof tag === 'object' && tag.name) {
        return tag.name;
      }
      return tag.toString().trim();
    });
  }
  
  return ['pohledávky', 'finance']; // Default tags if invalid format
}

// Function to fix a single article
function fixArticle(filePath, lang) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Standardize frontmatter
    const fixedData = {
      ...data,
      tags: standardizeTags(data.tags),
      readTime: standardizeReadTime(data.readTime, lang)
    };
    
    // Ensure required fields exist
    if (!fixedData.title) fixedData.title = path.basename(filePath, '.mdx');
    if (!fixedData.date) fixedData.date = new Date().toISOString();
    if (!fixedData.description) fixedData.description = '';
    if (!fixedData.category) fixedData.category = 'Pohledávky';
    
    // Create new frontmatter string
    const newContent = matter.stringify(content, fixedData);
    
    // Write back to file
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed article: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing article ${filePath}:`, error);
  }
}

// Main function to process all articles
async function fixAllArticles() {
  const contentDir = path.join(process.cwd(), 'content');
  const langDirs = ['posts', 'posts-en', 'posts-de', 'posts-sk'];
  
  for (const lang of langDirs) {
    const langDir = path.join(contentDir, lang);
    if (!fs.existsSync(langDir)) continue;
    
    const files = fs.readdirSync(langDir);
    for (const file of files) {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(langDir, file);
        fixArticle(filePath, lang);
      }
    }
  }
  
  console.log('All articles have been fixed!');
}

// Run the script
fixAllArticles().catch(console.error); 