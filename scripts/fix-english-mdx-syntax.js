const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Fix MDX syntax errors specifically in English article files
 * The SyntaxError: Arg string terminates parameters early - is typically caused by:
 * 1. Unescaped quotes in frontmatter
 * 2. Improperly formatted multi-line strings
 * 3. Double quotes within string values
 */
async function fixEnglishMdxSyntaxErrors() {
  const dir = 'content/posts-en';
  let fixedFilesCount = 0;
  let errorFilesCount = 0;

  // Check if directory exists
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping.`);
    return { fixedFilesCount, errorFilesCount };
  }

  console.log(`Processing ${dir}...`);
  
  // Get all MDX files in the directory
  const files = fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    try {
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Check for specific patterns that cause syntax errors
      const hasUnescapedQuotes = /"[^"]*"[^"]*"/.test(fileContent) || /""[^"]*""/.test(fileContent);
      const hasMultiLineString = />\s*-\s*\n/.test(fileContent);
      const hasMalformedFrontmatter = /'[^']*'[^']*':/.test(fileContent);
      
      if (hasUnescapedQuotes || hasMultiLineString || hasMalformedFrontmatter) {
        console.log(`Fixing syntax issues in: ${filePath}`);
        
        // Complete reconstruction is safer for these complex syntax issues
        await reconstructArticleFile(filePath);
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
            // Fix string values with unescaped quotes or newlines
            if (typeof value === 'string' && 
              (value.includes('"') || value.includes("\n") || value.includes("'"))) {
              // Clean the string and escape properly
              const cleanedValue = value
                .replace(/[\r\n\t]/g, ' ')  // Replace newlines with spaces
                .replace(/"/g, '\\"')       // Escape double quotes
                .replace(/'/g, "\\'");      // Escape single quotes
              
              updatedData[key] = cleanedValue;
              needsFix = true;
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
          await reconstructArticleFile(filePath);
          fixedFilesCount++;
        }
      }
    } catch (error) {
      console.error(`Error processing file ${file}: ${error.message}`);
      errorFilesCount++;
    }
  }

  console.log(`Fixed ${fixedFilesCount} files with syntax errors.`);
  console.log(`Encountered errors in ${errorFilesCount} files.`);
  
  return { fixedFilesCount, errorFilesCount };
}

/**
 * Completely reconstruct a corrupted article file by extracting and reformatting content
 */
async function reconstructArticleFile(filePath) {
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
    }
    
    if (!markdownContent) {
      console.error(`Could not extract markdown content from: ${filePath}`);
      return false;
    }
    
    // Create a clean frontmatter with properly escaped values
    const frontmatter = {
      title: title,
      date: `${date}T12:00:00.000Z`,
      description: `Article about ${title.toLowerCase()}`,
      image: '/images/default-business.jpg',
      author: 'John Smith',
      authorPosition: 'Receivables Specialist',
      authorImage: '/images/authors/en/john-smith.png',
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
fixEnglishMdxSyntaxErrors()
  .then(result => console.log('Completed English MDX syntax error fixes:', result))
  .catch(err => console.error('Error during English MDX syntax error fixing:', err)); 