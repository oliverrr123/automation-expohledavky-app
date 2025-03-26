const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createCanvas } = require('canvas');

/**
 * Fix author image paths and create missing author images for all languages
 * Ensures consistent paths and creates placeholder images with author initials
 */
async function fixAuthorImages() {
  // Language directories to process
  const languageDirs = [
    { dir: 'content/posts-cs', lang: 'cs' },
    { dir: 'content/posts-sk', lang: 'sk' },
    { dir: 'content/posts-de', lang: 'de' },
    { dir: 'content/posts-en', lang: 'en' },
    { dir: 'content/posts', lang: 'cs' } // Original posts directory
  ];

  let fixedPathsCount = 0;
  let createdImagesCount = 0;
  let errorCount = 0;
  const processedAuthors = new Map(); // Track authors we've already processed

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

  for (const { dir, lang } of languageDirs) {
    // Skip if directory doesn't exist
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} does not exist, skipping.`);
      continue;
    }

    console.log(`Processing ${dir} for author images...`);
    
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
          continue;
        }
        
        // Generate slug for the author
        const authorSlug = createAuthorSlug(data.author);
        const authorKey = `${lang}:${authorSlug}`;
        
        // Set correct author image path
        const correctImagePath = `/images/authors/${lang}/${authorSlug}.png`;
        
        // Check if path needs fixing
        const needsPathFix = !data.authorImage || 
                              data.authorImage.includes('placeholder') ||
                              !data.authorImage.includes(`/images/authors/${lang}/`);
        
        if (needsPathFix) {
          // Update the author image path
          data.authorImage = correctImagePath;
          
          // Write the updated content back to the file
          fs.writeFileSync(filePath, matter.stringify(content, data));
          console.log(`Fixed author image path in ${file} to ${correctImagePath}`);
          fixedPathsCount++;
        }
        
        // Skip image creation if we've already processed this author for this language
        if (processedAuthors.has(authorKey)) {
          continue;
        }
        
        // Define image path in public directory
        const authorImagePath = path.join(baseAuthorImageDir, lang, `${authorSlug}.png`);
        
        // Create image if it doesn't exist
        if (!fs.existsSync(authorImagePath)) {
          console.log(`Creating placeholder image for author: ${data.author} (${lang})`);
          const initials = getInitials(data.author);
          createAuthorPlaceholderImage(initials, authorImagePath);
          createdImagesCount++;
        }
        
        processedAuthors.set(authorKey, true);
      } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
        errorCount++;
      }
    }
  }

  console.log(`Fixed ${fixedPathsCount} author image paths.`);
  console.log(`Created ${createdImagesCount} author placeholder images.`);
  console.log(`Encountered errors in ${errorCount} files.`);
  
  return { fixedPathsCount, createdImagesCount, errorCount };
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

// Execute the function
fixAuthorImages()
  .then(result => console.log('Completed author image fixes:', result))
  .catch(err => console.error('Error during author image fixing:', err)); 