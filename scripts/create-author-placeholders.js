const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createAuthorPlaceholderImage } = require('./article-generation-utils');

// Create placeholders for all languages
async function createAuthorPlaceholders() {
  const languages = ['cs', 'sk', 'de', 'en'];
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const language of languages) {
    const dirPath = path.join(process.cwd(), 'content', language === 'en' ? 'posts' : `posts-${language}`);
    const publicImagesPath = path.join(process.cwd(), 'public', 'images', 'authors');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(publicImagesPath)) {
      fs.mkdirSync(publicImagesPath, { recursive: true });
    }
    
    // Get all MDX files
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory not found: ${dirPath}`);
      continue;
    }
    
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mdx'));
    console.log(`Processing ${files.length} articles in ${language} language...`);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      if (!data.author) {
        console.log(`Skipping ${file} - no author field`);
        continue;
      }
      
      // Generate filename from author
      const authorSlug = data.author
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      const authorImagePath = path.join(publicImagesPath, `${authorSlug}.png`);
      const publicPath = `/images/authors/${authorSlug}.png`;
      
      // Check if author image already exists
      if (fs.existsSync(authorImagePath)) {
        console.log(`Author image already exists for ${data.author}`);
        skippedCount++;
        continue;
      }
      
      // Create placeholder image
      try {
        console.log(`Creating placeholder for ${data.author} (${language})`);
        const imageBuffer = await createAuthorPlaceholderImage(data.author, language);
        fs.writeFileSync(authorImagePath, imageBuffer);
        
        // Update the article with the new author image
        data.authorImage = publicPath;
        const updatedContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, updatedContent);
        
        updatedCount++;
      } catch (error) {
        console.error(`Error creating placeholder for ${data.author}:`, error);
      }
    }
  }
  
  console.log(`Updated ${updatedCount} articles with author placeholders`);
  console.log(`Skipped ${skippedCount} articles (already had images)`);
  
  return { updatedCount, skippedCount };
}

// Execute the function
createAuthorPlaceholders()
  .then(result => console.log('Completed successfully:', result))
  .catch(err => console.error('Error:', err)); 