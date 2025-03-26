const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Comprehensive MDX file fixer for all language directories
 * 
 * This script fixes multiple issues that can cause MDX rendering failures:
 * 1. Malformed frontmatter (improper quotes, multiline strings, etc.)
 * 2. Unescaped quotes or special characters in string values
 * 3. Incorrect or missing author image paths
 * 4. Invalid content structure (e.g., multiple frontmatter sections)
 * 5. Problems with markdown content that could cause rendering issues
 */
async function fixAllMdxFiles() {
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
  let skippedFilesCount = 0;

  for (const { dir, lang } of languageDirs) {
    // Check if directory exists
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} does not exist, skipping.`);
      continue;
    }

    console.log(`Processing ${dir}...`);
    
    // Get all MDX files in the directory
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      try {
        // Read file content
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Check for patterns that indicate syntax errors
        const hasUnescapedQuotes = /"[^"]*"[^"]*"/.test(fileContent) || /""[^"]*""/.test(fileContent);
        const hasMultiLineString = />\s*-\s*\n/.test(fileContent);
        const hasMalformedFrontmatter = /'[^']*'[^']*':/.test(fileContent);
        const hasMultipleFrontmatter = (fileContent.match(/---/g) || []).length > 2;
        
        // If any serious issues are found, complete reconstruction is safer
        if (hasUnescapedQuotes || hasMultiLineString || hasMalformedFrontmatter || hasMultipleFrontmatter) {
          console.log(`Fixing major syntax issues in: ${filePath}`);
          await reconstructArticleFile(filePath, lang);
          fixedFilesCount++;
          continue;
        }
        
        // Try to parse the frontmatter to check for other issues
        try {
          const { data, content } = matter(fileContent);
          
          // Check if any fields need fixing
          let needsFix = false;
          
          // Copy data to avoid modifying the original during iteration
          const updatedData = { ...data };
          
          // Check for common issues in each field
          for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
              // Fix string values with unescaped quotes or newlines
              if (value.includes('"') || value.includes("\n") || value.includes("'")) {
                // Clean the string and escape properly
                const cleanedValue = value
                  .replace(/[\r\n\t]/g, ' ')  // Replace newlines with spaces
                  .replace(/"/g, '\\"')       // Escape double quotes
                  .replace(/'/g, "\\'");      // Escape single quotes
                
                updatedData[key] = cleanedValue;
                needsFix = true;
              }
            }
          }
          
          // Check for author image path issues
          if (data.author && (
              !data.authorImage || 
              data.authorImage.includes('placeholder') || 
              !data.authorImage.includes(`/images/authors/${lang}/`)
            )) {
            // Generate author slug
            const authorSlug = createAuthorSlug(data.author);
            // Set correct author image path
            updatedData.authorImage = `/images/authors/${lang}/${authorSlug}.png`;
            needsFix = true;
          }
          
          // If any issues were found, rewrite the file
          if (needsFix) {
            console.log(`Fixing frontmatter issues in: ${filePath}`);
            const updatedContent = matter.stringify(content, updatedData);
            fs.writeFileSync(filePath, updatedContent);
            fixedFilesCount++;
          } else {
            skippedFilesCount++;
          }
        } catch (parseError) {
          console.error(`Error parsing frontmatter in ${file}: ${parseError.message}`);
          
          // Try to recover the file if parsing failed
          await reconstructArticleFile(filePath, lang);
          fixedFilesCount++;
        }
      } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
        errorFilesCount++;
      }
    }
  }

  console.log(`Fixed ${fixedFilesCount} files with syntax errors.`);
  console.log(`Skipped ${skippedFilesCount} files that didn't need fixes.`);
  console.log(`Encountered errors in ${errorFilesCount} files.`);
  
  return { fixedFilesCount, skippedFilesCount, errorFilesCount };
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
 * Completely reconstruct a corrupted article file by extracting and reformatting content
 */
async function reconstructArticleFile(filePath, language) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the file name to get the date and slug
    const fileName = path.basename(filePath);
    const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.mdx$/);
    
    if (!match) {
      console.error(`Could not parse file name: ${fileName}`);
      return false;
    }
    
    const [_, date, slug] = match;
    
    // Try to extract title from the content
    let title = "";
    const titleMatch = originalContent.match(/title:\s*['"]?(.*?)['"]?[\r\n,]/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/['"`]/g, '');
    } else {
      // Fallback title based on slug
      title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Extract the actual markdown content (after the frontmatter)
    let markdownContent = "";
    
    // Try to get text past the second --- divider
    const parts = originalContent.split('---');
    if (parts.length >= 3) {
      // Join everything after the second --- delimiter
      markdownContent = parts.slice(2).join('---').trim();
      
      // Replace any problematic syntax in markdown content
      markdownContent = markdownContent
        .replace(/""([^"]*)""/, '**$1**')  // Fix double quotes that should be bold
        .replace(/([^"])""([^"]*?)""([^"])/, '$1**$2**$3');  // Fix double quotes that should be bold
    }
    
    if (!markdownContent) {
      console.error(`Could not extract markdown content from: ${filePath}`);
      return false;
    }
    
    // Create a clean frontmatter with language-specific author info
    const frontmatter = {
      title: title,
      date: `${date}T12:00:00.000Z`,
      description: `Article about ${title.toLowerCase()}`,
      image: '/images/default-business.jpg',
      author: language === 'cs' ? 'Jan Novák' : 
              language === 'sk' ? 'Martin Kováč' : 
              language === 'de' ? 'Thomas Schmidt' : 'John Smith',
      authorPosition: language === 'cs' ? 'Specialista na pohledávky' : 
                      language === 'sk' ? 'Špecialista na pohľadávky' : 
                      language === 'de' ? 'Forderungsspezialist' : 'Receivables Specialist',
      authorImage: `/images/authors/${language}/${language === 'cs' ? 'jan-novak' : 
                                         language === 'sk' ? 'martin-kovac' : 
                                         language === 'de' ? 'thomas-schmidt' : 
                                         'john-smith'}.png`,
      readTime: '7 min'
    };
    
    // Create the new file content
    const newContent = matter.stringify(markdownContent, frontmatter);
    
    // Write the fixed content back to the file
    fs.writeFileSync(filePath, newContent);
    
    console.log(`Reconstructed file: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error reconstructing file ${filePath}: ${error.message}`);
    return false;
  }
}

// Execute the function
fixAllMdxFiles()
  .then(result => console.log('Completed MDX fixes:', result))
  .catch(err => console.error('Error during MDX fixing:', err)); 