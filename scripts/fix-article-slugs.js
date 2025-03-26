const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * This script fixes article slugs to ensure they have a standardized format
 * to prevent 404 errors and ensure redirects work properly
 */
async function fixArticleSlugs() {
  // Language directories to check
  const languageDirs = [
    { dir: 'content/posts-cs', lang: 'cs' },
    { dir: 'content/posts-sk', lang: 'sk' },
    { dir: 'content/posts-de', lang: 'de' },
    { dir: 'content/posts-en', lang: 'en' },
    { dir: 'content/posts', lang: 'cs' } // Original posts directory
  ];

  let fixedFilesCount = 0;
  let errorFilesCount = 0;

  for (const { dir, lang } of languageDirs) {
    // Check if directory exists
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} does not exist, skipping.`);
      continue;
    }

    console.log(`Processing ${dir} for slug fixes...`);
    
    // Get all MDX files in the directory
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      try {
        // Extract date and original slug from filename
        const match = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.mdx$/);
        if (!match) {
          console.warn(`Could not parse filename: ${file}`);
          continue;
        }
        
        const [_, date, originalSlug] = match;
        
        // Check if slug is problematic (too long, contains special characters)
        const isProblematic = originalSlug.length > 80 || 
                              /[^a-z0-9-]/.test(originalSlug) ||
                              originalSlug.includes('--');
        
        if (isProblematic) {
          // Read the file to get the title
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          
          if (!data.title) {
            console.warn(`No title found in ${file}, skipping.`);
            continue;
          }
          
          // Create a simplified slug from the title
          const simplifiedSlug = createSimplifiedSlug(data.title);
          
          // Construct new filename
          const newFileName = `${date}-${simplifiedSlug}.mdx`;
          const newFilePath = path.join(dir, newFileName);
          
          // Check if new file would overwrite an existing one
          if (fs.existsSync(newFilePath) && newFilePath !== filePath) {
            console.warn(`Cannot rename ${file} to ${newFileName} - file already exists`);
            continue;
          }
          
          console.log(`Renaming ${file} to ${newFileName}`);
          
          // Create the new file
          fs.writeFileSync(newFilePath, matter.stringify(content, data));
          
          // If original and new files are different, delete the original
          if (newFilePath !== filePath) {
            fs.unlinkSync(filePath);
          }
          
          fixedFilesCount++;
        }
      } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
        errorFilesCount++;
      }
    }
  }

  console.log(`Fixed ${fixedFilesCount} files with problematic slugs.`);
  console.log(`Encountered errors in ${errorFilesCount} files.`);
  
  return { fixedFilesCount, errorFilesCount };
}

/**
 * Create a simplified slug from a title
 */
function createSimplifiedSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special characters
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Remove consecutive hyphens
    .replace(/^-+|-+$/g, '')         // Remove leading/trailing hyphens
    .substring(0, 80);               // Limit length
}

// Execute the function
fixArticleSlugs()
  .then(result => console.log('Completed article slug fixes:', result))
  .catch(err => console.error('Error during article slug fixing:', err)); 