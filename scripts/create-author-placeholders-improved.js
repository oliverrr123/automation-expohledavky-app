const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createCanvas } = require('canvas');

/**
 * Improved script to create author placeholder images for all languages
 * Generates consistent placeholder images with author initials
 */
async function createAuthorPlaceholders() {
  // Language directories to process
  const languageDirs = [
    { dir: 'content/posts-cs', lang: 'cs' },
    { dir: 'content/posts-sk', lang: 'sk' },
    { dir: 'content/posts-de', lang: 'de' },
    { dir: 'content/posts-en', lang: 'en' },
    { dir: 'content/posts', lang: 'cs' } // Original posts directory
  ];

  // Ensure author image directories exist
  const baseAuthorImageDir = path.join('public', 'images', 'authors');
  if (!fs.existsSync(baseAuthorImageDir)) {
    fs.mkdirSync(baseAuthorImageDir, { recursive: true });
  }

  // Create language-specific directories
  for (const { lang } of languageDirs) {
    const langDir = path.join(baseAuthorImageDir, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
  }

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const processedAuthors = new Map(); // Track authors we've already processed

  for (const { dir, lang } of languageDirs) {
    // Skip if directory doesn't exist
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} does not exist, skipping.`);
      continue;
    }

    console.log(`Processing ${dir} for author placeholders...`);
    
    // Get all MDX files
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      try {
        // Read the file content
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        // Skip if no author defined
        if (!data.author) {
          console.warn(`No author defined in ${file}, skipping.`);
          skippedCount++;
          continue;
        }
        
        // Generate slug for the author
        const authorSlug = createAuthorSlug(data.author);
        const authorKey = `${lang}:${authorSlug}`;
        
        // Skip if we've already processed this author for this language
        if (processedAuthors.has(authorKey)) {
          continue;
        }
        
        // Define image paths
        const authorImageFilename = `${authorSlug}.png`;
        const authorImagePath = path.join(baseAuthorImageDir, lang, authorImageFilename);
        const authorImageRelativePath = `/images/authors/${lang}/${authorImageFilename}`;
        
        // Skip if image already exists
        if (fs.existsSync(authorImagePath)) {
          console.log(`Author image already exists for ${data.author} in ${lang}, skipping.`);
          processedAuthors.set(authorKey, authorImageRelativePath);
          skippedCount++;
          continue;
        }
        
        // Create placeholder image
        console.log(`Creating placeholder image for author: ${data.author} (${lang})`);
        const initials = getInitials(data.author);
        createAuthorPlaceholderImage(initials, authorImagePath);
        
        // Update the articles with author image
        updateArticlesWithAuthorImage(dir, data.author, authorImageRelativePath);
        
        processedAuthors.set(authorKey, authorImageRelativePath);
        updatedCount++;
      } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
        errorCount++;
      }
    }
  }

  console.log(`Updated author images for ${updatedCount} unique authors.`);
  console.log(`Skipped ${skippedCount} authors that already had images.`);
  console.log(`Encountered errors in ${errorCount} files.`);
  
  return { updatedCount, skippedCount, errorCount };
}

/**
 * Create a slug for an author name
 */
function createAuthorSlug(authorName) {
  return authorName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special characters
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Remove consecutive hyphens
    .replace(/^-+|-+$/g, '');        // Remove leading/trailing hyphens
}

/**
 * Get initials from author name (up to 2 characters)
 */
function getInitials(authorName) {
  return authorName
    .split(' ')
    .filter(part => part.length > 0)
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Create a placeholder image with initials
 */
function createAuthorPlaceholderImage(initials, outputPath) {
  const size = 200;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#E5E7EB'; // Light gray background
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Text
  ctx.fillStyle = '#6B7280'; // Gray text
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size / 2, size / 2);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

/**
 * Update all articles for a specific author with the new image path
 */
function updateArticlesWithAuthorImage(directory, authorName, imagePath) {
  const files = fs.readdirSync(directory).filter(file => file.endsWith('.mdx'));
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    if (data.author === authorName) {
      // Update the author image path
      data.authorImage = imagePath;
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, matter.stringify(content, data));
      console.log(`Updated author image in ${file}`);
    }
  }
}

// Execute the function
createAuthorPlaceholders()
  .then(result => console.log('Completed author placeholder generation:', result))
  .catch(err => console.error('Error during author placeholder generation:', err)); 