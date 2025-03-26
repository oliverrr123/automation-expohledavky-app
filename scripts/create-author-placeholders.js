const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createCanvas } = require('canvas');

// Language directories to process
const languageDirs = ['posts-cs', 'posts-sk', 'posts-de', 'posts-en'];

// Generate placeholder image for an author
const generateAuthorPlaceholder = (author, lang) => {
  // Get initials from author name (first letter of first and last name)
  const initials = author
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2); // Limit to 2 characters
  
  // Create a canvas for the image (200x200 pixels)
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');
  
  // Set background color (light gray)
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(0, 0, 200, 200);
  
  // Set text properties
  ctx.fillStyle = '#505050';
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add initials to the center of the image
  ctx.fillText(initials, 100, 100);
  
  // Ensure directory exists
  const dirPath = path.join(process.cwd(), 'public', 'images', 'authors', lang);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Convert author name to slug for the filename
  const authorSlug = author
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
  
  // Save the image
  const outputPath = path.join(dirPath, `${authorSlug}.jpg`);
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  
  // Return public path to the image
  return `/images/authors/${lang}/${authorSlug}.jpg`;
};

// Process all articles to create author placeholders
const processArticles = () => {
  let updatedCount = 0;
  
  languageDirs.forEach(langDir => {
    const dirPath = path.join(process.cwd(), 'content', langDir);
    
    // Skip if directory doesn't exist
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory ${dirPath} does not exist. Skipping.`);
      return;
    }
    
    console.log(`Processing articles in ${langDir}...`);
    
    // Get all MDX files
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mdx'));
    
    // Extract language code (e.g., 'cs' from 'posts-cs')
    const lang = langDir.replace('posts-', '');
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter
      const { data, content } = matter(fileContent);
      
      // Skip if no author or author image already exists
      if (!data.author) {
        console.log(`No author found for ${file}. Skipping.`);
        return;
      }
      
      // Check if author image exists
      if (data.authorImage) {
        const imagePath = path.join(process.cwd(), 'public', data.authorImage.replace(/^\//, ''));
        
        if (fs.existsSync(imagePath)) {
          console.log(`Author image already exists for ${data.author} in ${file}. Skipping.`);
          return;
        }
      }
      
      // Generate placeholder image
      const authorImagePath = generateAuthorPlaceholder(data.author, lang);
      
      // Update frontmatter
      data.authorImage = authorImagePath;
      
      // Write updated content back to file
      const updatedContent = matter.stringify(content, data);
      fs.writeFileSync(filePath, updatedContent);
      
      console.log(`Updated author image for ${data.author} in ${file}.`);
      updatedCount++;
    });
  });
  
  console.log(`\nUpdated author images for ${updatedCount} articles.`);
};

// Main execution
try {
  processArticles();
  console.log('Done creating author placeholder images.');
} catch (error) {
  console.error('Error creating author placeholder images:', error);
} 