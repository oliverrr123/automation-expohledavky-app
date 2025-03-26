const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * This script identifies and removes duplicate articles across language directories
 * It looks for duplicates within the same language directory and handles them
 */
async function fixDuplicateArticles() {
  // Language directories to check
  const languageDirs = [
    { dir: 'content/posts-cs', lang: 'cs' },
    { dir: 'content/posts-sk', lang: 'sk' },
    { dir: 'content/posts-de', lang: 'de' },
    { dir: 'content/posts-en', lang: 'en' },
    { dir: 'content/posts', lang: 'cs' } // Original posts directory
  ];

  let removedDuplicatesCount = 0;
  let errorFilesCount = 0;

  for (const { dir, lang } of languageDirs) {
    // Check if directory exists
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} does not exist, skipping.`);
      continue;
    }

    console.log(`Processing ${dir} for duplicates...`);
    
    // Get all MDX files in the directory
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
    
    // Map of titles to file paths
    const titleMap = new Map();
    // Map of slugs to file paths
    const slugMap = new Map();
    
    // First pass: collect all titles and slugs
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      try {
        // Extract slug from filename (after date, before .mdx)
        const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '');
        
        // Read file content to extract title
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        
        if (data.title) {
          const title = data.title.toLowerCase().trim();
          
          // If title already exists, add to the list for that title
          if (titleMap.has(title)) {
            titleMap.get(title).push({ file, path: filePath, date: file.substring(0, 10) });
          } else {
            titleMap.set(title, [{ file, path: filePath, date: file.substring(0, 10) }]);
          }
        }
        
        // Track files with the same slug
        if (slugMap.has(slug)) {
          slugMap.get(slug).push({ file, path: filePath, date: file.substring(0, 10) });
        } else {
          slugMap.set(slug, [{ file, path: filePath, date: file.substring(0, 10) }]);
        }
      } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
        errorFilesCount++;
      }
    }
    
    // Second pass: identify and handle duplicates
    for (const [title, filesWithTitle] of titleMap) {
      if (filesWithTitle.length > 1) {
        console.log(`Found duplicate title "${title}" in ${dir}:`);
        filesWithTitle.forEach(f => console.log(`  - ${f.file}`));
        
        // Keep the newest file (by date in filename), remove others
        filesWithTitle.sort((a, b) => b.date.localeCompare(a.date));
        
        const keepFile = filesWithTitle[0];
        console.log(`Keeping newest file: ${keepFile.file}`);
        
        // Remove all other duplicates
        for (let i = 1; i < filesWithTitle.length; i++) {
          const removeFile = filesWithTitle[i];
          console.log(`Removing duplicate: ${removeFile.file}`);
          
          try {
            fs.unlinkSync(removeFile.path);
            removedDuplicatesCount++;
          } catch (error) {
            console.error(`Error removing file ${removeFile.file}: ${error.message}`);
            errorFilesCount++;
          }
        }
      }
    }
    
    // Handle slug duplicates - these might be articles with different content but same slug
    for (const [slug, filesWithSlug] of slugMap) {
      if (filesWithSlug.length > 1) {
        console.log(`Found duplicate slug "${slug}" in ${dir}:`);
        filesWithSlug.forEach(f => console.log(`  - ${f.file}`));
        
        // Keep the newest file by default
        filesWithSlug.sort((a, b) => b.date.localeCompare(a.date));
        
        // Check if these were already handled as title duplicates
        // We only want to handle cases where titles differ but slugs are the same
        const keepFile = filesWithSlug[0];
        
        // Check if files have different titles
        let hasDifferentTitles = false;
        let titles = new Set();
        
        for (const fileInfo of filesWithSlug) {
          try {
            const fileContent = fs.readFileSync(fileInfo.path, 'utf8');
            const { data } = matter(fileContent);
            if (data.title) {
              titles.add(data.title.toLowerCase().trim());
            }
          } catch (error) {
            console.error(`Error reading file ${fileInfo.file}: ${error.message}`);
          }
        }
        
        hasDifferentTitles = titles.size > 1;
        
        // If they have different titles, rename the slug of the older files
        if (hasDifferentTitles) {
          console.log(`Files have different titles but same slug, keeping newest and renaming others`);
          
          // Leave the newest file as is
          console.log(`Keeping newest file as is: ${keepFile.file}`);
          
          // Rename the older files
          for (let i = 1; i < filesWithSlug.length; i++) {
            const fileToRename = filesWithSlug[i];
            
            try {
              // Read file to get its title
              const fileContent = fs.readFileSync(fileToRename.path, 'utf8');
              const { data, content } = matter(fileContent);
              
              // Generate a unique suffix for the file
              const uniqueSuffix = `-${i}`;
              const newSlug = slug + uniqueSuffix;
              
              // Create new filename
              const newFileName = fileToRename.file.replace(slug, newSlug);
              const newFilePath = path.join(dir, newFileName);
              
              console.log(`Renaming ${fileToRename.file} to ${newFileName}`);
              
              // Write to new file and delete the old one
              fs.writeFileSync(newFilePath, matter.stringify(content, data));
              fs.unlinkSync(fileToRename.path);
            } catch (error) {
              console.error(`Error renaming file ${fileToRename.file}: ${error.message}`);
              errorFilesCount++;
            }
          }
        }
      }
    }
  }

  console.log(`Removed ${removedDuplicatesCount} duplicate articles.`);
  console.log(`Encountered errors in ${errorFilesCount} files.`);
  
  return { removedDuplicatesCount, errorFilesCount };
}

// Execute the function
fixDuplicateArticles()
  .then(result => console.log('Completed duplicate article fixes:', result))
  .catch(err => console.error('Error during duplicate article fixing:', err)); 