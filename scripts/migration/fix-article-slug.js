const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Fix article slugs for Slovak and German content
const fixArticleSlugs = () => {
  // Process Slovak articles
  processLanguageDirectory('posts-sk');
  
  // Process German articles
  processLanguageDirectory('posts-de');
  
  console.log('Slug fixing process completed.');
};

// Process articles in a specific language directory
const processLanguageDirectory = (langDir) => {
  const dirPath = path.join(process.cwd(), 'content', langDir);
  
  // Skip if directory doesn't exist
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist. Skipping.`);
    return;
  }
  
  console.log(`\nProcessing articles in ${langDir}...`);
  
  // Get all MDX files
  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mdx'));
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const { data, content } = matter(fileContent);
    
    // Check if the file needs fixing (slug too long or containing problematic characters)
    if (isSlugProblematic(file)) {
      console.log(`Processing file with problematic slug: ${file}`);
      
      // Get simplified slug based on the title
      const newSlug = createSimplifiedSlug(data.title);
      const datePrefix = file.match(/^\d{4}-\d{2}-\d{2}-/)[0];
      const newFileName = `${datePrefix}${newSlug}.mdx`;
      const newFilePath = path.join(dirPath, newFileName);
      
      console.log(`Creating new file with simplified slug: ${newFileName}`);
      
      // Write content to the new file
      fs.writeFileSync(newFilePath, fileContent);
      
      console.log(`File created successfully. Original file remains.`);
    } else {
      console.log(`File ${file} has a good slug. Skipping.`);
    }
  });
};

// Check if a file's slug is problematic (too long or contains problematic characters)
const isSlugProblematic = (fileName) => {
  // Extract the slug part (remove date prefix and extension)
  const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '');
  
  // Check length (more than 80 characters is too long)
  if (slug.length > 80) {
    return true;
  }
  
  // Check for problematic patterns (excessive hyphens, non-latin characters except accents)
  if (slug.includes('--') || /[^\w\s-áéíóúýčďěňřšťžäëïöüÿ]/i.test(slug)) {
    return true;
  }
  
  return false;
};

// Create a simplified slug from a title
const createSimplifiedSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .substring(0, 80); // Limit length to 80 characters
};

// Main execution
try {
  fixArticleSlugs();
} catch (error) {
  console.error('Error fixing article slugs:', error);
} 