const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function removeAuthorImages() {
  // Language directories to process
  const languages = ['cs', 'sk', 'de', 'en'];
  let updatedCount = 0;
  let skippedCount = 0;

  for (const lang of languages) {
    const dirPath = path.join(process.cwd(), 'content', lang === 'en' ? 'posts-en' : `posts-${lang}`);
    
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory not found: ${dirPath}`);
      continue;
    }

    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mdx'));
    console.log(`Processing ${files.length} articles in ${lang} language...`);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // Skip if no authorImage field
        if (!data.authorImage) {
          skippedCount++;
          continue;
        }

        // Remove authorImage field
        delete data.authorImage;

        // Write updated content back to file
        const updatedContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, updatedContent);
        
        console.log(`✓ Removed author image from ${file}`);
        updatedCount++;
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  }

  console.log('\nUpdate Summary:');
  console.log('----------------------------------------');
  console.log(`Updated: ${updatedCount} articles`);
  console.log(`Skipped: ${skippedCount} articles`);
  console.log('----------------------------------------');
}

// Run the update if called directly
if (require.main === module) {
  removeAuthorImages().catch(console.error);
}

module.exports = {
  removeAuthorImages
}; 