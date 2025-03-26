const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createAuthorPlaceholderImage } = require('./article-generation-utils');

/**
 * This script fixes the author placeholder image for the specific article
 * "Mediace a rozhodčí řízení: Klíč k úspěšnému vymáhání"
 */
async function fixAuthorPlaceholderForMediaceArticle() {
  // Define article path
  const articlePath = path.join(
    process.cwd(),
    'content',
    'posts-cs',
    '2025-03-25-mediace-a-rozhodci-rizeni-klic-k-uspesnemu-vymahani.mdx'
  );
  
  try {
    // Check if file exists
    if (!fs.existsSync(articlePath)) {
      console.error(`Article file not found: ${articlePath}`);
      return { success: false, error: 'File not found' };
    }
    
    // Read file content
    const fileContent = fs.readFileSync(articlePath, 'utf8');
    let { data, content } = matter(fileContent);
    
    // Check if author exists
    if (!data.author) {
      console.error('No author specified in article');
      return { success: false, error: 'No author information' };
    }
    
    // Create directory for author images if it doesn't exist
    const authorImagesDir = path.join(process.cwd(), 'public', 'images', 'authors');
    if (!fs.existsSync(authorImagesDir)) {
      fs.mkdirSync(authorImagesDir, { recursive: true });
    }
    
    // Generate author slug
    const authorSlug = data.author
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s]/g, '')        // Remove special chars
      .replace(/\s+/g, '-');          // Replace spaces with hyphens
    
    // Create placeholder image
    console.log(`Creating author placeholder for ${data.author}`);
    const imageBuffer = await createAuthorPlaceholderImage(data.author, 'cs');
    
    // Save image
    const imagePath = path.join(authorImagesDir, `${authorSlug}.png`);
    fs.writeFileSync(imagePath, imageBuffer);
    
    // Update article's author image path
    data.authorImage = `/images/authors/${authorSlug}.png`;
    
    // Rewrite the article with updated frontmatter
    const updatedContent = matter.stringify(content, data);
    fs.writeFileSync(articlePath, updatedContent);
    
    console.log(`Successfully updated author image for ${data.author}`);
    console.log(`Image path: ${data.authorImage}`);
    
    // Also check if there's a duplicate in the posts directory and fix it too
    const originalPostsPath = path.join(
      process.cwd(),
      'content',
      'posts',
      '2025-03-25-mediace-a-rozhodci-rizeni-klic-k-uspesnemu-vymahani.mdx'
    );
    
    if (fs.existsSync(originalPostsPath)) {
      const originalContent = fs.readFileSync(originalPostsPath, 'utf8');
      let { data: originalData, content: originalArticleContent } = matter(originalContent);
      
      // Update author image in the original file too
      originalData.authorImage = data.authorImage;
      
      // Rewrite the original article
      const updatedOriginalContent = matter.stringify(originalArticleContent, originalData);
      fs.writeFileSync(originalPostsPath, updatedOriginalContent);
      
      console.log(`Also updated duplicate article in 'posts' directory`);
    }
    
    return { 
      success: true, 
      authorImage: data.authorImage,
      article: path.basename(articlePath)
    };
  } catch (error) {
    console.error('Error fixing author placeholder:', error);
    return { success: false, error: error.message };
  }
}

// Execute the function
fixAuthorPlaceholderForMediaceArticle()
  .then(result => console.log('Result:', result))
  .catch(err => console.error('Error executing fix:', err)); 