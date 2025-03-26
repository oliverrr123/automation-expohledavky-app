const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Fix MDX syntax errors in article files
 * 
 * This script fixes common issues that cause MDX rendering to fail:
 * 1. Numbered object keys in frontmatter
 * 2. Invalid string formatting
 * 3. Unparseable markdown content
 */
async function fixMdxSyntaxErrors() {
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

    console.log(`Processing ${dir}...`);
    
    // Get all MDX files in the directory
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      try {
        // Read file content
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Check if content has numbered keys - a clear sign of corruption
        const hasNumberedKeys = /'[0-9]+':/.test(fileContent);
        
        if (hasNumberedKeys) {
          console.log(`Fixing corrupted file: ${filePath}`);
          
          // This file needs complete reconstruction
          await reconstructArticleFile(filePath, lang);
          fixedFilesCount++;
        } else {
          // Try to parse the frontmatter to check for other issues
          try {
            const { data, content } = matter(fileContent);
            
            // Check if any fields need fixing
            let needsFix = false;
            
            // Copy data to avoid modifying the original during iteration
            const updatedData = { ...data };
            
            // Check for common issues in each field
            for (const [key, value] of Object.entries(data)) {
              // Fix string values with unescaped quotes
              if (typeof value === 'string' && 
                 (value.includes('"') && !value.startsWith('"')) || 
                 value.includes('\n')) {
                updatedData[key] = value.replace(/"/g, '\\"');
                needsFix = true;
              }
              
              // Fix date formatting issues
              if (key === 'date' && typeof value === 'string' && !value.match(/^\d{4}-\d{2}-\d{2}T/)) {
                try {
                  // Try to parse and reformat the date
                  const date = new Date(value);
                  updatedData[key] = date.toISOString();
                  needsFix = true;
                } catch (e) {
                  console.warn(`Could not parse date in ${file}: ${value}`);
                }
              }
            }
            
            // If any issues were found, rewrite the file
            if (needsFix) {
              console.log(`Fixing frontmatter issues in: ${filePath}`);
              const updatedContent = matter.stringify(content, updatedData);
              fs.writeFileSync(filePath, updatedContent);
              fixedFilesCount++;
            }
          } catch (parseError) {
            console.error(`Error parsing frontmatter in ${file}: ${parseError.message}`);
            
            // Try to recover the file
            await reconstructArticleFile(filePath, lang);
            fixedFilesCount++;
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
        errorFilesCount++;
      }
    }
  }

  console.log(`Fixed ${fixedFilesCount} files with syntax errors.`);
  console.log(`Encountered errors in ${errorFilesCount} files.`);
  
  return { fixedFilesCount, errorFilesCount };
}

/**
 * Reconstruct a corrupted article file by extracting and reformatting content
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
    const titleMatch = originalContent.match(/title: ['"]?(.*?)['"]?[\r\n,]/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/['"`]/g, '');
    } else {
      // Fallback title based on slug
      title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Extract the actual markdown content (after the frontmatter)
    let markdownContent = "";
    const contentMatch = originalContent.match(/---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)/);
    if (contentMatch && contentMatch[2]) {
      markdownContent = contentMatch[2].trim();
    } else {
      // Try harder to find the content
      const lines = originalContent.split('\n');
      let passedFrontmatter = false;
      let frontmatterEndCount = 0;
      
      for (const line of lines) {
        if (line.trim() === '---') {
          frontmatterEndCount++;
          if (frontmatterEndCount >= 2) {
            passedFrontmatter = true;
            continue;
          }
        }
        
        if (passedFrontmatter) {
          markdownContent += line + '\n';
        }
      }
      
      markdownContent = markdownContent.trim();
    }
    
    if (!markdownContent) {
      console.error(`Could not extract markdown content from: ${filePath}`);
      return false;
    }
    
    // Create a basic frontmatter
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
      authorImage: `/images/authors/${language === 'cs' ? 'jan-novak' : 
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
fixMdxSyntaxErrors()
  .then(result => console.log('Completed MDX syntax error fixes:', result))
  .catch(err => console.error('Error during MDX syntax error fixing:', err)); 