const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createAuthorPlaceholderImage } = require('./article-generation-utils');

// Function to fix author placeholder image references in articles
async function fixAuthorPlaceholders() {
  const languages = ['cs', 'sk', 'de', 'en'];
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const language of languages) {
    const dirPath = path.join(process.cwd(), 'content', language === 'en' ? 'posts' : `posts-${language}`);
    const authorImagesDir = path.join(process.cwd(), 'public', 'images', 'authors');
    
    // Ensure directories exist
    if (!fs.existsSync(authorImagesDir)) {
      fs.mkdirSync(authorImagesDir, { recursive: true });
    }
    
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory not found: ${dirPath}`);
      continue;
    }
    
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mdx'));
    console.log(`Processing ${files.length} articles in ${language} language...`);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let { data, content } = matter(fileContent);
      
      if (!data.author) {
        console.log(`Skipping ${file} - no author field`);
        continue;
      }
      
      let needsUpdate = false;
      
      // Generate slug for author
      const authorSlug = data.author
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^\w\s]/g, '')        // Remove special chars
        .replace(/\s+/g, '-');          // Replace spaces with hyphens
      
      // Check if author image exists and fix if needed
      if (data.authorImage) {
        // Fix paths that point to .jpg files but should be .png
        if (data.authorImage.includes('.jpg') && data.authorImage.includes('/authors/')) {
          // Extract the author slug from the path
          const oldSlug = data.authorImage.split('/').pop().replace('.jpg', '');
          
          // Check if we have a png version
          const pngPath = path.join(authorImagesDir, `${oldSlug}.png`);
          if (fs.existsSync(pngPath)) {
            // Use the existing png file
            data.authorImage = `/images/authors/${oldSlug}.png`;
            needsUpdate = true;
            console.log(`Updated author image from jpg to png for ${data.author} in ${file}`);
          } else {
            // Try to create a placeholder if we couldn't find a png
            try {
              console.log(`Creating placeholder for ${data.author} (${language})`);
              const imageBuffer = await createAuthorPlaceholderImage(data.author, language);
              fs.writeFileSync(path.join(authorImagesDir, `${authorSlug}.png`), imageBuffer);
              
              // Update the article with the new image path
              data.authorImage = `/images/authors/${authorSlug}.png`;
              needsUpdate = true;
              console.log(`Created placeholder image for ${data.author} in ${file}`);
            } catch (error) {
              console.error(`Error creating placeholder for ${data.author}:`, error);
            }
          }
        }
      } else {
        // No author image specified, create one
        try {
          console.log(`Creating placeholder for ${data.author} (${language})`);
          const imageBuffer = await createAuthorPlaceholderImage(data.author, language);
          fs.writeFileSync(path.join(authorImagesDir, `${authorSlug}.png`), imageBuffer);
          
          // Update the article with the new image path
          data.authorImage = `/images/authors/${authorSlug}.png`;
          needsUpdate = true;
          console.log(`Created placeholder image for ${data.author} in ${file}`);
        } catch (error) {
          console.error(`Error creating placeholder for ${data.author}:`, error);
        }
      }
      
      // Save changes if needed
      if (needsUpdate) {
        const updatedContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, updatedContent);
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
  }
  
  console.log(`\nUpdated ${updatedCount} articles with author placeholders.`);
  console.log(`Skipped ${skippedCount} articles.`);
  
  return { updatedCount, skippedCount };
}

// Execute the function
fixAuthorPlaceholders()
  .then(result => console.log('Successfully fixed author placeholders:', result))
  .catch(err => console.error('Error fixing author placeholders:', err)); 