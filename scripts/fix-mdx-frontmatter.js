const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Fix MDX frontmatter issues in all articles
 * - Ensure author images use the correct path format
 * - Fix markdown syntax errors
 * - Remove empty description fields
 * - Standardize dates
 */
async function fixMdxFrontmatter() {
  // Language directories to process
  const languageDirs = [
    { dir: 'content/posts-cs', lang: 'cs' },
    { dir: 'content/posts-sk', lang: 'sk' },
    { dir: 'content/posts-de', lang: 'de' },
    { dir: 'content/posts-en', lang: 'en' },
    { dir: 'content/posts', lang: 'cs' } // Original posts directory
  ];

  let fixedFilesCount = 0;
  let errorFilesCount = 0;

  // Ensure author image directories exist
  const baseAuthorImageDir = path.join('public', 'images', 'authors');
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

    console.log(`Processing ${dir} for frontmatter fixes...`);
    
    // Get all MDX files
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      try {
        // Read the file content
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Check for common syntax errors in frontmatter
        let fixedContent = fileContent;
        
        // Fix common MDX syntax errors
        fixedContent = fixMdxSyntaxErrors(fixedContent);
        
        // Parse frontmatter
        const { data, content } = matter(fixedContent);
        
        // Flag to track if we made changes
        let hasChanges = fixedContent !== fileContent;
        
        // Fix author image paths
        if (data.author && data.authorImage) {
          // Generate author slug
          const authorSlug = createAuthorSlug(data.author);
          
          // Check if author image is using placeholder or incorrect path
          if (data.authorImage.includes('placeholder') || 
              !data.authorImage.includes(`/images/authors/${lang}/`)) {
            
            // Set correct author image path
            data.authorImage = `/images/authors/${lang}/${authorSlug}.png`;
            hasChanges = true;
          }
        }
        
        // Remove empty description fields
        if (data.description === '' || data.description === 'null') {
          delete data.description;
          hasChanges = true;
        }
        
        // Standardize dates if needed
        if (data.date && !data.date.includes('T')) {
          // Add time component if missing
          data.date = `${data.date.split('T')[0]}T00:00:00.000Z`;
          hasChanges = true;
        }
        
        // Write changes if needed
        if (hasChanges) {
          fs.writeFileSync(filePath, matter.stringify(content, data));
          console.log(`Fixed frontmatter in ${file}`);
          fixedFilesCount++;
        }
      } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
        errorFilesCount++;
      }
    }
  }

  console.log(`Fixed frontmatter in ${fixedFilesCount} files.`);
  console.log(`Encountered errors in ${errorFilesCount} files.`);
  
  return { fixedFilesCount, errorFilesCount };
}

/**
 * Fix common MDX syntax errors
 */
function fixMdxSyntaxErrors(content) {
  let fixedContent = content;
  
  // Fix multiple frontmatter sections (common error)
  if (fixedContent.indexOf('---\n') !== fixedContent.lastIndexOf('---\n')) {
    const firstDelimiter = fixedContent.indexOf('---\n') + 4;
    const secondDelimiter = fixedContent.indexOf('---\n', firstDelimiter);
    const thirdDelimiter = fixedContent.indexOf('---\n', secondDelimiter + 4);
    
    if (thirdDelimiter !== -1) {
      // Extract the frontmatter between first and second delimiter
      const frontmatter = fixedContent.substring(firstDelimiter, secondDelimiter).trim();
      
      // Extract content after the third delimiter
      const actualContent = fixedContent.substring(thirdDelimiter + 4).trim();
      
      // Reconstruct the file with a single frontmatter section
      fixedContent = `---\n${frontmatter}\n---\n\n${actualContent}`;
    }
  }
  
  // Fix quotes in frontmatter values
  const lines = fixedContent.split('\n');
  const inFrontmatter = lines.findIndex(line => line.trim() === '---') !== -1;
  
  if (inFrontmatter) {
    const startIndex = lines.findIndex(line => line.trim() === '---');
    const endIndex = lines.indexOf('---', startIndex + 1);
    
    if (startIndex !== -1 && endIndex !== -1) {
      for (let i = startIndex + 1; i < endIndex; i++) {
        const line = lines[i];
        
        // Only process lines with key-value pairs
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          
          // Skip empty values
          if (!value) continue;
          
          // Add quotes to string values that need them
          if (!value.startsWith("'") && !value.startsWith('"') && 
              !value.startsWith('>') && !value.startsWith('[') &&
              isNaN(value) && value !== 'true' && value !== 'false') {
            lines[i] = `${key}: '${value}'`;
          }
        }
      }
      
      fixedContent = lines.join('\n');
    }
  }
  
  return fixedContent;
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

// Execute the function
fixMdxFrontmatter()
  .then(result => console.log('Completed frontmatter fixes:', result))
  .catch(err => console.error('Error during frontmatter fixing:', err)); 