const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Fix the specific article with 404 error for "Jak optimalizovat postavení věřitele v insolvenci v ČR"
 * This script will create a new file with the correct slug and ensure proper formatting
 */
const fixSpecificArticle = () => {
  // Source file with problematic long slug
  const sourceFilePath = path.join(
    process.cwd(), 
    'content', 
    'posts-cs', 
    '2025-03-27-optimalizace-postaveni-veritele-v-insolvencnim-rizeni-strategie-pro-maximalizaci-navratnosti-pohledavek-v-ceskem-pravnim-prostredi.mdx'
  );
  
  // Target file with correct simplified slug
  const targetFilePath = path.join(
    process.cwd(),
    'content',
    'posts-cs',
    '2025-03-27-jak-optimalizovat-postaveni-veritele-v-insolvenci-v-cr.mdx'
  );
  
  // Verify the source file exists
  if (!fs.existsSync(sourceFilePath)) {
    console.error(`Source file not found: ${sourceFilePath}`);
    return { success: false, error: 'Source file not found' };
  }
  
  try {
    // Read the file content
    const fileContent = fs.readFileSync(sourceFilePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Make sure the title matches what we expect (for safety)
    if (data.title !== "Jak optimalizovat postavení věřitele v insolvenci v ČR") {
      // Update the title to match what users expect to see
      data.title = "Jak optimalizovat postavení věřitele v insolvenci v ČR";
    }
    
    // Make sure author image is properly set
    if (!data.authorImage || data.authorImage.includes('placeholder')) {
      // Ensure the author image is correctly set
      data.authorImage = "/images/authors/cs/jan-novak.png";
    }
    
    // Check if the target file already exists
    if (fs.existsSync(targetFilePath)) {
      console.log('Target file already exists, updating content...');
    }
    
    // Write the content to the new file with the correct slug
    fs.writeFileSync(targetFilePath, matter.stringify(content, data));
    console.log(`Successfully created file with correct slug: ${targetFilePath}`);
    
    // Check if source and target are different files
    if (sourceFilePath !== targetFilePath) {
      // Keep the original file for now, uncomment below if you want to delete it
      // fs.unlinkSync(sourceFilePath);
      // console.log(`Original file deleted: ${sourceFilePath}`);
    }
    
    return { 
      success: true, 
      oldPath: sourceFilePath,
      newPath: targetFilePath
    };
  } catch (error) {
    console.error(`Error fixing article: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Execute the function
const result = fixSpecificArticle();
console.log('Operation result:', result); 